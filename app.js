'use strict';
/**
 * Module dependencies.
 */

function init (app_done) {
    var db = require('./db');

    var express = require('express'),
        http = require('http'),
        path = require('path'),
        cons = require('consolidate'),
        swig = require('swig'),
        sass = require('node-sass'),
        async = require('async'),
        flash = require('connect-flash'),
        config = require('./config'),
        routes = require('./routes/routes'),
        auth = require('./routes/auth');

    var app = express();

    var testing = (module.parent === null)?false:true;

    // Set env
    app.set('dev', config.dev || true);
    // Disable log_in_as while running tests.
    var log_in_as = (testing)?false:config.log_in_as || false;
    app.set('log_in_as', log_in_as);
    app.set('port', config.port || 3000);

    // Set up templates.
    app.engine('.html', cons.swig);
    app.set('view engine', 'html');
    swig.init({
        root: app.get('views'),
        filters: require('./filters/filters'),
        allowErrors: true
    });
    if (!app.get('dev')) {
        app.locals.cache = true;
    }
    app.set('views', __dirname + '/views');

    // Lay some sass on it.
    app.use(sass.middleware({
        src:   __dirname + '/public/',
        dest:  __dirname + '/public/',
        debug: config.dev || true
    }));

    app.use(express.favicon());
    app.use(express.static(path.join(__dirname, 'public')));

    // Keep logger quite for tests.
    if (!testing) {
        app.use(express.logger('dev'));
    }
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: config.secret || 'keyboard cat',
                              cookie: {httpOnly: true}
                            }));
    app.use(flash());
    auth.init(app);
    app.use(express.methodOverride());
    app.use(app.router);

    // Development only
    if (app.get('dev')) {
        app.use(express.errorHandler());
    }

    routes.init(app);

    async.series([
        function(cb) {
            db.model.sync().complete(cb);
        },
        function(cb) {
            if (!testing) {
                // Srart the server if not testing.
                http.createServer(app).listen(app.get('port'), function(){
                    console.log('Express server listening on port ' +
                        app.get('port'));
                });
            } else {
                if (app_done) {
                    app_done(app);
                }
            }
            cb(null);
        }
    ]);
}

module.exports = init;

if (!module.parent) {
    init();
}
