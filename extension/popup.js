const PROFILE_KEY = "sponsorlens_student_profile";

const DEMO_TEXT = {
  strong:
    "Marketing Analytics Intern. International students encouraged. OPT candidates welcome. CPT eligible. Internship program. E-Verify employer. Entry level role.",
  risky:
    "Business Analyst Intern. Must be authorized to work in the U.S. Work authorization required. Sponsorship status unclear. Full-time conversion possible. Candidates may be asked about future sponsorship needs.",
  low:
    "Strategy Analyst. U.S. citizens only. Security clearance required. Must be permanently authorized to work in the United States. We do not sponsor visas now or in the future."
};

const analyzer = window.SponsorLensAnalyzer;

const analyzeBtn = document.getElementById("analyzeBtn");
const statusText = document.getElementById("statusText");
const resultCard = document.getElementById("resultCard");
const fitLabel = document.getElementById("fitLabel");
const scoreBadge = document.getElementById("scoreBadge");
const textLength = document.getElementById("textLength");
const reasonsList = document.getElementById("reasonsList");
const phrasesList = document.getElementById("phrasesList");
const contradictionsList = document.getElementById("contradictionsList");
const recommendedAction = document.getElementById("recommendedAction");
const recruiterMessage = document.getElementById("recruiterMessage");
const timeSaved = document.getElementById("timeSaved");
const disclaimerText = document.getElementById("disclaimerText");

const fields = {
  currentStatus: document.getElementById("currentStatus"),
  workPath: document.getElementById("workPath"),
  lookingFor: document.getElementById("lookingFor"),
  needsSponsorship: document.getElementById("needsSponsorship")
};

async function loadProfile() {
  const stored = await chrome.storage.local.get(PROFILE_KEY);
  const profile = stored[PROFILE_KEY] || {
    currentStatus: "F-1",
    workPath: "CPT seeking",
    lookingFor: "Internship",
    needsSponsorship: "Yes"
  };

  Object.entries(fields).forEach(([key, el]) => {
    el.value = profile[key] || el.value;
    el.addEventListener("change", saveProfile);
  });
}

function getProfile() {
  return {
    currentStatus: fields.currentStatus.value,
    workPath: fields.workPath.value,
    lookingFor: fields.lookingFor.value,
    needsSponsorship: fields.needsSponsorship.value,
    needsFutureSponsorship: fields.needsSponsorship.value
  };
}

async function saveProfile() {
  await chrome.storage.local.set({ [PROFILE_KEY]: getProfile() });
  setStatus("Profile saved locally.");
}

function setStatus(text) {
  statusText.textContent = text;
}

function renderList(listEl, items, emptyText) {
  listEl.innerHTML = "";
  const values = items.length ? items : [emptyText];
  values.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    listEl.appendChild(li);
  });
}

function setAnalyzingState(isAnalyzing) {
  analyzeBtn.disabled = isAnalyzing;
  analyzeBtn.textContent = isAnalyzing ? "Analyzing visible job text..." : "Analyze this job";
}

function renderAnalysis(result, sourceText) {
  resultCard.classList.remove("hidden", "strong", "risky", "low");
  resultCard.classList.add(result.fit);

  fitLabel.textContent = `${result.label} (${result.score}/100)`;
  scoreBadge.textContent = String(result.score);
  textLength.textContent = `Analyzed ${sourceText.length.toLocaleString()} characters from this page.`;

  renderList(reasonsList, result.reasons, "No additional context available.");
  renderList(phrasesList, result.detected_phrases, "No tracked work-authorization phrases detected.");
  renderList(contradictionsList, result.contradictions, "No direct contradictions detected.");

  recommendedAction.textContent = result.recommended_action;
  recruiterMessage.value = result.recruiter_message;
  disclaimerText.textContent = result.short_disclaimer || result.disclaimer;

  timeSaved.textContent =
    result.time_saved_minutes === 25
      ? "Estimated time saved: 25 minutes before completing a long application"
      : `Estimated time saved: ${result.time_saved_minutes} minutes`;
}

async function extractPageText(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"]
  });

  const response = await chrome.tabs.sendMessage(tabId, { type: "SPONSORLENS_EXTRACT" });
  return response?.pageText || "";
}

async function analyzeCurrentTab() {
  setAnalyzingState(true);
  setStatus("Analyzing visible job text...");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      setStatus("No active tab found. Open a job page and try again.");
      return;
    }

    const pageText = await extractPageText(tab.id);
    if (!pageText || pageText.length < 30) {
      setStatus("Could not extract enough text from this page. Try Demo Mode.");
      return;
    }

    const result = analyzer.analyzeJobText(pageText, getProfile());
    renderAnalysis(result, pageText);
    setStatus("Analysis complete.");
  } catch (error) {
    console.error(error);
    setStatus("Extraction failed on this page. Try Demo Mode for a reliable walkthrough.");
  } finally {
    setAnalyzingState(false);
  }
}

function runDemo(mode) {
  const text = DEMO_TEXT[mode] || "";
  const result = analyzer.analyzeJobText(text, getProfile());
  renderAnalysis(result, text);
  setStatus(`Demo analysis complete (${mode}).`);
}

async function copyMessage() {
  const text = recruiterMessage.value.trim();
  if (!text) return;
  await navigator.clipboard.writeText(text);
  setStatus("Recruiter-safe message copied.");
}

analyzeBtn.addEventListener("click", analyzeCurrentTab);

document.querySelectorAll("[data-demo]").forEach((btn) => {
  btn.addEventListener("click", () => runDemo(btn.dataset.demo));
});

document.getElementById("copyBtn").addEventListener("click", () => {
  copyMessage().catch(() => setStatus("Copy failed. Please select and copy manually."));
});

loadProfile().catch((error) => {
  console.error(error);
  setStatus("Could not load profile settings.");
});
