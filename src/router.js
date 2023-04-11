const { Router, json } = require("express");

const { validate } = require("./validator");

const { registerController } = require("./controllers/user/registerController");

const router = Router();

router.get("/", (req, res) => {
	res.send("Hello World!");
});

router.post("/user", json(), validate.user.register, registerController);

exports.router = router;
