const bcrypt = require('bcrypt');
const User = require("../connection/db-config").User;

exports.login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    // Find the user by email
    const foundUser = await User.findOne({
      email: email
    });
    if (!foundUser) {
      return res.render("login", {
        errorMessage: "Invalid email or password"
      });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.render("login", {
        errorMessage: "Invalid email or password"
      });
    }

    // If password matches, proceed with the login process
    req.session.user = foundUser;
    return res.redirect("/home");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};