const express = require("express");
const signupController = require("../controllers/signup");
const loginController = require("../controllers/login");
const bookController = require("../controllers/book");
const router = express.Router();

router.post("/signup", signupController.signup);
router.post("/login", loginController.login);
router.post("/addComment", bookController.addComment);
router.post("/rating", bookController.rating)

module.exports = router;