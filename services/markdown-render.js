'use strict';

const { marked } = require('marked');

/**
 * Converts markdown source to HTML using marked.
 * @param {string} markdownSource - Raw markdown text
 * @returns {string} Rendered HTML fragment
 */
function renderMarkdownToHtml(markdownSource) {
  return marked.parse(markdownSource);
}

module.exports = {
  renderMarkdownToHtml,
};
