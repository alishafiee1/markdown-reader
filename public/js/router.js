'use strict';

/**
 * مسیریابی SPA --- page routing and deep links ---
 */

const PAGES = ['welcome', 'home', 'library', 'reader', 'account'];

/** @type {{ currentPage: string, libraryPath: string, readerPath: string, returnLibraryPath: string }} */
const state = {
  currentPage: 'home',
  libraryPath: '',
  readerPath: '',
  returnLibraryPath: '',
};

/**
 * @param {string} pageName
 */
function showPage(pageName) {
  if (!PAGES.includes(pageName)) {
    return;
  }
  state.currentPage = pageName;
  document.querySelectorAll('.page').forEach((element) => {
    element.classList.toggle('active', element.dataset.page === pageName);
  });
  document.querySelectorAll('.bottom-nav button').forEach((button) => {
    button.classList.toggle('active', button.dataset.nav === pageName);
  });
  if (pageName !== 'reader') {
    document.getElementById('app').classList.remove('reader-fullscreen');
  }
}

/**
 * @param {string} path
 */
function navigateToReader(path) {
  state.readerPath = path;
  const url = new URL(window.location.href);
  url.searchParams.set('path', path);
  window.history.replaceState({}, '', url);
  showPage('reader');
  if (window.BookShelfReader) {
    window.BookShelfReader.open(path);
  }
}

/**
 * @param {string} [folderPath]
 */
function navigateToLibrary(folderPath = '') {
  state.libraryPath = folderPath;
  showPage('library');
  if (window.BookShelfLibrary) {
    window.BookShelfLibrary.open(folderPath);
  }
}

function returnFromReader() {
  const url = new URL(window.location.href);
  url.searchParams.delete('path');
  window.history.replaceState({}, '', url);
  navigateToLibrary(state.returnLibraryPath);
}

/**
 * Parses initial route from URL and localStorage.
 */
function initRoute() {
  const url = new URL(window.location.href);
  const docPath = url.searchParams.get('path');
  if (docPath) {
    state.returnLibraryPath = docPath.includes('/')
      ? docPath.split('/').slice(0, -1).join('/')
      : '';
    navigateToReader(docPath);
    return;
  }

  const welcomeDone = localStorage.getItem('bookshelf_welcome_done') === '1';
  if (!welcomeDone) {
    showPage('welcome');
    return;
  }
  showPage('home');
  if (window.BookShelfHome) {
    window.BookShelfHome.refresh();
  }
}

window.BookShelfRouter = {
  state,
  showPage,
  navigateToReader,
  navigateToLibrary,
  returnFromReader,
  initRoute,
};
