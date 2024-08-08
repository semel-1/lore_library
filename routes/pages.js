const express = require("express");
const bookController = require("../controllers/book");
const homeController = require("../controllers/home");
const categoryController = require("../controllers/category");
const searchController = require("../controllers/search");
const profileController = require("../controllers/profile");
const adminUserController = require("../controllers/admin/user");
const adminBookController = require("../controllers/admin/book");
const adminMessageController = require("../controllers/admin/message");
const adminCommentController = require("../controllers/admin/comment");
const authController = require("../controllers/auth");

const router = express.Router();

let errorMessage = "";
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.render("signup", {
    errorMessage
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    errorMessage
  });
});

router.get('/logout', authController.logout);
router.get("/home", authController.isLogedIn, homeController.show);
router.get("/book/:id", authController.isLogedIn, bookController.show);
router.get("/book/:id/download", authController.isLogedIn, bookController.download);
router.get("/book/:id/read", authController.isLogedIn, bookController.read);
router.get("/favorite", authController.isLogedIn, categoryController.favorite);
router.get("/readLater", authController.isLogedIn, categoryController.readLater);
router.get('/category/:category', authController.isLogedIn, categoryController.category);

router.get("/search", searchController.search);
router.get("/profile", authController.isLogedIn, profileController.show);

router.get("/admin", authController.isLogedIn, authController.restrictTo('admin'), adminUserController.show);
router.get('/auth/getUser/:id', authController.isLogedIn, authController.restrictTo('admin'), adminUserController.getUserById);
router.get('/auth/getBook/:id', authController.isLogedIn, authController.restrictTo('admin'), adminBookController.getBookById);
router.get('/messages', authController.isLogedIn, authController.restrictTo('admin'), adminMessageController.fetchMessages);
router.get('/comments', authController.isLogedIn, authController.restrictTo('admin'), adminCommentController.getComments);

module.exports = router;