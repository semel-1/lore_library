// routes/auth.js
const express = require("express");
const signupController = require("../controllers/signup");
const loginController = require("../controllers/login");
const bookController = require("../controllers/book");
const homeController = require("../controllers/home");
const profileController = require("../controllers/profile");
const adminUserController = require("../controllers/admin/user");
const adminBookController = require("../controllers/admin/book");

const router = express.Router();

router.post("/signup", signupController.signup);
router.post("/login", loginController.login);
router.post("/addComment", bookController.addComment);
router.post("/rating", bookController.rating);
router.post("/favorite/:id", bookController.favorite);
router.post("/readLater/:id", bookController.readLater);
router.post("/contact", homeController.contact);
router.post("/updateUserInfo", profileController.updateUserInfo);
router.post("/addUser", adminUserController.addUser);
router.post('/editUser', adminUserController.editUser);
router.post('/deleteUser', adminUserController.deleteUser);
router.post('/addBook', adminBookController.addBook);
router.post('/editBook', adminBookController.editBook);
router.post('/deleteBook', adminBookController.deleteBook);


module.exports = router;