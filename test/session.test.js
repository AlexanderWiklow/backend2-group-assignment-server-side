const mongodb = require("mongodb");
const session = require("../src/session.js");

test("createSession() returns an object with an accessToken and cookieConfig", () => {
	const sessionObject = session.createSession("userID");
	expect(typeof sessionObject).toBe("object");
	expect(typeof sessionObject.accessToken).toBe("string");
	expect(typeof sessionObject.cookieConfig).toBe("object");
});

test("verifySession() returns an object with a userID", () => {
	const mongodbId = new mongodb.ObjectId().toString();

	const token = session.createSession(mongodbId).accessToken;
	const payload = session.verifySession(token);
	expect(typeof payload).toBe("object");
	expect(payload.userID).toBe(mongodbId);
});
