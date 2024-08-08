const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../connection/db-config").User;

exports.login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    const foundUser = await User.findOne({
      email
    });
    if (!foundUser) {
      return res.status(400).render("login", {
        errorMessage: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).render("login", {
        errorMessage: "Invalid email or password"
      });
    }

    const token = jwt.sign({
      id: foundUser._id
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    });

    return res.redirect("/home");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};