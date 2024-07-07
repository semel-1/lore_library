const mongoose = require("mongoose")
const {
  Book,
  User,
  Comment,
  Rating,
} = require("../connection/db-config");

exports.show = async (req, res) => {

  let sumReviews = 0

  try {
    const foundUser = req.session.user;
    if (!foundUser) {
      return res.redirect("/login");
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        error: "Book not found"
      });
    }

    const image = Buffer.from(book.image.data).toString("base64");

    const comments = await Comment.find({
      book: req.params.id
    }).populate("user");

    const rating = await Rating.find({
      book: req.params.id
    })

    rating.forEach(review => {
      sumReviews = sumReviews + review.review;
    });

    const averageReview = sumReviews / rating.length;

    const formattedComments = comments.map(comment => ({
      ...comment._doc,
      formattedDate: comment.getFormattedDate()
    }));

    res.render("book", {
      foundUser,
      averageReview,
      book,
      image,
      comments: formattedComments,
      pageName: "book"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};


exports.download = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        error: "Book not found"
      });
    }

    res.set({
      'Content-Type': book.file.contentType,
      'Content-Disposition': `attachment; filename="${book.fileName || 'downloaded-file'}"`
    });

    res.send(book.file.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};


exports.read = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        error: "Book not found"
      });
    }

    res.contentType(book.file.contentType);
    res.send(book.file.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};


exports.addComment = async (req, res) => {
  try {
    const {
      comment,
      book
    } = req.body;
    const user = req.session.user;

    if (!user || !user._id) {
      return res.status(401).json({
        error: 'User not logged in or user ID missing.'
      });
    }

    const newComment = new Comment({
      book,
      user: user._id,
      text: comment
    });

    await newComment.save();
    res.redirect(`/book/${book}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to add comment"
    });
  }
};


exports.rating = (req, res) => {
  const rate = req.body.rate;
  const book = req.body.book;
  const user = req.session.user;

  Rating.findOneAndUpdate({
    user: user._id,
    book: book
  }, {
    review: rate
  }, {
    upsert: true,
    new: true
  }).then((rating) => {
    res.redirect(`/book/${book}`);

  }).catch((err) => {
    console.log(err);
  });
}

exports.favorite = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const bookId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        error: "Book not found"
      });
    }

    const isFavorite = user.favoriteBooks.some(book => book && book.toString() === bookId.toString());
    if (isFavorite) {
      user.favoriteBooks.pull(bookId);
    } else {
      user.favoriteBooks.push(bookId);
    }

    await user.save();
    res.status(200).json({
      favorite: !isFavorite
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};


exports.readLater = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const bookId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        error: "Book not found"
      });
    }

    const isReadLater = user.readLaterBooks.some(book => book && book.toString() === bookId.toString());
    if (isReadLater) {
      user.readLaterBooks.pull(bookId);
    } else {
      user.readLaterBooks.push(bookId);
    }

    await user.save();
    res.status(200).json({
      readLater: !isReadLater
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};