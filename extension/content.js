(function () {
  if (window.__sponsorlensInjected) return;
  window.__sponsorlensInjected = true;

  function cleanText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function extractCompanyLikeText() {
    const selectors = [
      '[class*="company"]',
      '[id*="company"]',
      '[data-test*="company"]',
      '[data-testid*="company"]'
    ];

    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (node?.textContent) {
        const cleaned = cleanText(node.textContent);
        if (cleaned.length > 2 && cleaned.length < 180) return cleaned;
      }
    }
    return "";
  }

  function extractVisiblePageText() {
    const parts = [];

    const title = cleanText(document.title);
    if (title) parts.push(`Title: ${title}`);

    const h1 = cleanText(document.querySelector("h1")?.innerText || "");
    if (h1) parts.push(`Heading: ${h1}`);

    const company = extractCompanyLikeText();
    if (company) parts.push(`Company: ${company}`);

    const main = cleanText(document.querySelector("main, article")?.innerText || "");
    if (main) parts.push(main);

    if (!main) {
      const body = cleanText(document.body?.innerText || "");
      if (body) parts.push(body);
    }

    return cleanText(parts.join("\n")).slice(0, 20000);
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "SPONSORLENS_EXTRACT") {
      sendResponse({ pageText: extractVisiblePageText() });
    }
  });
})();
