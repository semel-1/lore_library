// message.js
document.addEventListener('DOMContentLoaded', function () {
    fetchMessages();

    async function fetchMessages() {
        try {
            const response = await fetch('/messages');
            const messages = await response.json();
            renderMessages(messages);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        }
    }

    function renderMessages(messages) {
        const unreadMessagesContainer = document.getElementById('unread-messages');
        const readMessagesContainer = document.getElementById('read-messages');

        unreadMessagesContainer.innerHTML = '';
        readMessagesContainer.innerHTML = '';

        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.innerHTML = `
                <p><strong>${message.firstName} (${message.email})</strong> <button onclick="toggleMessageContent('${message._id}')">▼</button></p>
                <div id="message-content-${message._id}" style="display:none;">
                    <p>Type: ${message.messageType}</p>
                    <p>${message.message}</p>
                    ${message.isRead ? '' : `<button onclick="markAsRead('${message._id}')">Mark as Read</button>`}
                </div>
            `;

            if (message.isRead) {
                readMessagesContainer.appendChild(messageDiv);
            } else {
                unreadMessagesContainer.appendChild(messageDiv);
            }
        });
    }

    async function markAsRead(messageId) {
        try {
            const response = await fetch(`/auth/messages/${messageId}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                fetchMessages();
            } else {
                console.error(`Failed to mark message ${messageId} as read: ${response.statusText}`);
            }
        } catch (err) {
            console.error('Failed to mark message as read', err);
        }
    }

    function renderMessages(messages) {
        const unreadMessagesContainer = document.getElementById('unread-messages');
        const readMessagesContainer = document.getElementById('read-messages');

        unreadMessagesContainer.innerHTML = '';
        readMessagesContainer.innerHTML = '';

        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.innerHTML = `
                <p><strong>${message.firstName} (${message.email})</strong> <button onclick="toggleMessageContent('${message._id}')">▼</button></p>
                <div id="message-content-${message._id}" style="display:none;">
                    <p>Type: ${message.messageType}</p>
                    <p>${message.message}</p>
                    ${message.isRead ? `<button onclick="deleteMessage('${message._id}')">Delete</button>` : `<button onclick="markAsRead('${message._id}')">Mark as Read</button>`}
                </div>
            `;

            if (message.isRead) {
                readMessagesContainer.appendChild(messageDiv);
            } else {
                unreadMessagesContainer.appendChild(messageDiv);
            }
        });
    }

    async function deleteMessage(messageId) {
        try {
            const response = await fetch(`/auth/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                fetchMessages();
            } else {
                console.error(`Failed to delete message ${messageId}: ${response.statusText}`);
            }
        } catch (err) {
            console.error('Failed to delete message', err);
        }
    }

    window.deleteMessage = deleteMessage;


    window.markAsRead = markAsRead;

    window.toggleMessageContent = function (messageId) {
        const messageContent = document.getElementById(`message-content-${messageId}`);
        const isDisplayed = messageContent.style.display === 'block';
        messageContent.style.display = isDisplayed ? 'none' : 'block';
    };
});