const User = require("../connection/db-config").User;

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email, password: password })
    .then((foundUser) => {
      if (!foundUser) {
        // User not found, show error message and redirect to login page
        const errorMessage = "Email or Password is incorrect";
        res.render("login", { errorMessage: errorMessage });
      } else {
        // User found, redirect to home page
        res.render("home", { foundUser });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
};
