import mybatisMapper from "mybatis-mapper";
import DBPool from "../helper/DBPool";
import { RuntimeException } from "../helper/ExceptionHelper";

interface params {
	file_path: string;
	content?: string;
	password: string;
}

interface page {
	offset: number;
	listCount: number;
}

class LetterService {
	constructor() {
		mybatisMapper.createMapper([
			"./server/mapper/LetterMapper.xml"
		]);
	}

	async getList(params: page) {
		let dbcon = null;
		let data = null;

		try {
            dbcon = await DBPool.getConnection();
            let sql = mybatisMapper.getStatement(
                "LetterMapper",
                "selectList",
				{offset: params.offset, listCount: params.listCount}
            );
            let [result] = await dbcon.query(sql);

            data = result;
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) {
                dbcon.release();
            }
        }

        return data;
	}

	async getItem(id: string) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement(
                "LetterMapper",
                "selectItem",
                {id: id}
            );
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                throw new RuntimeException("데이터를 조회할 수 없습니다.");
            }

            data = result[0];

        } catch (err) {
            throw err;
        } finally {
            if (dbcon) {
                dbcon.release();
            }
        }

        return data;
    }

	async addItem(params: params) {
        let dbcon = null;
        let data = null;

        try {
            dbcon = await DBPool.getConnection();
            let sql = mybatisMapper.getStatement(
                "LetterMapper",
                "insertItem",
                {file_path: params.file_path, content: params.content, password: params.password}
            );
            let [{ insertId, affectedRows }] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException("저장된 데이터가 없습니다.");
            }

            sql = mybatisMapper.getStatement("LetterMapper", "selectItem", {
                id: insertId,
            });
            let [result] = await dbcon.query(sql);

            if (result.length === 0) {
                throw new RuntimeException(
                    "저장된 데이터를 조회할 수 없습니다."
                );
            }

            data = result[0];

        } catch (err) {
            throw err;
        } finally {
            if (dbcon) {
                dbcon.release();
            }
        }

        return data;
    }

	async deleteItem(id: string) {
        let dbcon = null;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement("LetterMapper", "deleteItem", {id: id});
            let [{ affectedRows }] = await dbcon.query(sql);

            if (affectedRows === 0) {
                throw new RuntimeException("삭제된 데이터가 없습니다.");
            }
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) {
                dbcon.release();
            }
        }
    }

    async getCount() {
        let dbcon = null;
        let cnt = 0;

        try {
            dbcon = await DBPool.getConnection();

            let sql = mybatisMapper.getStatement(
                "LetterMapper",
                "selectCount"
            );
            let [result] = await dbcon.query(sql);

            if (result.length > 0) {
                cnt = result[0].cnt;
            }
        } catch (err) {
            throw err;
        } finally {
            if (dbcon) {
                dbcon.release();
            }
        }

        return cnt;
    }
}

export default new LetterService();