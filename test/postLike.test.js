const request = require("supertest");

const database = require("../src/database.js");
const { router } = require("../src/router.js");

const express = require("express");
const app = express();
app.use(router);

describe("POST /post/like", () => {
	test("Should return 200 when toggling a like on a post", async () => {
		const targetUser = "Tor";
		const targetPost = "643e5660e0f8b72dd4e3d431";

		const newUser = await request(app).post("/user").send({ username: "test-post-like-toggle", password: "a" }).set("Accept", "application/json");
		const accessToken = newUser.headers["set-cookie"][0];

		const addLike = await request(app).post("/post/like").send({ targetUser, targetPost }).set("Accept", "application/json").set("cookie", accessToken);

		expect(addLike.status).toBe(201);

		const removeLike = await request(app).post("/post/like").send({ targetUser, targetPost }).set("Accept", "application/json").set("cookie", accessToken);

		expect(removeLike.status).toBe(200);

		const db = await database.getConnection();
		await db.collection("users").deleteOne({ username: "test-post-like-toggle" });
	});
	test("Should return 404 as the target user does not exist", async () => {
		const targetUser = "nonexistantuser";
		const targetPost = "643e5660e0f8b72dd4e3d431";

		const newUser = await request(app).post("/user").send({ username: "test-post-like-invalid-user", password: "a" }).set("Accept", "application/json");
		const accessToken = newUser.headers["set-cookie"][0];

		const response = await request(app).post("/post/like").send({ targetUser, targetPost }).set("Accept", "application/json").set("cookie", accessToken);

		expect(response.status).toBe(404);

		const db = await database.getConnection();
		await db.collection("users").deleteOne({ username: "test-post-like-invalid-user" });
	});
	test("Should return 404 as the target post does not exist", async () => {
		const targetUser = "Tor";
		const targetPost = "000000000000000000000000";

		const newUser = await request(app).post("/user").send({ username: "test-post-like-invalid-post", password: "a" }).set("Accept", "application/json");
		const accessToken = newUser.headers["set-cookie"][0];

		const response = await request(app).post("/post/like").send({ targetUser, targetPost }).set("Accept", "application/json").set("cookie", accessToken);

		expect(response.status).toBe(404);

		const db = await database.getConnection();
		await db.collection("users").deleteOne({ username: "test-post-like-invalid-post" });
	});
});

afterAll(async () => {
	const db = await database.getConnection();
	await db.collection("users").deleteOne({ username: "test-post-like-toggle" });
	await db.collection("users").deleteOne({ username: "test-post-like-invalid-user" });
	await db.collection("users").deleteOne({ username: "test-post-like-invalid-post" });
});
