const express = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/", require("./routes/pages"));

app.listen(3000, () => {
  console.log("server started on port 3000");
});
