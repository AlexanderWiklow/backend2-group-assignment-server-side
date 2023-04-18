const { ObjectId } = require("mongodb");

const database = require("../../database.js");

async function postDeleteController(req, res) {
  const jwt = req.body.jwt;
  const postOwnersID = jwt.userID;
  //   const { postID } = req.body;
  const { content } = req.body;

  const db = await database.getConnection();

  await db
    .collection("users")
    .deleteOne(
      { _id: new ObjectId(postOwnersID) },
      { $pull: { posts: { postID } } }
    );

  return res.status(204).json({ message: "Post deleted successfully" });
}

module.exports = { postDeleteController };
