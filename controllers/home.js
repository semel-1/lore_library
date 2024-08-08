const {
    Book,
    Contact
} = require("../connection/db-config");

exports.show = async (req, res) => {
    try {
        // Get the user's session, ID, and role from the JWT token
        const foundUser = req.user;
        const userRole = req.userRole;

        // Redirect based on user role
        if (!foundUser) {
            return res.status(401).json({
                error: "Unauthorized access. Please log in."
            });
        }

        if (userRole === 'admin') {
            return res.redirect('/admin'); // Redirect admins to the admin page
        } else if (userRole === 'user') {
            // Proceed to load the home page for regular users

            // Retrieve the unique categories from the database
            const categories = await Book.distinct('category');

            // Create an object to store books by category
            const booksByCategory = {};

            // For each category, retrieve the first 10 books
            for (const category of categories) {
                booksByCategory[category] = await Book.find({
                    category
                }).limit(10);
            }

            // Retrieve all books from the database
            const books = await Book.find();

            // Convert the image data to base64 for each book
            const booksWithImgData = books.map(book => {
                let image = null;
                if (book.image && book.image.data) {
                    image = Buffer.from(book.image.data).toString("base64");
                }

                // Create a new object with the book's data and image
                const {
                    _doc
                } = book;
                return {
                    ..._doc,
                    image
                };
            });

            // Render the home page with the books and categories
            return res.render("home", {
                foundUser,
                books: booksWithImgData,
                booksByCategory,
                pageName: "home"
            });
        } else {
            return res.status(403).json({
                error: "Access denied. You do not have permission to view this page."
            });
        }
    } catch (err) {
        // Log and return an error response if an error occurs
        console.error(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

// Handle contact form submission
exports.contact = async (req, res) => {
    const foundUser = req.user;
    let {
        firstName,
        email,
        message,
        messageType
    } = req.body;

    // Set default values for first name and email if user is logged in
    if (foundUser) {
        firstName = foundUser.firstName;
        email = foundUser.email;
    }

    try {
        // Create a new contact message
        const newContact = new Contact({
            user: foundUser ? foundUser._id : null, // Associate with user if logged in
            firstName,
            email,
            message,
            messageType,
        });

        // Save the new contact message to the database
        await newContact.save();

        // Redirect the user to the home page
        res.redirect("/home");
    } catch (err) {
        // Log the error and return a 500 response to the client
        console.log(err);
        res.status(500).send('There was an error processing your request.');
    }
};