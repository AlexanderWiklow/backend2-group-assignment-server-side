const { ObjectId } = require("mongodb");
const database = require("../../database.js");

async function postDeleteController(req, res) {
  const postOwnersID = req.query.userID;
  const postID = req.query.postID;

  const db = await database.getConnection();

  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(postOwnersID), "posts._id": new ObjectId(postID) },
      { $pull: { posts: { _id: new ObjectId(postID) } } }
    );
  return res.status(204).json({ message: "Post deleted successfully" });
}

module.exports = { postDeleteController };
