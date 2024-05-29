const express = require("express");
const Book = require("../connection/db-config").Book;
const bookController = require("../controllers/book");

const router = express.Router();
lettitle = "";
let errorMessage = "";

router.get("/", (req, res) => {
  res.render("index", {});
});

router.get("/signup", (req, res) => {
  res.render("signup", { errorMessage });
});

router.get("/login", (req, res) => {
  res.render("login", { errorMessage });
});

router.get("/home", (req, res) => {
  title = "home";
  const foundUser = req.user;

  if (foundUser) {
    // User is logged in, render home page with user's first name
    res.render("home", { foundUser, title });
  } else {
    // User is not logged in, display "Student"
    res.render("home", { foundUser: "student", title });
  }
});

router.get("/book/:id", bookController.show);

router.get("/book/:id/read", bookController.read);

router.get("/book/:id/download", bookController.download);

module.exports = router;
