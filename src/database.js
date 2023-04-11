const { MongoClient } = require("mongodb");

require("dotenv").config();

async function init() {
	const url = process.env.DATABASE_URL;

	if (!url) throw new Error('No database url provided, please add one in the .env file using the following pattern: DATABASE_URL="mongodb+srv://<username>:<password>@<host>"');

	const connection = await MongoClient.connect(url);

	const database = connection.db("main-database");

	return database;
}

exports.getConnection = init;
