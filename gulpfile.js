#!/usr/bin/env node

/**
 * Module dependencies.
 */
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var app = express();
var destination = 'src/main/webapp/resources';
var basename = 'weblogger';
var gulp = require('gulp');
var _ = require('lodash');
var angularHtmlify = require('gulp-angular-htmlify');
var angularTemplatecache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var replace = require('gulp-replace');
var stylish = require('jshint-stylish');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify-es').default;
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

gulp.task('default', function () {
    var port = normalizePort(process.env.PORT || '63131');
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);

    /**
     * Event listener for HTTP server "error" event.
     */
    server.on('error', onError);

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */
    server.on('listening', onListening);

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log('Http API is listening on ' + bind);
    }

    app.use(logger('combined')); //'combined' outputs the Apache style LOGs
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        parameterLimit: 100000,
        limit: '100kb',
        extended: true
    }));
    app.use(bodyParser.json({type: 'application/*+json'}));
    app.use(expressValidator([])); // this line must be immediately after any of the bodyParser middlewares!
    app.use(cookieParser());

///////////////////////////////////
/// Enable CORS
///////////////////////////////////
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-type, Authorization');
        next();
    });

    const openLoggingApi = require('./api/v1/logs');
    const openSessionsApi = require('./api/v1/sessions');
    const historyApi = require('./api/v1/history');
    app.use('/api/v1/', openLoggingApi);
    app.use('/api/v1/', openSessionsApi);
    app.use('/api/v1/', historyApi);

    app.start = function (opts) {

        app.use('/', express.static("src/main/webapp"));
// app.use('/img', express.static('src/main/img'));
// app.use('/lang', express.static('src/main/lang'));
// app.use('/fonts', express.static('src/main/fonts'));
        app.use('/resources', express.static(destination));

        app.get('*', function (req, res) {
            res.sendfile('src/main/webapp/index.html')
        });
    };

    gulp.start(['buildJS', 'buildTMPL', 'buildCss']);

    gulp.watch('src/main/js/**/*.js', function () {
        gulp.start(['buildJS']);
    });

    gulp.watch('src/main/js/**/*.tmpl.html', function () {
        gulp.start(['buildTMPL']);
    });

    gulp.watch('src/main/css/**', function () {
        gulp.start(['buildCss']);
    });

    app.start({});


// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
});

gulp.task('buildTMPL', function () {
    gulp.src('src/main/js/**/*.tmpl.html')
        .pipe(angularHtmlify())
        .pipe(angularTemplatecache({
            module: "weblogger",
            standalone: false
        }))
        .pipe(concat(basename + '.tmpl.js'))
        .pipe(gulp.dest(destination));
});

gulp.task('buildJS', function () {
    gulp.src('src/main/js/**/*.js')
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(babel())
        .pipe(ngAnnotate())
        .pipe(replace(/\.(catch|finally|delete|class|continue|default)\(/g, '["$1"]('))
        .pipe(concat(basename + '.js'))
        .pipe(gulp.dest(destination))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(destination))
});

gulp.task('buildCss', function () {
    gulp.src('src/main/css/*.css')
        .pipe(plumber())
        .pipe(concat(basename + '.css'))
        .pipe(gulp.dest(destination))
        .pipe(minify({
            keepSpecialComments: 0
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(destination));
});

gulp.task('libs', function () {
    var prefix = 'src/main/libs/';
    gulp.src([
        prefix + "angular.js",
        prefix + "angular-route.js",
        prefix + "ui-bootstrap.js",
        prefix + "moment.js",
        prefix + "lodash.js"
    ])
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(replace(/\.(catch|finally|delete|class|continue|default)\(/g, '["$1"]('))
        .pipe(uglify())
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(destination));
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}