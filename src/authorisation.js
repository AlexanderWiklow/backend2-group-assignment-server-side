const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();

const key = process.env.JWT_SECRET || "";
if (!key) throw new Error("Please assign a value for JWT_SECRET in a .env file in the project root");

function generateToken(userID) {
	return sign({ userID }, key, { expiresIn: "1h" });
}

function validateToken(token) {
	return verify(token, key);
}

module.exports = { generateToken, validateToken };
