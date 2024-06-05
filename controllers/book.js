const User = require("../connection/db-config").User;
const Book = require("../connection/db-config").Book;
const Comment = require("../connection/db-config").Comment;

exports.show = async (req, res) => {
  try {
    const foundUser = req.session.user; 
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
  const comment = req.body.comment;
  const book = req.body.book;
  const user = req.session.user;

  if (!user || !user._id) {
    return res.status(401).json({ error: 'User not logged in or user ID missing.' });
  }
  // console.log(req.params);
const newComment = new Comment({
  book:book,
  user: user._id,  
  text: comment
});
newComment.save();
res.redirect("/book/"+book)
}