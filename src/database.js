const { MongoClient } = require("mongodb");

require("dotenv").config();

let connection, client;

async function getConnection() {
	const url = process.env.DATABASE_URL;

	if (!url) throw new Error('No database url provided, please add one in the .env file using the following pattern: DATABASE_URL="mongodb+srv://<username>:<password>@<host>"');

	if (connection) return connection;

	client = await MongoClient.connect(url);

	connection = client.db("main-database");
	return connection;
}

async function closeClient() {
	if (!client) return;

	await client.close();
	client = undefined;
}

module.exports = { getConnection, closeClient };
