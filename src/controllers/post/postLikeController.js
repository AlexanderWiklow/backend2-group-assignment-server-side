const database = require("../../database.js");

async function postLikeController(req, res) {
	const { targetUser, targetPost } = req.body;
	const { userID } = req.body.jwt;

	const db = await database.getConnection();
	const users = db.collection("users");

	const user = await users.findOne({ username: targetUser });
	if (!user) return res.status(404).json({ error: "User not found" });

	const postsCountIndex = user.posts.length - 1;
	const targetPostOutOfIndex = targetPost > postsCountIndex;
	if (targetPostOutOfIndex) return res.status(404).json({ error: "Post not found" });

	const removeLikeResult = await users.findOneAndUpdate(
		{ username: targetUser, [`posts.${targetPost}.likes`]: userID },
		{
			$pull: { [`posts.${targetPost}.likes`]: userID }
		}
	);
	const didRemoveLike = removeLikeResult.lastErrorObject.updatedExisting;
	if (didRemoveLike) {
		console.log("Removed like");
		return res.status(200).end();
	}

	await users.findOneAndUpdate(
		{ username: targetUser },
		{
			$push: { [`posts.${targetPost}.likes`]: userID }
		}
	);

	console.log("Added like");
	return res.status(200).end();
}

module.exports = { postLikeController };
