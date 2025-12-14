

    (function() {
      const password = document.getElementById('password');
      const btn = document.getElementById('verifyBtn');
      const feedback = document.getElementById('feedback');
      const overlay = document.getElementById('loaderOverlay');
      const loaderText = document.getElementById('loaderText');
      const CORRECT_PASSWORD = 'Sudhanshu100@112';

      const steps = [
        "Validating environment integrity…",
        "Checking cryptographic signatures…",
        "Comparing password hash…",
        "Finalizing result…"
      ];

      function showOverlay() {
        overlay.style.display = 'flex';
        let i = 0;
        function next() {
          if (i < steps.length) {
            loaderText.textContent = steps[i];
            i++;
            setTimeout(next, 1000);
          } else {
            verifyResult();
          }
        }
        next();
      }

      function verifyResult() {
        const val = password.value.trim();
        if (val === CORRECT_PASSWORD) {
          loaderText.textContent = "✅ Password Verified — Redirecting…";
          sessionStorage.setItem('admin_entered_password', val);
          setTimeout(() => {
            overlay.style.display = 'none';
            window.location.href = 'dwcadmin passkey veryfication.html';
          }, 1200);
        } else {
          loaderText.textContent = "❌ Verification Failed — Please retry.";
          setTimeout(() => {
            overlay.style.display = 'none';
            feedback.textContent = "Wrong password! Try again.";
            feedback.style.color = "red";
          }, 1000);
        }
      }

      btn.addEventListener('click', () => {
        const val = password.value.trim();
        if (!val) {
          feedback.textContent = "Please enter a password.";
          feedback.style.color = "red";
          return;
        }
        feedback.textContent = "";
        showOverlay();
      });

      password.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          btn.click();
        }
      });

      // Disable inspect tools
      document.addEventListener('contextmenu', e => e.preventDefault());
      document.addEventListener('keydown', e => {
        if (e.ctrlKey && ['c','v','u','s'].includes(e.key.toLowerCase())) e.preventDefault();
        if (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) e.preventDefault();
        if (e.key === 'F12') e.preventDefault();
      });
    })();
