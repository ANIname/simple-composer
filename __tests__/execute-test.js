const replace    = require('lodash/replace');
const isFunction = require('lodash/isFunction');

/**
 * @param {string} testName - The test name
 * @param {string} testPath - The test path
 * @param {Function} testHandler - The test handler
 */
function executeTest(testName, testPath, testHandler) {
  if (!isFunction(testHandler)) return;

  const humanLikeTestName = replace(testName, /-/g, ' ');

  test(humanLikeTestName, testHandler);
}

module.exports = executeTest;
