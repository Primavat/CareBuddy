import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://idbratjfnpkzmbfzcehr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYnJhdGpmbnBrem1iZnpjZWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTYyMzMsImV4cCI6MjA5MDc5MjIzM30._SHhi4Q7MTDE12L4tsl6yaLKAWvxZoVmmLZB5wdV59g'
)

// 1. UI Loading Logic
window.addEventListener("load", function () {
  setTimeout(function () {
    const showcase = document.getElementById("showcase-page");
    const loginContainer = document.getElementById("login-container");
    if (showcase) showcase.classList.add("hidden");
    if (loginContainer) {
      loginContainer.classList.remove("hidden");
      setTimeout(() => loginContainer.classList.add("fade-in-active"), 50);
    }
  }, 2400);
});

// 2. Auth State Listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth Event:", event, "Session exists:", !!session);
  const path = window.location.pathname;
  const isLoginPage = path.includes("index.html") || path === "/" || path === "";

  if (session && isLoginPage) {
    window.location.href = "dashboard.html";
  }
});

// 3. Navigation & Auth Functions
window.loginWithGoogle = async function () {
  try {
    document.body.style.cursor = "wait";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://care-buddy-pi.vercel.app/dashboard.html',
        skipBrowserRedirect: false
      }
    });
    if (error) throw error;
  } catch (err) {
    console.error("Supabase Auth Error:", err.message);
    alert("Auth Error: " + err.message);
  } finally {
    document.body.style.cursor = "default";
  }
}

window.goToStep3 = function () {
  const contact = document.getElementById("contact").value.trim();
  if (contact === "") {
    alert("Please enter phone number or email");
    return;
  }
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step3").classList.remove("hidden");
}

window.verifyOTP = function () {
  const otp = document.getElementById("otp").value.trim();
  if (otp === "123456") {
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid OTP. Please try again.");
  }
}

// 4. Initial Page Load Check
async function initialCheck() {
  if (window.location.hash.includes("access_token")) return;

  const { data: { session } } = await supabase.auth.getSession();
  const path = window.location.pathname;
  if (session && (path.includes("index.html") || path === "/")) {
    window.location.href = "dashboard.html";
  }
}

initialCheck();
