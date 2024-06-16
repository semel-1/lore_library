const mongoose = require("mongoose");
const {
    Book
} = require("../connection/db-config");

exports.search = async (req, res) => {
    let query = req.query.search;

    if (typeof query !== 'string') {
        query = String(query);
    }


    console.log(`Search query: ${query}`);

    try {
        const books = await Book.find({
            $or: [{
                    title: {
                        $regex: query,
                        $options: 'i'
                    }
                },
                {
                    authorName: {
                        $regex: query,
                        $options: 'i'
                    }
                }
            ]
        });


        if (books.length > 0) {
            res.render('category', {
                books,
                pageName: "category",
                pageTitle: "Search result"
            });
        } else {
            res.send('No books found with this name.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};