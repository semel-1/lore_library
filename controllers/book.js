const mongoose = require("mongoose")
const {
  Book,
  User,
  Comment,
  Rating,
} = require("../connection/db-config");


// Render the book page with the given book's details and comments
exports.show = async (req, res) => {
  // Initialize sumReviews to 0
  let sumReviews = 0;

  try {
    // Get the session user
    const foundUser = req.user;
    // If no user is found, redirect to login page
    if (!foundUser) {
      return res.redirect("/login");
    }

    // Find the book by ID
    const book = await Book.findById(req.params.id);
    // If no book is found, return a 404 error
    if (!book) {
      return res.status(404).json({
        error: "Book not found"
      });
    }

    // Convert the book image data to base64
    const image = Buffer.from(book.image.data).toString("base64");

    // Find all comments for the book and populate the user field
    const comments = await Comment.find({
      book: req.params.id
    }).populate("user");

    // Find all ratings for the book
    const rating = await Rating.find({
      book: req.params.id
    });

    // Calculate the sum of all reviews
    rating.forEach(review => {
      sumReviews = sumReviews + review.review;
    });

    // Calculate the average review
    const averageReview = sumReviews / rating.length;

    // Format the comments by adding a formattedDate property
    const formattedComments = comments.map(comment => ({
      ...comment._doc,
      formattedDate: comment.getFormattedDate()
    }));

    // Render the book page with the book details, comments, and average review
    res.render("book", {
      foundUser, // Pass the session user
      averageReview, // Pass the average review
      book, // Pass the book object
      image, // Pass the book image
      comments: formattedComments, // Pass the formatted comments
      pageName: "book" // Pass the page name
    });
  } catch (err) {
    // Log and return an error response if an error occurs
    console.error('Error rendering book page:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};


// download a book file
exports.download = async (req, res) => {
  try {
    // Find the book by ID
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        error: "Book not found"
      });
    }

    // Set the response headers
    res.set({
      'Content-Type': book.file.contentType,
      'Content-Disposition': `attachment; filename="${book.fileName || 'downloaded-file'}"`
    });

    // Send the file data
    res.send(book.file.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};


// read a book file
exports.read = async (req, res) => {
  try {
    // Find the book by ID
    const book = await Book.findById(req.params.id);

    // If book is not found, return a 404 error
    if (!book) {
      return res.status(404).json({
        error: "Book not found"
      });
    }

    // Set the response content type and send the file data
    res.contentType(book.file.contentType);
    res.send(book.file.data);
  } catch (err) {
    // Log and return an error response if an error occurs
    console.error(err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};


// Add a comment to a book
exports.addComment = async (req, res) => {
  try {
    const {
      comment,
      book
    } = req.body;
    const user = req.user;

    // Check if user is logged in and has a valid user ID
    if (!user || !user._id) {
      return res.status(401).json({
        error: 'User not logged in or user ID missing.'
      });
    }

    // Create a new comment with the given text and associate it with the book and user
    const newComment = new Comment({
      book,
      user: user._id,
      text: comment
    });

    // Save the comment to the database
    await newComment.save();

    // Redirect the user to the book page after adding the comment
    res.redirect(`/book/${book}`);
  } catch (err) {
    console.error(err);
    // Return a 500 status code and an error message if an error occurs
    res.status(500).json({
      error: "Failed to add comment"
    });
  }
};


// Add a rating to a book
exports.rating = (req, res) => {
  // Get the rating and book from the request body
  const rate = req.body.rate;
  const book = req.body.book;
  const user = req.user;

  // Find or create a rating for the user and book, and update the review
  Rating.findOneAndUpdate({
    user: user._id, // Find the rating belonging to the user
    book: book // and for the specified book
  }, {
    review: rate // Update the review
  }, {
    upsert: true, // Create a new rating if one doesn't exist
    new: true // Return the updated or created rating
  }).then((rating) => {
    // Redirect the user to the book page after rating
    res.redirect(`/book/${book}`);

  }).catch((err) => {
    // Log any errors that occur
    console.log(err);
  });
}


// Toggle a book as a favorite 
exports.favorite = async (req, res) => {
  try {
    // Get the user ID and book ID from the request
    const userId = req.user._id;
    const bookId = req.params.id;

    // Find the user and book by their IDs
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    // If the user or book is not found, return an error response
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }
    if (!book) {
      return res.status(404).json({
        error: "Book not found"
      });
    }

    // Check if the book is already a favorite
    const isFavorite = user.favoriteBooks.some(
      (favBook) => favBook && favBook.toString() === bookId.toString()
    );

    // Toggle the favorite status
    if (isFavorite) {
      user.favoriteBooks.pull(bookId);
    } else {
      user.favoriteBooks.push(bookId);
    }

    // Save the updated user and send a success response
    await user.save();
    res.status(200).json({
      favorite: !isFavorite
    });
  } catch (err) {
    // Log and return an error response if an error occurs
    console.error(err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};


// Toggle a book as "Read Later" 
exports.readLater = async (req, res) => {
  try {
    // Get the user ID and book ID from the request
    const userId = req.user._id;
    const bookId = req.params.id;

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      // If the user is not found, return a 404 error
      return res.status(404).json({
        error: "User not found"
      });
    }

    // Find the book by its ID
    const book = await Book.findById(bookId);
    if (!book) {
      // If the book is not found, return a 404 error
      return res.status(404).json({
        error: "Book not found"
      });
    }

    // Check if the book is already in the "Read Later" list
    const isReadLater = user.readLaterBooks.some(book => book && book.toString() === bookId.toString());

    // Toggle the "Read Later" status
    if (isReadLater) {
      user.readLaterBooks.pull(bookId);
    } else {
      user.readLaterBooks.push(bookId);
    }

    // Save the updated user and send a success response
    await user.save();
    res.status(200).json({
      readLater: !isReadLater
    });
  } catch (err) {
    // Log and return an error response if an error occurs
    console.error(err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};