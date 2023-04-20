const { ObjectId } = require("mongodb");

const database = require("../../database.js");

async function postUpdateController(req, res) {
  const jwt = req.body.jwt;
  const postOwnersID = jwt.userID;
  const { postId } = req.params;
  const { content } = req.body;

  const db = await database.getConnection();
  const updatedPost = {
    "posts.$.content": content
  };

  const result = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(postOwnersID), "posts._id": new ObjectId(postId) }, { $set: updatedPost });

  if (result.modifiedCount === 0) {
    return res.status(404).json({ message: "Post not found or not updated" });
  }

  return res.status(200).json({ message: "Post updated successfully" });
}

module.exports = { postUpdateController };
