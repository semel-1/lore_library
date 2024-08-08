const express = require("express");
const signupController = require("../controllers/signup");
const loginController = require("../controllers/login");
const bookController = require("../controllers/book");
const profileController = require("../controllers/profile");
const adminUserController = require("../controllers/admin/user");
const adminBookController = require("../controllers/admin/book");
const adminMessageController = require("../controllers/admin/message");
const adminCommentController = require("../controllers/admin/comment");
const homeController = require("../controllers/home")
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/signup", signupController.signup);
router.post("/login", loginController.login);
router.post("/addComment", authController.isLogedIn, bookController.addComment);
router.post("/rating", authController.isLogedIn, bookController.rating);
router.post("/favorite/:id", authController.isLogedIn, bookController.favorite);
router.post("/readLater/:id", authController.isLogedIn, bookController.readLater);
router.post("/contact", authController.isLogedIn, homeController.contact);
router.post("/updateUserInfo", authController.isLogedIn, profileController.updateUserInfo);

router.post("/addUser", authController.isLogedIn, authController.restrictTo('admin'), adminUserController.addUser);
router.patch('/editUser', authController.isLogedIn, authController.restrictTo('admin'), adminUserController.editUser);
router.post('/deleteUser', authController.isLogedIn, authController.restrictTo('admin'), adminUserController.deleteUser);

router.post('/addBook', authController.isLogedIn, authController.restrictTo('admin'), adminBookController.addBook);
router.patch('/editBook', authController.isLogedIn, authController.restrictTo('admin'), adminBookController.editBook);
router.post('/deleteBook', authController.isLogedIn, authController.restrictTo('admin'), adminBookController.deleteBook);

router.post('/messages/:id/read', authController.isLogedIn, authController.restrictTo('admin'), adminMessageController.markAsRead);
router.delete('/messages/:id', authController.isLogedIn, authController.restrictTo('admin'), adminMessageController.deleteMessage);
router.delete('/comments/:id', authController.isLogedIn, authController.restrictTo('admin'), adminCommentController.deleteComment);

module.exports = router;