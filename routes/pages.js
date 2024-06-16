const express = require("express");
const bookController = require("../controllers/book");
const homeController = require("../controllers/home");
const categoryController = require("../controllers/category");
const searchController = require("../controllers/search");

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


router.get("/home", homeController.show)

router.get("/book/:id", bookController.show);

router.get("/book/:id/download", bookController.download);

router.get("/book/:id/read", bookController.read);

router.get("/favorite", categoryController.favorite);

router.get("/readLater", categoryController.readLater);

router.get('/category/:category', categoryController.category);

router.get("/search", searchController.search)




module.exports = router;





module.exports = router;