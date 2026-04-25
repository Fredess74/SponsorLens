const http = require("http");

const PORT = Number(process.env.PORT || 8787);

function parseJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

function mockExplain(payload) {
  const fit = payload?.analysisResult?.label || "Unknown";
  const title = payload?.jobMetadata?.title || "this role";
  return {
    enhanced_summary: `Based on local SponsorLens signals, ${title} appears as ${fit}. Confirm employer policy before investing in a long application.`,
    safer_recruiter_message:
      "Could you confirm whether candidates with F-1 OPT/CPT work authorization are considered for this role? I understand this depends on company policy and role requirements.",
    caveats: [
      "This response is informational and not legal advice.",
      "SponsorLens does not guarantee sponsorship or hiring outcomes."
    ]
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/explain") {
    try {
      const payload = await parseJson(req);

      // Optional future integration point:
      // If OPENAI_API_KEY exists, a server-side OpenAI API call could be made here.
      // This MVP intentionally returns deterministic local-safe output unless explicitly upgraded.
      if (!process.env.OPENAI_API_KEY) {
        const response = mockExplain(payload);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
        return;
      }

      // Placeholder fallback even when key exists (no runtime dependency added in challenge MVP).
      const response = mockExplain(payload);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid request payload", details: String(error.message || error) }));
    }
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, mode: process.env.OPENAI_API_KEY ? "optional-api" : "local-mock" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`SponsorLens optional backend listening on http://localhost:${PORT}`);
});
