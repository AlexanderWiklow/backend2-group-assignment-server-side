const { Router, json } = require("express");

const { validate } = require("./validator");
const { verifySessionMiddleware } = require("./session");

const { registerController } = require("./controllers/user/registerController");
const { loginController } = require("./controllers/user/loginController");

const { postCreateController } = require("./controllers/post/postCreateController");
const { postUpdateController } = require("./controllers/post/postUpdateController");
const { postLikeController } = require("./controllers/post/postLikeController");

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

//user
router.post("/user", json(), validate.user.register, registerController);

router.post("/user/login", json(), validate.user.login, loginController);

//post
router.post("/post", json(), validate.post.create, verifySessionMiddleware, postCreateController);

router.post("/post/like", json(), validate.post.like, verifySessionMiddleware, postLikeController);

router.put("/post/:postID", json(), validate.post.update, verifySessionMiddleware, postUpdateController);

exports.router = router;
