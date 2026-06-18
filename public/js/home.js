(function () {
  'use strict';

/**
 * صفحه خانه --- search, categories, continue reading ---
 */

const { apiRequest, searchLibrary, browseFolder } = window.BookShelfApi;
const { icon } = window.BookShelfIcons;
const { navigateToReader, navigateToLibrary } = window.BookShelfRouter;

let searchTimer = null;

/**
 * @param {string} title
 * @param {string} coverType
 * @param {string} coverValue
 * @returns {string}
 */
function renderCoverHtml(title, coverType, coverValue) {
  if (coverType === 'image' && coverValue) {
    return `<img src="${coverValue}" alt="">`;
  }
  const color = coverType === 'color' && coverValue ? coverValue : '#2563EB';
  return `<div class="book-cover" style="background:${color}">${title.slice(0, 24)}</div>`;
}

/**
 * @param {{ docPath: string, title: string, coverType: string, coverValue: string, scrollRatio: number }} item
 * @returns {string}
 */
function continueCardHtml(item) {
  const percent = Math.round((item.scrollRatio || 0) * 100);
  return `
    <article class="continue-card" data-path="${item.docPath}">
      ${renderCoverHtml(item.title, item.coverType, item.coverValue)}
      <div class="book-meta">
        <h3>${item.title}</h3>
        <p>ادامه از ${percent}٪</p>
        <div class="progress-bar"><span style="width:${percent}%"></span></div>
      </div>
    </article>`;
}

async function loadCategories() {
  const container = document.getElementById('categoryPills');
  if (!container) {
    return;
  }
  try {
    const listing = await browseFolder('');
    const folders = listing.folders || [];
    container.innerHTML =
      '<button class="pill active" data-path="">همه</button>' +
      folders
        .map((folder) => `<button class="pill" data-path="${folder.path}">${folder.name}</button>`)
        .join('');

    container.querySelectorAll('.pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        navigateToLibrary(pill.dataset.path || '');
      });
    });
  } catch (_error) {
    container.innerHTML = '<span class="empty-state">هنوز پوشه‌ای در کتابخانه نیست</span>';
  }
}

async function loadContinueSection() {
  const section = document.getElementById('continueSection');
  const row = document.getElementById('continueRow');
  if (!section || !row) {
    return;
  }

  try {
    const me = await apiRequest('/me').catch(() => null);
    if (me) {
      const recent = await apiRequest('/progress/recent');
      const items = recent.items || [];
      if (items.length === 0) {
        section.style.display = 'none';
        return;
      }
      section.style.display = 'block';
      row.innerHTML = items.map(continueCardHtml).join('');
      bindContinueCards(row);
      return;
    }
  } catch (_error) {
    /* guest fallback below */
  }

  const guestRecent = localStorage.getItem('bookshelf_guest_recent');
  if (!guestRecent) {
    section.style.display = 'block';
    row.innerHTML =
      '<p class="empty-state">ورود کن تا جای مطالعه روی همهٔ دستگاه‌ها ذخیره شود — <button class="btn-ghost" id="continueLoginBtn">حساب</button></p>';
    const loginBtn = document.getElementById('continueLoginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => window.BookShelfRouter.showPage('account'));
    }
    return;
  }

  try {
    const parsed = JSON.parse(guestRecent);
    section.style.display = 'block';
    row.innerHTML = continueCardHtml(parsed);
    bindContinueCards(row);
  } catch (_error) {
    section.style.display = 'none';
  }
}

/**
 * @param {HTMLElement} container
 */
function bindContinueCards(container) {
  container.querySelectorAll('[data-path]').forEach((card) => {
    card.addEventListener('click', () => {
      navigateToReader(card.dataset.path);
    });
  });
}

function setupSearch() {
  const input = document.getElementById('homeSearchInput');
  const results = document.getElementById('homeSearchResults');
  if (!input || !results) {
    return;
  }

  input.addEventListener('input', () => {
    clearTimeout(searchTimer);
    const query = input.value.trim();
    if (query.length < 2) {
      results.innerHTML = '';
      results.style.display = 'none';
      return;
    }
    searchTimer = setTimeout(async () => {
      try {
        const data = await searchLibrary(query);
        const items = data.items || [];
        if (items.length === 0) {
          results.innerHTML =
            '<div class="empty-state">نتیجه‌ای پیدا نشد — کلمهٔ دیگر امتحان کن</div>';
        } else {
          results.innerHTML = items
            .map(
              (item) => `
            <div class="search-result-item" data-path="${item.path}">
              <div style="width:36px;height:48px;background:var(--bg-elevated);border-radius:4px;font-size:10px;display:flex;align-items:center;justify-content:center;">${item.title.slice(0, 8)}</div>
              <div><strong>${item.title}</strong><br><small>${item.folder || 'ریشه'}</small></div>
            </div>`,
            )
            .join('');
          results.querySelectorAll('[data-path]').forEach((row) => {
            row.addEventListener('click', () => navigateToReader(row.dataset.path));
          });
        }
        results.style.display = 'block';
      } catch (_error) {
        results.innerHTML = '<div class="empty-state">خطا در جستجو</div>';
        results.style.display = 'block';
      }
    }, 300);
  });
}

async function refresh() {
  await Promise.all([loadCategories(), loadContinueSection()]);
}

function initHome() {
  setupSearch();
  const searchIcon = document.getElementById('homeSearchIcon');
  if (searchIcon) {
    searchIcon.innerHTML = icon('search');
  }
}

window.BookShelfHome = { initHome, refresh };
})();
