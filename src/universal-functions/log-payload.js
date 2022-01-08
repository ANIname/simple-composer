const { inspect } = require('util');

const get        = require('lodash/get');
const isFunction = require('lodash/isFunction');

/**
 * Log data from payload
 *
 * @param {object} parameters - Inspect object parameters
 * @returns {Function} universal function
 */
function logPayload(parameters = {}) {
  const {
    colors = true,
    sorted = true,

    depth = 10,

    prefix = '',

    path,

    ...additionalParameters
  } = parameters;

  /**
   * @param {object} payload - Universal function context
   * @param {Function|undefined} next - Next function in composed task
   * @returns {Function|*} call next function or return inspected object
   */
  function universalFunction(payload, next) {
    const objectToLog = path ? get(payload, path) : payload;

    const inspectedObjectToLog = inspect(objectToLog, {
      colors,
      sorted,

      depth,

      ...additionalParameters,
    });

    console.info(prefix, inspectedObjectToLog);

    return isFunction(next) ? next() : inspectedObjectToLog;
  }

  return universalFunction;
}

module.exports = logPayload;
