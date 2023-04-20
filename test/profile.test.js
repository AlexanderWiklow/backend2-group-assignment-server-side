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

describe("GET /profile/:username", () => {
	test("should return 200 and the found user object", async () => {
		const response = await request(app).get("/profile/Tor").set("Accept", "application/json");

		expect(response.status).toBe(200);

		const user = response.body;
		expect(typeof user).toBe("object");
		expect(user).toHaveProperty("id");
		expect(user).toHaveProperty("username");
		expect(user).toHaveProperty("posts");
	});

	test("should have clientHasLiked set to true", async () => {
		const db = await database.getConnection();
		const user = await db.collection("users").findOne({ username: "Tor" });
		const userID = user._id.toString();
		const token = createSession(userID);

		const clientCookie = cookie.serialize("accessToken", token.accessToken, token.cookieConfig);

		const response = await request(app).get("/profile/Tor").set("Accept", "application/json").set("Cookie", clientCookie);

		const foundProfile = response.body;
		console.log(foundProfile);

		expect(foundProfile).toHaveProperty("posts");
		expect(foundProfile.posts[0].clientHasLiked).toBe(true);
	});

	test("should have clientHasLiked set to false", async () => {
		const db = await database.getConnection();
		const user = await db.collection("users").findOne({ username: "Karl" });
		const userID = user._id.toString();
		const token = createSession(userID);

		const clientCookie = cookie.serialize("accessToken", token.accessToken, token.cookieConfig);

		const response = await request(app).get("/profile/Tor").set("Accept", "application/json").set("Cookie", clientCookie);

		const foundProfile = response.body;
		console.log(foundProfile);

		expect(foundProfile).toHaveProperty("posts");
		expect(foundProfile.posts[0].clientHasLiked).toBe(false);
	});

	test("should return 404 as the user was not found", async () => {
		const response = await request(app).get("/profile/tor").set("Accept", "application/json");

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "User not found" });
	});
	test("Should return 200 and have an empty posts array", async () => {
		const response = await request(app).get("/profile/a").set("Accept", "application/json");

		expect(response.status).toBe(200);
		expect(response.body.posts).toEqual([]);
	});
	test("Should return 200 and have posts.[i].clientIsAuthor set to true", async () => {
		//Tor is viewing his own posts, therefore he should have clientIsAuthor set to true
		const db = await database.getConnection();
		const user = await db.collection("users").findOne({ username: "Tor" });
		const userID = user._id.toString();
		const token = createSession(userID);

		const clientCookie = cookie.serialize("accessToken", token.accessToken, token.cookieConfig);

		const response = await request(app).get("/profile/Tor").set("Accept", "application/json").set("Cookie", clientCookie);

		const foundProfile = response.body;

		expect(foundProfile).toHaveProperty("posts");
		foundProfile.posts.forEach((post) => {
			expect(post.clientIsAuthor).toBe(true);
		});
	});
	test("Should return 200 and have posts.[i].clientIsAuthor set to false", async () => {
		//Karl is viewing Tor's posts, therefore he should have clientIsAuthor set to false
		const db = await database.getConnection();
		const user = await db.collection("users").findOne({ username: "Karl" });
		const userID = user._id.toString();
		const token = createSession(userID);

		const clientCookie = cookie.serialize("accessToken", token.accessToken, token.cookieConfig);

		const response = await request(app).get("/profile/Tor").set("Accept", "application/json").set("Cookie", clientCookie);

		const foundProfile = response.body;

		expect(foundProfile).toHaveProperty("posts");
		foundProfile.posts.forEach((post) => {
			expect(post.clientIsAuthor).toBe(false);
		});
	});
});

afterAll(async () => {
	await database.closeClient();
});
