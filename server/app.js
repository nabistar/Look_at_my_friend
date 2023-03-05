"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 모듈 참조
const LogHelper_1 = __importDefault(require("./helper/LogHelper"));
const UtillHelper_1 = __importDefault(require("./helper/UtillHelper"));
const WebHelper_1 = __importDefault(require("./helper/WebHelper"));
const cors_1 = __importDefault(require("cors"));
const ExceptionHelper_1 = require("./helper/ExceptionHelper");
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const serve_static_1 = __importDefault(require("serve-static"));
const body_parser_1 = __importDefault(require("body-parser"));
const method_override_1 = __importDefault(require("method-override"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const express_mysql_session_1 = __importDefault(require("express-mysql-session"));
// express 객체 생성
const app = (0, express_1.default)();
const configFileName = process.env.NODE_ENV !== "production" ? ".env.server.development" : ".env.server.production";
const configPath = (0, path_1.join)((0, path_1.resolve)(), configFileName);
if (!fs_1.default.existsSync(configPath)) {
    try {
        throw new Error();
    }
    catch (e) {
        console.error("===========================================");
        console.error("|        Configguration Init Error        |");
        console.error("===========================================");
        console.error("환경설정 파일을 찾을 수 없습니다. 환경설정 파일의 경로를 확인하세요.");
        console.error(`환경설정 파일 경로" ${configPath}`);
        console.error("프로그램을 종료합니다.");
        process.exit(1);
    }
}
dotenv_1.default.config({ path: configPath });
// 클라이언트 접속 시 초기화
app.use(express_useragent_1.default.express());
app.use((req, res, next) => {
    LogHelper_1.default.debug("클라이언트가 접속했습니다.");
    const beginTime = Date.now();
    const current_url = UtillHelper_1.default.urlFormat({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: req.originalUrl,
    });
    LogHelper_1.default.debug(`[${req.method}] ${decodeURIComponent(current_url)}`);
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (req.useragent) {
        LogHelper_1.default.debug(`[client] ${ip} / ${req.useragent.os} / ${req.useragent.browser} (${req.useragent.version}) / ${req.useragent.platform}`);
    }
    res.on("finish", () => {
        const endTime = Date.now();
        const time = endTime - beginTime;
        LogHelper_1.default.debug(`클라이언트의 접속이 종료되었습니다. ::: [runtime] ${time}ms`);
    });
    next();
});
// express 객체의 추가 설정
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.text());
app.use(body_parser_1.default.json());
app.use((0, method_override_1.default)("X-HTTP-Method"));
app.use((0, method_override_1.default)("X-HTTP-Method-Override"));
app.use((0, method_override_1.default)("X-Method-Override"));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_ENCRYPT_KEY));
if (typeof process.env.PUBLIC_PATH == 'string') {
    app.use("/", (0, serve_static_1.default)(process.env.PUBLIC_PATH));
}
if (typeof process.env.UPLOAD_URL == 'string' && typeof process.env.UPLOAD_DIR == 'string') {
    app.use(process.env.UPLOAD_URL, (0, serve_static_1.default)(process.env.UPLOAD_DIR));
}
if (typeof process.env.THUMB_URL == 'string' && typeof process.env.THUMB_DIR == 'string') {
    app.use(process.env.THUMB_URL, (0, serve_static_1.default)(process.env.THUMB_DIR));
}
app.use((0, cors_1.default)());
app.use((0, WebHelper_1.default)());
const store = (0, express_mysql_session_1.default)(express_session_1.default);
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_ENCRYPT_KEY,
    resave: false,
    saveUninitialized: false,
    store: new store({
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_SCHEMA,
        createDatabaseTable: process.env.MYSQL_SESSION_CREATE_TABLE,
        schema: {
            tableName: process.env.MYSQL_SESSION_TABLE_NAME,
            columnNames: {
                session_id: process.env.MYSQL_SESSION_FIELD_ID,
                expires: process.env.MYSQL_SESSION_FIELD_EXPIRES,
                data: process.env.MYSQL_SESSION_FIELD_DATA,
            },
        },
    }),
}));
// router는 객체 추가 설정 중 맨 마지막에 설정
const router = express_1.default.Router();
app.use("/", router);
// 각 url별 백엔드 기능 정의
// 에러 객체를 호출했을 때 동작할 처리. route처리의 맨 마지막에 위치해야함.
app.use((err, req, res, next) => {
    if (res.sendError) {
        res.sendError(err);
    }
});
// 앞에서 정의하지 않은 URL에 대한 일괄 처리 (에러 처리의 맨 마지막에 정의.)
app.use("*", (req, res, next) => {
    if (res.sendError) {
        res.sendError(new ExceptionHelper_1.PageNotFoundException());
    }
});
// 서버 구동 시작
const ip = UtillHelper_1.default.myip();
app.listen(process.env.PORT, () => {
    LogHelper_1.default.debug("-----------------------------------------");
    LogHelper_1.default.debug("|        Start Express Server           |");
    LogHelper_1.default.debug("-----------------------------------------");
    ip.forEach((v, i) => {
        LogHelper_1.default.debug(`server address => http://${v}:${process.env.PORT}`);
    });
    LogHelper_1.default.debug("-----------------------------------------");
});
process.on("exit", () => {
    LogHelper_1.default.debug("백엔드가 종료되었습니다.");
});
process.on("SIGINT", () => {
    process.exit();
});
