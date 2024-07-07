document.addEventListener('DOMContentLoaded', function () {
    // Get all tab links
    const tabLinks = document.querySelectorAll('.tab-link');

    // Add click event listener to each tab link
    tabLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default anchor behavior

            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active'); // Remove active class from all contents
            });

            // Get the target section ID from data-target attribute
            const targetId = this.getAttribute('data-target');

            // Show the target section
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.classList.add('active'); // Add active class to target section
            }
        });
    });

    // Default action: Show User Manager on page load
    document.getElementById('user-manager').classList.add('active');
});