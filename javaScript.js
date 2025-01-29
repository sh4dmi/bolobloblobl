// Dark mode functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const toggle = darkModeToggle.querySelector('div');
    if (body.classList.contains('dark-mode')) {
    toggle.style.transform = 'translateX(24px)';
        darkModeToggle.classList.remove('bg-gray-200');
        darkModeToggle.classList.add('bg-blue-600');
    } else {
        toggle.style.transform = 'translateX(0)';
        darkModeToggle.classList.add('bg-gray-200');
        darkModeToggle.classList.remove('bg-blue-600');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
}

// Load dark mode preference
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        const toggle = darkModeToggle.querySelector('div');
        toggle.style.transform = 'translateX(24px)';
        darkModeToggle.classList.remove('bg-gray-200');
        darkModeToggle.classList.add('bg-blue-600');
    }
    // Initialize calendar
    populateCalendar();
});

// Navigation menu functionality
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');
    // Close menu
    document.getElementById('navMenu').classList.remove('active');
}

// Settings modal functionality
function openSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
}

function toggleNotifications() {
    // Placeholder for notification functionality
    console.log('Notifications toggled');
}

// Calendar functionality
function populateCalendar() {
    const calendar = document.querySelector('.calendar');
    const daysInMonth = 31; // You can make this dynamic
    const headerCells = 7; // Days of week header

    // Clear existing days (except header)
    const days = calendar.querySelectorAll('.calendar-day:nth-child(n + ' + (headerCells + 1) + ')');
    days.forEach(day => day.remove());

    // Add days
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        // Date number
        const dateSpan = document.createElement('span');
        dateSpan.textContent = i;
        dayElement.appendChild(dateSpan);

        // Add duty indicators (example)
        if (i % 3 === 0) { // Just an example condition
            const dutySpan = document.createElement('span');
            dutySpan.className = 'text-xs text-blue-600 dark:text-blue-400';
            dutySpan.textContent = 'שמירה';
            dayElement.appendChild(dutySpan);
        }
        if (i % 4 === 0) {
            const dutySpan = document.createElement('span');
            dutySpan.className = 'text-xs text-green-600 dark:text-green-400';
            dutySpan.textContent = 'מטבח';
            dayElement.appendChild(dutySpan);
        }

        calendar.appendChild(dayElement);
    }
}

// Exchange form submission
function submitExchange(event) {
    event.preventDefault();
    // Here you would handle the exchange request submission
    alert('בקשת ההחלפה נשלחה בהצלחה');
}

// Constraints form submission
function submitConstraints(event) {
    event.preventDefault();
    // Here you would handle the constraints submission
    alert('האילוצים נשמרו בהצלחה');
}

// Close modals and menus when clicking outside
document.addEventListener('click', (event) => {
    const menu = document.getElementById('navMenu');
    const settingsModal = document.getElementById('settingsModal');

    if (!event.target.closest('#navMenu') && !event.target.closest('button')) {
        menu.classList.remove('active');
    }

    if (settingsModal && !event.target.closest('.bg-white') && !event.target.closest('button')) {
        settingsModal.classList.add('hidden');
    }
});
const firebaseConfig = {
    apiKey: "AIzaSyAE2oXv6WG8t0sKefhbqkNdti7T6Z2OZi0",
    authDomain: "bolbol-815bc.firebaseapp.com",
    projectId: "bolbol-815bc",
    storageBucket: "bolbol-815bc.firebasestorage.app",
    messagingSenderId: "925006008330",
    appId: "1:925006008330:web:e1a5924c945201045e0ff3",
    measurementId: "G-JYGPN1BWKV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Form visibility functions
function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

// Login handler
async function handleLogin(event) {
    event.preventDefault();

    const phoneNumber = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Check if user exists in Firestore
        const userSnapshot = await db.collection('users')
            .where('phoneNumber', '==', phoneNumber)
            .get();

        if (userSnapshot.empty) {
            alert('משתמש לא קיים');
            return;
        }

        // Sign in with Firebase Auth
        const userCredential = await auth.signInWithEmailAndPassword(
            `${phoneNumber}@dutyassign.com`,
            password
        );

        // Store user data
        const userData = userSnapshot.docs[0].data();
        localStorage.setItem('user', JSON.stringify({
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            personalNumber: userData.personalNumber,
            releaseDate: userData.releaseDate
        }));

        // Redirect to main app
        window.location.href = 'app.html';
    } catch (error) {
        console.error(error);
        alert('שגיאה בהתחברות: ' + error.message);
    }
}

// Registration handler
async function handleRegister(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const personalNumber = document.getElementById('personalNumber').value;
    const releaseDate = document.getElementById('releaseDate').value;
    const password = document.getElementById('password').value;

    try {
        // Check if user exists
        const existingUser = await db.collection('users')
            .where('phoneNumber', '==', phoneNumber)
            .get();

        if (!existingUser.empty) {
            alert('מספר טלפון כבר קיים במערכת');
            return;
        }

        // Create auth user
        const userCredential = await auth.createUserWithEmailAndPassword(
            `${phoneNumber}@dutyassign.com`,
            password
        );

        // Store additional user data in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            fullName,
            phoneNumber,
            personalNumber,
            releaseDate,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert('ההרשמה הושלמה בהצלחה!');
        showLoginForm();
    } catch (error) {
        console.error(error);
        alert('שגיאה בהרשמה: ' + error.message);
    }
}

// Check authentication state on page load
auth.onAuthStateChanged((user) => {
    if (user) {
        // If user is already logged in, redirect to app
        window.location.href = 'app.html';
    }
});
  function handleLogin(event) {
            event.preventDefault();

            // Mock login validation (you should replace this with real logic)
            const phone = document.getElementById('loginPhone').value;
            const password = document.getElementById('loginPassword').value;

            if (phone === "12345" && password === "password") {
                // Hide login form
                document.getElementById('loginWrapper').style.display = 'none';
                // Show the app content
                document.getElementById('appWrapper').style.display = 'block';
            } else {
                alert("Invalid credentials");
            }
        }

        // Function to toggle between login and register forms
        function showRegisterForm() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
        }

        function showLoginForm() {
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
        }