(function () {
  'use strict';

  /**
   * کلاینت API --- fetch wrapper for /api endpoints ---
   */

  const API_BASE = './api';

  /**
   * @param {string} path
   * @param {RequestInit} [options]
   * @returns {Promise<unknown>}
   */
  async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'same-origin',
      ...options,
      headers: {
        ...(options.body && !(options.body instanceof FormData)
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...options.headers,
      },
    });

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

  function searchLibrary(query) {
    return apiRequest(`/search?q=${encodeURIComponent(query)}`);
  }

  function browseFolder(folderPath = '') {
    const suffix = folderPath ? `?path=${encodeURIComponent(folderPath)}` : '';
    return apiRequest(`/browse${suffix}`);
  }

  function fetchDocument(docPath) {
    return apiRequest(`/doc?path=${encodeURIComponent(docPath)}`);
  }

  window.BookShelfApi = {
    apiRequest,
    searchLibrary,
    browseFolder,
    fetchDocument,
  };
})();
