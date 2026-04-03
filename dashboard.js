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
    const emailDisplay = document.getElementById("user-email");
    if (emailDisplay) emailDisplay.textContent = user.email;
}

// --- 2. GLOBAL FUNCTIONS (Required for HTML Buttons) ---

window.logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
};

window.showProfile = () => {
    document.getElementById("profileSection").style.display = "block";
    document.getElementById("chatbotSection").style.display = "none";
    setActiveButton(0);
};

window.showChatbot = () => {
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("chatbotSection").style.display = "block";
    setActiveButton(1);
};

function setActiveButton(activeIndex) {
    const buttons = document.querySelectorAll(".sidebar button");
    buttons.forEach((btn, index) => {
        btn.classList.toggle("active", index === activeIndex);
    });
}

// --- 3. FAMILY & CHATBOT LOGIC ---

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

// Initialize on Load
checkUserSession();

// Listen for the Handshake finishing
supabase.auth.onAuthStateChange((event, session) => {
    if (session) showPage(session.user);
    if (event === "SIGNED_OUT") window.location.href = "index.html";
});
