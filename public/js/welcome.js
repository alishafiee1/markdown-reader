(function () {
  'use strict';

/**
 * صفحه خوش‌آمد --- first-visit welcome screen ---
 */

function initWelcome() {
  const startButton = document.getElementById('welcomeStartBtn');
  if (!startButton) {
    return;
  }

  startButton.addEventListener('click', () => {
    localStorage.setItem('bookshelf_welcome_done', '1');
    window.BookShelfRouter.showPage('home');
    if (window.BookShelfHome) {
      window.BookShelfHome.refresh();
    }
    window.BookShelfRouter.navigateToLibrary('');
  });
}

window.BookShelfWelcome = { initWelcome };
})();
