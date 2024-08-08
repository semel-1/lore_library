const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../connection/db-config").User;

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password
    } = req.body;
    let errorMessage = "";

    const foundUser = await User.findOne({
      $or: [{
        email: email
      }, {
        phone: phone
      }]
    });

    if (foundUser) {
      if (foundUser.email === email) {
        errorMessage = "Email already exists";
      } else if (foundUser.phone === phone) {
        errorMessage = "Phone already exists";
      }
      return res.render("signup", {
        errorMessage
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("Successfully inserted one user");

    // Generate a JWT token for the user
    const token = jwt.sign({
      id: newUser._id
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN, // e.g., '1h', '24h'
    });

    // Set the JWT in a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure flag in production
      maxAge: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000, // e.g., 90 days in milliseconds
    });

    // Redirect to home or any other protected route
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};