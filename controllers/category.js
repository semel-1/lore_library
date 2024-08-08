const {
    Book,
    User
} = require("../connection/db-config");


const handleUserBooks = async (req, res, bookType, pageTitle) => {
    try {
        // Get the user's session and ID
        const foundUser = req.user
        const userId = foundUser._id;

        // Find the user and populate their books in the given category
        const user = await User.findById(userId).populate(bookType);

        // If the user doesn't exist, redirect to the login page
        if (!user) {
            return res.redirect('/login');
        }

        // Render the category page with the user's books
        res.render('category', {
            foundUser,
            pageName: "category",
            books: user[bookType],
            pageTitle
        });
    } catch (err) {
        // If there was an error, log it and send a 500 error response
        console.error(err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
}



exports.category = async (req, res) => {
    // Extract the category from the request parameters
    const category = req.params.category;
    // Get the user's session
    const foundUser = req.user;

    try {
        // Find all books that belong to the given category
        const books = await Book.find({
            category: category
        });

        // Render the category page with the books and the user's session
        res.render('category', {
            foundUser, // The user's session
            pageName: "category", // The name of the page
            books: books, // The books in the category
            pageTitle: category // The title of the category
        });
    } catch (err) {
        // If there was an error, log it and send a 500 error response
        console.error(err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
}

exports.favorite = async (req, res) => {
    // Call the handleUserBooks function to handle the user's favorite books.
    // The function takes in the request and response objects, as well as the name
    // of the book category ('favoriteBooks') and the page title ('Favorite Books').
    await handleUserBooks(req, res, 'favoriteBooks', 'Favorite Books');
}


exports.readLater = async (req, res) => {
    // Call the handleUserBooks function to handle the user's "Books to Read Later" section.
    await handleUserBooks(req, res, 'readLaterBooks', 'Books to Read Later');
}