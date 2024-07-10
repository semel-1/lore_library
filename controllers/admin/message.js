const {
    Contact
} = require('../../connection/db-config');



exports.markAsRead = async (req, res) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, {
            isRead: true
        });
        res.sendStatus(200);
    } catch (err) {
        console.error('Error updating message status:', err);
        res.status(500).send(err);
    }
};

exports.fetchMessages = async (req, res) => {
    try {
        const messages = await Contact.find();
        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).send(err);
    }
};


exports.deleteMessage = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    } catch (err) {
        console.error('Error deleting message:', err);
        res.status(500).send(err);
    }
};