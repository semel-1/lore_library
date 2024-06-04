const mongoose = require("mongoose");
const fs = require("fs-extra");
const path = require("path");

mongoose.connect("mongodb://localhost:27017/Lore").then(() => {
  console.log("successfully connected with mongo database");
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
});

var User = mongoose.model("User", userSchema);

const bookSchema = new mongoose.Schema({
  title: String,
  authorName: String,
  category: String,
  pageNumber: Number,
  language: String,
  numberOfDownload: Number,
  insight: String,
  img: { data: Buffer, contentType: String },
  file: { data: Buffer, contentType: String },
});

var Book = mongoose.model("Book", bookSchema);

const commentSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});


commentSchema.methods.getFormattedDate = function() {
  const date = new Date(this.createdAt);
  const current = Date.now();
  const time = current- date;
    // Calculate days, hours, minutes, and seconds
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
  
    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }  };

var Comment = mongoose.model("Comment", commentSchema);







// const newBook = new Book({
//   title: "ads",
//   authorName: "das",
//   category: "ads",
//   pageNumber: 546,
//   language: "ads",
//   numberOfDownload: 564,
//   insight: "adjkdsajkk",
//   img: { data: Buffer.alloc(0), contentType: "image/jpg" },
//   file: { data: Buffer.alloc(0), contentType: "application/pdf" },
// });

// const imgPath = path.join(
//   __dirname,
//   "../public/style/img/bookCover/image-2.jpg"
// );
// console.log(imgPath);

// fs.access(imgPath, fs.constants.F_OK, (err) => {
//   if (err) {
//     console.error(
//       `${imgPath} ${err.code === "ENOENT" ? "does not exist" : "is read-only"}`
//     );
//   } else {
//     const imageData = fs.readFileSync(imgPath);
//     const contentType = "image/jpg";
//     newBook.img.data = imageData;
//     newBook.img.contentType = contentType;

//     const pdfPath = path.join(__dirname, "../public/books/Svu3.pdf");
//     const pdfData = fs.readFileSync(pdfPath);
//     const pdfContentType = "application/pdf";

//     newBook.file.data = pdfData;
//     newBook.file.contentType = pdfContentType;
//     // newBook.save();
//   }
// });

module.exports = { User, Book ,Comment};
