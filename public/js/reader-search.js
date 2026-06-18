(function () {
  'use strict';

/**
 * جستجوی درون‌سند --- in-document search with highlight ---
 */

const MAX_HIGHLIGHTS = 200;

/** @type {{ marks: HTMLElement[], index: number }} */
const searchState = {
  marks: [],
  index: -1,
};

/**
 * @param {HTMLElement} container
 */
function clearHighlights(container) {
  container.querySelectorAll('mark.search-hit').forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) {
      return;
    }
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
  searchState.marks = [];
  searchState.index = -1;
}

/**
 * @param {HTMLElement} container
 * @param {string} term
 * @returns {number}
 */
function highlightTerm(container, term) {
  clearHighlights(container);
  if (!term) {
    return 0;
  }

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  const lowerTerm = term.toLowerCase();
  let count = 0;

  for (const node of textNodes) {
    if (count >= MAX_HIGHLIGHTS) {
      break;
    }
    const text = node.textContent || '';
    const lower = text.toLowerCase();
    let start = 0;
    let index = lower.indexOf(lowerTerm, start);
    if (index === -1) {
      continue;
    }

    const fragment = document.createDocumentFragment();
    while (index !== -1 && count < MAX_HIGHLIGHTS) {
      if (index > start) {
        fragment.appendChild(document.createTextNode(text.slice(start, index)));
      }
      const mark = document.createElement('mark');
      mark.className = 'search-hit';
      mark.textContent = text.slice(index, index + term.length);
      fragment.appendChild(mark);
      searchState.marks.push(mark);
      count += 1;
      start = index + term.length;
      index = lower.indexOf(lowerTerm, start);
    }
    if (start < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(start)));
    }
    node.parentNode.replaceChild(fragment, node);
  }

  if (searchState.marks.length > 0) {
    searchState.index = 0;
    activateMark(0);
  }
  return searchState.marks.length;
}

/**
 * @param {number} index
 */
function activateMark(index) {
  searchState.marks.forEach((mark, markIndex) => {
    mark.classList.toggle('active', markIndex === index);
  });
  const active = searchState.marks[index];
  if (active) {
    active.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function nextMatch() {
  if (searchState.marks.length === 0) {
    return;
  }
  searchState.index = (searchState.index + 1) % searchState.marks.length;
  activateMark(searchState.index);
}

function prevMatch() {
  if (searchState.marks.length === 0) {
    return;
  }
  searchState.index =
    (searchState.index - 1 + searchState.marks.length) % searchState.marks.length;
  activateMark(searchState.index);
}

window.BookShelfReaderSearch = {
  clearHighlights,
  highlightTerm,
  nextMatch,
  prevMatch,
  get state() {
    return searchState;
  },
};
})();
