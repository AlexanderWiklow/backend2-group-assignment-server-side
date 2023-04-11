const { generateToken } = require("./authorisation");

function createSession(userID, res) {
	res.cookie("accessToken", generateToken(userID), { maxAge: 1000 * 60 * 60, path: "/", domain: "localhost", httpOnly: true });
}

exports = { createSession };
