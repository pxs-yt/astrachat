document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const menuToggle = document.getElementById('menu-toggle');
    const menuContent = document.querySelector('.menu-content');
    const chatInput = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.send-btn');
    const messagesContainer = document.querySelector('.messages');

    // Initialize Supabase
    const supabaseUrl = 'https://lmijvxwyvimdfltqgkpk.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtaWp2eHd5dmltZGZsdHFna3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyODM4NzEsImV4cCI6MjA1ODg1OTg3MX0.rtyygw7yo0TpHoV4VQn8e6pw1_5EgYRaeQVVB8X0scw';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user && window.location.pathname !== '/login.html' && window.location.pathname !== '/signup.html') {
        window.location.href = 'login.html';
    }

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
    function toggleMenu(event) {
        event.preventDefault();
        menuContent.classList.toggle('open');
    }

    // Use both 'click' and 'touchstart' for better touch support
    menuToggle.addEventListener('click', toggleMenu);
    menuToggle.addEventListener('touchstart', toggleMenu);

    // Load messages
    async function loadMessages() {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (error) {
            console.error('Error loading messages:', error);
            return;
        }
        
        messagesContainer.innerHTML = '';
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.innerHTML = `
                <span class="message-username">${msg.username}:</span>
                <span class="message-content">${msg.content}</span>
                <span class="message-time">${new Date(msg.created_at).toLocaleTimeString()}</span>
            `;
            messagesContainer.appendChild(messageElement);
        });
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Send message
    async function sendMessage() {
        const content = chatInput.value.trim();
        if (!content || !user) return;
        
        const { error } = await supabase
            .from('messages')
            .insert([
                { 
                    user_id: user.id,
                    username: user.username,
                    content: content
                }
            ]);
        
        if (error) {
            console.error('Error sending message:', error);
            return;
        }
        
        chatInput.value = '';
        loadMessages();
    }

    // Event listeners for sending messages
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Set up real-time updates
    const channel = supabase
        .channel('messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
            loadMessages();
        })
        .subscribe();

    // Initial load
    loadMessages();

    // Update user info in menu if logged in
    if (user) {
        const menuHeader = document.querySelector('.menu-header h2');
        if (menuHeader) {
            menuHeader.textContent = user.username;
        }
        
        // Hide auth buttons if logged in
        const menuFooter = document.querySelector('.menu-footer');
        if (menuFooter) {
            menuFooter.innerHTML = `
                <button class="auth-btn" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    Log Out
                </button>
            `;
            
            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            });
        }
    }
});