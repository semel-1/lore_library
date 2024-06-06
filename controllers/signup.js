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

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    await newUser.save();
    console.log("Successfully inserted one user");
    return res.redirect("/login");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};