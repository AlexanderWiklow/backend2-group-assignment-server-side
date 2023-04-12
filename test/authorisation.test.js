const authorisation = require("../src/authorisation.js");

test("generateToken() returns a string", () => {
	const token = authorisation.generateToken("userID");
	expect(typeof token).toBe("string");
});

test("generated token validates", () => {
	const token = authorisation.generateToken("userID");
	const decoded = authorisation.validateToken(token);
	expect(decoded.userID).toBe("userID");
});

test("validateToken() throws an error if token is invalid", () => {
	expect(() => {
		authorisation.validateToken("invalid token");
	}).toThrow();
});
