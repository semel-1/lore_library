const mongoose = require("mongoose");
const {
    Book
} = require("../connection/db-config");

// search controller based on search query
exports.search = async (req, res) => {
    // Extract the search query from the request query parameters
    let query = req.query.search;

    // Ensure the query is a string
    if (typeof query !== 'string') {
        query = String(query);
    }

    // Log the search query
    console.log(`Search query: ${query}`);

    try {
        // Search for books based on the query
        const books = await Book.find({
            $or: [
                // Search by title
                {
                    title: {
                        $regex: query,
                        $options: 'i' // Case-insensitive search
                    }
                },
                // Search by author name
                {
                    authorName: {
                        $regex: query,
                        $options: 'i' // Case-insensitive search
                    }
                }
            ]
        });

        // If books are found, render the category page with the search results
        if (books.length > 0) {
            res.render('category', {
                books,
                pageName: "category",
                pageTitle: "Search result"
            });
        } else {
            // If no books are found, send a message indicating that
            res.send('No books found with this name.');
        }
    } catch (err) {
        // If an error occurs, log it and send a server error response
        console.error(err);
        res.status(500).send('Server Error');
    }
};