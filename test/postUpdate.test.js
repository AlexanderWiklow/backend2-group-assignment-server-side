const request = require("supertest");
const database = require("../src/database.js");
const { router } = require("../src/router.js");
const express = require("express");
const app = express();

app.use(router);

describe("PUT /post/:postId", () => {
  let accessToken;
  let postId;

  beforeAll(async () => {
    const newUser = await request(app)
      .post("/user")
      .send({ username: "test-update-post", password: "testpassword" })
      .set("Accept", "application/json");

    accessToken = newUser.headers["set-cookie"][0];
    const newPost = await request(app)
      .post("/post")
      .send({ content: "Original content" })
      .set("Accept", "application/json")
      .set("cookie", accessToken);
    console.log("newPost.body:", newPost.body); // Update this line

    postId = newPost.body.postId;
  });

  test("should return 200, and update the post", async () => {
    const response = await request(app)
      .put(`/post/${postId}`)
      .send({ content: "Updated content" })
      .set("Accept", "application/json")
      .set("cookie", accessToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Post updated successfully");
  });

  test("should return 404, and not update the post", async () => {
    const response = await request(app)
      .put("/post/123456789012")
      .send({ content: "Updated content" })
      .set("Accept", "application/json")
      .set("cookie", accessToken);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Post not found or not updated");
  });

  afterEach(async () => {
    const db = await database.getConnection();
    await db.collection("users").deleteOne({ username: "test-update-post" });
  });

  afterAll(async () => {
    await database.closeConnection();
  });
});
