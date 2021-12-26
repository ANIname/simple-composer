const nunjucks = require('nunjucks');
const replace  = require('lodash/replace');

/**
 * Parse template string to JSON
 *
 * @param {string} string - Template string
 * @returns {object} Parsed object
 */
function JSONparseTemplateString(string) {
  return JSON.parse(string, (key, value) => {
    try {
      return JSON.parse(replace(value, /&quot;/g, '"'));
    }

    catch {
      return value;
    }
  });
}

module.exports = {
  JSONparseTemplateString,
  ...nunjucks,
};
