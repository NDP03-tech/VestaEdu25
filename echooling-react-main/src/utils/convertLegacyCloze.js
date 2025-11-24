export function convertOldClozeDropLinks(container) {
  if (!container || !container.querySelectorAll) return;

  // 1. Convert legacy dropdowns
  container.querySelectorAll('a.clozedrop').forEach((el) => {
    const correctAnswer = el.textContent;
    const rawHref = el.getAttribute('href') || '';
    const match = rawHref.match(/#(.+)/);
    const options = match?.[1]?.split('0i0').filter(Boolean) || [];

    if (options.length > 0) {
      const allOptions = [correctAnswer.trim(), ...options];
      const encodedOptions = JSON.stringify(allOptions).replace(/"/g, '&quot;');

      const newDropdown = document.createElement('a');
      newDropdown.className = 'cloze dropdown';
      newDropdown.setAttribute('href', '#');
      newDropdown.setAttribute('data-answer', correctAnswer.trim());
      newDropdown.setAttribute('data-options', encodedOptions);
      newDropdown.innerHTML = `${correctAnswer.trim()}<span class="dropdown-icon">&#9660;</span>`;

      ensureSpacingBefore(el);
      el.replaceWith(newDropdown);
      ensureSpacingAfter(newDropdown);
    }
  });

  // 2. Convert legacy hints
  container.querySelectorAll('a.clozetip').forEach((el) => {
    const rawTitle = el.getAttribute('title') || '';
    const decodedHint = decodeHtmlEntities(rawTitle);
    const text = el.textContent;
    if (!text) return;

    const wrapper = document.createElement('span');
    wrapper.className = 'hint-wrapper';

    const cloze = document.createElement('span');
    cloze.className = 'cloze';
    cloze.textContent = text;

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-circle-info hint-icon';
    icon.setAttribute('data-hint', decodedHint);

    wrapper.appendChild(cloze);
    wrapper.appendChild(icon);

    ensureSpacingBefore(el);
    el.replaceWith(wrapper);
    // ❌ intentionally skip ensureSpacingAfter
  });

  // 3. Convert legacy <a class="cloze"> (gaps thường)
  container.querySelectorAll('a.cloze:not(.dropdown)').forEach((el) => {
    if (el.classList.contains('dropdown')) return;
    if (!el.hasAttribute('href')) return;

    const text = el.textContent;
    const newGap = document.createElement('a');
    newGap.className = 'cloze';
    newGap.setAttribute('href', '#');
    newGap.textContent = text;

    ensureSpacingBefore(el);
    el.replaceWith(newGap);
    ensureSpacingAfter(newGap);
  });

  // 4. Final spacing safety pass
  ensureSpacingAfterAll(container);
}

// --- Spacing utilities ---

function ensureSpacingBefore(el) {
  const prev = el.previousSibling;
  if (
    !prev ||
    (prev.nodeType === 3 && !/\s$/.test(prev.nodeValue)) ||
    (prev.nodeType === 1 && !/>[\s]*$/.test(prev.outerHTML))
  ) {
    el.parentNode?.insertBefore(document.createTextNode(' '), el);
  }
}

function ensureSpacingAfter(el) {
  const next = el.nextSibling;
  if (el.classList.contains('hint-wrapper')) return;

  if (
    !next ||
    (next.nodeType === 3 && !/^\s/.test(next.nodeValue)) ||
    (next.nodeType === 1 &&
      !/^[\s]*</.test(next.outerHTML) &&
      !next.classList?.contains('hint-wrapper'))
  ) {
    console.log('🧩 Thêm spacing SAU:', el);
    el.parentNode?.insertBefore(document.createTextNode(' '), next);
  }
}

function ensureSpacingAfterAll(container) {
  container.querySelectorAll('a.cloze, a.dropdown').forEach((el) => {
    ensureSpacingBefore(el);
    ensureSpacingAfter(el);
  });

  container.querySelectorAll('span.hint-wrapper').forEach((el) => {
    ensureSpacingBefore(el);
    // intentionally skip ensureSpacingAfter
  });
}

// --- Utility to decode HTML entities like &quot;
function decodeHtmlEntities(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
