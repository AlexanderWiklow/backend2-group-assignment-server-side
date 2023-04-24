const { ObjectId } = require("mongodb");

const database = require("../../database");

async function myProfileController(req, res) {
	const { userID } = req.body.jwt;

	const db = await database.getConnection();
	const users = db.collection("users");
	const { username } = await users.findOne({ _id: new ObjectId(userID) });

	return res.status(200).json({ redirect: username ? `/profile/${username}` : undefined });
}

module.exports = { myProfileController };
