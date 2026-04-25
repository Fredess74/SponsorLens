(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SponsorLensAnalyzer = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const DISCLAIMER_FULL =
    "SponsorLens is a non-commercial educational prototype. It does not provide legal, immigration, or employment advice. It does not guarantee visa sponsorship, job eligibility, or hiring outcomes. It provides general job-search guidance based on visible posting language.";

  const DISCLAIMER_SHORT =
    "Not legal advice. SponsorLens provides general job-search guidance only.";

  const PHRASE_GROUPS = {
    hardNegative: {
      "u.s. citizens only": -60,
      "us citizens only": -60,
      "security clearance required": -50,
      "must be eligible for security clearance": -45,
      "no visa sponsorship": -40,
      "no sponsorship": -40,
      "we do not sponsor": -40,
      "sponsorship is not available": -40,
      "must not require sponsorship now or in the future": -45,
      "will not sponsor now or in the future": -45,
      "must be permanently authorized to work": -35,
      "permanent work authorization": -35,
      "green card or u.s. citizen": -50,
      "citizen or permanent resident": -40
    },
    ambiguous: {
      "must be authorized to work in the u.s.": -10,
      "legally authorized to work in the united states": -10,
      "work authorization required": -10,
      "authorized to work without restriction": -20,
      "future sponsorship": -15
    },
    positive: {
      "opt candidates welcome": 30,
      "cpt eligible": 25,
      "cpt candidates welcome": 25,
      "international students encouraged": 25,
      "visa sponsorship available": 30,
      "sponsorship available": 25,
      "stem opt": 20,
      "e-verify": 15,
      internship: 10,
      "entry level": 10,
      "new grad": 10
    }
  };

  const RECOMMENDED_ACTIONS = {
    strong:
      "Apply and tailor your application. Include your work-authorization timeline only if the employer asks or if clarification would help.",
    risky:
      "Do not spend 40 minutes on a full application yet. First, ask the recruiter to clarify whether candidates with your work-authorization path are considered.",
    low:
      "Skip this role unless you have independent confirmation from the recruiter. The posting contains restrictive language that may conflict with your current profile."
  };

  const RECRUITER_MESSAGES = {
    strong:
      "Hi, I’m interested in this role and wanted to confirm whether candidates with F-1 OPT/CPT work authorization are considered. I’m happy to clarify my work-authorization timeline if helpful.",
    risky:
      "Hi, I’m very interested in this role. Before completing the full application, I wanted to clarify whether candidates with F-1 OPT or CPT work authorization are considered for this position. I understand this depends on company policy and role requirements, and I’d be happy to provide more context if helpful.",
    low:
      "Hi, I’m interested in this position, but I noticed language about work authorization requirements. Could you confirm whether candidates with temporary F-1 OPT/CPT work authorization are eligible to be considered for this role?"
  };

  const NO_SPONSORSHIP_PHRASES = [
    "no visa sponsorship",
    "no sponsorship",
    "we do not sponsor",
    "sponsorship is not available",
    "must not require sponsorship now or in the future",
    "will not sponsor now or in the future"
  ];

  const POSITIVE_SPONSORSHIP_PHRASES = [
    "visa sponsorship available",
    "sponsorship available",
    "international students encouraged",
    "opt candidates welcome",
    "cpt eligible",
    "cpt candidates welcome"
  ];

  function normalize(text) {
    return (text || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function detectPhrases(text, mapping) {
    return Object.keys(mapping).filter((phrase) => text.includes(phrase));
  }

  function resolveNeedsSponsorship(studentProfile) {
    return (
      studentProfile.needsFutureSponsorship ||
      studentProfile.needsSponsorship ||
      "Unsure"
    );
  }

  function determineFit(score) {
    if (score >= 80) return { fit: "strong", label: "Strong Fit" };
    if (score <= 44) return { fit: "low", label: "Low Fit" };
    return { fit: "risky", label: "Risky Fit" };
  }

  function analyzeContradictions(text, hasPositiveSponsorship, hasNegativeSponsorship, mentionsNoSponsorship) {
    const contradictions = [];

    if (hasPositiveSponsorship && hasNegativeSponsorship) {
      contradictions.push("The posting includes both positive and restrictive sponsorship language.");
    }

    if ((text.includes("opt candidates welcome") || text.includes("cpt")) && mentionsNoSponsorship) {
      contradictions.push("OPT/CPT-friendly wording appears alongside no-sponsorship language.");
    }

    if (text.includes("sponsorship available") && text.includes("must not require sponsorship now or in the future")) {
      contradictions.push("Sponsorship is marked available, but future sponsorship is explicitly disallowed.");
    }

    if (text.includes("international students encouraged") && (text.includes("u.s. citizens only") || text.includes("us citizens only"))) {
      contradictions.push("International students are encouraged but the posting also says U.S. citizens only.");
    }

    if (text.includes("sponsorship available") && (text.includes("permanent work authorization") || text.includes("must be permanently authorized to work"))) {
      contradictions.push("Sponsorship appears available, yet permanent authorization restrictions are also listed.");
    }

    if (text.includes("visa sponsorship available") && text.includes("no visa sponsorship")) {
      contradictions.push("The text contains both 'visa sponsorship available' and 'no visa sponsorship'.");
    }

    return contradictions;
  }

  function analyzeJobText(pageText, studentProfile = {}) {
    const normalizedText = normalize(pageText);
    let score = 70;
    const detectedSet = new Set();
    const reasons = [];

    if (normalizedText.length < 40) {
      reasons.push("Very limited visible job text was available. Analyze again on a full posting page or use Demo Mode.");
      score -= 20;
    }

    const hardNeg = detectPhrases(normalizedText, PHRASE_GROUPS.hardNegative);
    const ambiguous = detectPhrases(normalizedText, PHRASE_GROUPS.ambiguous);
    const positive = detectPhrases(normalizedText, PHRASE_GROUPS.positive);

    hardNeg.forEach((phrase) => {
      score += PHRASE_GROUPS.hardNegative[phrase];
      detectedSet.add(phrase);
    });

    ambiguous.forEach((phrase) => {
      score += PHRASE_GROUPS.ambiguous[phrase];
      detectedSet.add(phrase);
    });

    positive.forEach((phrase) => {
      score += PHRASE_GROUPS.positive[phrase];
      detectedSet.add(phrase);
    });

    const mentionsNoSponsorship = hardNeg.some((p) => NO_SPONSORSHIP_PHRASES.includes(p));
    const hasPositiveSponsorship = positive.some((p) => POSITIVE_SPONSORSHIP_PHRASES.includes(p));
    const hasNegativeSponsorship = hardNeg.some(
      (p) => NO_SPONSORSHIP_PHRASES.includes(p) || ["must be permanently authorized to work", "permanent work authorization", "u.s. citizens only", "us citizens only"].includes(p)
    );

    if (studentProfile.workPath === "STEM OPT eligible" && (normalizedText.includes("e-verify") || normalizedText.includes("stem opt"))) {
      score += 15;
      reasons.push("Your STEM OPT path aligns with E-Verify/STEM OPT language in this posting.");
    }

    if (studentProfile.workPath === "CPT seeking" && (normalizedText.includes("internship") || normalizedText.includes("cpt"))) {
      score += 15;
      reasons.push("Your CPT-seeking profile matches internship/CPT language here.");
    }

    const needsSponsorship = resolveNeedsSponsorship(studentProfile);

    if (needsSponsorship === "Yes" && mentionsNoSponsorship) {
      score -= 20;
      reasons.push("You indicated future sponsorship needs, but this posting includes restrictive sponsorship language.");
    }

    if (needsSponsorship === "Unsure" && ambiguous.length > 0) {
      score -= 5;
      reasons.push("Ambiguous sponsorship language is riskier when future sponsorship needs are uncertain.");
    }

    if (studentProfile.lookingFor === "Internship" && normalizedText.includes("internship")) {
      score += 10;
      reasons.push("This posting explicitly mentions an internship path.");
    }

    if (studentProfile.lookingFor === "Full-time" && (normalizedText.includes("full-time") || normalizedText.includes("entry level"))) {
      score += 5;
      reasons.push("The role includes full-time or entry-level language that matches your target.");
    }

    const contradictions = analyzeContradictions(normalizedText, hasPositiveSponsorship, hasNegativeSponsorship, mentionsNoSponsorship);

    score = Math.max(0, Math.min(100, score));

    let { fit, label } = determineFit(score);

    if (contradictions.length > 0) {
      reasons.push("The posting contains conflicting work-authorization signals. Confirm with the recruiter before applying.");
      if (fit === "strong" && score < 92) {
        fit = "risky";
        label = "Risky Fit";
      }
    }

    if (hardNeg.length > 0) {
      reasons.push("The posting includes restrictive language that can block or delay international candidate consideration.");
    }

    if (positive.length > 0) {
      reasons.push("The posting includes language that may be supportive for international candidates.");
    }

    if (reasons.length === 0) {
      reasons.push("No explicit sponsorship signals were detected; clarify eligibility early before investing significant application time.");
    }

    const timeSavedMinutes = fit === "low" ? 40 : fit === "risky" ? 25 : 0;

    return {
      fit,
      label,
      score,
      detected_phrases: Array.from(detectedSet),
      contradictions,
      reasons,
      recommended_action: RECOMMENDED_ACTIONS[fit],
      recruiter_message: RECRUITER_MESSAGES[fit],
      time_saved_minutes: timeSavedMinutes,
      disclaimer: DISCLAIMER_FULL,
      short_disclaimer: DISCLAIMER_SHORT
    };
  }

  return {
    analyzeJobText,
    PHRASE_GROUPS,
    RECOMMENDED_ACTIONS,
    RECRUITER_MESSAGES,
    DISCLAIMER_FULL,
    DISCLAIMER_SHORT
  };
});
