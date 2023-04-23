const request = require("supertest");
const cookie = require("cookie");

const database = require("../src/database.js");
const { createSession } = require("../src/session.js");
const { router } = require("../src/router.js");
const express = require("express");
const app = express();

app.use(router);

beforeAll(async () => {
	await database.getConnection();
});

describe("GET /profile", () => {
	test("Should redirect to the users profile based on the cookie", async () => {
		const db = await database.getConnection();
		const karl = await db.collection("users").findOne({ username: "Karl" });
		const session = createSession(karl._id);
		const accessToken = cookie.serialize("accessToken", session.accessToken, session.cookieConfig);

		const response = await request(app).get("/profile").set("cookie", accessToken);

		expect(response.statusCode).toBe(302);
		expect(response.headers["location"]).toBe("/profile/Karl");
	});
});

afterAll(async () => {
	await database.closeClient();
});
