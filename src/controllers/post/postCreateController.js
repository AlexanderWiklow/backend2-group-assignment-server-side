const { ObjectId } = require("mongodb");

const database = require("../../database.js");

async function postCreateController(req, res) {
  const jwt = req.body.jwt;
  const postOwnersID = jwt.userID;
  const { content } = req.body;

  const db = await database.getConnection();
  const post = {
    content,
    createdAt: new Date(),
  };

  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(postOwnersID) }, { $push: { posts: post } });

  return res.status(201).json({ message: "Post created" });
}

module.exports = { postCreateController };
