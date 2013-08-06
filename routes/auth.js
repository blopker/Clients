var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/User');

var log_in_as = false;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var user = User.get(id, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
    });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.get(username, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.pass !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

function login_get(req, res) {
    res.render('login');
}

// Middleware to restrict page access.
function restricted(req, res, next) {
    if (log_in_as !== false) {
        User.get(log_in_as, function(err, user) {
            if (err) {return;}
            req.logIn(user, function(err) {});
        });
    }

    if (req.isAuthenticated()) { return next(); }
    // Save this page for later.
    req.session.lastURL = req.url;
    res.redirect('/login');
}

// Middleware for admins
function restrictedAdmin (req, res, next) {
    restricted(req, res, function() {
        if(req.user.isAdmin()){ return next(); }
        res.redirect('/');
    });
}

exports.init = function(app) {
    log_in_as = app.get('log_in_as');

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/login', login_get);
    app.post('/login',
        passport.authenticate('local', {failureRedirect: '/login' }),
        function(req, res) {
            if (typeof req.session.lastURL !== 'undefined') {
                // Redirect back to the page they came from
                res.redirect(req.session.lastURL);
            } else {
                res.redirect('/');
            }
    });
    app.get('/logout', function(req, res) {
        req.logout();
        req.session.destroy(function(){
            res.redirect('/');
        });
    });
    return app;
};

exports.restricted = restricted;
exports.restrictedAdmin = restrictedAdmin;
