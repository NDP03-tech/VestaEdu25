// utils/extractGaps.js
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function decodeHtmlEntities(str) {
  const txt = new JSDOM().window.document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function extractFromHTML(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const gaps = [];
  const dropdowns = [];
  const hintWords = [];

  let position = 0;
  const clozes = doc.querySelectorAll(".cloze");

  clozes.forEach((el) => {
    const text = el.textContent?.trim();
    const length = text?.length || 0;
    if (!text) return;

    // ❌ Bỏ qua nếu nằm trong hint-wrapper
    if (el.closest(".hint-wrapper")) return;

    if (el.classList.contains("dropdown")) {
      try {
        const raw = el.getAttribute("data-options");
        const decoded = decodeHtmlEntities(raw || "[]");
        const options = JSON.parse(decoded);
        const correct = el.getAttribute("data-answer")?.trim();
        dropdowns.push({ options, correct_answer: correct, position, length });
      } catch (e) {
        console.error("❌ Failed to parse dropdown:", e);
      }
    } else {
      gaps.push({ correct_answers: [text], position, length });
    }

    position++;
  });

  // ✅ Extract hint words
  const hints = doc.querySelectorAll(".hint-wrapper");
  hints.forEach((el) => {
    const word = el.querySelector(".cloze")?.textContent?.trim();
    const hint = el.querySelector(".hint-icon")?.getAttribute("data-hint");
    if (word && hint) {
      hintWords.push({ word, hint });
    }
  });

  return { gaps, dropdowns, hintWords };
}

module.exports = extractFromHTML;
