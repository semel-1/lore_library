const bcrypt = require('bcrypt');
const {
    User,
    Book,
    Contact,
    Comment
} = require('../../connection/db-config');


exports.show = async (req, res) => {
    try {
        const foundUser = req.session.user;
        if (foundUser.role === "admin") {
            const books = await Book.find({}).sort({
                createdAt: -1
            });
            const users = await User.find({});
            const messages = await Contact.find();
            const comments = await Comment.find();

            res.render('admin', {
                books,
                users,
                messages,
                comments,
                pageName: 'admin',
                message: req.query.message
            });
        } else {
            res.redirect("/home");
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
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};


exports.addUser = async (req, res) => {
    try {
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

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Hash the password if it is provided
        let hashedPassword;
        if (password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        // Update the user with the new values
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.password = hashedPassword || user.password;
        user.role = role || user.role;

        // Save the updated user to the database
        await user.save();

        // Return a success response
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