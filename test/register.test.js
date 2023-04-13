const request = require("supertest");

const database = require("../src/database.js");
const { app } = require("../src/server.js");

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
});

afterAll(async () => {
	database.getConnection().then((db) => {
		db.collection("users").deleteMany({ username: "test" });
	});
});
