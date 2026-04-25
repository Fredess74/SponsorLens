const assert = require("assert");
const { analyzeJobText } = require("../extension/analyzer.js");

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

run("Strong Fit case", () => {
  const text = "OPT candidates welcome. CPT eligible. International students encouraged. E-Verify employer.";
  const result = analyzeJobText(text, profile({ needsFutureSponsorship: "No" }));
  assert.strictEqual(result.fit, "strong");
  assert.ok(result.score >= 80);
  assert.ok(result.detected_phrases.includes("opt candidates welcome"));
  assert.ok(result.detected_phrases.includes("cpt eligible"));
  assert.strictEqual(result.contradictions.length, 0);
});

run("Risky Fit case", () => {
  const text = "Business Analyst Internship. Must be authorized to work in the U.S. Work authorization required. Future sponsorship may be discussed.";
  const result = analyzeJobText(text, profile({ needsFutureSponsorship: "No" }));
  assert.strictEqual(result.fit, "risky");
  assert.ok(result.score >= 45 && result.score <= 79);
  assert.ok(result.detected_phrases.includes("must be authorized to work in the u.s."));
  assert.ok(result.detected_phrases.includes("work authorization required"));
  assert.ok(result.recommended_action.toLowerCase().includes("clarify"));
});

run("Low Fit case", () => {
  const text = "U.S. citizens only. Security clearance required. We do not sponsor visas now or in the future.";
  const result = analyzeJobText(text, profile());
  assert.strictEqual(result.fit, "low");
  assert.ok(result.score < 45);
  assert.ok(result.detected_phrases.includes("u.s. citizens only"));
  assert.ok(result.detected_phrases.includes("security clearance required"));
  assert.strictEqual(result.time_saved_minutes, 40);
});

run("Contradiction case", () => {
  const text = "Visa sponsorship available for selected roles. No visa sponsorship for this position.";
  const result = analyzeJobText(text, profile());
  assert.ok(result.contradictions.length > 0);
  assert.notStrictEqual(result.fit, "strong");
  assert.ok(result.reasons.some((r) => /conflicting work-authorization signals|confirm with the recruiter/i.test(r)));
});

run("Student profile STEM OPT adjustment case", () => {
  const text = "Work authorization required. E-Verify employer. STEM OPT support discussed during process.";
  const withStem = analyzeJobText(text, profile({ workPath: "STEM OPT eligible" }));
  const withoutStem = analyzeJobText(text, profile({ workPath: "Unsure" }));
  assert.ok(withStem.score > withoutStem.score);
});

run("Future sponsorship penalty case", () => {
  const text = "This role will not sponsor now or in the future.";
  const withNeed = analyzeJobText(text, profile({ needsFutureSponsorship: "Yes" }));
  const unsure = analyzeJobText(text, profile({ needsFutureSponsorship: "Unsure" }));
  assert.ok(withNeed.score < unsure.score);
  assert.strictEqual(withNeed.fit, "low");
});

run("Empty/weak extraction case", () => {
  const result = analyzeJobText("", profile());
  assert.ok(["risky", "low"].includes(result.fit));
  assert.ok(result.reasons.some((r) => /limited visible job text|no explicit sponsorship signals/i.test(r)));
});

run("Case-insensitivity case", () => {
  const text = "u.S. CiTiZeNs OnLy";
  const result = analyzeJobText(text, profile());
  assert.ok(result.detected_phrases.includes("u.s. citizens only"));
  assert.strictEqual(result.fit, "low");
});

console.log("All analyzer tests passed.");
