const {
    Book
} = require("../connection/db-config");

exports.show = async (req, res) => {
    try {
        const foundUser = req.session.user;
        const books = await Book.find();

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
            pageName: "home"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};