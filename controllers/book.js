const User = require("../connection/db-config").User;
const Book = require("../connection/db-config").Book;

exports.show = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const img = Buffer.from(book.img.data).toString("base64");

    res.render("book", { book: book, img: img ,pageName :"book"});
  } catch (err) {
    console.log(err);
  }
};

exports.download = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.contentType(book.file.contentType);
    res.send(book.file.data);
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
