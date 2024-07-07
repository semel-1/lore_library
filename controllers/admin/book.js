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
        const bookId = req.params.id;
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                error: 'Book not found'
            });
        }

        res.status(200).json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

// Add book
exports.addBook = [
    upload.fields([{
            name: 'image',
            maxCount: 1
        },
        {
            name: 'file_input',
            maxCount: 1
        }
    ]),
    async (req, res) => {
        try {
            const {
                title,
                authorName,
                category,
                pageNumber,
                language,
                insight
            } = req.body;
            const image = req.files['image'] ? req.files['image'][0] : null;
            const file = req.files['file_input'] ? req.files['file_input'][0] : null;

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

            await newBook.save();

            res.status(200).json({
                success: true,
                message: 'Book added successfully'
            });
        } catch (error) {
            console.error('Error adding book:', error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
];


// Edit book
exports.editBook = [
    upload.fields([{
            name: 'image',
            maxCount: 1
        },
        {
            name: 'file_input',
            maxCount: 1
        }
    ]),
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

            // Find existing book
            const existingBook = await Book.findById(id);

            // Check if new image and file were uploaded
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
        const {
            id
        } = req.body;
        await Book.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};