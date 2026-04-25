(function () {
  if (window.__sponsorlensExtractorReady) return;
  window.__sponsorlensExtractorReady = true;

  const MAX_TEXT = 20000;
  const NOISE_SELECTOR = [
    "script",
    "style",
    "noscript",
    "svg",
    "canvas",
    "nav",
    "footer",
    "input",
    "textarea",
    "select",
    "button",
    "[aria-hidden='true']",
    "[hidden]",
    "[role='navigation']",
    "header nav"
  ].join(",");

  const JOB_CONTAINER_SELECTORS = [
    "main",
    "article",
    "[role='main']",
    "[class*='job']",
    "[class*='posting']",
    "[class*='description']",
    "[data-testid*='job']",
    "[data-test*='job']"
  ];

  function cleanText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function isElementVisible(el) {
    if (!el || !(el instanceof Element)) return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    return true;
  }

  function stripNoiseFromClone(node) {
    const clone = node.cloneNode(true);
    clone.querySelectorAll(NOISE_SELECTOR).forEach((n) => n.remove());
    return clone;
  }

  function getTextFromNode(node) {
    if (!node || !isElementVisible(node)) return "";
    const cleanedNode = stripNoiseFromClone(node);
    return cleanText(cleanedNode.innerText || cleanedNode.textContent || "");
  }

  function findCompanyLikeText() {
    const selectors = [
      "[class*='company']",
      "[id*='company']",
      "[data-test*='company']",
      "[data-testid*='company']"
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      const text = getTextFromNode(el);
      if (text.length >= 2 && text.length <= 160) return text;
    }

    return "";
  }

  function findJobTitleCandidate() {
    const selectors = [
      "h1",
      "[class*='job-title']",
      "[class*='title']",
      "[data-testid*='title']",
      "[data-test*='title']"
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      const text = getTextFromNode(el);
      if (text.length >= 4 && text.length <= 180) return text;
    }

    return "";
  }

  function getJobContainerText() {
    let bestText = "";
    let bestSource = "";

    for (const selector of JOB_CONTAINER_SELECTORS) {
      const nodes = document.querySelectorAll(selector);
      for (const node of nodes) {
        const text = getTextFromNode(node);
        if (text.length > bestText.length) {
          bestText = text;
          bestSource = selector;
        }
      }
    }

    return { text: bestText, source: bestSource };
  }

  function extractVisiblePagePayload() {
    try {
      const parts = [];
      const title = cleanText(document.title);
      const heading = cleanText(document.querySelector("h1")?.innerText || "");
      const company = findCompanyLikeText();
      const url = cleanText(window.location.href || "");
      const detectedTitle = findJobTitleCandidate() || heading || title;

      if (title) parts.push(`Title: ${title}`);
      if (heading) parts.push(`Heading: ${heading}`);
      if (company) parts.push(`Company: ${company}`);

      const jobContainer = getJobContainerText();
      let source = "job_container";

      if (jobContainer.text.length > 200) {
        parts.push(jobContainer.text);
        source = `job_container:${jobContainer.source || "unknown"}`;
      } else {
        const bodyText = getTextFromNode(document.body);
        if (bodyText) {
          parts.push(bodyText);
          source = "body_fallback";
        }
      }

      const pageText = cleanText(parts.join("\n")).slice(0, MAX_TEXT);
      const charCount = pageText.length;

      let extractionQuality = "failed";
      if (charCount >= 1400 && source.startsWith("job_container")) extractionQuality = "good";
      else if (charCount >= 300) extractionQuality = "limited";

      return {
        pageText,
        title: detectedTitle,
        heading,
        company,
        url,
        source,
        charCount,
        extractionQuality
      };
    } catch (_err) {
      return {
        pageText: "",
        title: "",
        heading: "",
        company: "",
        url: cleanText(window.location.href || ""),
        source: "error",
        charCount: 0,
        extractionQuality: "failed"
      };
    }
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "SPONSORLENS_EXTRACT") {
      sendResponse(extractVisiblePagePayload());
      return true;
    }
    return false;
  });
})();
