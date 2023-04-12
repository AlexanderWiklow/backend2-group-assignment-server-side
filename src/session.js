const cookie = require("cookie");
const { ObjectId } = require("mongodb");

const { generateToken } = require("./authorisation");

function createSession(userID, res) {
	res.cookie("accessToken", generateToken(userID), { maxAge: 1000 * 60 * 60, path: "/", domain: "localhost", httpOnly: true });
}

function verifySession(req, res, next) {
	const { accessToken } = cookie.parse(req.headers.cookie || "");

	let payload;
	try {
		payload = validateToken(accessToken);

		const { userID } = payload;
		if (!userID) throw new Error("No userID in payload");
		//check weather the userID is parsable as an ObjectId
		new ObjectId(payload.userID);
		console.log(`Access was granted on '${req.url}' to user with id: ${payload.userID ?? "ERR"}`);

		req.body ? (req.body.jwt = payload) : (req.body = { jwt: payload });
		return next();
	} catch (error) {
		console.log(`Access was denied on '${req.url}'`);
		return res.status(400).end();
	}
}

exports = { createSession, verifySession };
