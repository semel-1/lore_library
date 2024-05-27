const express = require("express");
const User = require("../connection/db-config").User;

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

router.get("/home", (req, res) => {
  const foundUser = req.user; // Assuming you have middleware that sets req.user after successful login

  if (foundUser) {
    // User is logged in, render home page with user's first name
    res.render("home", { foundUser });
  } else {
    // User is not logged in, display "Student"
    res.render("home", { foundUser: "student" });
  }
});

router.get("/book", (req, res) => {
  res.render("book");
});

module.exports = router;
