// 모듈 참조
const logger = require("./helper/LogHelper");
const { myip, urlFormat, sendMail } = require("./helper/UtillHelper");
const fileHelper = require("./helper/FileHelper");
const WebHelper = require("./helper/WebHelper");
const cors = require("cors");
const { BadRequestException, PageNotFoundException } = require("./helper/ExceptionHelper");
const regexHelper = require("./helper/RegexHelper");

const fs = require("fs");
const { join, resolve } = require("path");

const dotenv = require("dotenv");
const express = require("express");

const useragent = require("express-useragent");
const serveStatic = require("serve-static");
const serveFavicon = require("serve-favicon");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const MySQLStore = require("express-mysql-session")(expressSession);
const nodemailer = require("nodemailer");

// express 객체 생성
const app = express();

const configFileName = process.env.NODE_ENV !== "production" ? ".env.zara.development" : ".env.zara.production";
const configPath = join(resolve(), configFileName);

if (!fs.existsSync(configPath)) {
    try {
        throw new Error();
    } catch (e) {
        console.error("===========================================");
        console.error("|        Configguration Init Error        |");
        console.error("===========================================");
        console.error("환경설정 파일을 찾을 수 없습니다. 환경설정 파일의 경로를 확인하세요.");
        console.error(`환경설정 파일 경로" ${configPath}`);
        console.error("프로그램을 종료합니다.");
        process.exit(1);
    }
}

dotenv.config({ path: configPath });

// 클라이언트 접속 시 초기화
app.use(useragent.express());

app.use((req, res, next) => {
    logger.debug("클라이언트가 접속했습니다.");

    const beginTime = Date.now();

    const current_url = urlFormat({
        protocol: req.protocol,
        host: req.get("host"),
        port: req.port,
        pathname: req.originalUrl,
    });

    logger.debug(`[${req.method}] ${decodeURIComponent(current_url)}`);

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    logger.debug(`[client] ${ip} / ${req.useragent.os} / ${req.useragent.browser} (${req.useragent.version}) / ${req.useragent.platform}`);

    res.on("finish", () => {
        const endTime = Date.now();
        const time = endTime - beginTime;
        logger.debug(`클라이언트의 접속이 종료되었습니다. ::: [runtime] ${time}ms`);
    });

    next();
});

// express 객체의 추가 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));

app.use(cookieParser(process.env.COOKIE_ENCRYPT_KEY));

app.use("/", serveStatic(process.env.PUBLIC_PATH));
app.use(process.env.UPLOAD_URL, serveStatic(process.env.UPLOAD_DIR));
app.use(process.env.THUMB_URL, serveStatic(process.env.THUMB_DIR));

app.use(cors());
app.use(WebHelper());

app.use(
    expressSession({
        secret: process.env.SESSION_ENCRYPT_KEY,
        resave: false,
        saveUninitialized: false,
        store: new MySQLStore({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
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
    }),
);

// router는 객체 추가 설정 중 맨 마지막에 설정
const router = express.Router();
app.use("/", router);

// 각 url별 백엔드 기능 정의


// 에러 객체를 호출했을 때 동작할 처리. route처리의 맨 마지막에 위치해야함.
app.use((err, req, res, next) => res.sendError(err));

// 앞에서 정의하지 않은 URL에 대한 일괄 처리 (에러 처리의 맨 마지막에 정의.)
app.use("*", (req, res, next) => res.sendError(new PageNotFoundException()));

// 서버 구동 시작
const ip = myip();

app.listen(process.env.PORT, () => {
    logger.debug("-----------------------------------------");
    logger.debug("|        Start Express Server           |");
    logger.debug("-----------------------------------------");

    ip.forEach((v, i) => {
        logger.debug(`server address => http://${v}:${process.env.PORT}`);
    });

    logger.debug("-----------------------------------------");
});

process.on("exit", () => {
    logger.debug("백엔드가 종료되었습니다.");
});

process.on("SIGINT", () => {
    process.exit();
});
