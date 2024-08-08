const {
    Contact
} = require('../../connection/db-config');



// Mark a message as read.
exports.markAsRead = async (req, res) => {
    try {
        // Find and update the message with the specified ID to mark it as read.
        await Contact.findByIdAndUpdate(req.params.id, {
            isRead: true
        });

        // Send a successful response with no content.
        res.sendStatus(200);
    } catch (err) {
        // Log the error and send a 500 status code with the error message.
        console.error('Error updating message status:', err);
        res.status(500).send(err);
    }
};


// Fetch all messages.
exports.fetchMessages = async (req, res) => {
    try {
        // Fetch all the messages from the database
        const messages = await Contact.find();

        // Send the fetched messages as a JSON response
        res.json(messages);
    } catch (err) {
        // Log the error and send a 500 status code with the error message
        console.error('Error fetching messages:', err);
        res.status(500).send(err);
    }
};

// Delete a message.
exports.deleteMessage = async (req, res) => {
    try {
        // Find and delete the message by its ID
        await Contact.findByIdAndDelete(req.params.id);

        // Send a successful response with no content
        res.sendStatus(200);
    } catch (err) {
        // Log the error and send a 500 status code with the error message
        console.error('Error deleting message:', err);
        res.status(500).send(err);
    }
};