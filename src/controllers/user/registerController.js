const bcrypt = require("bcrypt");

const database = require("../../database.js");
const { createSession } = require("../../session.js");

async function registerController(req, res) {
	const { username, password } = req.body;

	const hashedPassword = await bcrypt.hash(password, 10);

	const db = await database.getConnection();
	const users = db.collection("users");
	const { insertedId } = await users.insertOne({
		username,
		password: hashedPassword
	});

	const userID = insertedId.toString();
	console.log("User registered with ID: " + userID);

	const { accessToken, cookieConfig } = createSession(userID);
	res.cookie("accessToken", accessToken, cookieConfig);

	return res.status(201).end();
}

exports.registerController = registerController;
