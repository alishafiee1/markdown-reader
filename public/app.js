document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = './api';

  let isRtl = true;
  let currentFileName = 'document.html';
  let currentRawHTML = '';

  if (typeof marked === 'undefined') {
    alert('فایل marked.min.js پیدا نشد!');
  }

  /**
   * Performs fetch against module API with JSON handling.
   * @param {string} path - Relative API path
   * @param {RequestInit} [options] - Fetch options
   * @returns {Promise<unknown>}
   */
  async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, options);
    if (response.status === 204) {
      return null;
    }
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();
    if (!response.ok) {
      const message = payload && payload.error ? payload.error : response.statusText;
      throw new Error(message);
    }
    return payload;
  }

  /**
   * Loads article list from server and renders sidebar.
   * @returns {Promise<void>}
   */
  async function loadHistoryFromApi() {
    try {
      const articles = await apiRequest('/articles');
      renderHistoryUI(Array.isArray(articles) ? articles : []);
    } catch (error) {
      console.error('خطا در بارگذاری کتابخانه:', error);
      document.getElementById('historyContainer').innerHTML =
        '<span style="color:red; font-size:13px;">خطا در اتصال به سرور. npm start زده شده؟</span>';
    }
  }

  /**
   * Saves uploaded markdown via API.
   * @param {string} filename - Display filename
   * @param {string} rawMd - Markdown source
   * @param {string} htmlContent - Client-rendered HTML preview
   * @returns {Promise<void>}
   */
  async function saveArticleToApi(filename, rawMd, htmlContent) {
    await apiRequest('/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, markdown: rawMd, html: htmlContent }),
    });
    await loadHistoryFromApi();
  }

  /**
   * Clears all articles after user confirmation.
   * @returns {Promise<void>}
   */
  async function clearAllArticles() {
    if (!confirm('آیا از حذف تمام کتابخانه مطمئن هستید؟')) {
      return;
    }
    await apiRequest('/articles', { method: 'DELETE' });
    await loadHistoryFromApi();
    document.getElementById('welcomeMessage').style.display = 'block';
    document.getElementById('markdownOutput').style.display = 'none';
    document.getElementById('saveAsBtn').style.display = 'none';
    document.getElementById('appTitle').innerText = 'کتاب‌خوان مارک‌داون';
  }

  /**
   * Triggers bundle sync from content/docs on server.
   * @returns {Promise<void>}
   */
  async function syncBundleFromServer() {
    try {
      await apiRequest('/sync-bundle', { method: 'POST' });
      await loadHistoryFromApi();
      alert('بروزرسانی از پوشه content انجام شد.');
    } catch (error) {
      alert(`خطا در sync: ${error.message}`);
    }
  }

  loadHistoryFromApi();

  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');

  function toggleMenu() {
    drawer.classList.toggle('open');
    overlay.classList.toggle('show');
  }

  document.getElementById('menuBtn').addEventListener('click', toggleMenu);
  document.getElementById('closeMenuBtn').addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
  document.getElementById('syncBundleBtn').addEventListener('click', syncBundleFromServer);

  const themes = ['light', 'dark', 'reading'];
  let currentThemeIndex = 0;
  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.className = themes[currentThemeIndex];
  });

  document.getElementById('directionToggleBtn').addEventListener('click', () => {
    isRtl = !isRtl;
    const outputElement = document.getElementById('markdownOutput');
    outputElement.style.direction = isRtl ? 'rtl' : 'ltr';
    outputElement.style.textAlign = isRtl ? 'justify' : 'left';
  });

  /**
   * Renders sidebar history buttons.
   * @param {Array<{ slug: string, filename: string, source: string }>} articles
   */
  function renderHistoryUI(articles) {
    const container = document.getElementById('historyContainer');
    container.innerHTML = '';

    if (articles.length === 0) {
      container.innerHTML = '<span style="color:gray; font-size:13px;">کتابخانه خالی است.</span>';
      return;
    }

    articles.forEach((article) => {
      const button = document.createElement('button');
      button.className = 'history-item';
      const sourceLabel = article.source === 'bundle' ? '📦' : '📤';
      button.innerText = `${sourceLabel} ${article.filename.replace(/\.html$/, '')}`;
      button.onclick = async () => {
        try {
          const detail = await apiRequest(`/articles/${encodeURIComponent(article.slug)}`);
          displayContent(detail.html, detail.filename);
          toggleMenu();
        } catch (error) {
          alert(`خطا در بارگذاری: ${error.message}`);
        }
      };
      container.appendChild(button);
    });

    const clearButton = document.createElement('button');
    clearButton.className = 'delete-db-btn';
    clearButton.innerText = '🗑️ پاک کردن کل کتابخانه';
    clearButton.onclick = () => {
      clearAllArticles().catch((error) => alert(error.message));
    };
    container.appendChild(clearButton);
  }

  /**
   * Shows rendered HTML in main pane.
   * @param {string} html - HTML content
   * @param {string} filename - Display name
   */
  function displayContent(html, filename) {
    currentRawHTML = html;
    currentFileName = filename.endsWith('.html') ? filename : `${filename.replace(/\.[^/.]+$/, '')}.html`;

    document.getElementById('welcomeMessage').style.display = 'none';

    const outputElement = document.getElementById('markdownOutput');
    outputElement.style.display = 'block';
    outputElement.innerHTML = html;
    outputElement.style.direction = isRtl ? 'rtl' : 'ltr';
    outputElement.style.textAlign = isRtl ? 'justify' : 'left';

    document.getElementById('appTitle').innerText = currentFileName.replace('.html', '');
    document.getElementById('saveAsBtn').style.display = 'inline-block';
  }

  document.getElementById('mdFileInput').addEventListener('change', function onFileChange(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async function onFileLoaded(loadEvent) {
      const rawMd = loadEvent.target.result;
      const html = marked.parse(rawMd);
      const outputName = file.name.replace(/\.[^/.]+$/, '') + '.html';

      displayContent(html, outputName);
      try {
        await saveArticleToApi(file.name, rawMd, html);
        toggleMenu();
      } catch (error) {
        alert(`خطا در ذخیره: ${error.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  });

  document.getElementById('saveAsBtn').addEventListener('click', async function onSaveAsClick() {
    const dirAttr = isRtl ? 'rtl' : 'ltr';
    const alignAttr = isRtl ? 'justify' : 'left';
    const fullHtmlPage = `<!DOCTYPE html><html lang="${isRtl ? 'fa' : 'en'}" dir="${dirAttr}">
<head><meta charset="utf-8"><title>${currentFileName}</title></head>
<body style="font-family: Tahoma, Arial, sans-serif; line-height: 1.8; padding: 40px; max-width: 800px; margin: auto; direction: ${dirAttr}; text-align: ${alignAttr}; color: #333;">
${currentRawHTML}
</body></html>`;

    try {
      if (window.showSaveFilePicker) {
        const handle = await window.showSaveFilePicker({
          suggestedName: currentFileName,
          types: [{ description: 'HTML File', accept: { 'text/html': ['.html'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(fullHtmlPage);
        await writable.close();
        return;
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
      return;
    }

    const blob = new Blob([fullHtmlPage], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = currentFileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  });
});
