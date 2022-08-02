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
      const preparedValue = fixSpecialChars(value);

      return JSON.parse(preparedValue);
    }

    catch {
      return value;
    }
  });
}

/**
 * For correct json parsing, replace special chars
 *
 * @param {string} value - String to fix
 * @returns {string} Fixed string
 */
function fixSpecialChars(value) {
  let preparedValue = value;

  preparedValue = replace(preparedValue, /\n/g, '\\n');      // \n        -> \\n
  preparedValue = replace(preparedValue, /\t/g, '\\t');      // \t        -> \\t
  preparedValue = replace(preparedValue, /&quot;/g, '"');    // &quot;    -> "

  preparedValue = replace(preparedValue, /&amp;/g, '&');

  preparedValue = replace(preparedValue, /&amp;#39;/g, "'"); // &amp;#39; -> '
  preparedValue = replace(preparedValue, /&#39;/g, "'");     // &;#39;    -> '

  return preparedValue;
}

module.exports = {
  JSONparseTemplateString,
  ...nunjucks,
};
