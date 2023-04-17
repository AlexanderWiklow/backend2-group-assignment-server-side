const request = require("supertest");

const { router } = require("../src/router.js");

const express = require("express");
const app = express();
app.use(router);

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

	test("should return 404 as the user was not found", async () => {
		const response = await request(app).get("/profile/tor").set("Accept", "application/json");

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "User not found" });
	});
});
