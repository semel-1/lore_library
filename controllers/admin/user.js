const bcrypt = require('bcrypt');
const {
    User,
    Book,
    Contact,
    Comment
} = require('../../connection/db-config');


exports.show = async (req, res) => {
    try {
        // Check if the user is an admin
        const foundUser = req.user;
        const userRole = req.userRole;

        if (userRole === "admin") {
            // Find all books, sort by creation date
            const books = await Book.find({}).sort({
                createdAt: -1
            });
            // Find all users
            const users = await User.find({});
            // Find all messages
            const messages = await Contact.find({});
            // Find all comments
            const comments = await Comment.find({});

            // Render the admin page with the data
            res.render('admin', {
                books,
                users,
                messages,
                comments,
                pageName: 'admin',
                message: req.query.message
            });
        } else {
            // Redirect to the home page if the user is not an admin
            res.redirect("/home");
        }
    } catch (error) {
        console.error('Error rendering admin page:', error);
        // Send an internal server error response if an error occurs
        res.status(500).send('Internal Server Error');
    }
};


// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        // Extract user ID from request parameters
        const userId = req.params.id;

        // Find user by ID
        const user = await User.findById(userId);

        // If user not found, return a 404 error
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Return user object as a JSON response
        res.json(user);
    } catch (error) {
        // Log and return an error response if an error occurs
        console.error('Error fetching user:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

// Add user
exports.addUser = async (req, res) => {
    try {
        // Destructure user data from request body
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            role
        } = req.body;

        // Check if user already exists
        const foundUser = await User.findOne({
            $or: [{
                email
            }, {
                phone
            }]
        });

        // If user already exists, return an error response
        if (foundUser) {
            let errorMessage = foundUser.email === email ? "Email already exists" : "Phone already exists";
            return res.status(400).json({
                success: false,
                message: errorMessage
            });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user object with the hashed password
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role
        });

        // Save the new user to the database
        await newUser.save();

        // Send a success response to the client
        res.json({
            success: true,
            message: 'User added successfully'
        });
    } catch (error) {
        // Log and return an error response if an error occurs
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


exports.editUser = async (req, res) => {
    try {
        const {
            id,
            firstName,
            lastName,
            email,
            phone,
            password,
            role
        } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        let hashedPassword;
        if (password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.password = hashedPassword || user.password;
        user.role = role || user.role;

        await user.save();

        res.json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};



// delete a user from the database
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