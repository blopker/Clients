
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    config = require('./config'),
    cons = require('consolidate'),
    swig = require('swig'),
    sass = require('node-sass');

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
 debug: true
}));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
