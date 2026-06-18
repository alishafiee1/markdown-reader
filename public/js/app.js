(function () {
  'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const { icon } = window.BookShelfIcons;
  const { showPage } = window.BookShelfRouter;

  document.querySelectorAll('.bottom-nav button').forEach((button) => {
    const nav = button.dataset.nav;
    if (nav) {
      button.innerHTML = `${icon(nav === 'home' ? 'home' : nav === 'library' ? 'library' : nav === 'continue' ? 'continue' : 'account')}<span>${button.dataset.label}</span>`;
      button.addEventListener('click', () => {
        if (nav === 'continue') {
          window.BookShelfRouter.showPage('home');
          window.BookShelfHome?.refresh();
          return;
        }
        if (nav === 'library') {
          window.BookShelfRouter.navigateToLibrary(window.BookShelfRouter.state.libraryPath);
          return;
        }
        showPage(nav);
        if (nav === 'home') {
          window.BookShelfHome?.refresh();
        }
        if (nav === 'account') {
          window.BookShelfAccount?.refreshAccount();
        }
      });
    }
  });

  window.BookShelfWelcome.initWelcome();
  window.BookShelfHome.initHome();
  window.BookShelfLibrary.initLibrary();
  window.BookShelfReader.initReader();
  window.BookShelfAccount.initAccount();
  window.BookShelfAdminModal.initAdminModal();
  window.BookShelfRouter.initRoute();
});
})();
