const database = require("../../database.js");

// fetch all users from the database except for their password field. This is done by using the projection option in the find() method.
async function getAllUsers(req, res) {
  try {
    const db = await database.getConnection();

    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray();

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getAllUsers };
