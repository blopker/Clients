
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate'),
    swig = require('swig'),
    sass = require('node-sass'),
    user = require('./routes/user'),
    config = require('./config'),
    routes = require('./routes/routes'),
    auth = require('./routes/auth'),
    db = require('./db');

var app = express();

var testing = (module.parent === null)?false:true;

// Set env
app.set('dev', config.dev || true);
// Disable log_in_as while running tests.
var log_in_as = (testing)?false:config.log_in_as || false;
app.set('log_in_as', log_in_as);
app.set('port', config.port || 3000);

// Set up templates.
app.engine('html', cons.swig);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
swig.init({
    root: app.get('views'),
    filters: require('./filters/filters')
});
if (!app.get('dev')) {
    app.locals.cache = true;
}

// Lay some sass on it.
app.use(sass.middleware({
 src:   __dirname + '/public/',
 dest:  __dirname + '/public/',
 debug: config.dev || true
}));

app.use(express.favicon());
// Keep logger quite for tests.
if (!testing) {
    app.use(express.logger('dev'));
}
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: config.secret || 'keyboard cat',
                          cookie: {httpOnly: true}
                        }));
auth.init(app);
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Development only
if (app.get('dev')) {
  app.use(express.errorHandler());
}

routes.init(app);

db.init(app);

if (!testing) {
    // Srart the server if not testing.
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
} else {
    // Export app for testing.
    module.exports = app;
}

