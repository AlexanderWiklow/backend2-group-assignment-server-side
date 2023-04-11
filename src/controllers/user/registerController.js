const bcrypt = require("bcrypt");
const database = require("../../database.js");

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
	console.log("User created with ID: " + userID);

	// TODO: createSession(userID, res);

	return res.status(201).end();
}

exports.registerController = registerController;
