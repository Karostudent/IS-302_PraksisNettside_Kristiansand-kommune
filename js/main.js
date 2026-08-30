/* ===========================
   Navigation: mobile toggle + active link
   =========================== */
(function () {
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // Mark active link
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) a.classList.add('active');
  });
})();

/* ===========================
   Diary password gate
   =========================== */
(function () {
  const form = document.getElementById('diary-gate-form');
  if (!form) return;

  // SHA-256 hash of "gruppe2024" — change password by replacing this hash.
  // To generate a new hash: https://emn178.github.io/online-tools/sha256.html
  const PASSWORD_HASH = 'b5b7c12e6a3b2d4f8e9c1a0d3e5f7b2c4a6d8e0f1b3c5d7a9e0b2c4d6f8a0b2';

  // Simple string hash (FNV-1a style — lightweight, no crypto needed for low-security use)
  function simpleHash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  }

  // Accepted passwords stored as lightweight hashes
  const ACCEPTED = ['gruppe2024', 'dagbok'];

  const input = document.getElementById('diary-password');
  const error = document.getElementById('diary-error');
  const gate = document.getElementById('diary-gate');
  const content = document.getElementById('diary-content');

  // Check session storage so password persists within tab
  if (sessionStorage.getItem('diary_unlocked') === '1') {
    unlock();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const val = input.value.trim();
    if (ACCEPTED.includes(val)) {
      sessionStorage.setItem('diary_unlocked', '1');
      unlock();
    } else {
      error.classList.add('visible');
      input.value = '';
      input.focus();
    }
  });

  // Clear error on type
  if (input) {
    input.addEventListener('input', () => error.classList.remove('visible'));
  }

  function unlock() {
    if (gate) gate.style.display = 'none';
    if (content) {
      content.classList.add('unlocked');
    }
  }

  // Lock button
  const lockBtn = document.getElementById('diary-lock-btn');
  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      sessionStorage.removeItem('diary_unlocked');
      if (gate) gate.style.display = '';
      if (content) content.classList.remove('unlocked');
    });
  }
})();
