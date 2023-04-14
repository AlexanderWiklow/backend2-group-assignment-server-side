const { Router, json } = require("express");
const { validate } = require("./validator");
const { registerController } = require("./controllers/user/registerController");
const { loginController } = require("./controllers/user/loginController");

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/user", json(), validate.user.register, registerController);

router.post("/user/login", json(), validate.user.login, loginController);

exports.router = router;
