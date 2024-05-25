const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Lore").then(() => {
  console.log("successfully coneected with mongo database");
});

const userSchema = {
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
};

var User = mongoose.model("User", userSchema);
module.exports = { User };
