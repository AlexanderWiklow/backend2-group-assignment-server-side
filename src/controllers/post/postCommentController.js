const { ObjectId } = require("mongodb");
const database = require("../../database.js");

async function postCommentController(req, res) {
  const jwt = req.body.jwt;
  const commenterID = jwt.userID;
  const { postId } = req.params;
  const { comment } = req.body;

  if (!ObjectId.isValid(postId)) return res.status(400).json({ message: "Invalid post ID" });

  const db = await database.getConnection();

  const user = await db.collection("users").findOne({ _id: new ObjectId(commenterID) });
  const newComment = {
    sender: user.username,
    comment,
    createdAt: new Date()
  };

  const result = await db
    .collection("users")
    .updateOne({ "posts._id": new ObjectId(postId) }, { $push: { "posts.$.comments": newComment } });

  if (result.modifiedCount === 0) {
    return res.status(404).json({ message: "Post not found or comment not added" });
  }

  return res.status(201).json({ message: "Comment added successfully" });
}

module.exports = { postCommentController };
