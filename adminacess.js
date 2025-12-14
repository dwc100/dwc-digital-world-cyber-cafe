/* Stored Credentials */
const pass1 = "Sudhanshu100@112";
const pass2 = "Sudhanshu100@100";   
const pinCode = "888088";           
/* Security Control */
let tries = localStorage.getItem("tries") ? parseInt(localStorage.getItem("tries")) : 0;
let lockTime = localStorage.getItem("lockTime") ? parseInt(localStorage.getItem("lockTime")) : 0;

function startCountdown(){
  const msg=document.getElementById("msg");
  let x=setInterval(()=>{
    let remain = lockTime - Date.now();
    if(remain <= 0){
      clearInterval(x);
      msg.textContent = "🔓 You can try again now.";
      localStorage.setItem("tries", 0);
      return;
    }
    msg.className="msg error";
    msg.textContent = `⏳ Locked! Try again in ${Math.ceil(remain/1000)}s`;
  },1000);
}
if(Date.now() < lockTime) startCountdown();
/* STEP 1 */
function verifyStep1(){
  if(Date.now() < lockTime){startCountdown();return;}
  const val = document.getElementById("passkey").value.trim();
  const msg = document.getElementById("msg");

  if(val === pass1){
    msg.textContent = "✔ Passkey Verified";
    msg.className = "msg success";
    goStep(2);
  } else handleFail();
}

/* STEP 2 */
function verifyStep2(){
  if(Date.now() < lockTime){startCountdown();return;}
  const val = document.getElementById("password2").value.trim();
  const msg = document.getElementById("msg");

  if(val === pass2){
    msg.textContent = "✔ Password Verified";
    msg.className = "msg success";
    goStep(3);
  } else handleFail();
}

/* STEP 3 */
function verifyStep3(){
  if(Date.now() < lockTime){startCountdown();return;}
  const val = document.getElementById("pin").value.trim();
  const msg = document.getElementById("msg");

  if(val === pinCode){
    msg.textContent = "✔ PIN Verified — Access Granted!";
    msg.className = "msg success";
    localStorage.setItem("tries", 0);
    setTimeout(()=>location.href="admineloginpagepasswordverification.html", 800);
  } else handleFail();
}

/* Fail Handler */
function handleFail(){
  const msg = document.getElementById("msg");
  tries++; localStorage.setItem("tries", tries);

  if(tries >= 3){
    lockTime = Date.now() + (3 * 60 * 1000);
    localStorage.setItem("lockTime", lockTime);
    msg.textContent = "🚫 3 Wrong Attempts! Locked for 3 minutes.";
    msg.className = "msg error";
    startCountdown();
  } else {
    msg.textContent = `❌ Wrong Input! (${tries}/3)`;
    msg.className = "msg error";
  }
}

/* Step Switcher */
function goStep(step){
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step3").classList.add("hidden");

  if(step === 2){
    document.getElementById("step2").classList.remove("hidden");
    document.getElementById("stepTitle").textContent = "STEP 02 — PASSWORD";
  }
  if(step === 3){
    document.getElementById("step3").classList.remove("hidden");
    document.getElementById("stepTitle").textContent = "STEP 03 — PIN";
  }
}