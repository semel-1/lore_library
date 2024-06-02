const express = require("express");
const Book = require("../connection/db-config").Book;
const bookController = require("../controllers/book");

const router = express.Router();

let errorMessage = "";
let pageName = "";

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
    pageName = "home"
    // User is logged in, render home page with user's first name
    res.render("home", { foundUser,pageName });
  } else {
    // User is not logged in, display "Student"
    res.render("home", { foundUser: "student",pageName:"home" });
  }
});

router.get("/book/:id", bookController.show);

router.get("/book/:id/download", bookController.download);

router.get("/book/:id/read", bookController.read);

module.exports = router;
