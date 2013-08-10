var admin = require('./admin'),
    auth = require('./auth'),
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

    // Admin routes
    app.get('/admin', auth.restrictedAdmin, admin.list);
    app.post('/admin', auth.restrictedAdmin, admin.update);
    app.put('/admin', auth.restrictedAdmin, admin.add);
    app.delete('/admin', auth.restrictedAdmin, admin.delete);

    // Login routes
    app.get('/login', function (req, res) {
        res.render('login');
    });
    app.post('/login', auth.authenticate, auth.authenticated);
    app.get('/logout', auth.logout);
}

exports.init = init;
