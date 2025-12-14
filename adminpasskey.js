    (function() {
      const passInput = document.getElementById('passkeyInput');
      const btn = document.getElementById('verifyBtn');
      const feedback = document.getElementById('feedback');
      const overlay = document.getElementById('loaderOverlay');
      const loaderText = document.getElementById('loaderText');

      const CORRECT_PASSKEY = 'Sudhanshudwc';
      const steps = [
        "Scanning security tokens…",
        "Encrypting passkey data…",
        "Matching encrypted hash…",
        "Authorizing user access…"
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
        const val = passInput.value.trim();
        if (val === CORRECT_PASSKEY) {
          loaderText.textContent = "✅ Passkey Verified — Access Granted";
          sessionStorage.setItem('verified_passkey', val);
          setTimeout(() => {
            overlay.style.display = 'none';
            window.location.href = 'adminotp.html';
          }, 1200);
        } else {
          loaderText.textContent = "❌ Wrong Passkey — Retry.";
          setTimeout(() => {
            overlay.style.display = 'none';
            feedback.textContent = "Wrong Passkey! Try again.";
            feedback.style.color = "red";
          }, 1000);
        }
      }

      btn.addEventListener('click', () => {
        const val = passInput.value.trim();
        if (!val) {
          feedback.textContent = "Please enter your Passkey.";
          feedback.style.color = "red";
          return;
        }
        feedback.textContent = "";
        showOverlay();
      });

      passInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          btn.click();
        }
      });

      document.addEventListener('contextmenu', e => e.preventDefault());
      document.addEventListener('keydown', e => {
        if (e.ctrlKey && ['c','v','u','s'].includes(e.key.toLowerCase())) e.preventDefault();
        if (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) e.preventDefault();
        if (e.key === 'F12') e.preventDefault();
      });
    })();
  