// ===============================
// DASHBOARD LIVE UPDATES
// ===============================

async function updateDashboard() {
  try {
    const res = await fetch("/dashboard");
    const data = await res.json();

    document.getElementById("user_id").innerText = data.user_id;
    document.getElementById("balance").innerText = data.balance.toFixed(2);
    document.getElementById("profit").innerText = data.profit.toFixed(2);
    document.getElementById("kyc").innerText = data.kyc;

  } catch (err) {
    console.error("Error updating dashboard:", err);
  }
}

// Update dashboard every 5 seconds
setInterval(updateDashboard, 5000);
updateDashboard();


// ===============================
// COUNTDOWN TIMER FOR PENDING ACTIONS
// ===============================

function startCountdown(id, durationSeconds) {
  const display = document.getElementById(id);
  let timer = durationSeconds;

  const interval = setInterval(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    display.innerText = `${minutes}m ${seconds}s`;

    if (timer <= 0) {
      clearInterval(interval);
      display.innerText = "Time expired";
    }

    timer--;
  }, 1000);
}

const kycEl = document.getElementById("kyc");
if (data.kyc === "approved") kycEl.style.color = "green";
else if (data.kyc === "pending") kycEl.style.color = "orange";
else if (data.kyc === "rejected") kycEl.style.color = "red";


// Example usage:
// startCountdown("depositCountdown", 900); // 15 minutes
// startCountdown("kycCountdown", 900); // 15 minutes
