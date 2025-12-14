    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
    import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

    const firebaseConfig = {
      apiKey: "AIzaSyAoAONAcz2TrIML5DWw7MHP1GWXA1Nu678",
      authDomain: "adminotp-1dcf5.firebaseapp.com",
      databaseURL: "https://adminotp-1dcf5-default-rtdb.firebaseio.com",
      projectId: "adminotp-1dcf5",
      storageBucket: "adminotp-1dcf5.firebasestorage.app",
      messagingSenderId: "1008143217341",
      appId: "1:1008143217341:web:52ffd5f14482b66aa77dd4",
      measurementId: "G-0QBCN9SLZR"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);

    let confirmationResult;
    const phoneInput = document.getElementById('phone');
    const sendBtn = document.getElementById('sendOtp');
    const otpInput = document.getElementById('otp');
    const verifyBtn = document.getElementById('verifyOtp');
    const feedback = document.getElementById('feedback');

    // 🔹 Initialize reCAPTCHA safely on page load
    window.onload = () => {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: (response) => { console.log("reCAPTCHA verified"); }
      });
    };

    sendBtn.addEventListener('click', async () => {
      const phone = phoneInput.value.trim();
      feedback.textContent = "";
      if (!phone) return feedback.textContent = "Enter your phone number.";

      try {
        // ✅ Check allowed numbers from DB
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "allowedNumbers"));
        let allowed = false;
        snapshot.forEach(childSnap => {
          if (childSnap.val() === phone) allowed = true;
        });

        if (!allowed) {
          feedback.textContent = "❌ This number is not authorized.";
          feedback.style.color = "red";
          return;
        }

        // ✅ Send OTP
        confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
        feedback.textContent = "✅ OTP sent successfully!";
        feedback.style.color = "green";
        otpInput.style.display = "block";
        verifyBtn.style.display = "block";

      } catch (error) {
        console.error(error);
        feedback.textContent = "⚠️ " + error.message;
        feedback.style.color = "red";
      }
    });

    verifyBtn.addEventListener('click', async () => {
      const code = otpInput.value.trim();
      if (!code) return feedback.textContent = "Enter the OTP.";

      try {
        await confirmationResult.confirm(code);
        feedback.textContent = "✅ OTP Verified!";
        feedback.style.color = "green";
        setTimeout(() => window.location.href = "qrcodeveryfication.html", 1200);
      } catch (error) {
        feedback.textContent = "❌ Invalid OTP.";
        feedback.style.color = "red";
      }
    });
  