const mongoose = require("mongoose");
const fs = require("fs-extra");
const path = require("path");
const {
  type
} = require("os");

mongoose.connect("mongodb://localhost:27017/Lore").then(() => {
  console.log("successfully connected with mongo database");
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
  favoriteBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  readLaterBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
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
  img: {
    data: Buffer,
    contentType: String
  },
  file: {
    data: Buffer,
    contentType: String
  },
});

var Book = mongoose.model("Book", bookSchema);

const commentSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


commentSchema.methods.getFormattedDate = function () {
  const date = new Date(this.createdAt);
  const current = Date.now();
  const time = current - date;
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
  }
};

var Comment = mongoose.model("Comment", commentSchema);



const ratingSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  review: {
    type: Number,
    min: 1,
    max: 5
  }
});

var Rating = mongoose.model("Rating", ratingSchema);

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  firstName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ['complaint', 'support', 'advice', 'other'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Contact = mongoose.model('Contact', contactSchema);


module.exports = {
  User,
  Book,
  Comment,
  Rating,
  Contact
};