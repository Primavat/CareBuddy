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
async function checkUser() {
  // 1. Get the current session
  const { data: { session }, error } = await supabase.auth.getSession();
  const user = session?.user;
  const path = window.location.pathname;

  // 2. Define our pages (more robust path checking)
  const isLoginPage = path === "/" || path.includes("index.html") || path === "";
  const isDashboard = path.includes("dashboard.html");

  // 3. LOGIC:
  if (user) {
    // If logged in and on login page -> Go to dashboard
    if (isLoginPage) {
      window.location.href = "dashboard.html";
    }
  } else {
    // If NOT logged in and on dashboard -> Go to login
    // BUT: only redirect if we aren't currently in the middle of an auth change
    if (isDashboard) {
       window.location.href = "index.html";
    }
  }
}

// 4. THE SECRET SAUCE: Listen for state changes
// This catches the moment the Google login finishes
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth State Changed:", event);
  if (event === "SIGNED_IN") {
    window.location.href = "dashboard.html";
  }
});
checkUser()
