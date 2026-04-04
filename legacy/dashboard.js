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
    if (sectionId === 'journalSection') {
        window.renderJournalEntries();
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
    if (members.length === 0) {
        memberList.innerHTML = '<div class="empty-state">No family members added yet. Add one to see their health milestones.</div>';
        return;
    }

    members.forEach((m, index) => {
        const div = document.createElement("div");
        div.className = "member-folder";
        div.innerHTML = `
            <div class="member-header">
                <div class="member-avatar">${m.name.charAt(0)}</div>
                <div class="member-info">
                    <h3>${m.name}</h3>
                    <p>${m.relation} • ${m.age} Yrs</p>
                </div>
                <div class="member-actions">
                    <button onclick="window.editMember(${index})">✏️</button>
                    <button onclick="window.deleteMember(${index})">🗑️</button>
                </div>
            </div>
            <div class="member-body">
                <p><strong>Health Summary:</strong> ${m.health || "No underlying conditions noted."}</p>
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
    // --- INFANT (0-12 Months) ---
    { id: 'bcg', name: 'BCG (Tuberculosis)', ageMonths: 0, description: 'Single dose given at birth.' },
    { id: 'hepb1', name: 'Hepatitis B (Dose 1)', ageMonths: 0, description: 'At birth or within 24 hours.' },
    { id: 'polio1', name: 'Polio (IPV/OPV)', ageMonths: 1.5, description: '6 weeks old.' },
    { id: 'dtap1', name: 'DTaP (Dose 1)', ageMonths: 2, description: 'Protects against Diphtheria, Tetanus, Pertussis.' },
    { id: 'rota1', name: 'Rotavirus (Dose 1)', ageMonths: 2, description: 'Prevents severe diarrhea.' },
    { id: 'pneu1', name: 'Pneumococcal (Dose 1)', ageMonths: 2, description: 'Protects against pneumonia.' },
    { id: 'mmr1', name: 'MMR (Dose 1)', ageMonths: 9, description: 'Measles, Mumps, Rubella.' },

    // --- CHILD / TEEN (1-18 Years) ---
    { id: 'var1', name: 'Varicella (Chickenpox)', ageMonths: 12, description: '1 year old.' },
    { id: 'hepa1', name: 'Hepatitis A', ageMonths: 13, description: '1.5 years old.' },
    { id: 'typh1', name: 'Typhoid (Booster)', ageMonths: 24, description: 'Every 2-3 years.' },
    { id: 'hpv1', name: 'HPV (Dose 1)', ageMonths: 120, description: 'Around 10-12 years old.' },
    { id: 'mening', name: 'Meningococcal', ageMonths: 132, description: 'Prevents meningitis.' },

    // --- ADULT (18+) ---
    { id: 'tdap_boost', name: 'Tdap Booster', ageMonths: 240, description: 'Every 10 years for adults.' },
    { id: 'flu_annual', name: 'Annual Flu Vaccine', ageMonths: 6, description: 'Recommended seasonal vaccine.' },
    { id: 'covid_boost', name: 'COVID-19 Follow-up', ageMonths: 192, description: 'Annual recommended booster.' },
    { id: 'shing', name: 'Shingles Vaccine', ageMonths: 600, description: 'Recommended for age 50+.' }
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

// --- 8. NEARBY HOSPITALS LOGIC ---

window.findNearbyHospitals = () => {
    const results = document.getElementById("hospitalResults");
    if (!results) return;

    results.innerHTML = '<div class="empty-state"><p>📡 Scanning for healthcare services...</p></div>';

    if (!navigator.geolocation) {
        results.innerHTML = '<div class="empty-state"><p>❌ Geolocation is not supported by your browser.</p></div>';
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const searchQuery = document.getElementById("hospitalSearch").value || "hospital";
        
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&lat=${latitude}&lon=${longitude}&bounded=1&viewbox=${longitude-0.1},${latitude+0.1},${longitude+0.1},${latitude-0.1}`;
            const res = await fetch(url);
            const data = await res.json();

            results.innerHTML = "";
            if (data.length === 0) {
                results.innerHTML = '<div class="empty-state"><p>📭 No facilities found in your immediate area. Try searching for "Clinic" or "Doctor".</p></div>';
                return;
            }

            data.forEach(item => {
                const card = document.createElement("div");
                card.className = "hospital-card";
                card.innerHTML = `
                    <span class="dist">📍 Medical Facility</span>
                    <h4>${item.display_name.split(',')[0]}</h4>
                    <p style="font-size: 0.85rem; color: #666;">${item.display_name.split(',').slice(1, 3).join(',')}</p>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}" target="_blank" class="btn-direct">🚗 Get Directions</a>
                `;
                results.appendChild(card);
            });
        } catch (e) {
            results.innerHTML = '<div class="empty-state"><p>❌ Connection error. Please try again later.</p></div>';
        }
    }, () => {
        results.innerHTML = '<div class="empty-state"><p>⚠️ Location access denied. Please enable GPS to find nearby services.</p></div>';
    });
};

// --- 9. AI DIETARY PLANS ---

window.generateDietPlan = async () => {
    const goal = document.getElementById("dietGoal").value;
    const type = document.getElementById("dietType").value;
    const resultArea = document.getElementById("dietResults");
    const content = document.getElementById("dietContent");

    if (!resultArea || !content) return;

    resultArea.style.display = "block";
    content.innerHTML = "✨ CareBot is crafting your personalized plan...";
    content.scrollIntoView({ behavior: 'smooth' });

    const prompt = `As a professional nutritionist for CareBuddy, generate a detailed ${goal} dietary plan for a ${type} user. 
    Include:
    1. A short motivational intro.
    2. A 1-day sample meal plan (Breakfast, Lunch, Evening Snack, Dinner).
    3. Three key nutritional tips for this goal.
    Be concise, empathetic, and professional.`;

    try {
        const genResult = await model.generateContent(prompt);
        const response = await genResult.response;
        content.innerHTML = response.text();
    } catch (e) {
        content.innerHTML = "❌ Sorry, I hit a snag while generating your plan. Please try again or check your connection.";
    }
};

window.copyDietPlan = () => {
    const content = document.getElementById("dietContent").innerText;
    navigator.clipboard.writeText(content).then(() => {
        alert("📋 Plan copied to clipboard!");
    });
};

// --- 10. MOODOMETER LOGIC ---

window.logMood = async (type, emoji) => {
    const tipCard = document.getElementById("moodTip");
    const tipText = document.getElementById("tipText");
    if (!tipCard || !tipText) return;

    // Show the card and a loading state
    tipCard.style.display = "block";
    tipText.innerHTML = `<i>CareBot is thinking about your ${type} mood...</i>`;
    tipCard.scrollIntoView({ behavior: 'smooth' });

    const prompt = `The user at CareBuddy just logged their mood as ${type} (${emoji}). 
    As an empathetic health assistant, provide a ONE-SENTENCE relaxation tip or mindfulness advice for this specific mood. 
    Be warm, brief, and helpful.`;

    try {
        const genResult = await model.generateContent(prompt);
        const response = await genResult.response;
        tipText.innerHTML = `"${response.text()}"`;
    } catch (e) {
        tipText.innerHTML = "Take a deep breath and remember you're doing great! 🌿";
    }
};

// --- 11. HEALTH JOURNAL LOGIC ---

window.updateWordCount = () => {
    const text = document.getElementById("journalInput").value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const count = words.length;
    const counter = document.getElementById("wordCount");
    if (counter) {
        counter.innerText = `Words: ${count} / 1000`;
        counter.style.color = count > 1000 ? "#ff7675" : "var(--text-dim)";
    }
};

window.saveJournalEntry = () => {
    const text = document.getElementById("journalInput").value.trim();
    if (!text) return alert("Please write something before saving.");

    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length > 1000) return alert("Please limit your entry to 1,000 words.");

    const entries = JSON.parse(localStorage.getItem("carebuddy_journal") || "[]");
    const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        content: text,
        starred: false
    };

    entries.unshift(newEntry);
    localStorage.setItem("carebuddy_journal", JSON.stringify(entries));
    document.getElementById("journalInput").value = "";
    window.updateWordCount();
    window.renderJournalEntries();
};

window.renderJournalEntries = () => {
    const list = document.getElementById("journalList");
    if (!list) return;

    const entries = JSON.parse(localStorage.getItem("carebuddy_journal") || "[]");
    list.innerHTML = "";

    if (entries.length === 0) {
        list.innerHTML = '<div class="empty-state">No journal entries yet. Start writing above!</div>';
        return;
    }

    entries.forEach(entry => {
        const card = document.createElement("div");
        card.className = `journal-entry ${entry.starred ? 'starred' : ''}`;
        card.innerHTML = `
            <div class="journal-date">${entry.date}</div>
            <div class="journal-content" id="content-${entry.id}">${entry.content}</div>
            <div class="journal-actions">
                <button onclick="window.editJournalEntry(${entry.id})" id="edit-btn-${entry.id}">✏️ Edit</button>
                <button onclick="window.toggleStarJournalEntry(${entry.id})" class="btn-star ${entry.starred ? 'active' : ''}">⭐ Star</button>
                <button onclick="window.downloadJournalEntry(${entry.id})">💾 Download</button>
                <button onclick="window.deleteJournalEntry(${entry.id})" class="btn-delete">🗑️ Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
};

window.deleteJournalEntry = (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    let entries = JSON.parse(localStorage.getItem("carebuddy_journal") || "[]");
    entries = entries.filter(e => e.id !== id);
    localStorage.setItem("carebuddy_journal", JSON.stringify(entries));
    window.renderJournalEntries();
};

window.toggleStarJournalEntry = (id) => {
    const entries = JSON.parse(localStorage.getItem("carebuddy_journal") || "[]");
    const entry = entries.find(e => e.id === id);
    if (entry) {
        entry.starred = !entry.starred;
        localStorage.setItem("carebuddy_journal", JSON.stringify(entries));
        window.renderJournalEntries();
    }
};

window.editJournalEntry = (id) => {
    const contentDiv = document.getElementById(`content-${id}`);
    const editBtn = document.getElementById(`edit-btn-${id}`);
    
    if (editBtn.innerText === "✏️ Edit") {
        const currentText = contentDiv.innerText;
        contentDiv.innerHTML = `<textarea id="edit-box-${id}" style="width:100%; min-height:100px; padding:10px; border-radius:8px; border:1px solid var(--border);">${currentText}</textarea>`;
        editBtn.innerText = "💾 Save";
        editBtn.style.background = "#27ae60";
        editBtn.style.color = "white";
    } else {
        const newText = document.getElementById(`edit-box-${id}`).value.trim();
        if (!newText) return alert("Content cannot be empty.");
        
        const entries = JSON.parse(localStorage.getItem("carebuddy_journal") || "[]");
        const entry = entries.find(e => e.id === id);
        if (entry) {
            entry.content = newText;
            localStorage.setItem("carebuddy_journal", JSON.stringify(entries));
            window.renderJournalEntries();
        }
    }
};

window.downloadJournalEntry = (id) => {
    const entries = JSON.parse(localStorage.getItem("carebuddy_journal") || "[]");
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    // Clean date for filename (e.g., 2026-04-04)
    const dateStr = new Date(entry.id).toISOString().split('T')[0];
    const filename = `Journal_${dateStr}.txt`;
    const blob = new Blob([`CAREBUDDY JOURNAL ENTRY\nDate: ${entry.date}\n\n${entry.content}`], { type: 'text/plain' });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};

// Initialize
checkUserSession();

supabase.auth.onAuthStateChange((event, session) => {
    if (session) showPage(session.user);
    if (event === "SIGNED_OUT") window.location.href = "index.html";
});
