/***********************
 * USER NAME (NAVBAR)
 ***********************/
const storedName = localStorage.getItem("username");
if (document.getElementById("userName")) {
    document.getElementById("userName").innerText = storedName || "friend";
}

/***********************
 * FAMILY MEMBER LOGIC
 ***********************/
const form = document.getElementById("familyForm");
const memberList = document.getElementById("memberList");

let members = [];
let editIndex = null;

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const birthdateValue = document.getElementById("birthdate").value;

    const member = {
        name: document.getElementById("name").value,
        gender: document.getElementById("gender").value,
        birthdate: birthdateValue,
        relation: document.getElementById("relation").value,
        health: document.getElementById("health").value,
        age: calculateAge(birthdateValue)
    };

    if (editIndex === null) {
        members.push(member);
    } else {
        members[editIndex] = member;
        editIndex = null;
    }

    renderMembers();
    form.reset();
});

function renderMembers() {
    memberList.innerHTML = "";

    members.forEach((m, index) => {
        const div = document.createElement("div");
        div.className = "member";

        div.innerHTML = `
            <strong>${m.name}</strong> (${m.relation})<br>
            Gender: ${m.gender}<br>
            Age: ${m.age}<br>
            Health: ${m.health || "N/A"}

            <div class="member-actions">
                <button class="edit-btn" onclick="editMember(${index})">✏️ Edit</button>
                <button class="delete-btn" onclick="deleteMember(${index})">🗑️ Delete</button>
            </div>
        `;

        memberList.appendChild(div);
    });
}

function editMember(index) {
    const m = members[index];

    document.getElementById("name").value = m.name;
    document.getElementById("gender").value = m.gender;
    document.getElementById("birthdate").value = m.birthdate;
    document.getElementById("relation").value = m.relation;
    document.getElementById("health").value = m.health;

    editIndex = index;
}

function deleteMember(index) {
    if (confirm("Are you sure you want to delete this family member?")) {
        members.splice(index, 1);
        renderMembers();
    }
}

function calculateAge(birthdate) {
    if (!birthdate) return "";
    const dob = new Date(birthdate);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/***********************
 * SIDEBAR NAVIGATION
 ***********************/
function showProfile() {
    document.getElementById("profileSection").style.display = "block";
    document.getElementById("chatbotSection").style.display = "none";
    setActiveButton(0);
}

function showChatbot() {
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("chatbotSection").style.display = "block";
    setActiveButton(1);
}

function setActiveButton(activeIndex) {
    const buttons = document.querySelectorAll(".sidebar button");
    buttons.forEach((btn, index) => {
        btn.classList.toggle("active", index === activeIndex);
    });
}

/***********************
 * CHATBOT LOGIC
 ***********************/
function sendMessage() {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    if (!message) return;

    const chat = document.getElementById("chatMessages");

    // User message
    const userDiv = document.createElement("div");
    userDiv.className = "user-msg";
    userDiv.innerText = message;
    chat.appendChild(userDiv);

    input.value = "";
    chat.scrollTop = chat.scrollHeight;

    // Bot reply
    setTimeout(() => {
        const botDiv = document.createElement("div");
        botDiv.className = "bot-msg";
        botDiv.innerText = getBotReply(message);
        chat.appendChild(botDiv);
        chat.scrollTop = chat.scrollHeight;
    }, 600);
}

function getBotReply(msg) {
    msg = msg.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi"))
        return "Hello 👋 I’m CareBuddy. How can I help you today?";

    if (msg.includes("fever"))
        return "If fever lasts more than 2 days, please consult a doctor 🌡️";

    if (msg.includes("headache"))
        return "Try resting, staying hydrated, and avoiding screens 🧠";

    if (msg.includes("stress") || msg.includes("anxiety"))
        return "It’s important to take breaks and breathe deeply 💚";

    if (msg.includes("thank"))
        return "You’re most welcome 😊";

    return "I’m here to help with health-related questions 💊";
}
