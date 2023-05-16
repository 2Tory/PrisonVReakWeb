"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
var createError = require('http-errors');
var express = require("express");
var path = require("path");
var morgan = require("morgan");
var signaling_1 = require("./signaling");
var httphandler_1 = require("./class/httphandler");
var users_1 = require("../client/routes/users");
var index_1 = require("../client/routes/index");
var cors = require('cors');
var createServer = function (config) {
    var app = express();
    (0, httphandler_1.reset)(config.mode);
    // logging http access
    if (config.logging != "none") {
        app.use(morgan(config.logging));
    }
    app.set('views', path.join(__dirname, '../client/views'));
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);
    // const signal = require('./signaling');
    app.use(cors({ origin: '*' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.get('/config', function (req, res) { return res.json({ useWebSocket: config.type == 'websocket', startupMode: config.mode, logging: config.logging }); });
    app.use('/signaling', signaling_1.default);
    app.use(express.static(path.join(__dirname, '../client/public')));
    app.use('/module', express.static(path.join(__dirname, '../client/src')));
    app.use('/', index_1);
    app.use('/users', users_1);
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
    return app;
};
exports.createServer = createServer;
//# sourceMappingURL=server.js.map
