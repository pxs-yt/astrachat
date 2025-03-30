document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    
    // Initialize Supabase
    const supabaseUrl = 'https://lmijvxwyvimdfltqgkpk.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtaWp2eHd5dmltZGZsdHFna3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyODM4NzEsImV4cCI6MjA1ODg1OTg3MX0.rtyygw7yo0TpHoV4VQn8e6pw1_5EgYRaeQVVB8X0scw';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // Check for the user's theme preference on page load
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Password validation for signup page
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
    }

    // Signup form handling
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = signupForm.username.value.trim();
            const password = signupForm.password.value;
            const confirmPassword = signupForm['confirm-password'].value;
            
            // Validate password match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Validate password requirements
            if (!validatePasswordStrength(password)) {
                alert('Password does not meet all requirements!');
                return;
            }
            
            try {
                // Hash password (in a real app, you'd do this on the server)
                const hashedPassword = await hashPassword(password);
                
                // Insert user into database
                const { data, error } = await supabase
                    .from('users')
                    .insert([
                        { 
                            username: username,
                            password_hash: hashedPassword
                        }
                    ]);
                
                if (error) throw error;
                
                alert('Account created successfully! Please log in.');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Signup error:', error.message);
                alert('Signup failed: ' + error.message);
            }
        });
    }

    // Login form handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = loginForm.username.value.trim();
            const password = loginForm.password.value;
            
            try {
                // Get user from database
                const { data: users, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('username', username)
                    .single();
                
                if (error) throw error;
                if (!users) throw new Error('User not found');
                
                // Verify password (in a real app, you'd use proper password hashing)
                const isValid = await verifyPassword(password, users.password_hash);
                
                if (!isValid) {
                    throw new Error('Invalid password');
                }
                
                // Store user session
                localStorage.setItem('user', JSON.stringify({
                    id: users.id,
                    username: users.username
                }));
                
                // Redirect to chat
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Login error:', error.message);
                alert('Login failed: ' + error.message);
            }
        });
    }

    // Simple password hashing (in a real app, use a proper library like bcrypt)
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function verifyPassword(password, hash) {
        const hashedPassword = await hashPassword(password);
        return hashedPassword === hash;
    }

    function validatePassword() {
        const password = passwordInput.value;
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            symbol: /[^A-Za-z0-9]/.test(password)
        };
        
        // Update requirement indicators
        document.querySelector('.req-length').classList.toggle('valid', requirements.length);
        document.querySelector('.req-length').classList.toggle('invalid', !requirements.length);
        document.querySelector('.req-uppercase').classList.toggle('valid', requirements.uppercase);
        document.querySelector('.req-uppercase').classList.toggle('invalid', !requirements.uppercase);
        document.querySelector('.req-number').classList.toggle('valid', requirements.number);
        document.querySelector('.req-number').classList.toggle('invalid', !requirements.number);
        document.querySelector('.req-symbol').classList.toggle('valid', requirements.symbol);
        document.querySelector('.req-symbol').classList.toggle('invalid', !requirements.symbol);
    }

    function validatePasswordStrength(password) {
        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        );
    }
});