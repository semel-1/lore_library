const mongosse = require("mongoose");

mongosse.connect("mongodb://localhost:27017/Lore").then(() => {
  console.log("successfully coneected with mongo database");
});
