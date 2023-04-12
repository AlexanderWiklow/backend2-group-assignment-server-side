const express = require("express");
const { router } = require("./router.js");
const app = express();

app.use(router);

app.listen(5050);
console.log("http://localhost:5050");

exports.app = app;
