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

    // If we have a session, move to dashboard
    if (session && isLoginPage) {
        console.log("Session confirmed, redirecting to dashboard...");
        window.location.href = "dashboard.html";
    }

    // If the user explicitly signs out, then and ONLY then move to login
    if (event === "SIGNED_OUT" && path.includes("dashboard.html")) {
        window.location.href = "index.html";
    }
});

// 3. Navigation & Auth Functions
async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://care-buddy-pi.vercel.app/dashboard.html',
      skipBrowserRedirect: false // Ensure this is false so Supabase handles the move
    }
  });

  if (error) {
    console.error("Supabase Auth Error:", error.message);
    alert("Auth Error: " + error.message);
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
    // Check for tokens in the URL (Google redirect)
    const hasHash = window.location.hash.includes("access_token");
    const hasError = window.location.hash.includes("error");

    if (hasHash || hasError) {
        console.log("Hash detected. Stopping all redirects to allow processing...");
        return; // EXIT. Do not run any redirects if we are in the middle of a login.
    }

    const { data: { session } } = await supabase.auth.getSession();
    const path = window.location.pathname;
    const isDashboard = path.includes("dashboard.html");

    // Only redirect to login if we are on the dashboard AND we are 100% sure there's no session
    if (!session && isDashboard) {
        // Add a tiny delay to be absolutely sure the session isn't just loading
        setTimeout(() => {
            supabase.auth.getSession().then(({ data }) => {
                if (!data.session) {
                    console.log("Still no session after delay. Redirecting to login...");
                    window.location.href = "index.html";
                }
            });
        }, 500); 
    }
}

initialCheck();
