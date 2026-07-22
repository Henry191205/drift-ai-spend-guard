const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const urgeInput = document.getElementById("urge");
const daysInput = document.getElementById("daysUntilPayday");
const timeInput = document.getElementById("timeOfDay");
const stateInput = document.getElementById("state");
const urgeValue = document.getElementById("urgeValue");
const form = document.getElementById("predictor-form");
const riskLabel = document.getElementById("riskLabel");
const riskBar = document.getElementById("riskBar");
const riskPercent = document.getElementById("riskPercent");
const suggestedDelay = document.getElementById("suggestedDelay");
const recommendation = document.getElementById("recommendation");
const alternative = document.getElementById("alternative");
const submitButton = document.querySelector(".submit-button");
const resultPanel = document.getElementById("resultPanel");
const buttonText = submitButton?.querySelector(".btn-text");

const categoryRisk = {
  essential: 4,
  food: 24,
  travel: 28,
  shopping: 38,
  entertainment: 45,
};

const timeRisk = {
  morning: 5,
  afternoon: 9,
  evening: 18,
  lateNight: 32,
};

const stateRisk = {
  stable: 6,
  stressed: 28,
  tired: 20,
};

function scoreRisk(amount, category, urge, days, time, state) {
  const base = (Math.log10(amount + 1) / Math.log10(10000)) * 20;
  const urgency = Number(urge) * 4;
  const budgetFatigue = Math.max(0, 18 - Number(days));
  const risk =
    base +
    urgency +
    categoryRisk[category] +
    timeRisk[time] +
    stateRisk[state] +
    budgetFatigue;
  return Math.max(0, Math.min(100, Math.round(risk)));
}

function delaySuggestion(score, category, urge) {
  if (score >= 80) return `${Math.max(4, Math.min(12, urge)) * 10} min hold`;
  if (score >= 60) return "5 min pause + budget check";
  if (score >= 40) return "3 min reflection timer";
  return "No delay needed";
}

function alternateSuggestion(category, score) {
  const highPriority = {
    essential: "Pay now if truly needed, then track in essentials category.",
    food: "Make a lower-cost meal plan and order a shared version.",
    shopping: "Move item to wishlist and revisit after one cycle of sleep.",
    entertainment: "Switch to a free alternative before committing.",
    travel: "Book after checking upcoming weekly cash buffer.",
  };

  if (score >= 70) {
    return highPriority[category] || "Revisit this decision after 10 minutes.";
  }
  if (score >= 45) {
    return "Compare with your monthly priority list and decide once.";
  }
  return "Complete purchase if it aligns with your planned budget.";
}

function recommendationText(score, category, amount, altSuggestion) {
  if (score >= 80) {
    return `High impulse risk for INR ${amount} in ${category}. ${altSuggestion}`;
  }
  if (score >= 60) {
    return "Likely impulse pattern detected. Drift recommends a short delay and a re-check of your monthly budget.";
  }
  if (score >= 40) {
    return "Moderate risk. Consider a 3-minute pause and one clarifying question: 'Will this purchase improve my week?'.";
  }
  return "Risk is manageable. You are likely making a controlled decision.";
}

function describeRisk(score) {
  if (score >= 80) return "Very high risk";
  if (score >= 60) return "High risk";
  if (score >= 40) return "Watchful risk";
  if (score >= 20) return "Mild risk";
  return "Low risk";
}

urgeValue.textContent = urgeInput.value;

urgeInput.addEventListener("input", () => {
  urgeValue.textContent = urgeInput.value;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = Number(amountInput.value || 0);
  const category = categoryInput.value;
  const urge = Number(urgeInput.value || 0);
  const days = Number(daysInput.value || 0);
  const time = timeInput.value;
  const state = stateInput.value;

  submitButton?.classList.add("is-processing");
  resultPanel?.classList.add("processing");
  if (submitButton) submitButton.disabled = true;
  if (buttonText) buttonText.textContent = "Analyzing";
  riskLabel.textContent = "Analyzing contextual signals";
  riskPercent.textContent = "processing..";
  suggestedDelay.textContent = "estimating...";
  alternative.textContent = "running policy rules";
  recommendation.textContent = "Drift is reading your inputs and calibrating risk.";

  setTimeout(() => {
    const score = scoreRisk(amount, category, urge, days, time, state);
    const delay = delaySuggestion(score, category, urge);
    const alt = alternateSuggestion(category, score);

    riskPercent.textContent = `${score}%`;
    riskLabel.textContent = describeRisk(score);
    riskBar.style.width = `${score}%`;
    suggestedDelay.textContent = delay;
    alternative.textContent = alt;
    recommendation.textContent = recommendationText(score, category, amount, alt);

    recommendation.style.color = score >= 60 ? "var(--danger)" : "var(--ink)";
    submitButton?.classList.remove("is-processing");
    resultPanel?.classList.remove("processing");
    if (buttonText) buttonText.textContent = "Run inference";
    if (submitButton) submitButton.disabled = false;
  }, 700);
});
