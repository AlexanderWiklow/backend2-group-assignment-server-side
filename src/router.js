const { express, Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

exports.router = router;
