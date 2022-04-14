const nunjucks = require('nunjucks');
const replace  = require('lodash/replace');

/**
 * Parse template string to JSON
 *
 * @param {string} string - Template string
 * @returns {object} Parsed object
 */
function JSONparseTemplateString(string) {
  let preparedString = string;

  preparedString = replace(preparedString, /\n/g, '\\n');

  return JSON.parse(preparedString, (key, value) => {
    try {
      let preparedValue = value;

      preparedValue = replace(preparedValue, /\n/g, '\\n');
      preparedValue = replace(preparedValue, /\t/g, '\\t');
      preparedValue = replace(preparedValue, /&quot;/g, '"');

      return JSON.parse(preparedValue);
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
