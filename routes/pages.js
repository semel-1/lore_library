const express = require("express");
const bookController = require("../controllers/book");
const homeController = require("../controllers/home");
const categoryController = require("../controllers/category");
const searchController = require("../controllers/search");
const profileController = require("../controllers/profile");
const adminUserController = require("../controllers/admin/user");
const adminBookController = require("../controllers/admin/book");
const {
  route
} = require("./auth");

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


router.get('/logout', (req, res) => {
  if (req.session.user) {
    req.session.user = false;
    res.redirect('/');
  } else {
    res.redirect("/login")
  }
});


router.get("/home", homeController.show)

router.get("/book/:id", bookController.show);

router.get("/book/:id/download", bookController.download);

router.get("/book/:id/read", bookController.read);

router.get("/favorite", categoryController.favorite);

router.get("/readLater", categoryController.readLater);

router.get('/category/:category', categoryController.category);

router.get("/search", searchController.search);

router.get("/profile", profileController.show);

router.get("/admin", adminUserController.show);
router.get('/auth/getUser/:id', adminUserController.getUserById);

router.get('/auth/getBook/:id', adminBookController.getBookById);





module.exports = router;