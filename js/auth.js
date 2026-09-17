// ========================================
// BUSINESS COPILOT - AUTHENTICATION
// ========================================

// Storage keys
const USERS_KEY = "bc_users";
const SESSION_KEY = "bc_session";


// ========================================
// HELPER FUNCTIONS
// ========================================

// Get all registered users
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);

    if (!users) {
        return [];
    }

    return JSON.parse(users);
}


// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}


// Create a logged-in session
function createSession(userId) {
    const session = {
        userId: userId,
        loggedInAt: new Date().toISOString()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}


// Get the current session
function getSession() {
    const session = localStorage.getItem(SESSION_KEY);

    if (!session) {
        return null;
    }

    return JSON.parse(session);
}


// Log the user out
function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
}


// ========================================
// SIGNUP
// ========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (event) {

        // Prevent the page from refreshing
        event.preventDefault();

        // Get form values
        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim().toLowerCase();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("signupConfirmPassword").value;

        const message = document.getElementById("signupMessage");


        // Clear previous message
        message.className = "auth-message";
        message.textContent = "";


        // ========================================
        // VALIDATION
        // ========================================

        if (!name || !email || !password || !confirmPassword) {
            showAuthMessage(
                message,
                "Please fill in all fields.",
                "error"
            );
            return;
        }


        if (password.length < 6) {
            showAuthMessage(
                message,
                "Password must be at least 6 characters.",
                "error"
            );
            return;
        }


        if (password !== confirmPassword) {
            showAuthMessage(
                message,
                "Passwords do not match.",
                "error"
            );
            return;
        }


        // ========================================
        // CHECK EXISTING USER
        // ========================================

        const users = getUsers();

        const existingUser = users.find(function (user) {
            return user.email === email;
        });


        if (existingUser) {
            showAuthMessage(
                message,
                "An account with this email already exists.",
                "error"
            );
            return;
        }


        // ========================================
        // CREATE USER
        // ========================================

        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password
        };


        users.push(newUser);

        saveUsers(users);


        // ========================================
        // LOGIN USER AUTOMATICALLY
        // ========================================

        createSession(newUser.id);


        showAuthMessage(
            message,
            "Account created successfully. Redirecting...",
            "success"
        );


        // Give the user a moment to see the message
        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 700);

    });
}


// ========================================
// LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        // Prevent page refresh
        event.preventDefault();


        // Get form values
        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");


        // Clear previous message
        message.className = "auth-message";
        message.textContent = "";


        // ========================================
        // VALIDATION
        // ========================================

        if (!email || !password) {
            showAuthMessage(
                message,
                "Please enter your email and password.",
                "error"
            );
            return;
        }


        // ========================================
        // FIND USER
        // ========================================

        const users = getUsers();

        const user = users.find(function (user) {
            return user.email === email;
        });


        if (!user) {
            showAuthMessage(
                message,
                "No account was found with this email.",
                "error"
            );
            return;
        }


        // ========================================
        // CHECK PASSWORD
        // ========================================

        if (user.password !== password) {
            showAuthMessage(
                message,
                "Incorrect password. Please try again.",
                "error"
            );
            return;
        }


        // ========================================
        // CREATE SESSION
        // ========================================

        createSession(user.id);


        showAuthMessage(
            message,
            "Login successful. Redirecting...",
            "success"
        );


        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 700);

    });
}


// ========================================
// MESSAGE FUNCTION
// ========================================

function showAuthMessage(element, text, type) {
    element.textContent = text;
    element.classList.add(type);
}

// ========================================
// DASHBOARD PROTECTION
// ========================================

if (window.location.pathname.endsWith("dashboard.html")) {

    const session = getSession();

    if (!session) {
        window.location.href = "login.html";
    }
}