document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const menuToggle = document.getElementById('menu-toggle');
    const menuContent = document.querySelector('.menu-content');

    // Function to toggle the theme
    function toggleTheme() {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    }

    themeToggle.addEventListener('click', toggleTheme);

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    // Function to toggle the menu
    function toggleMenu() {
        menuContent.classList.toggle('open');
    }

    menuToggle.addEventListener('click', toggleMenu);
});