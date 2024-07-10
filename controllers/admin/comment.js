const {
    Comment,
    Book,
    User
} = require('../../connection/db-config');

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate('user')
            .populate('book');
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            message: 'Error fetching comments'
        });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            message: 'Error deleting comment'
        });
    }
};