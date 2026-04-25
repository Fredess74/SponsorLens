(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SponsorLensStorage = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function sanitizeSavedJob(input) {
    return {
      jobTitle: input.jobTitle || "Unknown title",
      company: input.company || "Unknown company",
      pageUrl: input.pageUrl || "",
      fit: input.fit,
      score: Number(input.score || 0),
      label: input.label || "",
      detected_phrases: Array.isArray(input.detected_phrases) ? input.detected_phrases.slice(0, 25) : [],
      contradictions: Array.isArray(input.contradictions) ? input.contradictions.slice(0, 15) : [],
      recommended_action: input.recommended_action || "",
      time_saved_minutes: Number(input.time_saved_minutes || 0),
      analyzedAt: input.analyzedAt || new Date().toISOString()
    };
  }

  function summarizeSavedJobs(items) {
    const summary = {
      strong: 0,
      risky: 0,
      low: 0,
      totalTimeSaved: 0,
      lastFive: []
    };

    (items || []).forEach((item) => {
      if (item.fit === "strong") summary.strong += 1;
      if (item.fit === "risky") summary.risky += 1;
      if (item.fit === "low") summary.low += 1;
      summary.totalTimeSaved += Number(item.time_saved_minutes || 0);
    });

    summary.lastFive = (items || [])
      .slice()
      .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
      .slice(0, 5);

    return summary;
  }

  function toExportJson(items) {
    return JSON.stringify({ exportedAt: new Date().toISOString(), jobs: items || [] }, null, 2);
  }

  return {
    sanitizeSavedJob,
    summarizeSavedJobs,
    toExportJson
  };
});
