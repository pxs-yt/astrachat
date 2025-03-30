document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // Check for the user's theme preference on page load
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    // --- Firebase Initialization ---
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

    // --- Password Visibility Toggle ---
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const type = passwordInputs[index].getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInputs[index].setAttribute('type', type);
            button.classList.toggle('fa-eye');
            button.classList.toggle('fa-eye-slash');
        });
    });

    // --- Form Handling ---
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#email').value;
            const password = loginForm.querySelector('#password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log("Logged in user: ", user);
                    window.location.href = 'index.html'; // Redirect on login
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Login Error: ", errorCode, errorMessage);
                    alert("Login failed: " + errorMessage);
                });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = signupForm.querySelector('#username').value;
            const email = signupForm.querySelector('#email').value;
            const password = signupForm.querySelector('#password').value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed up
                    const user = userCredential.user;
                    console.log("Signed up user: ", user);
                    // You might want to update the user's profile with the username here
                    user.updateProfile({
                        displayName: username
                    }).then(() => {
                        window.location.href = 'index.html'; // Redirect on signup
                    });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Signup Error: ", errorCode, errorMessage);
                    alert("Signup failed: " + errorMessage);
                });
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = forgotPasswordForm.querySelector('#email').value;

            auth.sendPasswordResetEmail(email)
                .then(() => {
                    console.log("Password reset email sent!");
                    alert("Password reset email sent!");
                    window.location.href = 'login.html';  // Redirect to login
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Password reset Error: ", errorCode, errorMessage);
                    alert("Password reset failed: " + errorMessage);
                });
        });
    }
});