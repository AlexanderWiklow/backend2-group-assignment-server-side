const database = require("../../database.js");
const { createSession } = require("../../session.js");
const bcrypt = require("bcrypt");

// this function will be called when the user tries to log in. It will check if the user exists in the database and if the password is correct
async function loginController(req, res) {
  const { username, password } = req.body;

  try {
    const db = await database.getConnection();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });

    if (user) {
      // If user is found, compare the password from the request with the password from the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // If passwords match, create a session and return a success response
        const userID = user._id.toString();
        console.log("user logged in with ID: " + userID + "");

        // Rest of the code for successful login
        const { accessToken, cookieConfig } = createSession(userID);
        res.cookie("accessToken", accessToken, cookieConfig);

        return res.status(200).json({ message: "Login successful", user });
      } else {
        // Passwords do not match, return an error response
        return res.status(401).json({ error: "Wrong password" });
      }
    } else {
      // If user is not found, return an error response
      return res.status(401).json({ error: "User not found" });
    }
  } catch (error) {
    // Handle any errors that may occur during the login process
    console.error("Error occurred during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

exports.loginController = loginController;
