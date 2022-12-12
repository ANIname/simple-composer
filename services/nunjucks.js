const nunjucks = require('nunjucks');
const replace  = require('lodash/replace');
const isNumber = require('lodash/isNumber');

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

      const result = JSON.parse(preparedValue);

      return isNumber(result) ? value : result;
    }

    catch {
      return value;
    }
  });
}

/**
 * Same as JSON.stringify, but converts BigInts to Numbers.
 *
 * @param {*} value A JavaScript value, an object or array, to convert.
 * @returns {string} A JSON string representing the given value.
 */
function JSONstringify(value) {
  return JSON.stringify(value, (replacerKey, replacerValue) => (
    // eslint-disable-next-line lodash/prefer-lodash-typecheck
    typeof replacerValue === 'bigint' ? Number(replacerValue) : replacerValue
  ));
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
  JSONstringify,
  ...nunjucks,
};
