const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Lore").then(() => {
  console.log("successfully coneected with mongo database");
});

const userSchema = {
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
};

var User = mongoose.model("User", userSchema);

const bookSchema = {
  title: String,
  authorName: String,
  category: String,
  pageNumber: Number,
  Language: String,
  numberOfDownload: Number,
};

var Book = mongoose.model("Book", bookSchema);

module.exports = { User, Book };
