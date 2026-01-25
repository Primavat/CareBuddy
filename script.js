function goToStep2() {
    const name = document.getElementById("username").value.trim();
    if (name === "") {
        alert("Please enter your name");
        return;
    }
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
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
