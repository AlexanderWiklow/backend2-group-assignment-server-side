const { ObjectId } = require("mongodb");
const database = require("../../database.js");

async function postDeleteController(req, res) {
  const jwt = req.body.jwt;
  const postOwnersID = jwt.userID;
  const postID = req.query.postID;

  const db = await database.getConnection();

  try {
    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(postOwnersID), "posts._id": new ObjectId(postID) },
        { $pull: { posts: { _id: new ObjectId(postID) } } }
      );

    if (result.modifiedCount === 0) {
      throw new Error("Post not found");
    }

    return res.status(204).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { postDeleteController };
