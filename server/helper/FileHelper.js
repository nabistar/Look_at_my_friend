const fs = require('fs');
const {join, extname} = require('path');
const multer = require('multer');
const thumbnail = require("node-thumbnail");

class FileHelper {
	static #current = null;

	static getInstanse(){
		if(FileHelper.#current == null) {
			FileHelper.#current = new FileHelper();
		}
		return FileHelper.#current;
	}

	mkdirs(target, permission = '0755') {
		if(target == undefined || target == null){return;}

		target = target.replaceAll('\\', '/');

		const target_list = target.split('/');
		
		let dir = '';

		if (target.substring(0, 1) == '/') {
			dir = '/';
		}

		if (target_list[0].indexOf(":") > -1) {
			target_list[0] += '/';
		}

		target_list.forEach((v, i) => {
			dir = join(dir, v);

			if(v == '.') {
				return;
			}

			if(!fs.existsSync(dir)){
				fs.mkdirSync(dir);
				fs.chmodSync(dir, permission);
			}
		});

	}

	initMulter() {
		this.mkdirs(process.env.UPLOAD_DIR);

		const multipart = multer({
			storage: multer.diskStorage({
				destination: (req, file, callback) => {
					console.group("destination");
					console.debug(file);
					console.groupEnd();

					file.upload_dir = process.env.UPLOAD_DIR.replace(/\\/gi, '/');

					callback(null, file.upload_dir);
				},
				filename: (req, file, callback) => {
					console.group("filename");
					console.debug(file);
					console.groupEnd();

					const extName = extname(file.originalname).toLowerCase();
					const saveName = new Date().getTime().toString() + extName;

					file.savename = saveName;
					file.path = join(file.upload_dir, saveName).replace(/\\/gi, '/');
					file.url = join(process.env.UPLOAD_URL, saveName).replace(/\\/gi, '/');

					if(req.file instanceof Array) {
						req.file.push(file);
					} else {
						req.file = file;
					}

					callback(null, saveName);
				}
			}),
			limits: {
				files: parseInt(process.env.UPLOAD_MAX_COUNT),
				fileSize: parseInt(eval(process.env.UPLOAD_MAX_SIZE))
			},
			fileFilter: (req, file, callback) => {
				const extName = extname(file.originalname).substring(1).toLocaleLowerCase();

				if(process.env.UPLOAD_FILE_FILTER !== undefined) {
					if(process.env.UPLOAD_FILE_FILTER.indexOf(extName) == -1) {
						const err = new Error();
						err.code = 500;
						err.message = process.env.UPLOAD_FILE_FILTER.replaceAll("|", ",") + "형식만 업로드 가능합니다.";

						return callback(err);
					}
				}

				callback(null, true);
			}
		});

		return multipart;
	}

	checkUploadError(err) {
		if(err) {
			if(err instanceof multer.MulterError) {
				switch (err.code) {
					case "LIMIT_FILE_COUNT":
						err.code = 500;
						err.message = "업로드 가능한 파일 수를 초과했습니다.";
						break;
					case "LIMIT_FILE_SIZE":
						err.code = 500;
						err.message = "업로드 가능한 파일 용량을 초과했습니다.";
						break;
					default:
						err.code = 500;
						err.message = "알 수 없는 에러가 발생했습니다.";
						break;
				}
			}

			throw err;
		}
	}

	async createThumbnail(file) {
		this.mkdirs(process.env.THUMB_DIR);
		const size = process.env.THUMB_SIZE.split("|").map((v,i) => parseInt(v));

		for(let i=0; i<size.length; i++) {
			const v = size[i];
			const thumb_options = {
				source: file.path,
				destination: process.env.THUMB_DIR,
				width: v,
				prefix: "thumb_",
				suffix: "_" + v + "w",
				override: true
			};

			const basename = file.savename;
			const filename = basename.substring(0, basename.lastIndexOf("."));
			const thumbname = thumb_options.prefix + filename + thumb_options.suffix + extname(basename);

			if(!file.hasOwnProperty(thumbnail)) {
				file.thumbnail = {};
			}

			const key = v + "w";
			file.thumbnail[key] = `${process.env.THUMB_URL}/${thumbname}`;

			await thumbnail.thumb(thumb_options);
		}
	}

	async createThumbnailMultiple(files) {
		for (let i = 0; i < files.length; i++) {
			await this.createThumbnail(files[i]);
		}
	}
}

module.exports = FileHelper.getInstanse();