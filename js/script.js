document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const menuToggle = document.getElementById('menu-toggle');
    const menuContent = document.querySelector('.menu-content');
    const messagesDiv = document.getElementById('messages'); // Added
    const messageInput = document.getElementById('message-input'); // Added
    const sendBtn = document.getElementById('send-btn'); // Added
    const userNameSidebar = document.getElementById('user-name-sidebar'); // Added

    // --- Theme Toggle ---
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

    // --- Menu Toggle ---
    // Function to toggle the menu
    function toggleMenu(event) {
        event.preventDefault();
        menuContent.classList.toggle('open');
    }

    // Use both 'click' and 'touchstart' for better touch support
    menuToggle.addEventListener('click', toggleMenu);
    menuToggle.addEventListener('touchstart', toggleMenu);

    // --- Firebase Integration ---
    const firebaseConfig = {
        apiKey: "AIzaSyCkg8vstIMneNVcxBtFpAwghOcZVeaPEKc",
        authDomain: "astrachat-ardian.firebaseapp.com",
        projectId: "astrachat-ardian",
        storageBucket: "astrachat-ardian.firebasestorage.app",
        messagingSenderId: "752287023950",
        appId: "1:752287023950:web:383dd2b2a698d749f2941f",
        measurementId: "G-0LKQGW2WQ9"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database(); // Realtime Database

    let currentUser;

    // --- Authentication State Listener ---
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            displayMessages();
            setUserName();
        } else {
            // No user is signed in.
            window.location.href = 'login.html'; // Redirect to login
        }
    });

    // --- Display Messages ---
    function displayMessages() {
        messagesDiv.innerHTML = ''; // Clear existing messages

        // Reference to the chat messages in the database (using a single chat room named 'general')
        const messagesRef = db.ref('general').orderByChild('timestamp');

        // Listen for new messages
        messagesRef.on('child_added', (snapshot) => {
            const message = snapshot.val();

            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            if (message.uid === currentUser.uid) {
                messageDiv.classList.add('sent');
            }

            const senderSpan = document.createElement('span');
            senderSpan.classList.add('sender');
            senderSpan.textContent = message.senderName;
            messageDiv.appendChild(senderSpan);

            const textP = document.createElement('p');
            textP.textContent = message.text;
            messageDiv.appendChild(textP);

            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
        });
    }

    // --- Send Message ---
    function sendMessage() {
        const text = messageInput.value.trim();
        if (text) {
            const message = {
                uid: currentUser.uid,
                senderName: currentUser.displayName || 'Anonymous',
                text: text,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };

            // Push the message to the 'general' chat room
            db.ref('general').push(message);
            messageInput.value = '';
        }
    }

    // --- Set User Name in Sidebar ---
    function setUserName() {
        if (currentUser) {
            userNameSidebar.textContent = currentUser.displayName || 'Anonymous';
        }
    }

    // --- Send Message on Button Click ---
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // --- Send Message on Enter Key Press ---
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});