const User = require("../connection/db-config").User;

exports.login = (req, res) => {
  let errorMessage = "";
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email, password: password })
    .then((foundUser) => {
      if (!foundUser) {
        errorMessage = "Email or Password is incorrect";
        res.render("login", { errorMessage: errorMessage });
      } else {
        // instead of send message go to home page
        res.send("successfully log in");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
