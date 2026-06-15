'use strict';

/**
 * صفحه مطالعه --- reader themes, fullscreen, progress, scroll save ---
 */

const { fetchDocument, apiRequest } = window.BookShelfApi;
const { icon } = window.BookShelfIcons;
const { returnFromReader, state } = window.BookShelfRouter;
const { clearHighlights, highlightTerm, nextMatch, prevMatch } = window.BookShelfReaderSearch;

let scrollSaveTimer = null;
let isFullscreen = false;
let currentUser = null;

const PREFS_KEY = 'bookshelf_prefs';
const GUEST_RECENT_KEY = 'bookshelf_guest_recent';

/**
 * @returns {{ readingTheme: string, fontScale: string }}
 */
function loadLocalPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
  } catch (_error) {
    return {};
  }
}

/**
 * @param {{ readingTheme?: string, fontScale?: string }} prefs
 */
function saveLocalPrefs(prefs) {
  const current = loadLocalPrefs();
  localStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...prefs }));
}

/**
 * @param {string} theme
 * @param {string} fontScale
 */
function applyReaderTheme(theme, fontScale) {
  const card = document.getElementById('readerCard');
  if (!card) {
    return;
  }
  card.dataset.theme = theme;
  card.dataset.font = fontScale;
  document.querySelectorAll('.theme-dot').forEach((dot) => {
    dot.classList.toggle('active', dot.dataset.theme === theme);
  });
}

async function syncPrefsToServer(theme, fontScale) {
  if (!currentUser) {
    return;
  }
  try {
    await apiRequest('/me/preferences', {
      method: 'PUT',
      body: JSON.stringify({ readingTheme: theme, fontScale }),
    });
  } catch (_error) {
    showOfflineBanner();
  }
}

function showOfflineBanner() {
  const banner = document.getElementById('offlineBanner');
  if (banner) {
    banner.hidden = false;
  }
}

function hideOfflineBanner() {
  const banner = document.getElementById('offlineBanner');
  if (banner) {
    banner.hidden = true;
  }
}

/**
 * @param {string} docPath
 * @param {number} ratio
 */
async function saveProgress(docPath, ratio) {
  if (currentUser) {
    try {
      await apiRequest('/progress', {
        method: 'PUT',
        body: JSON.stringify({ docPath, scrollRatio: ratio }),
      });
      hideOfflineBanner();
    } catch (_error) {
      showOfflineBanner();
    }
    return;
  }

  try {
    const doc = await fetchDocument(docPath);
    localStorage.setItem(
      GUEST_RECENT_KEY,
      JSON.stringify({
        docPath,
        title: doc.title,
        coverType: doc.coverType,
        coverValue: doc.coverValue,
        scrollRatio: ratio,
      }),
    );
  } catch (_error) {
    /* ignore */
  }
}

function updateScrollProgress() {
  const content = document.getElementById('readerContent');
  const bar = document.getElementById('readerScrollProgress');
  if (!content || !bar) {
    return;
  }
  const scrollable = content.scrollHeight - content.clientHeight;
  const ratio = scrollable > 0 ? content.scrollTop / scrollable : 0;
  bar.style.width = `${Math.round(ratio * 100)}%`;

  clearTimeout(scrollSaveTimer);
  scrollSaveTimer = setTimeout(() => {
    if (state.readerPath) {
      saveProgress(state.readerPath, ratio);
    }
  }, 2000);
}

function toggleFullscreen() {
  isFullscreen = !isFullscreen;
  document.getElementById('app').classList.toggle('reader-fullscreen', isFullscreen);
}

/**
 * @param {string} docPath
 */
async function open(docPath) {
  state.readerPath = docPath;
  state.returnLibraryPath = docPath.includes('/')
    ? docPath.split('/').slice(0, -1).join('/')
    : '';

  const titleEl = document.getElementById('readerTitle');
  const content = document.getElementById('readerContent');
  if (!content) {
    return;
  }

  content.innerHTML = '<p>در حال بارگذاری…</p>';

  try {
    currentUser = await apiRequest('/me').catch(() => null);
    const doc = await fetchDocument(docPath);
    if (titleEl) {
      titleEl.textContent = doc.title;
    }
    content.innerHTML = doc.html;
    applyAutoDirection(content);

    const prefs = currentUser?.preferences || loadLocalPrefs();
    const theme = prefs.readingTheme || 'night';
    const fontScale = prefs.fontScale || 'normal';
    applyReaderTheme(theme, fontScale);

    const progress = currentUser
      ? await apiRequest('/progress/recent')
          .then((data) => (data.items || []).find((item) => item.docPath === docPath))
          .catch(() => null)
      : null;

    const guestRecent = !progress ? JSON.parse(localStorage.getItem(GUEST_RECENT_KEY) || 'null') : null;
    const ratio = progress?.scrollRatio ?? guestRecent?.docPath === docPath ? guestRecent.scrollRatio : 0;

    requestAnimationFrame(() => {
      const scrollable = content.scrollHeight - content.clientHeight;
      content.scrollTop = scrollable * (ratio || 0);
      updateScrollProgress();
    });
  } catch (error) {
    content.innerHTML = `<p class="empty-state">خطا: ${error.message}</p>`;
  }
}

/**
 * @param {HTMLElement} container
 */
function applyAutoDirection(container) {
  container.querySelectorAll('p, li, h1, h2, h3, h4, blockquote').forEach((element) => {
    const text = element.textContent || '';
    const persianRatio = (text.match(/[\u0600-\u06FF]/g) || []).length / Math.max(text.length, 1);
    if (persianRatio > 0.3) {
      element.setAttribute('dir', 'rtl');
      element.style.textAlign = 'right';
    } else if (/[a-zA-Z]/.test(text)) {
      element.setAttribute('dir', 'ltr');
      element.style.textAlign = 'left';
    }
  });
}

function initReader() {
  document.getElementById('readerBackBtn')?.addEventListener('click', returnFromReader);
  document.getElementById('readerFullscreenBtn')?.addEventListener('click', toggleFullscreen);
  document.getElementById('readerSearchToggle')?.addEventListener('click', () => {
    document.getElementById('readerSearchPanel')?.classList.toggle('open');
  });

  document.querySelectorAll('.theme-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      const theme = dot.dataset.theme;
      const card = document.getElementById('readerCard');
      const fontScale = card?.dataset.font || 'normal';
      applyReaderTheme(theme, fontScale);
      saveLocalPrefs({ readingTheme: theme });
      syncPrefsToServer(theme, fontScale);
    });
  });

  document.getElementById('fontSmallerBtn')?.addEventListener('click', () => setFontScale('normal'));
  document.getElementById('fontLargerBtn')?.addEventListener('click', () => {
    const card = document.getElementById('readerCard');
    const current = card?.dataset.font || 'normal';
    const next = current === 'normal' ? 'large' : 'xlarge';
    setFontScale(next);
  });

  const content = document.getElementById('readerContent');
  content?.addEventListener('scroll', updateScrollProgress);

  const searchInput = document.getElementById('readerSearchInput');
  const searchCount = document.getElementById('readerSearchCount');
  searchInput?.addEventListener('input', () => {
    const term = searchInput.value.trim();
    const count = highlightTerm(content, term);
    if (searchCount) {
      searchCount.textContent = count ? `1 از ${count}` : term ? 'یافت نشد' : '';
    }
  });

  document.getElementById('readerSearchNext')?.addEventListener('click', () => {
    nextMatch();
    const total = window.BookShelfReaderSearch.state.marks.length;
    const idx = window.BookShelfReaderSearch.state.index + 1;
    if (searchCount && total) {
      searchCount.textContent = `${idx} از ${total}`;
    }
  });

  document.getElementById('readerSearchPrev')?.addEventListener('click', () => {
    prevMatch();
    const total = window.BookShelfReaderSearch.state.marks.length;
    const idx = window.BookShelfReaderSearch.state.index + 1;
    if (searchCount && total) {
      searchCount.textContent = `${idx} از ${total}`;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isFullscreen) {
      toggleFullscreen();
    }
  });

  ['readerBackBtn', 'readerFullscreenBtn', 'readerSearchToggle'].forEach((id) => {
    const el = document.getElementById(id);
    if (el && !el.innerHTML) {
      el.innerHTML =
        id === 'readerBackBtn' ? icon('back') : id === 'readerFullscreenBtn' ? icon('fullscreen') : icon('search');
    }
  });
}

/**
 * @param {string} scale
 */
function setFontScale(scale) {
  const card = document.getElementById('readerCard');
  const theme = card?.dataset.theme || 'night';
  applyReaderTheme(theme, scale);
  saveLocalPrefs({ fontScale: scale });
  syncPrefsToServer(theme, scale);
}

window.BookShelfReader = { initReader, open };
