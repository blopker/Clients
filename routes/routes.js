var user = require('./user'),
    auth = require('./auth'),
    fs = require('./file_system');


function init (app) {
    app.get('/', function(req, res) {
        res.send('HELLO');
    });

    // Browse routes
    app.get('/files/:file(*)/', auth.restricted, fs.browse_folder);
    app.get('/files/', auth.restricted, fs.browse_folder);
    app.get('/files/:file(*)', auth.restricted, fs.get_file);
    app.get('/files', function(req, res) {
        res.redirect('/files/');
    });

    // Admin routes
    app.get('/admin', auth.restrictedAdmin, user.list);

    // Login routes
    app.get('/login', function (req, res) {
        res.render('login');
    });
    app.post('/login', auth.authenticate, auth.authenticated);
    app.get('/logout', auth.logout);
}

exports.init = init;
