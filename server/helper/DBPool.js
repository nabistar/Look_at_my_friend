const {join, resolve} = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const logger = require('./LogHelper');

dotenv.config({path: join(resolve(), ".env.zara.development")});

class DBPool {
	static #currnt = null;

	static connectionInfo = {
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		user: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_SCHEMA,
		connectionLimit: process.env.DATABASE_CONNECTION_LIMIT,
		connectTimeout: process.env.DATABASE_CONNECT_TIMEOUT,
		waitForConnections: process.env.DATABASE_WAIT_FOR_CONNECTIONS
	};

	static getInstance() {
		if (DBPool.#currnt == null) {
			DBPool.#currnt = new DBPool();
		} 
		return DBPool.#currnt;
	}

	constructor() {
		this.pool = mysql.createPool(DBPool.connectionInfo);
		this.pool.on('connection', (connection) => {
			logger.info(` >> DATABASE 접속됨 [threadId=${connection.threadId}]`);

			const oldQuery = connection.query;

			connection.query = function (...args) {
				const queryCmd = oldQuery.apply(connection, args);

				logger.debug(queryCmd.sql.trim().replace(/\n/g, " ").replace(/ +(?= )/g, " "));
				return queryCmd;
			}
		});

		this.pool.on('acquire', (connection) => {
			logger.info(` >> Connection 임대됨 [threadId=${connection.threadId}]`);
		});

		this.pool.on('release', (connection) => {
			logger.info(` >> Connection 반납됨 [threadId=${connection.threadId}]`);
		});
	}

	async getConnection() {
		let dbcon = null;

		try {
			dbcon = await this.pool.getConnection();
		} catch (err) {
			if(dbcon) {
				dbcon.release();
				logger.error(err);
				throw err;
			}
		}

		return dbcon;
	}

	close() {
		this.pool.end();
	}
}

module.exports = DBPool.getInstance();