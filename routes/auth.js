const express = require("express");
const signupController = require("../controllers/signup");
const loginController = require("../controllers/login");
const bookController = require("../controllers/book");
const router = express.Router();

router.post("/signup", signupController.signup);
router.post("/login", loginController.login);
router.post("/comment" ,bookController.addComment)

module.exports = router;
