const { Router, json } = require("express");
const { validate } = require("./validator");
const { registerController } = require("./controllers/user/registerController");
const { loginController } = require("./controllers/user/loginController");
const { postCreateController } = require("./controllers/post/postCreateController");
const { postUpdateController } = require("./controllers/post/postUpdateController");
const { verifySessionMiddleware } = require("./session");

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/user", json(), validate.user.register, registerController);

router.post("/user/login", json(), validate.user.login, loginController);
router.post("/post", json(), validate.post.create, verifySessionMiddleware, postCreateController);
router.put("/post/:postID", json(), validate.post.update, verifySessionMiddleware, postUpdateController);

exports.router = router;
