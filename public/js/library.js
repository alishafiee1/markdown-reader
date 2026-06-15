'use strict';

/**
 * صفحه کتابخانه --- breadcrumb folder explorer grid ---
 */

const { browseFolder } = window.BookShelfApi;
const { icon } = window.BookShelfIcons;
const { navigateToReader, state } = window.BookShelfRouter;

/**
 * @param {string} title
 * @param {string} coverType
 * @param {string} coverValue
 * @returns {string}
 */
function coverBlock(title, coverType, coverValue) {
  if (coverType === 'image' && coverValue) {
    return `<div class="book-cover"><img src="${coverValue}" alt=""></div>`;
  }
  const color = coverValue || '#2563EB';
  return `<div class="book-cover" style="background:${color}">${title.slice(0, 20)}</div>`;
}

/**
 * @param {Array<{ label: string, path: string }>} breadcrumbs
 * @returns {string}
 */
function breadcrumbsHtml(breadcrumbs) {
  return breadcrumbs
    .map((crumb, index) => {
      const sep = index > 0 ? '<span class="sep">›</span>' : '';
      return `${sep}<button type="button" data-crumb="${crumb.path}">${crumb.label}</button>`;
    })
    .join('');
}

/**
 * @param {string} folderPath
 */
async function open(folderPath = '') {
  state.libraryPath = folderPath;
  state.returnLibraryPath = folderPath;
  const grid = document.getElementById('libraryGrid');
  const crumbs = document.getElementById('libraryBreadcrumbs');
  if (!grid) {
    return;
  }

  grid.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div>';

  try {
    const listing = await browseFolder(folderPath);
    if (crumbs) {
      crumbs.innerHTML = breadcrumbsHtml(listing.breadcrumbs || []);
      crumbs.querySelectorAll('[data-crumb]').forEach((button) => {
        button.addEventListener('click', () => open(button.dataset.crumb || ''));
      });
    }

    const folders = (listing.folders || [])
      .map(
        (folder) => `
      <article class="folder-card" data-folder="${folder.path}">
        <div class="folder-icon">${icon('folder')}</div>
        <div class="book-meta"><h3>${folder.name}</h3></div>
      </article>`,
      )
      .join('');

    const books = (listing.books || [])
      .map(
        (book) => `
      <article class="book-card" data-book="${book.path}">
        <button type="button" class="admin-edit-btn" data-edit="${book.path}" title="ویرایش جلد">${icon('edit')}</button>
        ${coverBlock(book.title, book.coverType, book.coverValue)}
        <div class="book-meta"><h3>${book.title}</h3><p>${book.description || ''}</p></div>
      </article>`,
      )
      .join('');

    if (!folders && !books) {
      grid.innerHTML = '<p class="empty-state">این پوشه خالی است</p>';
      return;
    }

    if ((listing.folders || []).length === 0 && (listing.books || []).length === 0) {
      grid.innerHTML = '<p class="empty-state">این پوشه خالی است — از مسیر بالا پوشهٔ دیگر انتخاب کن</p>';
      return;
    }

    grid.innerHTML = `<div class="book-grid">${folders}${books}</div>`;

    grid.querySelectorAll('[data-folder]').forEach((card) => {
      card.addEventListener('click', () => open(card.dataset.folder));
    });

    grid.querySelectorAll('[data-book]').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('.admin-edit-btn')) {
          return;
        }
        navigateToReader(card.dataset.book);
      });
    });

    grid.querySelectorAll('[data-edit]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        if (window.BookShelfAdminModal) {
          window.BookShelfAdminModal.open(button.dataset.edit);
        }
      });
    });
  } catch (error) {
    grid.innerHTML = `<p class="empty-state">کتابخانه در دسترس نیست — ${error.message}</p>`;
  }
}

function initLibrary() {
  /* opened via router */
}

window.BookShelfLibrary = { initLibrary, open };
