const { ObjectId } = require("mongodb");
const database = require("../../database.js");

async function postLikeController(req, res) {
	const { targetUser, targetPost } = req.body;
	const { userID } = req.body.jwt;

	const db = await database.getConnection();
	const users = db.collection("users");

	const targetPostObjectId = new ObjectId(targetPost);

	const matchedUserAndPost = await users.findOne({ username: targetUser, "posts._id": targetPostObjectId });
	console.log("matchedUserAndPost", matchedUserAndPost);
	if (matchedUserAndPost === null) return res.status(404).json({ error: "User or post not found" });

	//Can be optimised by running an aggregation in mongodb. For now this works.
	const matchedPost = matchedUserAndPost.posts.find((post) => {
		return post._id.toString() === targetPost;
	});
	const clientHasLiked = matchedPost.likes.includes(userID);

	if (clientHasLiked) {
		await users.findOneAndUpdate(
			{ username: targetUser, "posts._id": targetPostObjectId },
			{
				$pull: { "posts.$.likes": userID }
			}
		);
		console.log("Removed like");
		return res.status(200).end();
	}

	await users.findOneAndUpdate(
		{ username: targetUser, "posts._id": targetPostObjectId },
		{
			$push: { "posts.$.likes": userID }
		}
	);
	console.log("Added like");
	return res.status(201).end();
}

module.exports = { postLikeController };
