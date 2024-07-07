document.addEventListener('DOMContentLoaded', function () {
    const addBookBtn = document.getElementById('add-book-btn');
    const bookFormModal = document.getElementById('book-form-modal');
    const closeBookBtn = document.querySelector('.close-book-btn');

    addBookBtn.addEventListener('click', function () {
        document.getElementById('book-form').reset();
        document.getElementById('book-id').value = '';
        bookFormModal.style.display = 'block';
    });

    closeBookBtn.addEventListener('click', function () {
        bookFormModal.style.display = 'none';
    });

    bookFormModal.addEventListener('click', function (e) {
        if (e.target === bookFormModal) {
            bookFormModal.style.display = 'none';
        }
    });

    document.querySelectorAll('.edit-book-btn').forEach(button => {
        button.addEventListener('click', async function (event) {
            event.preventDefault();
            const bookId = this.dataset.id;

            try {
                const response = await fetch(`/auth/getBook/${bookId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const book = await response.json();
                populateBookForm(book);
            } catch (error) {
                console.error('Error fetching book:', error);
                alert('Error fetching book details.');
            }
        });
    });

    function populateBookForm(book) {
        document.getElementById('book-id').value = book._id;
        document.getElementById('title').value = book.title;
        document.getElementById('authorName').value = book.authorName;
        document.getElementById('category').value = book.category;
        document.getElementById('pageNumber').value = book.pageNumber;
        document.getElementById('language').value = book.language;
        document.getElementById('insight').value = book.insight;
        document.getElementById('book-form-modal').style.display = 'block';
    }

    document.getElementById('book-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const bookId = document.getElementById('book-id').value;
        const formData = new FormData(event.target);

        try {
            const response = await fetch(bookId ? `/auth/editBook` : '/auth/addBook', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Network response was not ok: ' + errorText);
            }

            const result = await response.json();
            if (result.success) {
                window.location.href = '/admin?message=' + (bookId ? 'Book updated successfully' : 'Book added successfully');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error saving book:', error);
            alert('Error saving book: ' + error.message);
        }
    });

    document.querySelectorAll('.delete-book-form').forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const bookId = form.querySelector('input[name="id"]').value;
            try {
                const response = await fetch('/auth/deleteBook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: bookId
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error('Network response was not ok: ' + errorText);
                }

                const result = await response.json();
                if (result.success) {
                    window.location.href = '/admin?message=Book deleted successfully';
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Error deleting book: ' + error.message);
            }
        });
    });
});