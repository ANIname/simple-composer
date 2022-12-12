const isFunction = require('lodash/isFunction');
const merge      = require('lodash/merge');
const set        = require('lodash/set');

const nunjucks = require('../../services/nunjucks');

/**
 * Merge data from payload
 *
 * @param {string} variableDestinationPath - Path where variable will saved
 * @param {...any} sources - The source objects
 * @returns {Function} universal function
 */
function mergeData(variableDestinationPath, ...sources) {
  const stringifiedSources = nunjucks.JSONstringify(sources);
  const compiledSources    = nunjucks.compile(stringifiedSources);

  /**
   * @param {object} payload - Universal function context
   * @param {Function|undefined} next - Next function in composed task
   * @returns {Function|*} call next function or return merged sources
   */
  function universalFunction(payload, next) {
    const renderedSources = compiledSources.render(payload);
    const parsedSources   = nunjucks.JSONparseTemplateString(renderedSources);
    const mergedSources   = merge(...parsedSources);

    set(payload, variableDestinationPath, mergedSources);

    return isFunction(next) ? next() : mergedSources;
  }

  return universalFunction;
}

module.exports = mergeData;
