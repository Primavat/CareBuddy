import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://idbratjfnpkzmbfzcehr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYnJhdGpmbnBrem1iZnpjZWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTYyMzMsImV4cCI6MjA5MDc5MjIzM30._SHhi4Q7MTDE12L4tsl6yaLKAWvxZoVmmLZB5wdV59g'
)

// --- AUTH LOGIC ---

async function checkUserSession() {
    // 1. If there's a hash in the URL, Supabase is working. DO NOT REDIRECT.
    if (window.location.hash.includes("access_token")) {
        console.log("Processing Google Login...");
        return; 
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // 2. Give it a 1.5s second chance to recover the session
        setTimeout(async () => {
            const { data: { session: retry } } = await supabase.auth.getSession();
            if (!retry) window.location.href = "index.html";
            else setupUI(retry.user);
        }, 1500);
    } else {
        setupUI(session.user);
    }
}

function setupUI(user) {
    document.body.style.display = "block";
    const el = document.getElementById("user-email");
    if (el) el.textContent = user.email;
}

// --- ATTACH FUNCTIONS TO WINDOW (So HTML buttons work) ---
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

// Initialize
checkUserSession();

// Listen for auth changes (like successful Google handshake)
supabase.auth.onAuthStateChange((event, session) => {
    if (session) setupUI(session.user);
    if (event === "SIGNED_OUT") window.location.href = "index.html";
});

// ... Keep your Family Member Logic and Chatbot Logic below here ...
