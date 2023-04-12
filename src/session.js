const cookie = require("cookie");
const { ObjectId } = require("mongodb");

const { generateToken, validateToken } = require("./authorisation");

function createSession(userID) {
	return { accessToken: generateToken(userID), cookieConfig: { maxAge: 1000 * 60 * 60, path: "/", domain: "localhost", httpOnly: true } };
}

function verifySession(accessToken) {
	const payload = validateToken(accessToken);

	const { userID } = payload;
	if (!userID) throw new Error("No userID in payload");
	//check weather the userID is parsable as an ObjectId
	new ObjectId(payload.userID);

	return payload;
}

function verifySessionMiddleware(req, res, next) {
	const { accessToken } = cookie.parse(req.headers.cookie || "");

	try {
		const payload = verifySession(accessToken);
		console.log(`Access was granted on '${req.url}' to user with id: ${payload.userID ?? "ERR"}`);

		req.body ? (req.body.jwt = payload) : (req.body = { jwt: payload });
		return next();
	} catch (error) {
		console.log(`Access was denied on '${req.url}'`);
		return res.status(400).end();
	}
}

module.exports = { createSession, verifySession, verifySessionMiddleware };
