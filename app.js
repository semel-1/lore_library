const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");




const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "thisismysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


const pageRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");

app.use("/", pageRoutes);
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});