const {
    Comment,
    Book,
    User
} = require('../../connection/db-config');



exports.getComments = async (req, res) => {
    try {
        // Retrieve all comments from the database, populate the user and book fields
        const comments = await Comment.find()
            .populate('user')
            .populate('book');

        // Send the comments as a JSON response
        res.json(comments);
    } catch (error) {
        // Log the error and send a 500 status code with an error message
        console.error('Error fetching comments:', error);
        res.status(500).json({
            message: 'Error fetching comments'
        });
    }
};


exports.deleteComment = async (req, res) => {
    try {
        // Find and delete the comment by its ID
        await Comment.findByIdAndDelete(req.params.id);

        // Return a successful response with no content
        res.status(204).send();
    } catch (error) {
        // Log the error and send a 500 status code with an error message
        console.error('Error deleting comment:', error);
        res.status(500).json({
            message: 'Error deleting comment'
        });
    }
};