const { ObjectId } = require("mongodb");
const database = require("../../database.js");

async function postDeleteController(req, res) {
  // const jwt = req.query.jwt;
  const postOwnersID = req.query.userID;
  const postID = req.query.postID; // Update variable to directly access query parameter value
  // const { content } = req.body;
  console.log("Hello");

  console.log("postOwnersID", postOwnersID);
  console.log("postID", postID);

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
