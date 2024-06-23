const express = require("express");
const signupController = require("../controllers/signup");
const loginController = require("../controllers/login");
const bookController = require("../controllers/book");
const homeController = require("../controllers/home");
const profileController = require("../controllers/profile");

const router = express.Router();

router.post("/signup", signupController.signup);
router.post("/login", loginController.login);
router.post("/addComment", bookController.addComment);
router.post("/rating", bookController.rating);
router.post("/favorite/:id", bookController.favorite);
router.post("/readLater/:id", bookController.readLater);
router.post("/contact", homeController.contact)
router.post("/updateUserInfo", profileController.updateUserInfo)


module.exports = router;