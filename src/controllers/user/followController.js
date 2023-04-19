const { ObjectId } = require("mongodb");

const database = require("../../database.js");

//The goal with this controller is to allow requestors
//to add/remove users to/from their own following list.

async function followController(req, res) {
	const { jwt, targetUserID } = req.body;

	const userIDObjectId = new ObjectId(jwt.userID);

	const db = await database.getConnection();
	const users = db.collection("users");
	const foundUser = await users.findOne({ _id: userIDObjectId });

	const targetUserExists = await users.findOne({ _id: new ObjectId(targetUserID) });
	if (!targetUserExists) return res.status(404).json({ error: "The target user does not exist" });

	//Check weather targetUserID already is included in
	//foundUser.following.
	//Depending on that state, $push/$pull from the array.

	const alreadyFollowsTargetUser = foundUser.follows?.includes(targetUserID) || false;
	if (alreadyFollowsTargetUser) {
		await users.findOneAndUpdate(
			{ _id: userIDObjectId },
			{
				$pull: { follows: targetUserID }
			}
		);
		console.log(`'${foundUser.username}' unfollowed user with username: ${targetUserExists.username}`);
		return res.status(200).json({ message: "Unfollowed user" });
	}

	await users.findOneAndUpdate(
		{ _id: userIDObjectId },
		{
			$push: { follows: targetUserID }
		}
	);
	console.log(`'${foundUser.username}' followed user with username: ${targetUserExists.username}`);
	return res.status(200).json({ message: "Followed user" });
}

module.exports = { followController };
