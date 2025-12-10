(function(){
  const bar = document.getElementById("bar");
  const error = document.getElementById("errorMsg");

  /* ---------------- DEVICE & NETWORK INFO ---------------- */
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const netType = connection && connection.effectiveType ? connection.effectiveType : "4g";
  const cores = navigator.hardwareConcurrency || 4;
  const deviceMemory = navigator.deviceMemory || 4; // in GB

  /* Performance factor based on cores & memory */
  let perfFactor = 1;
  if(cores >= 8) perfFactor *= 0.7;
  else if(cores >= 4) perfFactor *= 0.9;
  else perfFactor *= 1.2;

  if(deviceMemory >= 8) perfFactor *= 0.85;
  else if(deviceMemory >= 4) perfFactor *= 1;
  else perfFactor *= 1.2;

  /* Network-based duration */
  let baseDuration;
  switch(netType){
    case "slow-2g": baseDuration = 14000; break;
    case "2g": baseDuration = 10000; break;
    case "3g": baseDuration = 7000; break;
    case "4g": baseDuration = 4000; break;
    case "5g": baseDuration = 2500; break;
    default: baseDuration = 5000;
  }
  let duration = baseDuration * perfFactor;

  /* ---------------- PROGRESS BAR LOGIC ---------------- */
  let progress = 0;
  const step = 100 / (duration / 60);
  let timer;

  function startLoading(){
    clearInterval(timer);
    timer = setInterval(() => {
      if(!navigator.onLine){
        clearInterval(timer);
        bar.style.width = "0%";
        error.style.display = "block";
        return;
      }

      progress += step;
      progress = Math.min(progress, 100);

      // Smooth ease effect
      bar.style.transition = "width 0.06s ease-in-out";
      bar.style.width = progress + "%";

      if(progress >= 100){
        clearInterval(timer);
        document.body.style.transition = "opacity 0.6s ease";
        document.body.style.opacity = "0";
        setTimeout(()=>{ window.location.href="dwc.html"; }, 800);
      }
    }, 60);
  }

  // Page visibility pause/resume
  document.addEventListener("visibilitychange", () => {
    if(document.hidden) clearInterval(timer);
    else if(progress < 100 && navigator.onLine) startLoading();
  });

  /* ---------------- NETWORK HANDLING ---------------- */
  if(!navigator.onLine){
    error.style.display = "block";
  } else {
    error.style.display = "none";
    startLoading();
  }

  window.addEventListener("offline", ()=>{ clearInterval(timer); error.style.display="block"; });
  window.addEventListener("online", ()=>{ if(progress < 100){ error.style.display="none"; startLoading(); } });

  /* -------------------- SECURITY -------------------- */
  const forbiddenKeys = ["F12","U","S","A","C","X","P","I","J"];
  document.addEventListener("keydown", e => {
    if(
      e.key === "F12" ||
      (e.ctrlKey && forbiddenKeys.includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.shiftKey && ["I","J"].includes(e.key.toUpperCase()))
    ){
      e.preventDefault(); e.stopPropagation();
      console.warn("Shortcut disabled for security.");
      return false;
    }
  });

  document.addEventListener("contextmenu", e => e.preventDefault());
  document.addEventListener("copy", e => e.preventDefault());
  document.addEventListener("cut", e => e.preventDefault());
  document.addEventListener("paste", e => e.preventDefault());
  document.addEventListener("dragstart", e => e.preventDefault());
  document.addEventListener("selectstart", e => e.preventDefault());

  /* -------------------- DEVTOOLS DETECTION -------------------- */
  let devtoolsOpen = false;
  const devtoolsCheck = setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    if(widthThreshold || heightThreshold) {
      if(!devtoolsOpen){
        devtoolsOpen = true;
        console.warn("DevTools detected. Redirecting...");
        window.location.href = "about:blank";
      }
    } else {
      devtoolsOpen = false;
    }
  }, 1000);

  /* ---------------- DEVICE INFO LOG (Optional) ---------------- */
  console.log(`Network: ${netType}, Cores: ${cores}, Memory: ${deviceMemory}GB, PerfFactor: ${perfFactor.toFixed(2)}`);
})();
