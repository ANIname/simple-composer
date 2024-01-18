const he       = require('he')
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

  preparedString = replace(preparedString, /&amp;#92;/g, '&#92;');

  return JSON.parse(preparedString, (key, value) => {
    try {
      const preparedValue = he.decode(value);

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

module.exports = {
  JSONparseTemplateString,
  JSONstringify,
  ...nunjucks,
};
