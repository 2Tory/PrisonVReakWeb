"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
var express = require("express");
const session = require('express-session');
var path = require("path");
var morgan = require("morgan");
var signaling_1 = require("./signaling");
var httphandler_1 = require("./class/httphandler");
const passport = require('passport');
const bodyParser = require('body-parser');
var index_1 = require("../client/routes/index");

const authController = require('../client/controllers/authController');
const mainRouter = require('../client/routes/auth');
const authCheck = require('../client/middleware/authCheck');
const postRouter = require('../client/routes/post');

var cors = require('cors');
var createServer = function (config) {
    var app = express();
    (0, httphandler_1.reset)(config.mode);
    app.set('views', path.join(__dirname, '../client/views'));
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(session({
      secret: 'aaaa@aaaa', // 원하는 문자 입력
      resave: false,
      saveUninitialized: true,
    }));

    // Passport 및 세션 미들웨어 초기화
    app.use(passport.initialize());
    app.use(passport.session());

    // 인증 라우터
    app.use('/auth', mainRouter);
    app.use('/', postRouter);

    // const signal = require('./signaling');
    app.use(cors({ origin: '*' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.get('/config', function (req, res) { return res.json({ useWebSocket: config.type == 'websocket', startupMode: config.mode, logging: config.logging }); });
    app.use('/signaling', signaling_1.default);
    app.use(express.static(path.join(__dirname, '../client/public')));
    app.use('/partials', express.static(path.join(__dirname, '../client/views/partials')));
    app.use('/', index_1);



    return app;
};
exports.createServer = createServer;
//# sourceMappingURL=server.js.map
