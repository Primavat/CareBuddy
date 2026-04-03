import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://idbratjfnpkzmbfzcehr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYnJhdGpmbnBrem1iZnpjZWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTYyMzMsImV4cCI6MjA5MDc5MjIzM30._SHhi4Q7MTDE12L4tsl6yaLKAWvxZoVmmLZB5wdV59g'
)

// 1. UI Loading Logic
window.addEventListener("load", function() {
    setTimeout(function() {
        const showcase = document.getElementById("showcase-page");
        const loginContainer = document.getElementById("login-container");
        
        if (showcase) showcase.classList.add("hidden");
        if (loginContainer) {
            loginContainer.classList.remove("hidden");
            // Small delay to allow CSS to register the block display before fading in
            setTimeout(function() {
                loginContainer.classList.add("fade-in-active");
            }, 50);
        }
    }, 2400); // wait for showcase animation to nearly finish
});

// 2. Auth State Listener
supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth Event:", event, "Session exists:", !!session);
    
    const path = window.location.pathname;
    const isLoginPage = path.includes("index.html") || path === "/" || path === "";

    // Handle Sign In or Token Recovery
    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (isLoginPage) {
            window.location.href = "dashboard.html";
        }
    }

    // Handle Initial Session if user is already logged in
    if (event === "INITIAL_SESSION" && session) {
        if (isLoginPage) {
            window.location.href = "dashboard.html";
        }
    }

    // Handle Sign Out
    if (event === "SIGNED_OUT") {
        if (path.includes("dashboard.html")) {
            window.location.href = "index.html";
        }
    }
});

// 3. Navigation & Auth Functions
async function loginWithGoogle() {
    try {
        document.body.style.cursor = "wait";
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://care-buddy-pi.vercel.app/dashboard.html'
            }
        });
        if (error) throw error;
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        document.body.style.cursor = "default";
    }
}

function goToStep3() {
    const contact = document.getElementById("contact").value.trim();
    if (contact === "") {
        alert("Please enter phone number or email");
        return;
    }
    document.getElementById("step2").classList.add("hidden");
    document.getElementById("step3").classList.remove("hidden");
}

function verifyOTP() {
    const otp = document.getElementById("otp").value.trim();
    if (otp === "123456") {
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid OTP. Please try again.");
    }
}

// 4. Initial Page Load Check
async function initialCheck() {
    // If URL has a hash (token), stop and let the listener handle it
    if (window.location.hash.includes("access_token") || window.location.hash.includes("error")) {
        console.log("Login token detected in URL. Waiting for Supabase...");
        return; 
    }

    const { data: { session } } = await supabase.auth.getSession();
    const path = window.location.pathname;
    const isDashboard = path.includes("dashboard.html");
    const isLoginPage = path.includes("index.html") || path === "/" || path === "";

    if (session && isLoginPage) {
        window.location.href = "dashboard.html";
    } else if (!session && isDashboard) {
        window.location.href = "index.html";
    }
}

initialCheck();
