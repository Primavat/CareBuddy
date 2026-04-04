import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
    'https://idbratjfnpkzmbfzcehr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYnJhdGpmbnBrem1iZnpjZWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTYyMzMsImV4cCI6MjA5MDc5MjIzM30._SHhi4Q7MTDE12L4tsl6yaLKAWvxZoVmmLZB5wdV59g'
)

// --- 1. AUTH & REDIRECT LOGIC ---

async function checkUserSession() {
    // If the URL has a hash, Google is currently logging us in. STOP redirects.
    if (window.location.hash.includes("access_token")) {
        console.log("Login in progress...");
        return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        showPage(session.user);
    } else {
        // Wait 1.5s to see if the session finishes loading
        setTimeout(async () => {
            const { data: { session: retry } } = await supabase.auth.getSession();
            if (!retry) {
                window.location.href = "index.html";
            } else {
                showPage(retry.user);
            }
        }, 1500);
    }
}

function showPage(user) {
    document.body.style.display = "block";
    const greetingName = document.getElementById("user-name-greeting");
    const dropdownName = document.getElementById("display-name");
    const dropdownEmail = document.getElementById("user-email");

    const fullName = user.user_metadata?.full_name || "Primavat";

    if (greetingName) greetingName.textContent = fullName;
    if (dropdownName) dropdownName.textContent = fullName;
    if (dropdownEmail) dropdownEmail.textContent = user.email;

    // Initialize Mode & Points
    const savedMode = localStorage.getItem("dashboardMode") || "personal";
    window.setDashboardMode(savedMode);
    
    // Initial UI update for points
    updatePointsUI();

    // Auto-greet the user after a short delay
    setTimeout(() => autoGreet(fullName), 1000);
}

// --- 2. GLOBAL FUNCTIONS (Required for HTML Buttons) ---

window.setDashboardMode = (mode) => {
    localStorage.setItem("dashboardMode", mode);
    document.body.className = `mode-${mode}`;

    // Update Toggle UI
    document.getElementById("personal-btn").classList.toggle("active", mode === 'personal');
    document.getElementById("family-btn").classList.toggle("active", mode === 'family');

    // Default Section based on mode
    if (mode === 'personal') window.showSection('vitalsSection');
    else window.showSection('profileSection');
};

window.showSection = (sectionId) => {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    // Show target
    const target = document.getElementById(sectionId);
    if (target) target.style.display = 'block';

    // Update Sidebar UI
    const buttons = document.querySelectorAll(".sidebar button");
    buttons.forEach(btn => {
        const onClickAttr = btn.getAttribute("onclick") || "";
        btn.classList.toggle("active", onClickAttr.includes(`'${sectionId}'`));
    });
};

// --- 3. REWARDS & AI LOGIC ---

// --- AI CONFIGURATION ---
const GEMINI_API_KEY = "AIzaSyB7H5bhn8y8Z4Ah-vTCqnMNWVw6ovxTrDs";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const CHAT_PERSONALITY = "Your name is CareBot. You are a friendly, professional, and knowledgeable medical assistant for the CareBuddy app. Provide concise, helpful, and empathetic health advice. Always remind the user to consult a professional for serious concerns.";

// Points System
window.addPoints = (category, amount) => {
    const points = JSON.parse(localStorage.getItem("carebuddy_points") || '{"hydration":0, "fitness":0}');
    points[category] += amount;
    localStorage.setItem("carebuddy_points", JSON.stringify(points));
    updatePointsUI();
};

function updatePointsUI() {
    const points = JSON.parse(localStorage.getItem("carebuddy_points") || '{"hydration":0, "fitness":0}');
    const hydElem = document.getElementById("hydration-points");
    const fitElem = document.getElementById("fitness-points");
    if (hydElem) hydElem.textContent = points.hydration;
    if (fitElem) fitElem.textContent = points.fitness;
}

window.logHydration = () => {
    window.addPoints('hydration', 10);
    alert("Great job! You earned 10 points for staying hydrated 💧");
};

window.logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
};

window.toggleDropdown = (id) => {
    const dropdown = document.getElementById(id);
    const allDropdowns = document.querySelectorAll('.dropdown-content');

    allDropdowns.forEach(d => {
        if (d.id !== id) d.classList.remove('show');
    });

    dropdown.classList.toggle('show');
};

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-menu') && !e.target.closest('.settings')) {
        document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
    }
});

// Setup click listeners for the icons
document.addEventListener('DOMContentLoaded', () => {
    const profileIcon = document.querySelector('#profile-menu .menu-icon');
    const settingsIcon = document.querySelector('#settings-menu .menu-icon');

    if (profileIcon) profileIcon.onclick = () => window.toggleDropdown('profile-dropdown');
    if (settingsIcon) settingsIcon.onclick = () => window.toggleDropdown('settings-dropdown');
});

// --- 4. STUB FUNCTIONS FOR MENU OPTIONS ---

window.showNotificationSettings = () => alert("🔔 Notification Settings: This feature is coming soon!");
window.showPrivacy = () => alert("🔒 Privacy Settings: Your data is always encrypted and secure.");
window.showTheme = () => alert("🎨 Theme: Custom themes will be available in the next update.");
window.changeName = () => {
    const newName = prompt("Enter your new display name:");
    if (newName) {
        document.getElementById("display-name").textContent = newName;
        alert("Name updated successfully! (Local only for demo)");
    }
};
window.changePassword = () => alert("🔑 Change Password: A reset link has been sent to your email (Demo).");

// --- 5. FAMILY & CHATBOT LOGIC ---

const form = document.getElementById("familyForm");
const memberList = document.getElementById("memberList");
let members = [];
let editIndex = null;

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const birthdate = document.getElementById("birthdate").value;
        const member = {
            name: document.getElementById("name").value,
            gender: document.getElementById("gender").value,
            birthdate: birthdate,
            relation: document.getElementById("relation").value,
            health: document.getElementById("health").value,
            age: calculateAge(birthdate)
        };

        if (editIndex === null) members.push(member);
        else { members[editIndex] = member; editIndex = null; }

        renderMembers();
        form.reset();
    });
}

function renderMembers() {
    memberList.innerHTML = "";
    members.forEach((m, index) => {
        const div = document.createElement("div");
        div.className = "member";
        div.innerHTML = `
            <strong>${m.name}</strong> (${m.relation})<br>
            Age: ${m.age} | Health: ${m.health || "N/A"}
            <div class="member-actions">
                <button onclick="window.editMember(${index})">✏️</button>
                <button onclick="window.deleteMember(${index})">🗑️</button>
            </div>`;
        memberList.appendChild(div);
    });
}

window.editMember = (index) => {
    const m = members[index];
    document.getElementById("name").value = m.name;
    document.getElementById("gender").value = m.gender;
    document.getElementById("birthdate").value = m.birthdate;
    document.getElementById("relation").value = m.relation;
    document.getElementById("health").value = m.health;
    editIndex = index;
};

window.deleteMember = (index) => {
    if (confirm("Delete this member?")) {
        members.splice(index, 1);
        renderMembers();
    }
};

function calculateAge(birthdate) {
    if (!birthdate) return "";
    const dob = new Date(birthdate);
    const ageDate = new Date(Date.now() - dob.getTime());
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// --- CHATBOT WIDGET FUNCTIONALITY ---
window.toggleChatWidget = () => {
    const chatWindow = document.getElementById("chatWindow");
    const isHidden = chatWindow.style.display === "none";
    chatWindow.style.display = isHidden ? "flex" : "none";
};

function autoGreet(name) {
    const chatMessages = document.getElementById("chatMessages");
    // Only greet if chat is empty
    if (chatMessages.children.length === 0) {
        appendMessage('bot', `How can I help you today, ${name}? 👋`);
        // Optionally open the widget automatically on first load
        document.getElementById("chatWindow").style.display = "flex";
    }
}

window.sendMessage = async () => {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    if (!message) return;

    appendMessage('user', message);
    input.value = "";

    if (GEMINI_API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE" || !GEMINI_API_KEY) {
        appendMessage('bot', "CareBot needs an API Key! Please add it to dashboard.js.");
        return;
    }

    // Typing indicator
    const typingId = 'typing-' + Date.now();
    const chatMessages = document.getElementById("chatMessages");
    const typingDiv = document.createElement("div");
    typingDiv.id = typingId;
    typingDiv.className = "bot-msg typing";
    typingDiv.textContent = "CareBot is thinking...";
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        console.log("CareBot: Sending request to Gemini...");
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${CHAT_PERSONALITY}\n\nUser Question: ${message}` }]
                }]
            })
        });

        const data = await response.json();
        console.log("CareBot: Received response:", data);

        if (data.error) {
            throw new Error(data.error.message || "API Error");
        }

        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        document.getElementById(typingId).remove();

        if (aiResponse) {
            appendMessage('bot', aiResponse);
        } else {
            console.warn("CareBot: No text in response. Finish reason:", data.candidates?.[0]?.finishReason);
            appendMessage('bot', "I'm sorry, I couldn't process that. It might be a sensitive topic or a connection glitch.");
        }
    } catch (error) {
        console.error("CareBot: Error during fetch:", error);
        document.getElementById(typingId).remove();
        appendMessage('bot', "Oops! I'm having trouble connecting to my AI brain. Please check your API key or internet.");
    }
};

function appendMessage(sender, text) {
    const chatMessages = document.getElementById("chatMessages");
    const div = document.createElement("div");
    div.className = sender === 'user' ? "user-msg" : "bot-msg";
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize on Load
checkUserSession();

// Listen for the Handshake finishing
supabase.auth.onAuthStateChange((event, session) => {
    if (session) showPage(session.user);
    if (event === "SIGNED_OUT") window.location.href = "index.html";
});
