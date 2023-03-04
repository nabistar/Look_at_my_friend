const {networkInterfaces} = require('os');
const nodemailer = require('nodemailer');
const logger = require('./LogHelper');

class UtilHelper {
	static #current = null;

	static getInstance() {
		if (UtilHelper.#current === null) {
			UtilHelper.#current = new UtilHelper();
		}
		return UtilHelper.#current;
	}

	myip() {
		const ipAddress = [];
		const nets = networkInterfaces();

		for (const attr in nets) {
			const item = nets[attr];

			item.map((v, i) => {
				if ((v.family == 'IPv4' || v.family == 4) && v.address != '127.0.0.1') {
					ipAddress.push(v.address);
				}
			});
		}
		return ipAddress;
	};

	urlFormat(urlObject) {
		return String(Object.assign(new URL('http://a.com'), urlObject));
	}

	async sendMail(writerName, writeEmail, receiverName, receiverEmail, subject, content) {
		if(writerName) {
			writeEmail = `${writerName} <${writeEmail}>`;
		}

		if(receiverName) {
			receiverEmail = `${receiverName} <${receiverEmail}>`;
		}

		const smtp = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.SMTP_USERNAME,
				pass: process.env.SMTP_PASSWORD
			}
		});

		try {
			await smtp.sendMail({
				from: writeEmail,
				to: receiverEmail,
				subject: subject,
				html: content
			});
		} catch (e) {
			logger.error(e.message);
			throw new Error("메일 발송에 실패했습니다.");
		}
	}

	pagenation(totalCount=0, nowPage=1, listCount=10, groupCount=5) {
		totalCount = isNaN(totalCount) ? 0 : parseInt(totalCount);
		nowPage = isNaN(nowPage) ? 1 : parseInt(nowPage);
		listCount = isNaN(listCount) ? 10 : parseInt(listCount);
		groupCount = isNaN(groupCount) ? 5 : parseInt(groupCount);

		let totalPage = parseInt((totalCount - 1) / listCount) + 1;
		let totalGroup = parseInt((totalPage - 1) / groupCount) + 1;
		let nowGroup = parseInt((nowPage - 1) / groupCount) + 1;
		let groupStart = parseInt((nowGroup - 1) * groupCount) + 1;
		let groupEnd = Math.min(totalPage, nowGroup * groupCount);

		let preGroupLastPage = 0;
		if (groupStart > groupCount) {
			preGroupLastPage = groupStart - 1;
		}

		let nextGroupFirstPage = 0;
		if(groupEnd < totalPage) {
			nextGroupFirstPage = groupEnd + 1;
		}

		let offset = (nowPage - 1) * listCount;

		return {
			nowPage: nowPage,
			totalCount: totalCount,
			listCount: listCount,
			totalPage: totalPage,
			groupCount: groupCount,
			totalGroup: totalGroup,
			nowGroup: nowGroup,
			groupStart: groupStart,
			groupEnd: groupEnd,
			preGroupLastPage: preGroupLastPage,
			nextGroupFirstPage: nextGroupFirstPage,
			offset: offset
		};
	}
}

module.exports = UtilHelper.getInstance();