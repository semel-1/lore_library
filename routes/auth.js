const express = require("express");
const signupController = require("../controllers/signup");
const loginController = require("../controllers/login");
const router = express.Router();

router.post("/signup", signupController.signup);
router.post("/login", loginController.login);

module.exports = router;
