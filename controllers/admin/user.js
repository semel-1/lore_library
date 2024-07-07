const {
    User,
    Book
} = require('../../connection/db-config');


exports.show = async (req, res) => {

    try {
        const foundUser = req.session.user;
        if (foundUser.role === "admin") {
            // Fetch data as needed for the admin page
            const books = await Book.find({}).sort({
                createdAt: -1
            }); // Example fetching books
            const users = await User.find({}); // Example fetching users

            // Render admin.ejs with appropriate data
            res.render('admin', {
                books: books,
                users: users,
                pageName: 'admin',
                message: req.query.message
            });
        } else {
            res.redirect("/home")
        }

    } catch (error) {
        console.error('Error rendering admin page:', error);
        res.status(500).send('Internal Server Error');
    }

};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            // If user not found, return a 404 error.
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Return the user.
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        // If an error occurred, return a 500 error.
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

exports.addUser = async (req, res) => {
    try {
        // Extract user details from the request body.
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            role
        } = req.body;

        // Create a new user object with the extracted details.
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password,
            role
        });

        // Save the new user to the database.
        await newUser.save();

        // Send a success response to the client.
        res.json({
            success: true,
            message: 'User added successfully'
        });
    } catch (error) {
        // Log any error that occurs and return a 500 error to the client.
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.editUser = async (req, res) => {
    try {
        // Extract user details from the request body.
        const {
            id, // The ID of the user to be updated.
            firstName, // The first name of the user.
            lastName, // The last name of the user.
            email, // The email of the user.
            phone, // The phone number of the user.
            password, // The password of the user.
            role // The role of the user.
        } = req.body;

        // Find the user by ID and update the fields with the new values.
        const updatedUser = await User.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            phone,
            password,
            role
        }, {
            new: true // Return the updated document.
        });

        if (!updatedUser) {
            // If the user is not found, return a 404 error.
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Return a success response with a message.
        res.json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        // Log any error that occurs and return a 500 error to the client.
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        // Extract user id from request body
        const {
            id
        } = req.body;

        // Find and delete user by id
        const deletedUser = await User.findByIdAndDelete(id);

        // If user not found, return a 404 error
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Return a success response with a message
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        // Log any error that occurs and return a 500 error to the client
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};