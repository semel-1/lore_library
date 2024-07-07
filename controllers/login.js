const {
  User
} = require("../connection/db-config");

exports.login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    const foundUser = await User.findOne({
      email,
      password
    });
    console.log(__dirname);

    if (!foundUser) {
      const errorMessage = "Email or Password is incorrect";
      return res.render("login", {
        errorMessage
      });
    }

    req.session.user = foundUser;
    if (foundUser.role === "admin") {
      return res.redirect("/admin");
    } else if (foundUser.role === "user") {
      return res.redirect("/home")
    }

  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};