'use strict';

/**
 * مودال ویرایش جلد --- admin book cover edit modal ---
 */

const { apiRequest, fetchDocument } = window.BookShelfApi;

let currentDocPath = '';

function openModal() {
  document.getElementById('adminModal')?.classList.add('open');
}

function closeModal() {
  document.getElementById('adminModal')?.classList.remove('open');
  currentDocPath = '';
}

/**
 * @param {string} docPath
 */
async function open(docPath) {
  currentDocPath = docPath;
  try {
    const doc = await fetchDocument(docPath);
    const form = document.getElementById('adminCoverForm');
    if (!form) {
      return;
    }
    form.title.value = doc.title;
    form.description.value = doc.description || '';
    form.coverColor.value = doc.coverType === 'color' ? doc.coverValue || '#2563EB' : '#2563EB';
    const preview = document.getElementById('adminCoverPreview');
    if (preview) {
      if (doc.coverType === 'image' && doc.coverValue) {
        preview.innerHTML = `<img src="${doc.coverValue}" alt="" style="width:100%;height:160px;object-fit:cover;border-radius:8px;">`;
      } else {
        preview.innerHTML = `<div style="height:160px;border-radius:8px;background:${form.coverColor.value};display:flex;align-items:center;justify-content:center;color:#fff;padding:1rem;text-align:center;">${doc.title}</div>`;
      }
    }
    openModal();
  } catch (error) {
    alert(error.message);
  }
}

async function saveMetadata(event) {
  event.preventDefault();
  const form = event.target;
  if (!currentDocPath) {
    return;
  }

  try {
    const encodedPath = currentDocPath.split('/').map(encodeURIComponent).join('/');
    await apiRequest(`/admin/books/${encodedPath}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: form.title.value,
        description: form.description.value,
        coverType: 'color',
        coverValue: form.coverColor.value,
      }),
    });
    closeModal();
    if (window.BookShelfLibrary) {
      window.BookShelfLibrary.open(window.BookShelfRouter.state.libraryPath);
    }
  } catch (error) {
    alert(error.message);
  }
}

async function uploadCover(event) {
  const file = event.target.files?.[0];
  if (!file || !currentDocPath) {
    return;
  }
  const formData = new FormData();
  formData.append('cover', file);
  try {
    const encodedPath = currentDocPath.split('/').map(encodeURIComponent).join('/');
    await apiRequest(`/admin/books/${encodedPath}/cover`, {
      method: 'POST',
      body: formData,
    });
    closeModal();
    if (window.BookShelfLibrary) {
      window.BookShelfLibrary.open(window.BookShelfRouter.state.libraryPath);
    }
  } catch (error) {
    alert(error.message);
  }
}

function initAdminModal() {
  document.getElementById('adminCoverForm')?.addEventListener('submit', saveMetadata);
  document.getElementById('adminModalClose')?.addEventListener('click', closeModal);
  document.getElementById('adminModalCancel')?.addEventListener('click', closeModal);
  document.getElementById('adminCoverFile')?.addEventListener('change', uploadCover);
  document.getElementById('adminCoverForm')?.coverColor?.addEventListener('input', (event) => {
    const preview = document.getElementById('adminCoverPreview');
    const title = document.getElementById('adminCoverForm')?.title?.value || '';
    if (preview) {
      preview.innerHTML = `<div style="height:160px;border-radius:8px;background:${event.target.value};display:flex;align-items:center;justify-content:center;color:#fff;">${title}</div>`;
    }
  });
}

window.BookShelfAdminModal = { initAdminModal, open, close: closeModal };
