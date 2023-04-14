const database = require("../../database.js");

async function profileController(req, res) {
	const { username } = req.params;

	const db = await database.getConnection();

	const foundUser = await db.collection("users").findOne({ username });
	if (foundUser === null) return res.status(404).json({ message: "User not found" });

	const publicUser = {
		username: foundUser.username,
		posts: foundUser.posts
	};

	return res.status(200).json(publicUser);
}

module.exports = { profileController };
