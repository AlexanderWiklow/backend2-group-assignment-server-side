const { Router, json } = require("express");

const { validate } = require("./validator");
const { verifySessionMiddleware } = require("./session");

const { profileController } = require("./controllers/user/profileController");
const {
  myProfileController,
} = require("./controllers/user/myProfileController");
const { registerController } = require("./controllers/user/registerController");
const { loginController } = require("./controllers/user/loginController");
const { followController } = require("./controllers/user/followController");
const { feedController } = require("./controllers/user/feedController.js");

const {
  postCreateController,
} = require("./controllers/post/postCreateController");
const {
  postUpdateController,
} = require("./controllers/post/postUpdateController");
const { postLikeController } = require("./controllers/post/postLikeController");
const {
  postDeleteController,
} = require("./controllers/post/postDeleteController");
const {
  postCommentController,
} = require("./controllers/post/postCommentController");
const { getAllUsers } = require("./controllers/user/getAllUsers");

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

//user
router.get("/profile/:username", validate.user.profile, profileController);

router.get("/profile", verifySessionMiddleware, myProfileController);

router.post("/user", json(), validate.user.register, registerController);

router.post("/user/login", json(), validate.user.login, loginController);

router.post(
  "/follow",
  json(),
  validate.user.follow,
  verifySessionMiddleware,
  followController
);

router.get("/feed", verifySessionMiddleware, feedController);

router.get("/users", verifySessionMiddleware, getAllUsers);

//post
router.post(
  "/post",
  json(),
  validate.post.create,
  verifySessionMiddleware,
  postCreateController
);

router.post(
  "/post/like",
  json(),
  validate.post.like,
  verifySessionMiddleware,
  postLikeController
);

router.put(
  "/post/:postId",
  json(),
  validate.post.update,
  verifySessionMiddleware,
  postUpdateController
);

router.delete(
  "/post",
  json(),
  validate.post.delete,
  verifySessionMiddleware,
  postDeleteController
);

router.post(
  "/post/:postId/comment",
  json(),
  validate.post.comment,
  verifySessionMiddleware,
  postCommentController
);

exports.router = router;
