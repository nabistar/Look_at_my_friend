const logger = require('./LogHelper');

const WebHelper = () => {
	return (req, res, next) => {
		res._sendResult = (data, error=null) => {
			const json = {
				rt: 'ok',
				rtcode: 200,
				rtmsg: null
			};

			if (error) {
				json.rt = error.name || "Server Error";
				json.rtcode = error.code || 500;
				json.rtmsg = error.message || "요청을 처리하는데 실패했습니다.";

				if (isNaN(json.rtcode)) {
					json.rtcode = 500;
				}
			}

			if (data) {
				for (const item in data) {
					json[item] = data[item];
				}
			}

			const offset = new Date().getTimezoneOffset() * 60000;
			const today = new Date(Date.now() - offset);
			json.pubdate = today.toISOString();

			res.header("Content-Type", "application/json; charset=utf-8");
			res.header("name", encodeURIComponent(json.name));
			res.header("message", encodeURIComponent(json.message));
			res.status(json.rtcode || 200).send(json);
		};

		res.sendResult = (data) => {
			res._sendResult(data);
		};

		res.sendError = (error) => {
			logger.error(error.stack);

			if (error.code == undefined) {
				error.code = 500;
			}

			res._sendResult(null, error);
		};

		next();
	};
};

module.exports = WebHelper;