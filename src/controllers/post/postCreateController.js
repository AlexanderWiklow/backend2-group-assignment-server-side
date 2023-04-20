const { ObjectId } = require("mongodb");

const database = require("../../database.js");

async function postCreateController(req, res) {
  const jwt = req.body.jwt;
  const postOwnersID = jwt.userID;
  const { content } = req.body;

  const db = await database.getConnection();
  const post = {
    _id: new ObjectId(),
    content,
    createdAt: new Date(),
    likes: [],
    comments: []
  };

  await db.collection("users").updateOne({ _id: new ObjectId(postOwnersID) }, { $push: { posts: post } });

  return res.status(201).json({ message: "Post created", postId: post._id });
}

module.exports = { postCreateController };
