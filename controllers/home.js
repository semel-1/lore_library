const {
    Book,
    Contact
} = require("../connection/db-config");

exports.show = async (req, res) => {
    try {
        const foundUser = req.session.user;

        const categories = await Book.distinct('category');

        const booksByCategory = {};

        for (const category of categories) {
            booksByCategory[category] = await Book.find({
                category: category
            }).limit(10);
        }

        const books = await Book.find();

        const booksWithImgData = books.map(book => {
            let image = null;
            if (book.image && book.image.data) {
                image = Buffer.from(book.image.data).toString("base64");
            }

            const {
                _doc
            } = book;
            return {
                ..._doc,
                image
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

exports.contact = async (req, res) => {
    const foundUser = req.session.user;
    let {
        firstName,
        email,
        message,
        messageType
    } = req.body;

    if (foundUser) {
        firstName = foundUser.firstName;
        email = foundUser.email;
    }

    try {
        const newContact = new Contact({
            user: foundUser ? foundUser._id : null,
            firstName,
            email,
            message,
            messageType,
        });

        await newContact.save();
        res.redirect("/home");
    } catch (err) {
        console.log(err);
        res.status(500).send('There was an error processing your request.');
    }
};