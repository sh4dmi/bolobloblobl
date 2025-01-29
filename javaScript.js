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
});const firebaseConfig = {
       apiKey: "AIzaSyAE2oXv6WG8t0sKefhbqkNdti7T6Z2OZi0",
       authDomain: "bolbol-815bc.firebaseapp.com",
       projectId: "bolbol-815bc",
       storageBucket: "bolbol-815bc.firebasestorage.app",
       messagingSenderId: "925006008330",
       appId: "1:925006008330:web:e1a5924c945201045e0ff3",
       measurementId: "G-JYGPN1BWKV"
   };

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
               alert('מספר טלפון או סיסמה שגויים');
               return;
           }

           // Sign in with Firebase Auth
           const userCredential = await auth.signInWithEmailAndPassword(
               `${phoneNumber}@dutyassign.com`,
               password
           );

           // Store user data
           const userData = userSnapshot.docs[0].data();
           localStorage.setItem('userData', JSON.stringify({
               fullName: userData.fullName,
               phoneNumber: userData.phoneNumber,
               personalNumber: userData.personalNumber,
               releaseDate: userData.releaseDate
           }));

           // Hide login wrapper and show app wrapper
           document.getElementById('loginWrapper').style.display = 'none';
           document.getElementById('appWrapper').style.display = 'block';

           // Update displayed name
           const userGreeting = document.querySelector('#duties h2');
           if (userGreeting) {
               userGreeting.textContent = `שלום, ${userData.fullName}`;
           }

       } catch (error) {
           console.error(error);
           alert('מספר טלפון או סיסמה שגויים');
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

           // Store user data in localStorage
           localStorage.setItem('userData', JSON.stringify({
               fullName,
               phoneNumber,
               personalNumber,
               releaseDate
           }));

           // Hide login wrapper and show app wrapper
           document.getElementById('loginWrapper').style.display = 'none';
           document.getElementById('appWrapper').style.display = 'block';

           // Update displayed name
           const userGreeting = document.querySelector('#duties h2');
           if (userGreeting) {
               userGreeting.textContent = `שלום, ${fullName}`;
           }

       } catch (error) {
           console.error(error);
           alert('שגיאה בהרשמה: ' + error.message);
       }
   }

   // Check authentication state on page load
   auth.onAuthStateChanged((user) => {
       if (user) {
           // Get user data from localStorage
           const userData = JSON.parse(localStorage.getItem('userData'));
           if (userData) {
               // Hide login wrapper and show app wrapper
               document.getElementById('loginWrapper').style.display = 'none';
               document.getElementById('appWrapper').style.display = 'block';

               // Update displayed name
               const userGreeting = document.querySelector('#duties h2');
               if (userGreeting) {
                   userGreeting.textContent = `שלום, ${userData.fullName}`;
               }
           }
       }
   });
   async function isDutyOwner() {
       const user = auth.currentUser;
       if (!user) return false;

       const userDoc = await db.collection('users').doc(user.uid).get();
       return userDoc.data()?.isOwner || false;
   }

   // Function to add duty assignment UI to settings for owners
   async function initializeSettings() {
       const isOwner = await isDutyOwner();
       const settingsContent = document.querySelector('#settingsModal .space-y-4');

       if (isOwner) {
           const dutySection = document.createElement('div');
           dutySection.innerHTML = `
               <h3 class="text-lg font-semibold mb-3">ניהול תורנויות</h3>
               <button onclick="showDutyAssignmentModal()"
                       class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                   הוספת תורנות
               </button>
           `;
           settingsContent.appendChild(dutySection);
       }
   }

   // Function to load all users for the dropdown
   async function loadUsers() {
       try {
           const usersSnapshot = await db.collection('users').get();
           const userSelect = document.getElementById('dutyUser');
           userSelect.innerHTML = '<option value="">בחר חייל</option>';

           usersSnapshot.forEach(doc => {
               const userData = doc.data();
               const option = document.createElement('option');
               option.value = userData.personalNumber;
               option.textContent = userData.fullName;
               userSelect.appendChild(option);
           });
       } catch (error) {
           console.error('Error loading users:', error);
           alert('שגיאה בטעינת רשימת החיילים');
       }
   }

   // Create duty assignment modal
   function createDutyAssignmentModal() {
       const modal = document.createElement('div');
       modal.id = 'dutyAssignmentModal';
       modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 z-30';
       modal.innerHTML = `
           <div class="bg-white dark:bg-gray-800 rounded-lg p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md">
               <h2 class="text-xl font-bold mb-4">הוספת תורנות חדשה</h2>
               <form id="dutyAssignmentForm" class="space-y-4">
                   <div>
                       <label class="block mb-2">סוג תורנות</label>
                       <select id="dutyKind" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                           <option value="שמירה">שמירה</option>
                           <option value="מטבח">מטבח</option>
                           <option value="רסר">רסר</option>
                       </select>
                   </div>
                   <div>
                       <label class="block mb-2">תאריך</label>
                       <input type="date" id="dutyDate"
                              class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required>
                   </div>
                   <div>
                       <label class="block mb-2">חייל</label>
                       <select id="dutyUser"
                               class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required>
                           <option value="">בחר חייל</option>
                       </select>
                   </div>
                   <div class="flex justify-end space-x-2">
                       <button type="button" onclick="closeDutyAssignmentModal()"
                               class="px-4 py-2 border rounded">ביטול</button>
                       <button type="submit"
                               class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">הוסף</button>
                   </div>
               </form>
           </div>
       `;
       document.body.appendChild(modal);
   }

   // Show duty assignment modal
   function showDutyAssignmentModal() {
       const modal = document.getElementById('dutyAssignmentModal');
       if (!modal) {
           createDutyAssignmentModal();
       }
       loadUsers(); // Load users when opening the modal
       document.getElementById('dutyAssignmentModal').classList.remove('hidden');
   }

   // Close duty assignment modal
   function closeDutyAssignmentModal() {
       document.getElementById('dutyAssignmentModal').classList.add('hidden');
   }

   // Handle duty assignment
   async function handleDutyAssignment(event) {
       event.preventDefault();

       const kind = document.getElementById('dutyKind').value;
       const date = document.getElementById('dutyDate').value;
       const userNumber = document.getElementById('dutyUser').value;

       if (!userNumber) {
           alert('נא לבחור חייל');
           return;
       }

       try {
           // Add duty to Firestore
           await db.collection('duties').add({
               kind,
               date: new Date(date),
               userNumber,
               createdAt: firebase.firestore.FieldValue.serverTimestamp(),
               createdBy: auth.currentUser.uid
           });

           alert('התורנות נוספה בהצלחה');
           closeDutyAssignmentModal();
           loadUserDuties(); // Refresh duties display
       } catch (error) {
           console.error(error);
           alert('שגיאה בהוספת התורנות');
       }
   }

   // Load user duties
   async function loadUserDuties() {
       const userData = JSON.parse(localStorage.getItem('userData'));
       if (!userData) return;

       try {
           const dutiesSnapshot = await db.collection('duties')
               .where('userNumber', '==', userData.personalNumber)
               .orderBy('date')
               .get();

           const dutiesContainer = document.querySelector('#duties');
           const guardDuties = dutiesContainer.querySelector('div:nth-child(2)');
           const kitchenDuties = dutiesContainer.querySelector('div:nth-child(3)');

           // Clear existing duties
           guardDuties.querySelector('.duty-card')?.remove();
           kitchenDuties.querySelector('.duty-card')?.remove();

           dutiesSnapshot.forEach(doc => {
               const duty = doc.data();
               const dutyCard = createDutyCard(duty);

               if (duty.kind === 'שמירה') {
                   guardDuties.appendChild(dutyCard);
               } else if (duty.kind === 'מטבח') {
                   kitchenDuties.appendChild(dutyCard);
               }
           });
       } catch (error) {
           console.error(error);
           alert('שגיאה בטעינת התורנויות');
       }
   }

   // Create duty card element
   function createDutyCard(duty) {
       const card = document.createElement('div');
       card.className = 'duty-card';

       const date = duty.date.toDate();
       const formattedDate = new Intl.DateTimeFormat('he-IL', {
           weekday: 'long',
           day: 'numeric',
           month: 'numeric'
       }).format(date);

       card.innerHTML = `
           <div class="flex justify-between items-center">
               <div>
                   <h4 class="font-medium">${duty.kind}</h4>
                   <p class="text-sm text-gray-600 dark:text-gray-400">${formattedDate}</p>
               </div>
               <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded">
                   ${isUpcoming(date) ? 'קרוב' : 'מאושר'}
               </span>
           </div>
       `;

       return card;
   }

   // Helper function to check if duty is upcoming
   function isUpcoming(date) {
       const now = new Date();
       const threeDays = 3 * 24 * 60 * 60 * 1000;
       return date > now && date - now < threeDays;
   }

   // Initialize event listeners
   document.addEventListener('DOMContentLoaded', () => {
       createDutyAssignmentModal();
       initializeSettings();

       // Add event listener for duty assignment form
       document.getElementById('dutyAssignmentForm').addEventListener('submit', handleDutyAssignment);

       // Load duties when user is authenticated
       auth.onAuthStateChanged((user) => {
           if (user) {
               loadUserDuties();
           }
       });
   });