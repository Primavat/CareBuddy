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
};

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
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    window.location.href = "index.html"
  } else {
    console.log("User:", user)
  }
}

checkUser()
