import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai'

const supabase = createClient(
    'https://idbratjfnpkzmbfzcehr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYnJhdGpmbnBrem1iZnpjZWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTYyMzMsImV4cCI6MjA5MDc5MjIzM30._SHhi4Q7MTDE12L4tsl6yaLKAWvxZoVmmLZB5wdV59g'
)

// --- 1. AUTH & REDIRECT LOGIC ---

async function checkUserSession() {
    if (window.location.hash.includes("access_token")) {
        console.log("Login in progress...");
        return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        showPage(session.user);
    } else {
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

    const savedMode = localStorage.getItem("dashboardMode") || "personal";
    window.setDashboardMode(savedMode);
    
    updatePointsUI();
    setTimeout(() => autoGreet(fullName), 1000);
}

// --- 2. GLOBAL FUNCTIONS ---

window.setDashboardMode = (mode) => {
    localStorage.setItem("dashboardMode", mode);
    document.body.className = `mode-${mode}`;

    document.getElementById("personal-btn").classList.toggle("active", mode === 'personal');
    document.getElementById("family-btn").classList.toggle("active", mode === 'family');

    if (mode === 'personal') window.showSection('vitalsSection');
    else window.showSection('profileSection');
};

window.showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    const target = document.getElementById(sectionId);
    if (target) target.style.display = 'block';

    if (sectionId === 'vaccinationSection') {
        window.renderVaccinations();
    }

    const buttons = document.querySelectorAll(".sidebar button");
    buttons.forEach(btn => {
        const onClickAttr = btn.getAttribute("onclick") || "";
        btn.classList.toggle("active", onClickAttr.includes(`'${sectionId}'`));
    });
};

// --- 3. REWARDS LOGIC ---

// --- 3. REWARDS & AI LOGIC ---

const GEMINI_API_KEY = "AIzaSyB7H5bhn8y8Z4Ah-vTCqnMNWVw6ovxTrDs".trim();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const MODELS_TO_TRY = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
let activeModelName = MODELS_TO_TRY[0];

const getBotModel = (modelName) => genAI.getGenerativeModel({ 
    model: modelName,
    systemInstruction: "Your name is CareBot. You are a friendly, professional, and knowledgeable medical assistant for the CareBuddy app. Provide concise, helpful, and empathetic health advice. Always remind the user to consult a professional for serious concerns."
}, { apiVersion: 'v1' });

let model = getBotModel(activeModelName);

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

document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-menu') && !e.target.closest('.settings')) {
        document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const profileIcon = document.querySelector('#profile-menu .menu-icon');
    const settingsIcon = document.querySelector('#settings-menu .menu-icon');

    if (profileIcon) profileIcon.onclick = () => window.toggleDropdown('profile-dropdown');
    if (settingsIcon) settingsIcon.onclick = () => window.toggleDropdown('settings-dropdown');
});

// --- 4. STUB FUNCTIONS ---

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

// --- 5. FAMILY LOGIC ---

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

// --- 6. CHATBOT ---

window.toggleChatWidget = () => {
    const chatWindow = document.getElementById("chatWindow");
    const isHidden = chatWindow.style.display === "none";
    chatWindow.style.display = isHidden ? "flex" : "none";
};

function autoGreet(name) {
    const chatMessages = document.getElementById("chatMessages");
    if (chatMessages.children.length === 0) {
        appendMessage('bot', `How can I help you today, ${name}? 👋`);
        document.getElementById("chatWindow").style.display = "flex";
    }
}

window.sendMessage = async (retryMsg = null) => {
    const input = document.getElementById("chatInput");
    const message = retryMsg || input.value.trim();
    if (!message) return;

    if (!retryMsg) {
        appendMessage('user', message);
        input.value = "";
    }

    const typingId = 'typing-' + Date.now();
    const chatMessages = document.getElementById("chatMessages");
    const typingDiv = document.createElement("div");
    typingDiv.id = typingId;
    typingDiv.className = "bot-msg typing";
    typingDiv.textContent = "CareBot is thinking...";
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        
        document.getElementById(typingId)?.remove();

        if (text) {
            appendMessage('bot', text);
        } else {
            appendMessage('bot', "I received an empty response. Please try again.");
        }

    } catch (error) {
        console.error(`CareBot Service Error (${activeModelName})`);
        
        if (document.getElementById(typingId)) {
            document.getElementById(typingId).remove();
        }

        if (error.message.includes("404") || error.message.includes("not found")) {
            const nextIndex = MODELS_TO_TRY.indexOf(activeModelName) + 1;
            if (nextIndex < MODELS_TO_TRY.length) {
                const prevModel = activeModelName;
                activeModelName = MODELS_TO_TRY[nextIndex];
                model = getBotModel(activeModelName);
                return window.sendMessage(message); 
            }
        }

        appendMessage('bot', "Oops! Could not connect to CareBot. Please try again.");
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

// --- 7. VACCINATION TRACKER ---

const VACCINE_SCHEDULE = [
    { id: 'bcg', name: 'BCG (Tuberculosis)', ageMonths: 0, description: 'Single dose at birth' },
    { id: 'hepb1', name: 'Hepatitis B (Dose 1)', ageMonths: 0, description: 'At birth' },
    { id: 'polio1', name: 'Oral Polio Vaccine (OPV)', ageMonths: 1.5, description: '6 weeks old' },
    { id: 'rotav', name: 'Rotavirus Vaccine', ageMonths: 2, description: '2 months old' },
    { id: 'mmr1', name: 'MMR (Dose 1)', ageMonths: 9, description: '9 months old' },
    { id: 'dpt_boost', name: 'DPT Booster', ageMonths: 18, description: '1.5 years old' },
    { id: 'typhoid', name: 'Typhoid Vaccine', ageMonths: 24, description: '2 years old' },
    { id: 'hpv', name: 'HPV Vaccine', ageMonths: 120, description: '10 years old' },
    { id: 'flu', name: 'Annual Flu Shot', ageMonths: 6, description: 'Recommended annually from 6mo+' }
];

let currentVaccineFilter = 'all';

window.renderVaccinations = () => {
    const list = document.getElementById("vaccineList");
    const profileSelect = document.getElementById("vaccine-profile-select");
    if (!list || !profileSelect) return;

    const currentVal = profileSelect.value;
    profileSelect.innerHTML = '<option value="user">Me (Primary)</option>';
    members.forEach((m, idx) => {
        const opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = m.name;
        profileSelect.appendChild(opt);
    });
    profileSelect.value = currentVal;

    let birthdate = localStorage.getItem("carebuddy_user_dob") || "1990-01-01";
    let profileId = "user";
    
    if (profileSelect.value !== "user") {
        const mem = members[profileSelect.value];
        if (mem) {
            birthdate = mem.birthdate;
            profileId = `member_${profileSelect.value}`;
        }
    }

    const userAgeMonths = calculateAgeInMonths(birthdate);
    const completedKey = `carebuddy_vaccines_${profileId}`;
    const completed = JSON.parse(localStorage.getItem(completedKey) || "[]");

    list.innerHTML = "";

    VACCINE_SCHEDULE.forEach(v => {
        const isDone = completed.includes(v.id);
        const isOverdue = !isDone && userAgeMonths >= v.ageMonths;
        
        if (currentVaccineFilter === 'completed' && !isDone) return;
        if (currentVaccineFilter === 'pending' && isDone) return;

        const card = document.createElement("div");
        card.className = `vaccine-card ${isDone ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
        card.innerHTML = `
            <div class="age-tag">${v.ageMonths === 0 ? 'At Birth' : (v.ageMonths < 12 ? v.ageMonths + ' mo' : Math.floor(v.ageMonths/12) + ' yrs')}</div>
            <h3>${v.name}</h3>
            <p>${v.description}</p>
            <div class="status">
                <span>${isDone ? '✅ Completed' : (isOverdue ? '⚠️ Overdue' : '⏳ Upcoming')}</span>
                ${!isDone ? `<button class="btn-done" onclick="window.markVaccineDone('${v.id}', '${profileId}')">Mark Done</button>` : ''}
            </div>
        `;
        list.appendChild(card);
    });

    updateVaccineProgress(completed.length);
    updateVaccineBadge(userAgeMonths, completed);
};

window.markVaccineDone = (id, profileId) => {
    const completedKey = `carebuddy_vaccines_${profileId}`;
    const completed = JSON.parse(localStorage.getItem(completedKey) || "[]");
    if (!completed.includes(id)) {
        completed.push(id);
        localStorage.setItem(completedKey, JSON.stringify(completed));
        window.renderVaccinations();
    }
};

window.filterVaccines = (type) => {
    currentVaccineFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(type));
    });
    window.renderVaccinations();
};

function updateVaccineProgress(doneCount) {
    const total = VACCINE_SCHEDULE.length;
    const percent = Math.round((doneCount / total) * 100);
    const fill = document.getElementById("vaccine-progress-fill");
    const text = document.getElementById("vaccine-progress-text");
    if (fill) fill.style.width = percent + "%";
    if (text) text.textContent = `Overall Protection: ${percent}%`;
}

function updateVaccineBadge(ageMonths, completed) {
    const badge = document.getElementById("vaccine-badge");
    if (!badge) return;

    const overdueCount = VACCINE_SCHEDULE.filter(v => 
        !completed.includes(v.id) && ageMonths >= v.ageMonths
    ).length;

    if (overdueCount > 0) {
        badge.style.display = "inline-block";
        badge.textContent = overdueCount;
    } else {
        badge.style.display = "none";
    }
}

function calculateAgeInMonths(birthdate) {
    const dob = new Date(birthdate);
    const now = new Date();
    return (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
}

setTimeout(window.renderVaccinations, 500);

// Initialize
checkUserSession();

supabase.auth.onAuthStateChange((event, session) => {
    if (session) showPage(session.user);
    if (event === "SIGNED_OUT") window.location.href = "index.html";
});
