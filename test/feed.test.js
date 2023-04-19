const request = require("supertest");
const cookie = require("cookie");

const { router } = require("../src/router.js");
const { createSession } = require("../src/session.js");
const database = require("../src/database.js");

const express = require("express");
const app = express();
app.use(router);

beforeAll(async () => {
	await database.getConnection();
});

describe("GET /feed", () => {
	test("Should return 200 and an array of users. Each containing _id, username and posts", async () => {
		const db = await database.getConnection();
		const user = await db.collection("users").findOne({ username: "Karl" });
		const userID = user._id.toString();
		const token = createSession(userID);

		const clientCookie = cookie.serialize("accessToken", token.accessToken, token.cookieConfig);

		const response = await request(app).get("/feed").set("Accept", "application/json").set("cookie", clientCookie);

		const followedUsers = response.body;
		console.log("followedUsers :>> ", followedUsers);

		expect(response.status).toBe(200);
		followedUsers.forEach((user) => {
			expect(user).toHaveProperty("_id");
			expect(user).toHaveProperty("username");
			expect(user).toHaveProperty("posts");
		});
	});
	// test("Should return 401, as the feed is not available for unauthorised users", async () => {
	// 	const response = await request(app).get("/feed").set("Accept", "application/json");

	// 	expect(response.status).toBe(401); //TODO: FIX session.js to return 401 when token is invalid.
	// });
	test("Should return 200 and an empty array, as the user does not follow anyone", async () => {
		const db = await database.getConnection();
		const user = await db.collection("users").findOne({ username: "a" });
		const userID = user._id.toString();
		const token = createSession(userID);

		const clientCookie = cookie.serialize("accessToken", token.accessToken, token.cookieConfig);

		const response = await request(app).get("/feed").set("Accept", "application/json").set("cookie", clientCookie);

		const followedUsers = response.body;
		console.log("followedUsers :>> ", followedUsers);

		expect(response.status).toBe(200);
		expect(followedUsers).toEqual([]);
	});
});

afterAll(async () => {
	await database.closeClient();
});
