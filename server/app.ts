// 모듈 참조
import logger from './helper/LogHelper';
import util from "./helper/UtillHelper";
import WebHelper from "./helper/WebHelper";
import cors from "cors";
import { BadRequestException, PageNotFoundException } from "./helper/ExceptionHelper";

import fs from "fs";
import { join, resolve } from "path";

import dotenv from "dotenv";
import express, {Application, Request, Response, NextFunction} from "express";

import useragent from "express-useragent";
import serveStatic from "serve-static";
import serveFavicon from "serve-favicon";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import MySQLStore from "express-mysql-session";

import letter from "./controller/LetterController";

interface custom extends Response {
	sendResult?: Function,
	sendError?: Function
}

// express 객체 생성
const app: Application = express();

const configFileName = process.env.NODE_ENV !== "production" ? ".env.server.development" : ".env.server.production";
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

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.debug("클라이언트가 접속했습니다.");

    const beginTime = Date.now();

    const current_url = util.urlFormat({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: req.originalUrl,
    });

    logger.debug(`[${req.method}] ${decodeURIComponent(current_url)}`);

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if(req.useragent) {
		logger.debug(`[client] ${ip} / ${req.useragent.os} / ${req.useragent.browser} (${req.useragent.version}) / ${req.useragent.platform}`);
	}

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

if (typeof process.env.PUBLIC_PATH == 'string') {
	app.use("/", serveStatic(process.env.PUBLIC_PATH));
}
if (typeof process.env.UPLOAD_URL == 'string' && typeof process.env.UPLOAD_DIR == 'string') {
	app.use(process.env.UPLOAD_URL, serveStatic(process.env.UPLOAD_DIR));
}
if (typeof process.env.THUMB_URL == 'string' && typeof process.env.THUMB_DIR == 'string') {
	app.use(process.env.THUMB_URL, serveStatic(process.env.THUMB_DIR));
}


app.use(cors());
app.use(WebHelper());

const store = MySQLStore(expressSession as any);
app.use(
    expressSession({
        secret: process.env.SESSION_ENCRYPT_KEY as string,
        resave: false,
        saveUninitialized: false,
        store: new store({
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT as string),
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_SCHEMA,
            createDatabaseTable: process.env.MYSQL_SESSION_CREATE_TABLE as unknown as boolean,
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
app.use("/", letter);

// 에러 객체를 호출했을 때 동작할 처리. route처리의 맨 마지막에 위치해야함.
app.use((err: Error, req: Request, res: custom, next: NextFunction) => {
	if(res.sendError){
		res.sendError(err);
	}
});

// 앞에서 정의하지 않은 URL에 대한 일괄 처리 (에러 처리의 맨 마지막에 정의.)
app.use("*", (req: Request, res: custom, next: NextFunction) => {
	if (res.sendError) {
		res.sendError(new PageNotFoundException());
	}
});

// 서버 구동 시작
const ip = util.myip();

app.listen(process.env.PORT, () => {
    logger.debug("-----------------------------------------");
    logger.debug("|        Start Express Server           |");
    logger.debug("-----------------------------------------");

    ip.forEach((v: string, i: number) => {
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
