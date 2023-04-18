const { ObjectId } = require("mongodb");
const database = require("../../database.js");

async function postDeleteController(req, res) {
  const jwt = req.query.jwt;
  const postOwnersID = jwt.userID; // Update variable name from jwt.userID to req.query.userID
  const postID = jwt.postID; // Update variable to directly access query parameter value
  // const { content } = req.body;

  const db = await database.getConnection();

  await db.collection("users").deleteOne(
    { _id: ObjectId(postOwnersID) }, // Convert postOwnersID to ObjectId
    { $pull: { posts: { _id: ObjectId(postID) } } } // Convert postID to ObjectId
  );

  return res.status(204).json({ message: "Post deleted successfully" });
}

module.exports = { postDeleteController };
