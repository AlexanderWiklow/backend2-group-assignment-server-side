const request = require("supertest");
const { router } = require("../src/router.js");
const express = require("express");
const app = express();

app.use(router);

const database = require("../src/database.js");

beforeAll(async () => {
	await database.getConnection();
});

// two scenarios for login testing - one for success and one for failure
describe("POST /user/login", () => {
  test("should return 200, and give an accessToken", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({ username: "Alex", password: "123456" })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);

    const cookie = response.headers["set-cookie"][0];
    expect(cookie).toMatch(/accessToken=/);
  });

  test("should return 400, and not give an accessToken", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({ username: "", password: "" })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);

    const cookie = response.headers["set-cookie"];
    expect(cookie).toBeUndefined();
  });
});

afterAll(async () => {
	await database.closeClient();
});
