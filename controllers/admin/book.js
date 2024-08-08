const {
    Book
} = require('../../connection/db-config');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});


// Get book by ID
exports.getBookById = async (req, res) => {
    try {
        // Extract the book ID from the request parameters
        const bookId = req.params.id;

        // Find the book by its ID
        const book = await Book.findById(bookId);

        // If the book is not found, return a 404 error response
        if (!book) {
            return res.status(404).json({
                error: 'Book not found'
            });
        }

        // Return the book object as a JSON response
        res.status(200).json(book);
    } catch (error) {
        // Log and return an error response if an error occurs
        console.error('Error fetching book:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

// Add book
exports.addBook = [
    upload.fields([{
            name: 'image', // name of the field in the form
            maxCount: 1 // maximum number of files allowed
        },
        {
            name: 'file_input',
            maxCount: 1
        }
    ]),
    async (req, res) => {
        try {
            // Extract the book data from the request body
            const {
                title,
                authorName,
                category,
                pageNumber,
                language,
                insight
            } = req.body;

            // Extract the image and file from the request files
            const image = req.files['image'] ? req.files['image'][0] : null;
            const file = req.files['file_input'] ? req.files['file_input'][0] : null;

            // Create a new Book object with the extracted data
            const newBook = new Book({
                title,
                authorName,
                category,
                pageNumber,
                language,
                insight,
                image: image ? {
                    data: image.buffer,
                    contentType: image.mimetype
                } : null,
                file: file ? {
                    data: file.buffer,
                    contentType: file.mimetype
                } : null
            });

            // Save the new book to the database
            await newBook.save();

            // Return a success response
            res.status(200).json({
                success: true,
                message: 'Book added successfully'
            });
        } catch (error) {
            // Log and return an error response if an error occurs
            console.error('Error adding book:', error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
];

exports.editBook = [
    upload.fields([{
        name: 'image',
        maxCount: 1
    }, {
        name: 'file_input',
        maxCount: 1
    }]),
    async (req, res) => {
        try {
            const {
                id,
                title,
                authorName,
                category,
                pageNumber,
                language,
                insight
            } = req.body;

            const existingBook = await Book.findById(id);
            if (!existingBook) {
                return res.status(404).json({
                    success: false,
                    message: 'Book not found'
                });
            }

            let updatedImage = existingBook.image;
            let updatedFile = existingBook.file;

            if (req.files['image']) {
                updatedImage = {
                    data: req.files['image'][0].buffer,
                    contentType: req.files['image'][0].mimetype
                };
            }

            if (req.files['file_input']) {
                updatedFile = {
                    data: req.files['file_input'][0].buffer,
                    contentType: req.files['file_input'][0].mimetype
                };
            }

            const updatedData = {
                title,
                authorName,
                category,
                pageNumber,
                language,
                insight,
                image: updatedImage,
                file: updatedFile,
            };

            await Book.findByIdAndUpdate(id, updatedData);

            res.status(200).json({
                success: true,
                message: 'Book updated successfully'
            });
        } catch (error) {
            console.error('Error updating book:', error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
];

// Delete book
exports.deleteBook = async (req, res) => {
    try {
        // Extract the book ID from the request body
        const {
            id
        } = req.body;

        // Find and delete the book by its ID
        await Book.findByIdAndDelete(id);

        // Return a success response
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        // Log and return an error response if an error occurs
        console.error('Error deleting book:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};