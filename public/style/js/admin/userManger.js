document.addEventListener('DOMContentLoaded', function () {
    const addUserBtn = document.getElementById('add-user-btn');
    const userFormModal = document.getElementById('user-form-modal');
    const closeBtn = document.querySelector('.close-btn');
    const modalContent = document.querySelector('.modal-content');

    addUserBtn.addEventListener('click', function () {
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        userFormModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', function () {
        userFormModal.style.display = 'none';
    });

    userFormModal.addEventListener('click', function (e) {
        if (e.target === userFormModal) {
            userFormModal.style.display = 'none';
        }
    });

    modalContent.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    document.querySelectorAll('.edit-user-btn').forEach(button => {
        button.addEventListener('click', async function () {
            const userId = this.dataset.id;
            try {
                const response = await fetch(`/auth/getUser/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const user = await response.json();
                document.getElementById('user-id').value = user._id;
                document.getElementById('firstName').value = user.firstName;
                document.getElementById('lastName').value = user.lastName;
                document.getElementById('email').value = user.email;
                document.getElementById('phone').value = user.phone;
                document.getElementById('password').value = user.password;
                document.getElementById('role').value = user.role;
                userFormModal.style.display = 'block';
            } catch (error) {
                console.error('Error fetching user:', error);
                alert('Error fetching user details.');
            }
        });
    });

    document.getElementById('user-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const userId = document.getElementById('user-id').value;
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const phone = data.phone;
        if (!/^\d{10}$/.test(phone)) {
            alert('Phone number must be exactly 10 digits.');
            return;
        }

        try {
            const response = await fetch(userId ? `/auth/editUser` : '/auth/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            if (result.success) {
                window.location.href = '/admin?message=' + (userId ? 'User updated successfully' : 'User added successfully');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user.');
        }
    });

    document.querySelectorAll('.delete-user-form').forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const userId = form.querySelector('input[name="id"]').value;
            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    const response = await fetch('/auth/deleteUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: userId
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const result = await response.json();
                    if (result.success) {
                        window.location.href = '/admin?message=User deleted successfully';
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('Error deleting user.');
                }
            }
        });
    });
});