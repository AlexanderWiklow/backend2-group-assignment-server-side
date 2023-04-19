const mongoDB = require("mongodb");

const database = require("../../database.js");

// The purpose of this controller is to return
// the requestors followed users posts

async function feedController(req, res) {
	const { jwt } = req.body;

	const db = await database.getConnection();
	const users = db.collection("users");

	const user = await users.findOne({ _id: new mongoDB.ObjectId(jwt.userID) });
	const followedUsersIDs = user.follows || [];

	const followedUsers = [];
	followedUsersIDs.forEach((id) => {
		const followedUser = users.findOne({ _id: new mongoDB.ObjectId(id) });
		followedUsers.push(followedUser);
	});

	const awaitedFollowedUsers = (await Promise.all(followedUsers)).map((followedUser) => {
		//assign weather the requestor has liked individual posts
		const posts =
			followedUser.posts?.map((post) => {
				post.clientHasLiked = post.likes.includes(jwt.userID);
				return post;
			}) || [];

		const publicUser = {
			_id: followedUser._id,
			username: followedUser.username,
			posts
		};

		return publicUser;
	});

	return res.status(200).json(awaitedFollowedUsers);
}

module.exports = { feedController };
