// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database(); // Or firebase.firestore() for Cloud Firestore

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const logoutBtn = document.getElementById('logout-btn');
const themeToggle = document.getElementById('theme-toggle');

let currentUser;

// Function to apply theme from localStorage
function applyTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// Function to toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Apply theme on page load
applyTheme();

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Listen for authentication changes
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        displayMessages();
    } else {
        window.location.href = 'auth.html'; // Redirect to login
    }
});

// Function to display messages
function displayMessages() {
    messagesDiv.innerHTML = ''; // Clear existing messages

    // Reference to the chat messages in the database
    const messagesRef = db.ref('messages').orderByChild('timestamp'); // For Realtime Database
    // const messagesRef = db.collection('messages').orderBy('timestamp'); // For Cloud Firestore

    // Listen for new messages
    messagesRef.on('child_added', (snapshot) => { // For Realtime Database
    // messagesRef.onSnapshot((snapshot) => { // For Cloud Firestore
        const message = snapshot.val(); // For Realtime Database
        // snapshot.forEach(doc => { // For Cloud Firestore
        //     const message = doc.data();

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
    // }); // For Cloud Firestore
}

// Function to send a message
function sendMessage() {
    const text = messageInput.value.trim();
    if (text) {
        const message = {
            uid: currentUser.uid,
            senderName: currentUser.displayName || 'Anonymous', // Or fetch from database if you store it
            text: text,
            timestamp: firebase.database.ServerValue.TIMESTAMP // For Realtime Database
            // timestamp: firebase.firestore.FieldValue.serverTimestamp() // For Cloud Firestore
        };

        // Push the message to the database
        db.ref('messages').push(message); // For Realtime Database
        // db.collection('messages').add(message); // For Cloud Firestore

        messageInput.value = '';
    }
}

// Send message on button click
sendBtn.addEventListener('click', sendMessage);

// Send message on Enter key press
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        // Sign-out successful.
        window.location.href = 'auth.html';
    }).catch((error) => {
        // An error happened.
        console.error(error);
    });
});