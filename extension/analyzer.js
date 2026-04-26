(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SponsorLensAnalyzer = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const DISCLAIMER_FULL =
    "SponsorLens is a non-commercial educational prototype. It does not provide legal, immigration, or employment advice. It does not guarantee visa sponsorship, job eligibility, or hiring outcomes. It provides general job-search guidance based on visible posting language.";

  const DISCLAIMER_SHORT = "Not legal advice. SponsorLens provides general job-search guidance only.";

  const SIGNALS = [
    { id: "visa_sponsorship_available", label: "visa sponsorship available", severity: "positive", score: 30, blockTag: "sponsorship_available", patterns: [/\bvisa\s+sponsorship\s+available\b/i] },
    { id: "sponsorship_available", label: "sponsorship available", severity: "positive", score: 25, requiresNoTag: "sponsorship_available", patterns: [/\bsponsorship\s+available\b/i] },
    { id: "opt_candidates_welcome", label: "OPT candidates welcome", severity: "positive", score: 30, patterns: [/\bopt\s+candidates?\s+welcome\b/i] },
    { id: "cpt_eligible", label: "CPT eligible", severity: "positive", score: 25, patterns: [/\bcpt\s+eligible\b/i] },
    { id: "cpt_candidates_welcome", label: "CPT candidates welcome", severity: "positive", score: 25, patterns: [/\bcpt\s+candidates?\s+welcome\b/i] },
    { id: "international_students_encouraged", label: "international students encouraged", severity: "positive", score: 25, patterns: [/\binternational\s+students?\s+encouraged\b/i] },
    { id: "stem_opt", label: "STEM OPT", severity: "positive", score: 20, patterns: [/\bstem\s*opt\b/i] },
    { id: "e_verify", label: "E-Verify", severity: "positive", score: 15, patterns: [/\be[-\s]?verify\b/i] },
    { id: "internship", label: "internship", severity: "positive", score: 10, patterns: [/\bintern(ship|s)?\b/i] },
    { id: "entry_level", label: "entry level", severity: "positive", score: 10, patterns: [/\bentry[-\s]?level\b/i] },
    { id: "new_grad", label: "new grad", severity: "positive", score: 10, patterns: [/\bnew\s+grad(uate)?s?\b/i] },
    { id: "early_career", label: "early career", severity: "positive", score: 10, patterns: [/\bearly\s+career\b/i] },

    { id: "us_citizens_only", label: "U.S. citizens only", severity: "hard_negative", score: -60, patterns: [/\bu\.?s\.?\s+citizens?\s+only\b/i, /\bus\s+citizens?\s+only\b/i] },
    { id: "us_citizenship_required", label: "U.S. citizenship required", severity: "hard_negative", score: -60, patterns: [/\bu\.?s\.?\s+citizenship\s+required\b/i, /\bunited\s+states\s+citizenship\s+required\b/i, /\bmust\s+be\s+a\s+u\.?s\.?\s+citizen\b/i] },
    { id: "security_clearance_required", label: "security clearance required", severity: "hard_negative", score: -50, patterns: [/\bsecurity\s+clearance\s+required\b/i, /\bactive\s+security\s+clearance\b/i] },
    { id: "eligible_for_security_clearance", label: "must be eligible for security clearance", severity: "hard_negative", score: -45, patterns: [/\bmust\s+be\s+eligible\s+for\s+security\s+clearance\b/i] },
    { id: "no_visa_sponsorship", label: "no visa sponsorship", severity: "hard_negative", score: -40, blockTag: "no_sponsorship", patterns: [/\bno\s+visa\s+sponsorship\b/i] },
    { id: "no_sponsorship_available", label: "no sponsorship available", severity: "hard_negative", score: -40, requiresNoTag: "no_sponsorship", blockTag: "no_sponsorship", patterns: [/\bno\s+sponsorship\s+available\b/i, /\bsponsorship\s+not\s+available\b/i, /\bwe\s+do\s+not\s+sponsor\b/i, /\bwe\s+are\s+unable\s+to\s+sponsor\b/i] },
    { id: "no_future_sponsorship", label: "will not sponsor now or in the future", severity: "hard_negative", score: -45, blockTag: "no_sponsorship", patterns: [/\bmust\s+not\s+require\s+sponsorship\s+now\s+or\s+in\s+the\s+future\b/i, /\bwill\s+not\s+sponsor\s+now\s+or\s+in\s+the\s+future\b/i] },
    { id: "permanently_authorized", label: "must be permanently authorized to work", severity: "hard_negative", score: -35, patterns: [/\bmust\s+be\s+permanently\s+authorized\s+to\s+work\b/i, /\bpermanent\s+work\s+authorization\s+required\b/i, /\bpermanent\s+work\s+authorization\b/i] },
    { id: "green_card_or_citizen", label: "green card or U.S. citizen", severity: "hard_negative", score: -50, patterns: [/\bgreen\s+card\s+or\s+u\.?s\.?\s+citizen\b/i, /\bcitizen\s+or\s+permanent\s+resident\b/i, /\blawful\s+permanent\s+resident\s+or\s+citizen\b/i] },

    { id: "authorized_to_work_us", label: "must be authorized to work in the U.S.", severity: "ambiguous", score: -10, patterns: [/\bmust\s+be\s+authorized\s+to\s+work\s+in\s+the\s+u\.?s\.?\b/i] },
    { id: "legally_authorized_us", label: "legally authorized to work in the United States", severity: "ambiguous", score: -10, patterns: [/\blegally\s+authorized\s+to\s+work\s+in\s+the\s+united\s+states\b/i] },
    { id: "work_authorization_required", label: "work authorization required", severity: "ambiguous", score: -10, patterns: [/\bwork\s+authorization\s+required\b/i, /\bemployment\s+authorization\b/i, /\bwork\s+eligibility\b/i] },
    { id: "without_restriction", label: "authorized to work without restriction", severity: "ambiguous", score: -20, patterns: [/\bauthorized\s+to\s+work\s+without\s+restriction\b/i] },
    { id: "future_sponsorship", label: "future sponsorship", severity: "ambiguous", score: -15, patterns: [/\bfuture\s+sponsorship\b/i, /\bmay\s+require\s+sponsorship\b/i, /\brequire\s+sponsorship\s+in\s+the\s+future\b/i] }
  ];

  const RECOMMENDED_ACTIONS = {
    strong: "Apply and tailor your application. Include your work-authorization timeline only if the employer asks or if clarification would help.",
    risky: "Do not spend 40 minutes on a full application yet. First, ask the recruiter to clarify whether candidates with your work-authorization path are considered.",
    low: "Skip this role unless you have independent confirmation from the recruiter. The posting contains restrictive language that may conflict with your current profile."
  };

  const MESSAGE_VARIANTS = {
    strong: {
      short: "Could you confirm whether candidates with F-1 OPT/CPT work authorization are considered for this role?",
      polite: "Hi, I’m interested in this role. Could you confirm whether candidates with F-1 OPT/CPT work authorization are considered? I’d be happy to clarify my timeline if helpful.",
      cover: "I am excited about this opportunity and would appreciate clarification on whether candidates with F-1 OPT/CPT work authorization are considered. I understand eligibility depends on role requirements and company policy, and I can provide my work-authorization timeline if useful."
    },
    risky: {
      short: "Before I complete the full application, could you clarify whether F-1 OPT/CPT candidates are considered?",
      polite: "Hi, I’m very interested in this role. Before completing the full application, could you confirm whether candidates with F-1 OPT or CPT work authorization are considered? I understand this depends on policy and role requirements.",
      cover: "I’m interested in this role and wanted to respectfully confirm work-authorization alignment before investing in the full process. Could you share whether candidates on F-1 OPT/CPT are considered for this position? I can provide additional context as needed."
    },
    low: {
      short: "Could you confirm whether temporary F-1 OPT/CPT work authorization is eligible for consideration here?",
      polite: "Hi, I’m interested in this position, but I noticed language about work-authorization requirements. Could you confirm whether temporary F-1 OPT/CPT work authorization is considered for this role?",
      cover: "I noticed restrictive work-authorization language in the posting and wanted to confirm eligibility criteria before applying. If candidates with temporary F-1 OPT/CPT authorization can still be considered, I would appreciate your guidance on next steps."
    }
  };

  function normalize(text) {
    return (text || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function resolveNeedsSponsorship(profile) {
    return profile.needsFutureSponsorship || profile.needsSponsorship || "Unsure";
  }

  function matchSignals(text) {
    const matched = [];
    const matchedTags = new Set();
    SIGNALS.forEach((signal) => {
      if (signal.requiresNoTag && matchedTags.has(signal.requiresNoTag)) return;
      if (!signal.patterns.some((pattern) => pattern.test(text))) return;
      matched.push(signal);
      if (signal.blockTag) matchedTags.add(signal.blockTag);
    });
    return matched;
  }

  function hasSignal(matched, id) {
    return matched.some((s) => s.id === id);
  }

  function collectContradictions(matched) {
    const contradictions = [];
    const positiveSponsor = hasSignal(matched, "visa_sponsorship_available") || hasSignal(matched, "sponsorship_available");
    const negativeSponsor = hasSignal(matched, "no_visa_sponsorship") || hasSignal(matched, "no_sponsorship_available") || hasSignal(matched, "no_future_sponsorship");
    const optCpt = hasSignal(matched, "opt_candidates_welcome") || hasSignal(matched, "cpt_eligible") || hasSignal(matched, "cpt_candidates_welcome");
    const intl = hasSignal(matched, "international_students_encouraged");
    const citizens = hasSignal(matched, "us_citizens_only") || hasSignal(matched, "us_citizenship_required");
    const permanent = hasSignal(matched, "permanently_authorized") || hasSignal(matched, "green_card_or_citizen");
    const stemOrVerify = hasSignal(matched, "stem_opt") || hasSignal(matched, "e_verify");

    if (positiveSponsor && negativeSponsor) contradictions.push("The posting includes both positive and restrictive sponsorship language.");
    if (optCpt && negativeSponsor) contradictions.push("OPT/CPT-friendly wording appears alongside restrictive sponsorship language.");
    if (positiveSponsor && hasSignal(matched, "no_future_sponsorship")) contradictions.push("Sponsorship appears available while future sponsorship is restricted.");
    if (intl && citizens) contradictions.push("The posting encourages international students but also includes U.S. citizenship restrictions.");
    if (positiveSponsor && permanent) contradictions.push("Positive sponsorship wording appears with permanent authorization restrictions.");
    if (hasSignal(matched, "visa_sponsorship_available") && hasSignal(matched, "no_visa_sponsorship")) contradictions.push("The text contains both 'visa sponsorship available' and 'no visa sponsorship'.");
    if (stemOrVerify && permanent) contradictions.push("STEM OPT/E-Verify language appears alongside permanent authorization restrictions.");
    return contradictions;
  }

  function determineFit(score) {
    if (score >= 80) return { fit: "strong", label: "Strong Fit" };
    if (score <= 44) return { fit: "low", label: "Low Fit" };
    return { fit: "risky", label: "Risky Fit" };
  }

  function determineEvidenceLevel(matched, contradictions, textLength) {
    const hardCount = matched.filter((s) => s.severity === "hard_negative").length;
    const posCount = matched.filter((s) => s.severity === "positive").length;
    if (textLength < 120 || matched.length < 2) return "limited";
    if (contradictions.length > 0 || (hardCount > 0 && posCount > 0)) return "mixed";
    return "strong";
  }

  function determineConfidence(textLength, contradictions, extractionQuality, evidenceLevel) {
    if (textLength < 120 || extractionQuality === "limited" || extractionQuality === "failed") return "low";
    if (contradictions.length > 0) return "low";
    if (evidenceLevel === "strong") return "high";
    return "medium";
  }

  function analyzeJobText(pageText, studentProfile = {}) {
    const text = normalize(pageText);
    let score = 70;
    const reasons = [];
    const matched = matchSignals(text);
    matched.forEach((s) => (score += s.score));

    if (studentProfile.workPath === "STEM OPT eligible" && (hasSignal(matched, "e_verify") || hasSignal(matched, "stem_opt"))) {
      score += 15;
      reasons.push("Your STEM OPT path aligns with E-Verify/STEM OPT language in this posting.");
    }
    if (studentProfile.workPath === "CPT seeking" && (hasSignal(matched, "internship") || hasSignal(matched, "cpt_eligible") || hasSignal(matched, "cpt_candidates_welcome"))) {
      score += 15;
      reasons.push("Your CPT-seeking profile aligns with internship/CPT-related language.");
    }

    const needs = resolveNeedsSponsorship(studentProfile);
    const noSponsorship = hasSignal(matched, "no_visa_sponsorship") || hasSignal(matched, "no_sponsorship_available") || hasSignal(matched, "no_future_sponsorship");
    if (needs === "Yes" && noSponsorship) {
      score -= 20;
      reasons.push("You indicated future sponsorship needs, and restrictive sponsorship language was detected.");
    }
    if (needs === "Unsure" && matched.some((s) => s.severity === "ambiguous")) {
      score -= 5;
      reasons.push("Ambiguous sponsorship language is riskier when future sponsorship needs are uncertain.");
    }

    if (studentProfile.lookingFor === "Internship" && hasSignal(matched, "internship")) score += 10;
    if (studentProfile.lookingFor === "Full-time" && (text.includes("full-time") || hasSignal(matched, "entry_level") || hasSignal(matched, "new_grad") || hasSignal(matched, "early_career"))) score += 5;

    if (text.length < 50) {
      score -= 20;
      reasons.push("Very limited visible job text was detected. Open a full posting or use Demo Mode.");
    }

    const contradictions = collectContradictions(matched);

    const citizenOrClearance = hasSignal(matched, "us_citizens_only") || hasSignal(matched, "us_citizenship_required") || hasSignal(matched, "security_clearance_required") || hasSignal(matched, "eligible_for_security_clearance");
    if (citizenOrClearance) {
      score = Math.min(score, 44);
      reasons.push("Citizenship or security-clearance restrictions can strongly limit eligibility for many international students.");
    }

    score = Math.max(0, Math.min(100, score));
    let { fit, label } = determineFit(score);
    if (contradictions.length > 0 && fit === "strong") {
      fit = "risky";
      label = "Risky Fit";
    }

    if (contradictions.length > 0) reasons.push("The posting contains conflicting work-authorization signals. Confirm with the recruiter before applying.");
    if (matched.some((s) => s.severity === "hard_negative")) reasons.push("Restrictive language was detected that may reduce alignment with your current work-authorization path.");
    if (matched.some((s) => s.severity === "positive")) reasons.push("Supportive language was also detected; recruiter clarification can reduce uncertainty.");
    if (reasons.length === 0) reasons.push("No strong sponsorship signal was detected. Clarifying expectations early can save time.");

    const evidence_level = determineEvidenceLevel(matched, contradictions, text.length);
    const confidence = determineConfidence(text.length, contradictions, studentProfile.__extractionQuality, evidence_level);

    const signal_summary = {
      hardNegativeCount: matched.filter((s) => s.severity === "hard_negative").length,
      ambiguousCount: matched.filter((s) => s.severity === "ambiguous").length,
      positiveCount: matched.filter((s) => s.severity === "positive").length,
      contradictionCount: contradictions.length
    };

    const top_evidence = matched.slice(0, 5).map((s) => `${s.severity}: ${s.label}`);
    const timeSavedMinutes = fit === "low" ? 40 : fit === "risky" ? 25 : 0;
    const variants = MESSAGE_VARIANTS[fit];

    return {
      fit,
      label,
      score,
      detected_phrases: matched.map((s) => s.label),
      contradictions,
      reasons,
      recommended_action: RECOMMENDED_ACTIONS[fit],
      recruiter_message: variants.polite,
      recruiter_message_variants: variants,
      time_saved_minutes: timeSavedMinutes,
      disclaimer: DISCLAIMER_FULL,
      short_disclaimer: DISCLAIMER_SHORT,
      confidence,
      evidence_level,
      signal_summary,
      top_evidence
    };
  }

  return { analyzeJobText, SIGNALS, RECOMMENDED_ACTIONS, MESSAGE_VARIANTS, DISCLAIMER_FULL, DISCLAIMER_SHORT };
});
