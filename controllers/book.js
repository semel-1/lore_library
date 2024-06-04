const User = require("../connection/db-config").User;
const Book = require("../connection/db-config").Book;
const Comment = require("../connection/db-config").Comment;

exports.show = async (req, res) => {
  try {
    const foundUser = req.user;
    const book = await Book.findById(req.params.id);
    const img = Buffer.from(book.img.data).toString("base64");
    const comments = await Comment.find({ book: req.params.id }).populate("user");
    const formattedComments = comments.map(comment => ({
      ...comment._doc,
      formattedDate: comment.getFormattedDate()
    }));
    if (foundUser){
      res.render("book", {book: book, img:img ,comments:formattedComments,pageName :"book"});
    }else{
      res.redirect("/login")
    }

  } catch (err) {
    console.log(err);
  }
};

exports.download = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.contentType(book.file.contentType);
    res.send(book.file.data);
  } catch (err) {
    console.log(err);
  }
};

exports.read = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.contentType(book.file.contentType);
        res.send(book.file.data);
      } catch (err) {
        console.log(err);
      }
    };


exports.addComment = (req,res)=>{  
const newComment = new Comment({
  book: "665611f31e992fd0974f202a",  // replace with the actual book id
  user: "6657b004baebb0a784ffaebb",  // replace with the actual user id
  text: "This is a comment"
});

// newComment.save();

}