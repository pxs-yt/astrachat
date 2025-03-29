document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const menuToggle = document.getElementById('menu-toggle');
    const menuContent = document.querySelector('.menu-content');

    // Function to toggle the theme
    function toggleTheme() {
        body.classList.toggle('dark-mode');
        // Store the user's theme preference in local storage
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    }

    // Event listener for the theme toggle button
    themeToggle.addEventListener('click', toggleTheme);

    // Check for the user's theme preference on page load
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    // Function to toggle the menu
    function toggleMenu() {
        menuContent.classList.toggle('open'); // Toggle the 'open' class
    }

    // Event listener for the menu toggle button
    menuToggle.addEventListener('click', toggleMenu);
});