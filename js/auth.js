document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // Check for the user's theme preference on page load
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    }
});