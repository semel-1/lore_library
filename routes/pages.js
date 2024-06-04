const express = require("express");
const bookController = require("../controllers/book");
const homeController = require("../controllers/home")

const router = express.Router();

let errorMessage = "";
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.render("signup", { errorMessage });
});

router.get("/login", (req, res) => {
  res.render("login", { errorMessage });
});

router.get("/home",homeController.show )

router.get("/book/:id", bookController.show);

router.get("/book/:id/download", bookController.download);

router.get("/book/:id/read", bookController.read);



module.exports = router;
