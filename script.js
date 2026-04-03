window.onload = function() {
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
