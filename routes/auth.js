var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../db').User;

var log_in_as = false;

passport.serializeUser(function(user, done) {
    done(null, user.name);
});

passport.deserializeUser(function(id, done) {
    User.get(id, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.get(username, function (err, user) {
            if (err) {return done(err); }

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

// Middleware to restrict page access.
function restricted(req, res, next) {
    // Auto login for debugging.
    if (log_in_as !== false && !req.isAuthenticated()) {
        User.get(log_in_as, function(err, user) {
            if (err) {throw err;}
            req.logIn(user, function(err) {
                if (err) {throw err;}
                res.locals.user = req.user;
                return next();
            });
        });
        return;
    }

    if (req.isAuthenticated()) { return next(); }

    // Save this path for later.
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

// Middleware for authentication
function authenticate (req, res, next) {
    passport.authenticate('local',
        {failureRedirect: req.path })(req, res, next);
}

// Call after authentication
function authenticated (req, res) {
    if (typeof req.session.lastURL !== 'undefined') {
        // Redirect back to the page they came from
        res.redirect(req.session.lastURL);
    } else {
        res.redirect('/');
    }
}

function logout (req, res) {
    req.logout();
    delete req.session.lastURL;
    req.session.destroy(function(){
        res.redirect('/');
    });
}

exports.init = function(app) {
    log_in_as = app.get('log_in_as');

    app.use(passport.initialize());
    app.use(passport.session());

    // Add user to locals for templates
    app.use(function(req, res, next) {
        if(req.user){
            res.locals.user = req.user;
        }
        next();
    });

    return app;
};

exports.restricted = restricted;
exports.restrictedAdmin = restrictedAdmin;
exports.authenticate = authenticate;
exports.authenticated = authenticated;
exports.logout = logout;
