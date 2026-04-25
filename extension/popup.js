const PROFILE_KEY = "sponsorlens_student_profile";
const SAVED_JOBS_KEY = "sponsorlens_saved_jobs";

const DEMO_TEXT = {
  strong: "Marketing Analytics Intern. International students encouraged. OPT candidates welcome. CPT eligible. Internship program. E-Verify employer. Entry level role.",
  risky: "Business Analyst Intern. Must be authorized to work in the U.S. Work authorization required. Sponsorship status unclear. Full-time conversion possible. Candidates may be asked about future sponsorship needs.",
  low: "Strategy Analyst. U.S. citizens only. Security clearance required. Must be permanently authorized to work in the United States. We do not sponsor visas now or in the future."
};

const analyzer = window.SponsorLensAnalyzer;
const storageTools = window.SponsorLensStorage;
let currentAnalysis = null;
let selectedMessageVariant = "polite";
let savedJobs = [];

const el = {
  analyzeBtn: document.getElementById("analyzeBtn"),
  saveBtn: document.getElementById("saveBtn"),
  copyBtn: document.getElementById("copyBtn"),
  statusText: document.getElementById("statusText"),
  resultCard: document.getElementById("resultCard"),
  fitLabel: document.getElementById("fitLabel"),
  scoreBadge: document.getElementById("scoreBadge"),
  jobMetaLine: document.getElementById("jobMetaLine"),
  textLength: document.getElementById("textLength"),
  qualityLine: document.getElementById("qualityLine"),
  confidenceLine: document.getElementById("confidenceLine"),
  demoHint: document.getElementById("demoHint"),
  reasonsList: document.getElementById("reasonsList"),
  topEvidenceList: document.getElementById("topEvidenceList"),
  phrasesList: document.getElementById("phrasesList"),
  contradictionsList: document.getElementById("contradictionsList"),
  recommendedAction: document.getElementById("recommendedAction"),
  recruiterMessage: document.getElementById("recruiterMessage"),
  timeSaved: document.getElementById("timeSaved"),
  disclaimerText: document.getElementById("disclaimerText"),
  savedSummary: document.getElementById("savedSummary"),
  savedJobsList: document.getElementById("savedJobsList"),
  exportSavedBtn: document.getElementById("exportSavedBtn"),
  clearSavedBtn: document.getElementById("clearSavedBtn")
};

const fields = {
  currentStatus: document.getElementById("currentStatus"),
  workPath: document.getElementById("workPath"),
  lookingFor: document.getElementById("lookingFor"),
  needsSponsorship: document.getElementById("needsSponsorship")
};

function setStatus(text) {
  el.statusText.textContent = text;
}

function setAnalyzingState(isAnalyzing) {
  el.analyzeBtn.disabled = isAnalyzing;
  el.analyzeBtn.textContent = isAnalyzing ? "Analyzing visible job text..." : "Analyze this job";
}

function renderList(listEl, items, emptyText) {
  listEl.innerHTML = "";
  const values = items && items.length ? items : [emptyText];
  values.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    listEl.appendChild(li);
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

async function loadProfile() {
  const stored = await chrome.storage.local.get(PROFILE_KEY);
  const profile = stored[PROFILE_KEY] || { currentStatus: "F-1", workPath: "CPT seeking", lookingFor: "Internship", needsSponsorship: "Yes" };
  Object.entries(fields).forEach(([key, input]) => {
    input.value = profile[key] || input.value;
    input.addEventListener("change", saveProfile);
  });
}

async function loadSavedJobs() {
  const stored = await chrome.storage.local.get(SAVED_JOBS_KEY);
  savedJobs = Array.isArray(stored[SAVED_JOBS_KEY]) ? stored[SAVED_JOBS_KEY] : [];
  renderSavedJobs();
}

async function persistSavedJobs() {
  await chrome.storage.local.set({ [SAVED_JOBS_KEY]: savedJobs });
  renderSavedJobs();
}

function renderSavedJobs() {
  if (!storageTools) return;
  const summary = storageTools.summarizeSavedJobs(savedJobs);
  el.savedSummary.textContent = `Strong: ${summary.strong} · Risky: ${summary.risky} · Low: ${summary.low} · Total time saved: ${summary.totalTimeSaved} min`;

  el.savedJobsList.innerHTML = "";
  if (summary.lastFive.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No saved analyses yet.";
    el.savedJobsList.appendChild(li);
    return;
  }

  summary.lastFive.forEach((job) => {
    const li = document.createElement("li");
    li.textContent = `${job.label} (${job.score}/100) — ${job.jobTitle} @ ${job.company}`;
    el.savedJobsList.appendChild(li);
  });
}

function getMessageForVariant(result, variant) {
  if (!result.recruiter_message_variants) return result.recruiter_message;
  return result.recruiter_message_variants[variant] || result.recruiter_message_variants.polite || result.recruiter_message;
}

function renderSelectedMessage() {
  if (!currentAnalysis) return;
  el.recruiterMessage.value = getMessageForVariant(currentAnalysis.result, selectedMessageVariant);
}

function renderAnalysis(result, extractionMeta) {
  currentAnalysis = { result, extractionMeta };
  el.resultCard.classList.remove("hidden", "strong", "risky", "low");
  el.resultCard.classList.add(result.fit);

  el.fitLabel.textContent = `Verdict: ${result.label}`;
  el.scoreBadge.textContent = `${result.score}/100`;
  el.jobMetaLine.textContent = `Job: ${extractionMeta.title || extractionMeta.heading || "Unknown title"} · Company: ${extractionMeta.company || "Unknown company"}`;
  el.textLength.textContent = `Analyzed ${Number(extractionMeta.charCount || 0).toLocaleString()} characters.`;
  el.qualityLine.textContent = `Extraction quality: ${extractionMeta.extractionQuality || "failed"} (${extractionMeta.source || "unknown source"})`;
  el.confidenceLine.textContent = `Confidence: ${result.confidence || "medium"} · Evidence level: ${result.evidence_level || "limited"}`;
  el.demoHint.classList.toggle("hidden", extractionMeta.extractionQuality !== "limited");

  renderList(el.topEvidenceList, result.top_evidence, "No top evidence extracted.");
  renderList(el.reasonsList, result.reasons, "No additional context available.");
  renderList(el.phrasesList, result.detected_phrases, "No tracked work-authorization phrases detected.");
  renderList(el.contradictionsList, result.contradictions, "No direct contradictions detected.");

  el.recommendedAction.textContent = result.recommended_action;
  renderSelectedMessage();
  el.disclaimerText.textContent = result.short_disclaimer || result.disclaimer;
  el.timeSaved.textContent = result.time_saved_minutes === 25 ? "Estimated time saved: 25 minutes before completing a long application" : `Estimated time saved: ${result.time_saved_minutes} minutes`;
}

async function extractPageText(tabId) {
  await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
  const response = await chrome.tabs.sendMessage(tabId, { type: "SPONSORLENS_EXTRACT" });
  if (!response || typeof response !== "object") {
    return { pageText: "", title: "", heading: "", company: "", url: "", source: "none", charCount: 0, extractionQuality: "failed" };
  }
  return {
    pageText: response.pageText || "",
    title: response.title || "",
    heading: response.heading || "",
    company: response.company || "",
    url: response.url || "",
    source: response.source || "unknown",
    charCount: Number(response.charCount || 0),
    extractionQuality: response.extractionQuality || "failed"
  };
}

async function analyzeCurrentTab() {
  if (!analyzer || typeof analyzer.analyzeJobText !== "function" || !storageTools) {
    setStatus("Analyzer or storage tools unavailable. Reload the extension and try again.");
    return;
  }

  setAnalyzingState(true);
  setStatus("Analyzing visible job text...");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      setStatus("No active tab found. Open a job page and try again.");
      return;
    }

    const extraction = await extractPageText(tab.id);
    if (!extraction.pageText || extraction.extractionQuality === "failed") {
      setStatus("Could not read this page. Try Demo Mode or open a full job posting page.");
      return;
    }

    const result = analyzer.analyzeJobText(extraction.pageText, { ...getProfile(), __extractionQuality: extraction.extractionQuality });
    renderAnalysis(result, extraction);
    setStatus(extraction.extractionQuality === "limited" ? "Analysis complete with limited extraction quality." : "Analysis complete.");
  } catch (error) {
    console.error(error);
    setStatus("Could not read this page. Try Demo Mode or open a full job posting page.");
  } finally {
    setAnalyzingState(false);
  }
}

function runDemo(mode) {
  if (!analyzer || typeof analyzer.analyzeJobText !== "function") {
    setStatus("Analyzer unavailable. Reload extension and retry.");
    return;
  }
  const text = DEMO_TEXT[mode] || "";
  const result = analyzer.analyzeJobText(text, { ...getProfile(), __extractionQuality: "good" });
  renderAnalysis(result, {
    pageText: text,
    title: `${mode.toUpperCase()} Demo Role`,
    heading: `${mode.toUpperCase()} Demo Role`,
    company: "Demo Company",
    url: "demo://local",
    source: `demo:${mode}`,
    charCount: text.length,
    extractionQuality: "good"
  });
  setStatus(`Demo analysis complete (${mode}).`);
}

async function saveCurrentAnalysis() {
  if (!currentAnalysis || !storageTools) {
    setStatus("Run an analysis before saving.");
    return;
  }

  const { result, extractionMeta } = currentAnalysis;
  const record = storageTools.sanitizeSavedJob({
    jobTitle: extractionMeta.title || extractionMeta.heading,
    company: extractionMeta.company,
    pageUrl: extractionMeta.url,
    fit: result.fit,
    score: result.score,
    label: result.label,
    detected_phrases: result.detected_phrases,
    contradictions: result.contradictions,
    recommended_action: result.recommended_action,
    time_saved_minutes: result.time_saved_minutes,
    analyzedAt: new Date().toISOString()
  });

  savedJobs = [record, ...savedJobs].slice(0, 200);
  await persistSavedJobs();
  setStatus("Analysis saved locally.");
}

async function exportSavedJobs() {
  if (!storageTools) return;
  const jsonText = storageTools.toExportJson(savedJobs);
  try {
    await navigator.clipboard.writeText(jsonText);
    setStatus("Saved jobs JSON copied to clipboard.");
  } catch (_error) {
    setStatus("Export failed to copy. Try again or check clipboard permissions.");
  }
}

async function clearSavedJobs() {
  savedJobs = [];
  await persistSavedJobs();
  setStatus("Saved jobs cleared.");
}

async function copyMessage() {
  const text = el.recruiterMessage.value.trim();
  if (!text) {
    setStatus("No message to copy yet.");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    setStatus("Selected message copied.");
  } catch (_err) {
    setStatus("Copy failed. Please select the text and copy manually.");
  }
}

el.analyzeBtn.addEventListener("click", analyzeCurrentTab);
el.saveBtn.addEventListener("click", saveCurrentAnalysis);
el.copyBtn.addEventListener("click", copyMessage);
el.exportSavedBtn.addEventListener("click", exportSavedJobs);
el.clearSavedBtn.addEventListener("click", clearSavedJobs);

document.querySelectorAll("[data-demo]").forEach((btn) => btn.addEventListener("click", () => runDemo(btn.dataset.demo)));
document.querySelectorAll("[data-variant]").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedMessageVariant = btn.dataset.variant;
    renderSelectedMessage();
  });
});

Promise.all([loadProfile(), loadSavedJobs()]).catch((error) => {
  console.error(error);
  setStatus("Initialization failed. Reload extension and try again.");
});
