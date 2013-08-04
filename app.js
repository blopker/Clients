
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes/routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    config = require('./config'),
    cons = require('consolidate'),
    swig = require('swig'),
    sass = require('node-sass'),
    auth = require('./routes/auth');

var app = express();

// all environments
app.set('dev', config.dev || true);
app.set('port', config.port || 3000);

// Set up templates.
app.engine('html', cons.swig);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
swig.init({
    'root': app.get('views')
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
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: config.secret || 'keyboard cat',
                          cookie: {httpOnly: true}
                        }));
auth.init(app);
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (app.get('dev')) {
  app.use(express.errorHandler());
}

routes.init(app);

if (module.parent === null) {
    // Srart the server if not testing.
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
} else {
    // Export app for testing.
    module.exports = app;
}

