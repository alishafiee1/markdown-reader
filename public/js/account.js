(function () {
  'use strict';

/**
 * صفحه حساب --- login, register, logout ---
 */

const { apiRequest } = window.BookShelfApi;

let currentUser = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) {
    return;
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function renderLoggedIn(user) {
  const loggedOut = document.getElementById('accountLoggedOut');
  const loggedIn = document.getElementById('accountLoggedIn');
  const banner = document.getElementById('adminPasswordBanner');

  if (loggedOut) {
    loggedOut.hidden = true;
  }
  if (loggedIn) {
    loggedIn.hidden = false;
    document.getElementById('accountUsername').textContent = user.username;
    document.getElementById('accountRole').textContent =
      user.role === 'admin' ? 'مدیر' : 'کاربر';
  }

  if (banner) {
    banner.hidden = !user.needsPasswordChange;
  }

  document.body.classList.toggle('is-admin', user.role === 'admin');
}

function renderLoggedOut() {
  const loggedOut = document.getElementById('accountLoggedOut');
  const loggedIn = document.getElementById('accountLoggedIn');
  const banner = document.getElementById('adminPasswordBanner');

  if (loggedOut) {
    loggedOut.hidden = false;
  }
  if (loggedIn) {
    loggedIn.hidden = true;
  }
  if (banner) {
    banner.hidden = true;
  }
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  if (loginPanel) {
    loginPanel.hidden = false;
  }
  if (registerPanel) {
    registerPanel.hidden = true;
  }
  document.body.classList.remove('is-admin');
}

async function refreshAccount() {
  try {
    currentUser = await apiRequest('/me');
    renderLoggedIn(currentUser);
  } catch (_error) {
    currentUser = null;
    renderLoggedOut();
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const errorEl = document.getElementById('loginError');
  const username = form.username.value.trim();
  const password = form.password.value;

  try {
    const user = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    currentUser = user;
    renderLoggedIn(user);
    showToast('ورود موفق');
    if (window.BookShelfHome) {
      window.BookShelfHome.refresh();
    }
  } catch (error) {
    if (errorEl) {
      errorEl.textContent = error.message;
    }
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const form = event.target;
  const errorEl = document.getElementById('registerError');
  if (errorEl) {
    errorEl.textContent = '';
  }
  try {
    const user = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: form.username.value.trim(),
        password: form.password.value,
      }),
    });
    currentUser = user;
    renderLoggedIn(user);
    document.getElementById('registerPanel').hidden = true;
    document.getElementById('loginPanel').hidden = true;
    showToast('ثبت‌نام موفق');
    if (window.BookShelfHome) {
      window.BookShelfHome.refresh();
    }
  } catch (error) {
    if (errorEl) {
      errorEl.textContent = error.message;
    }
  }
}

async function handleLogout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (_error) {
    /* session may already be gone */
  }
  currentUser = null;
  renderLoggedOut();
  showToast('خارج شدید');
  if (window.BookShelfHome) {
    window.BookShelfHome.refresh();
  }
}

function initAccount() {
  document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
  document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  document.getElementById('showRegisterBtn')?.addEventListener('click', () => {
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginPanel').hidden = true;
    document.getElementById('registerPanel').hidden = false;
  });
  document.getElementById('showLoginBtn')?.addEventListener('click', () => {
    document.getElementById('registerError').textContent = '';
    document.getElementById('registerPanel').hidden = true;
    document.getElementById('loginPanel').hidden = false;
  });
  refreshAccount();
}

window.BookShelfAccount = { initAccount, refreshAccount, get currentUser() { return currentUser; } };
})();
