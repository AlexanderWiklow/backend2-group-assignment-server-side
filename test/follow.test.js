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

describe("POST /follow", () => {
	test("Should return 200, adding and removing a user from the following array", async () => {
		const db = await database.getConnection();
		const user = await db.collection("users").findOne({ username: "follow-test-user" });
		const userID = user._id.toString();
		const token = createSession(userID);

		const clientCookie = cookie.serialize("accessToken", token.accessToken, token.cookieConfig);

		const followUserRes = await request(app).post("/follow").send({ targetUserID: "6436c4b32d0e8b50dd369ae0" }).set("Accept", "application/json").set("cookie", clientCookie);

		expect(followUserRes.status).toBe(200);
		expect(followUserRes.body).toEqual({ message: "Followed user" });

		const unFollowUserRes = await request(app).post("/follow").send({ targetUserID: "6436c4b32d0e8b50dd369ae0" }).set("Accept", "application/json").set("cookie", clientCookie);

		expect(unFollowUserRes.status).toBe(200);
		expect(unFollowUserRes.body).toEqual({ message: "Unfollowed user" });
	});
	// test("Should return 401, as following is not available for unauthorised users", async () => {
	// 	const response = await request(app).post("/follow").send({ targetUserID: "6436c4b32d0e8b50dd369ae0" }).set("Accept", "application/json");

	// 	expect(response.status).toBe(401); //TODO: FIX session.js to return 401 when token is invalid.
	// });
	test("Should return 404 as the target user does not exist", async () => {
		const db = await database.getConnection();
		const user = await db.collection("users").findOne({ username: "follow-test-user" });
		const userID = user._id.toString();
		const token = createSession(userID);

		const clientCookie = cookie.serialize("accessToken", token.accessToken, token.cookieConfig);

		const response = await request(app).post("/follow").send({ targetUserID: "000000000000000000000000" }).set("Accept", "application/json").set("cookie", clientCookie);

		expect(response.status).toBe(404);
	});
});

afterAll(async () => {
	await database.closeClient();
});
