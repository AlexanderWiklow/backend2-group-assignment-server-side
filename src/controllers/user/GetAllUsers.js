// get all users from mongodb
const database = require("../../database.js");

async function getAllUsers(req, res) {
  const db = await database.getConnection();

  const users = await db.collection("users").find().toArray();

  return res.status(200).json(users);
}

module.exports = { getAllUsers };
