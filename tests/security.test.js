const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, "extension", "manifest.json"), "utf8"));

function read(file) {
  return fs.readFileSync(path.join(repoRoot, file), "utf8");
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

run("manifest permissions remain minimal", () => {
  assert.deepStrictEqual([...(manifest.permissions || [])].sort(), ["activeTab", "scripting", "storage"].sort());
  assert.ok(!manifest.host_permissions, "host_permissions should be absent");
});

run("extension runtime has no external API calls", () => {
  ["extension/popup.js", "extension/content.js", "extension/analyzer.js", "extension/popup.html"].forEach((file) => {
    const content = read(file);
    assert.ok(!/\bfetch\s*\(/i.test(content), `fetch found in ${file}`);
    assert.ok(!/XMLHttpRequest/i.test(content), `XMLHttpRequest found in ${file}`);
    assert.ok(!/https?:\/\//i.test(content), `external URL found in ${file}`);
  });
});

run("no dangerous untrusted innerHTML injection", () => {
  const popupJs = read("extension/popup.js");
  const unsafe = popupJs.split("\n").filter((line) => line.includes("innerHTML") && !line.includes('innerHTML = ""'));
  assert.strictEqual(unsafe.length, 0);
});

run("no API keys in repository", () => {
  const files = [
    "README.md",
    "extension/popup.js",
    "extension/analyzer.js",
    "backend/server.js",
    "docs/API_MODE.md"
  ].filter((f) => fs.existsSync(path.join(repoRoot, f)));

  files.forEach((file) => {
    const content = read(file);
    assert.ok(!/sk-[a-z0-9]{20,}/i.test(content), `potential OpenAI key found in ${file}`);
  });
});

run("no persistent full page text storage", () => {
  const popupJs = read("extension/popup.js");
  const badLine = popupJs.split("\n").find((line) => /chrome\.storage\.local\.set/i.test(line) && /pageText/i.test(line));
  assert.ok(!badLine, "pageText should not be written to chrome.storage.local");
});

run("no local secret files committed", () => {
  [".env", ".env.local", ".env.production", "secrets.json"].forEach((file) => {
    assert.ok(!fs.existsSync(path.join(repoRoot, file)), `${file} should not be committed`);
  });
});

console.log("All security checks passed.");
