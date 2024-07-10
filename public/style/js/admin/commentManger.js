document.addEventListener('DOMContentLoaded', function () {
    const commentManager = new CommentManager();
    commentManager.loadComments();
});

class CommentManager {
    constructor() {
        this.commentsList = document.getElementById('comments-list');
    }

    async loadComments() {
        try {
            const response = await fetch('/comments'); // Ensure this matches your routing setup
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const comments = await response.json();
            this.renderComments(comments);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    }

    renderComments(comments) {
        this.commentsList.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = this.createCommentElement(comment);
            this.commentsList.appendChild(commentElement);
        });
    }

    createCommentElement(comment) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        const commentText = document.createElement('p');
        commentText.textContent = `Comment: ${comment.text}`;

        const bookInfo = document.createElement('p');
        bookInfo.textContent = `Book: ${comment.book.title}`;

        const userInfo = document.createElement('p');
        userInfo.textContent = `User: ${comment.user.email}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => this.deleteComment(comment._id));

        commentDiv.appendChild(commentText);
        commentDiv.appendChild(bookInfo);
        commentDiv.appendChild(userInfo);
        commentDiv.appendChild(deleteButton);

        return commentDiv;
    }

    async deleteComment(commentId) {
        try {
            const response = await fetch(`/auth/comments/${commentId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            this.loadComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }
}