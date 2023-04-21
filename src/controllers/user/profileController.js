const mongodb = require("mongodb");
const cookie = require("cookie");

const database = require("../../database.js");
const { verifySession } = require("../../session.js");

async function profileController(req, res) {
	const { username } = req.params;

	let jwt;
	try {
		jwt = verifySession(cookie.parse(req.headers.cookie || "").accessToken);
	} catch (_) {}
	const userID = jwt?.userID || "";

	const db = await database.getConnection();

	const foundUser = await db.collection("users").findOne({ username });
	if (foundUser === null) return res.status(404).json({ message: "User not found" });

	const clientIsProfileOwner = foundUser._id.toString() === userID;
	let clientIsFollowing;
	if (clientIsProfileOwner || !userID) {
		clientIsFollowing = false;
	} else {
		clientIsFollowing = !!(await db.collection("users").findOne({ _id: new mongodb.ObjectId(userID), follows: foundUser._id.toString() }));
	}

	//Each post is modified to contain weather this specific client has liked the post or not.
	//This is done since the client can not determine weather they have liked or not, as their own userID is baked into the JWT.
	const posts =
		foundUser.posts?.map((post) => {
			post.clientHasLiked = post.likes.includes(userID);
			post.clientIsAuthor = userID === foundUser._id.toString();
			return post;
		}) || [];

	const publicUser = {
		id: foundUser._id,
		username: foundUser.username,
		clientIsProfileOwner,
		clientIsFollowing,
		posts
	};

	return res.status(200).json(publicUser);
}

module.exports = { profileController };
