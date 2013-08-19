var admin = require('./admin'),
    auth = require('./auth'),
    user = require('./user'),
    fs = require('./file_system');

function init (app) {
    app.get('/', function(req, res) {
        res.redirect('/files/');
    });

    // Browse routes
    app.get('/files/:file(*)/', auth.restricted, fs.browse_folder);
    app.get('/files/', auth.restricted, fs.browse_folder);
    app.get('/files/:file(*)', auth.restricted, fs.get_file);
    app.get('/files', function(req, res) {
        res.redirect('/files/');
    });

    // Admin route
    app.get('/admin', auth.restrictedAdmin, admin.get);

    // User routes
    app.put('/user', auth.restrictedAdmin, user.add);
    app.post('/user/:name', auth.restrictedAdmin, user.update);
    app.delete('/user/:name', auth.restrictedAdmin, user.delete);

    // Login routes
    app.get('/login', function (req, res) {
        res.render('login', {errors: req.flash('error')});
    });
    app.post('/login', auth.authenticate, auth.authenticated);
    app.get('/logout', auth.logout);
}

exports.init = init;
