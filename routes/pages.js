const express = require("express");
const router = express.Router();

let errorMessage = "";

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.render("signup", { errorMessage });
});

router.get("/login", (req, res) => {
  res.render("login", { errorMessage });
});

module.exports = router;
