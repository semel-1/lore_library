const Book =require ("../connection/db-config").Book;

exports.show = async(req,res)=>{
    const foundUser = req.session.user; // Get user from session
    const books = await Book.find();
    

    const booksWithImgData = books.map(book => {
        const img = Buffer.from(book.img.data).toString("base64");
        return { ...book._doc, img };
    });
    
    
    if (foundUser) {
        // User is logged in, render home page with foundUser's first name
        res.render("home", { foundUser ,book:booksWithImgData ,pageName:"home"});
    } else {
        // User is not logged in, display "Student"
        res.render("home", { foundUser: "student" ,book:booksWithImgData,pageName:"home"});
    }
};