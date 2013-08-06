var user = require('./user'),
    auth = require('./auth'),
    fs = require('./file_system');


function init (app) {
    app.get('/', function(req, res) {
        res.send('HELLO');
    });
    app.get('/files/*/', auth.restricted, fs.browse_folder);
    app.get('/files/', auth.restricted, fs.browse_folder);
    app.get('/files/*', auth.restricted, fs.get_file);
    app.get('/files', function(req, res) {
        res.redirect('/files/');
    });
    app.get('/admin', auth.restrictedAdmin, user.list);
}

exports.init = init;
