const express = require("express");
const Book = require("../connection/db-config").Book;

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

router.get("/book/:id", async function (req, res) {
  try {
    // Use the Mongoose model to query MongoDB for book data
    const book = await Book.findById(req.params.id);
    const img = Buffer.from(book.img.data).toString("base64");

    // Render the 'book' view and pass it the book data
    res.render("book", { book: book, img: img });
  } catch (err) {
    console.log(err);
  }
});

router.get("/book/:id/download", async function (req, res) {
  try {
    const book = await Book.findById(req.params.id);
    res.contentType(book.file.contentType);
    res.send(book.file.data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
