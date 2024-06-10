const {
    Book
} = require("../connection/db-config");

exports.show = async (req, res) => {
    try {
        const foundUser = req.session.user;

        // Fetch categories from the database
        const categories = await Book.distinct('category');

        // Fetch books for each category
        const booksByCategory = {};

        for (const category of categories) {
            booksByCategory[category] = await Book.find({
                category: category
            }).limit(10);
        }

        // Fetch all books
        const books = await Book.find();

        // Format books with image data
        const booksWithImgData = books.map(book => {
            const img = Buffer.from(book.img.data).toString("base64");
            const {
                _doc
            } = book;
            return {
                ..._doc,
                img
            };
        });

        res.render("home", {
            foundUser: foundUser || "student",
            books: booksWithImgData,
            booksByCategory: booksByCategory,
            pageName: "home"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};