import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://idbratjfnpkzmbfzcehr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYnJhdGpmbnBrem1iZnpjZWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTYyMzMsImV4cCI6MjA5MDc5MjIzM30._SHhi4Q7MTDE12L4tsl6yaLKAWvxZoVmmLZB5wdV59g'
)
window.addEventListener("load", function() {
    setTimeout(function() {
        document.getElementById("showcase-page").classList.add("hidden");
        const loginContainer = document.getElementById("login-container");
        loginContainer.classList.remove("hidden");
        
        // Small delay to allow CSS to register the block display before fading in
        setTimeout(function() {
            loginContainer.classList.add("fade-in-active");
        }, 50);
        
    }, 2400); // wait for showcase animation to nearly finish
});

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
async function loginWithGoogle() {
  try {
    document.body.style.cursor = "wait";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://care-buddy-pi.vercel.app/dashboard.html'
      }
    })

    if (error) throw error;

  } catch (err) {
    alert("Error: " + err.message)
  } finally {
    document.body.style.cursor = "default";
  }
}
// 1. THE LISTENER
supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth Event:", event, "Session exists:", !!session);
    
    // If we just signed in, or a session was recovered from the URL
    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    // If we have a session, always move away from login page
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        window.location.href = "dashboard.html";
    }
}

// Added: If the session finishes loading and there's a user, move them
if (event === "INITIAL_SESSION" && session) {
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        window.location.href = "dashboard.html";
    }
}

    // If the user signed out
    if (event === "SIGNED_OUT") {
        if (window.location.pathname.includes("dashboard.html")) {
            window.location.href = "index.html";
        }
    }
});

// 2. THE INITIAL CHECK (With a "Pause" for Login tokens)
async function initialCheck() {
    // Check if the URL has a Supabase hash (this happens right after Google login)
    // If it does, we STOP and let onAuthStateChange handle the exchange.
    if (window.location.hash.includes("access_token") || window.location.hash.includes("error")) {
        console.log("Login token detected in URL. Waiting for Supabase...");
        return; 
    }

    const { data: { session } } = await supabase.auth.getSession();
    const path = window.location.pathname;
    const isDashboard = path.includes("dashboard.html");
    const isLoginPage = path.includes("index.html") || path === "/";

    if (session && isLoginPage) {
        window.location.href = "dashboard.html";
    } else if (!session && isDashboard) {
        window.location.href = "index.html";
    }
}
initialCheck();
