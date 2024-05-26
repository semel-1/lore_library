const express = require("express");
const User = require("../connection/db-config").User;

exports.signup = (req, res) => {
  let errorMessage = "";

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;

  const newUser = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    password: password,
  });

  User.findOne({ $or: [{ email: email }, { phone: phone }] })
    .then((foundUser) => {
      if (foundUser) {
        if (foundUser.email === email) {
          errorMessage = "Email already exist";
        } else if (foundUser.phone === phone) {
          errorMessage = "Phone already exists";
        }
        res.render("signup", { errorMessage: errorMessage });
      } else {
        newUser
          .save()
          .then(() => {
            console.log("Successfully inserted one user");
            res.redirect("/login");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
