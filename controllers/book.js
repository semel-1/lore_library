const express = require("express");
const User = require("../connection/db-config").User;
const Book = require("../connection/db-config").Book;

exports.show = async (req, res) => {
  title = "book";
  try {
    // Use the Mongoose model to query MongoDB for book data
    const book = await Book.findById(req.params.id);
    const img = Buffer.from(book.img.data).toString("base64");

    // Render the 'book' view and pass it the book data
    res.render("book", { book: book, img: img, title });
  } catch (err) {
    console.log(err);
  }
};

exports.read = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.contentType(book.file.contentType);
    res.send(book.file.data);
  } catch (err) {
    console.log(err);
  }
};

exports.download = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.contentType(book.file.contentType);
    // Set Content-Disposition header to trigger a file download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + book.file.name
    );
    res.send(book.file.data);
  } catch (err) {
    console.log(err);
  }
};
