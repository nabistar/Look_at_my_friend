import express, { Request, Response, NextFunction } from "express";
import LetterService from "../service/LetterService";
import UtilHelper from "../helper/UtillHelper";
import fileHelper from "../helper/FileHelper";
import regexHelper from "../helper/RegexHelper";

interface custom extends Response {
    sendResult?: Function;
    sendError?: Function;
}

interface customReq extends Request {
    file?: Object;
    files?: Object;
}

const url: string = "/lookfriend";
const router = express.Router();

router.get(url, async (req, res: custom, next) => {
    const { nowpage = 1, listCount = 10 } = req.query;
    let pageInfo = null;
    let json = null;

    try {
        const totalCount = LetterService.getCount();
        pageInfo = UtilHelper.pagenation(totalCount, nowpage, listCount);
        json = await LetterService.getList({ offset: pageInfo.offset, listCount: pageInfo.listCount });
    } catch (err) {
        return next(err);
    }

    if (res.sendResult) {
        res.sendResult({ pagenation: pageInfo, data: json });
    }
});

router.get(`${url}/:id`, async (req, res: custom, next) => {
    const { id } = req.params;
    let json = null;

    try {
        json = await LetterService.getItem(id);
    } catch (err) {
        return next(err);
    }

    if (res.sendResult) {
        res.sendResult({ data: json });
    }
});

router.post(url, async (req, res: custom, next) => {
    const { file, content, password } = req.body;
    let json = null;

    try {
        regexHelper.value(file, "등록할 파일이 없습니다.");
        regexHelper.value(password, "비밀번호가 없습니다.");
    } catch (err) {
        return next(err);
    }

    try {
        const params = {
            file_path: file,
            content: content,
            password: password,
        };
		
        json = await LetterService.addItem(params);
    } catch (err) {
        return next(err);
    }

    if (res.sendResult) {
        res.sendResult({ data: json });
    }
});

router.post(`${url}img`, (req: customReq, res: custom, next) => {
    const upload = fileHelper.initMulter().single("friend");

    upload(req, res, async (err: Error) => {
        try {
            fileHelper.checkUploadError(err);
        } catch (err) {
            return next(err);
        }

        if (res.sendResult) {
            res.sendResult({ data: req.file });
        }
    });
});

router.delete(`${url}/:id`, async (req, res: custom, next) => {
    const { id } = req.params;

    try {
        await LetterService.deleteItem(id);
    } catch (err) {
        return next(err);
    }

    if (res.sendResult) {
        res.sendResult();
    }
});

export default router;
