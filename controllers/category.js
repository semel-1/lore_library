const {
    Book,
    User
} = require("../connection/db-config");

const handleUserBooks = async (req, res, bookType, pageTitle) => {
    try {
        const foundUser = req.session.user
        const userId = foundUser._id;
        const user = await User.findById(userId).populate(bookType);

        if (!user) {
            return res.redirect('/login');
        }

        res.render('category', {
            foundUser,
            pageName: "category",
            books: user[bookType],
            pageTitle
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
}



exports.category = async (req, res) => {
    const category = req.params.category;
    const foundUser = req.session.user;
    try {
        const books = await Book.find({
            category: category
        });

        res.render('category', {
            foundUser,
            pageName: "category",
            books: books,
            pageTitle: category
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
}

exports.favorite = async (req, res) => {
    await handleUserBooks(req, res, 'favoriteBooks', 'Favorite Books');
}

exports.readLater = async (req, res) => {
    await handleUserBooks(req, res, 'readLaterBooks', 'Books to Read Later');
}