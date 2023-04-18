const request = require("supertest");

const database = require("../src/database.js");
const { router } = require("../src/router.js");

const express = require("express");
const app = express();
app.use(router);

beforeAll(async () => {
	await database.getConnection();
});

describe("POST /user", () => {
	test("should return 201, and give an accessToken", async () => {
		const response = await request(app).post("/user").send({ username: "test", password: "test" }).set("Accept", "application/json");

		expect(response.status).toBe(201);

		const cookie = response.headers["set-cookie"][0];
		expect(cookie).toMatch(/accessToken=/);
	});

	test("should return 400, and not give an accessToken", async () => {
		const response = await request(app).post("/user").send({ username: "", password: "" }).set("Accept", "application/json");

		expect(response.status).toBe(400);

		const cookie = response.headers["set-cookie"];
		expect(cookie).toBeUndefined();
	});

	test("should return 409 when username is taken", async () => {
		const response = await request(app).post("/user").send({ username: "test", password: "test" }).set("Accept", "application/json");

		expect(response.status).toBe(409);

		const cookie = response.headers["set-cookie"];
		expect(cookie).toBeUndefined();

		const db = await database.getConnection();
		db.collection("users").deleteMany({ username: "test" });
	});
});

afterAll(async () => {
	const db = await database.getConnection();
	db.collection("users").deleteMany({ username: "test" });
	await database.closeClient();
});
