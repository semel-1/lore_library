const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const cookieParser = require('cookie-parser')
const session = require("express-session");
require('dotenv').config();


const app = express();


// Middleware to parse JSON bodies
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024
  }
}); // 100MB file size limit


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "thisismysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser())
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