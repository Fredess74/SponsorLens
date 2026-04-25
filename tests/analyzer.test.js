const assert = require("assert");
const { analyzeJobText } = require("../extension/analyzer.js");
const { sanitizeSavedJob, toExportJson } = require("../extension/storageHelpers.js");

function profile(overrides = {}) {
  return {
    currentStatus: "F-1",
    workPath: "OPT eligible",
    lookingFor: "Both",
    needsFutureSponsorship: "Unsure",
    ...overrides
  };
}

function run(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

run("output compatibility includes legacy and advanced fields", () => {
  const result = analyzeJobText("OPT candidates welcome", profile());
  ["fit", "label", "score", "detected_phrases", "contradictions", "reasons", "recommended_action", "recruiter_message", "time_saved_minutes", "disclaimer", "short_disclaimer", "confidence", "evidence_level", "signal_summary", "top_evidence"].forEach((field) => {
    assert.ok(field in result, `missing field ${field}`);
  });
});

run("confidence high/medium/low coverage", () => {
  const high = analyzeJobText("OPT candidates welcome. CPT eligible. International students encouraged. E-Verify employer. Entry level internship for early career applicants.", profile({ needsFutureSponsorship: "No", __extractionQuality: "good" }));
  const lowContradiction = analyzeJobText("Visa sponsorship available. No visa sponsorship.", profile({ __extractionQuality: "good" }));
  const lowShort = analyzeJobText("hi", profile({ __extractionQuality: "limited" }));
  assert.strictEqual(high.confidence, "high");
  assert.strictEqual(lowContradiction.confidence, "low");
  assert.strictEqual(lowShort.confidence, "low");
});

run("evidence level strong/mixed/limited", () => {
  const strong = analyzeJobText("OPT candidates welcome. CPT eligible. E-Verify employer. This internship is designed for early career talent and includes structured mentorship.", profile({ needsFutureSponsorship: "No", __extractionQuality: "good" }));
  const mixed = analyzeJobText("International students encouraged. U.S. citizens only. This role may involve policy-sensitive operations with strict authorization requirements and cross-functional oversight.", profile({ __extractionQuality: "good" }));
  const limited = analyzeJobText("Hello", profile({ __extractionQuality: "limited" }));
  assert.strictEqual(strong.evidence_level, "strong");
  assert.strictEqual(mixed.evidence_level, "mixed");
  assert.strictEqual(limited.evidence_level, "limited");
});

run("signal summary counts and contradiction count", () => {
  const result = analyzeJobText("Visa sponsorship available. No visa sponsorship. Work authorization required.", profile());
  assert.ok(result.signal_summary.positiveCount >= 1);
  assert.ok(result.signal_summary.hardNegativeCount >= 1);
  assert.ok(result.signal_summary.ambiguousCount >= 1);
  assert.ok(result.signal_summary.contradictionCount >= 1);
});

run("message variants safety and forbidden phrases absent", () => {
  const result = analyzeJobText("Work authorization required", profile());
  const variants = result.recruiter_message_variants;
  assert.ok(variants.short && variants.polite && variants.cover);
  [variants.short, variants.polite, variants.cover, result.recruiter_message].forEach((msg) => {
    ["free", "guaranteed", "forever", "no paperwork", "3 years", "you must consider me"].forEach((bad) => {
      assert.strictEqual(msg.toLowerCase().includes(bad), false);
    });
  });
});

run("contradiction reduces confidence", () => {
  const result = analyzeJobText("Visa sponsorship available. No visa sponsorship.", profile({ __extractionQuality: "good" }));
  assert.strictEqual(result.confidence, "low");
});

run("score always clamped", () => {
  const high = analyzeJobText("OPT candidates welcome. CPT eligible. International students encouraged. Visa sponsorship available. STEM OPT. E-Verify. Entry level. New grad.", profile({ needsFutureSponsorship: "No", workPath: "STEM OPT eligible", __extractionQuality: "good" }));
  const low = analyzeJobText("U.S. citizens only. Security clearance required. No visa sponsorship. Must be permanently authorized to work.", profile({ needsFutureSponsorship: "Yes", __extractionQuality: "good" }));
  assert.ok(high.score >= 0 && high.score <= 100);
  assert.ok(low.score >= 0 && low.score <= 100);
});

run("saved job object excludes full pageText", () => {
  const job = sanitizeSavedJob({
    jobTitle: "Analyst",
    company: "Demo",
    pageUrl: "https://example.com/job",
    fit: "risky",
    score: 60,
    label: "Risky Fit",
    detected_phrases: ["work authorization required"],
    contradictions: [],
    recommended_action: "Clarify",
    time_saved_minutes: 25,
    analyzedAt: "2026-01-01T00:00:00.000Z",
    pageText: "SHOULD_NOT_EXIST"
  });
  assert.ok(!Object.prototype.hasOwnProperty.call(job, "pageText"));
});

run("export format valid JSON", () => {
  const json = toExportJson([sanitizeSavedJob({ fit: "strong", score: 88, label: "Strong Fit", detected_phrases: [], contradictions: [], recommended_action: "Apply", time_saved_minutes: 0 })]);
  const parsed = JSON.parse(json);
  assert.ok(Array.isArray(parsed.jobs));
  assert.ok(parsed.exportedAt);
});

console.log("All analyzer advanced tests passed.");
