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

describe("PUT /post/:postId 400", () => {
  test("should return 400", async () => {
    const db = await database.getConnection();
    const karl = await db.collection("users").findOne({ username: "Karl" });
    const session = createSession(karl._id);
    const accessToken = cookie.serialize("accessToken", session.accessToken, session.cookieConfig);

    const response = await request(app).put("/post/invalid-post-id").send({ content: "invalid-post-id-content" }).set("Accept", "application/json").set("cookie", accessToken);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid post ID");
  });
});

afterAll(async () => {
  await database.closeClient();
});
