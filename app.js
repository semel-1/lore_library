const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pageRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");
app.use("/", pageRoutes);
app.use("/auth", authRoutes);

// Other setup and routes

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
