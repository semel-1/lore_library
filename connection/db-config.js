const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

mongoose.connect("mongodb://localhost:27017/Lore")
  .then(() => console.log("Successfully connected to MongoDB database"))
  .catch((err) => console.error("Connection error", err));

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  favoriteBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  readLaterBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  photo: {
    data: Buffer,
    contentType: String
  },
  role: {
    type: String,
    default: "user"
  }
});



// Pre middleware for removing comments and ratings associated with the user
userSchema.pre('remove', async function (next) {
  try {
    // Remove all comments associated with this user
    await Comment.deleteMany({
      user: this._id
    });

    // Remove all ratings associated with this user
    await Rating.deleteMany({
      user: this._id
    });

    next();
  } catch (error) {
    next(error);
  }
});


const User = mongoose.model("User", userSchema);

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  pageNumber: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  insight: {
    type: String,
    required: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  file: {
    data: Buffer,
    contentType: String
  }
});

const Book = mongoose.model("Book", bookSchema);

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
  const seconds = Math.floor(time / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

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

const Comment = mongoose.model("Comment", commentSchema);

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

const Rating = mongoose.model("Rating", ratingSchema);

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  firstName: String,
  email: String,
  message: String,
  messageType: {
    type: String,
    enum: ['complaint', 'support', 'advice', 'other']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = {
  User,
  Book,
  Comment,
  Rating,
  Contact
};