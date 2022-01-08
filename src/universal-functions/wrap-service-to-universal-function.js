const { promisify } = require('util');
const set           = require('lodash/set');
const castPath      = require('lodash/_castPath');
const isFunction    = require('lodash/isFunction');

const nunjucks = require('../../services/nunjucks');

/**
 * Wrap service to universal function, for use composed task payload
 *
 * @param {object}  parameters - Wrap service parameters
 * @param {object}  parameters.service - Module/Service that will wrap to universal function
 * @param {string}  parameters.serviceName - Module/Service name (optional)
 * @param {boolean} parameters.debug - Do you want to enable debug mode?
 *
 * !important one parameter below can be true
 * @param {boolean} parameters.shouldPromisify - Takes a function following the common error-first callback style, i.e. taking a (err, value) => ... callback as the last argument, and returns a version that returns promises.
 * @param {boolean} parameters.shouldUseNativeReturnPromise - For ex: aws services should call .promise()
 * @returns {Function} - Universal function wizard
 * @example
 *
 * // Here we convert prisma npm module to universal function and will try to find user in our database
 * // More about prisma module: https://www.prisma.io
 * const prismaUniversalFunction = wrapServiceToUniversalFunction(prisma)
 * const foundUser = await prismaUniversalFunction('user.findUnique', {
 *   where: { id: '6691fb2a-98c3-4143-8fd7-ec6777728357' }
 * })
 * // { id: "6691fb2a-98c3-4143-8fd7-ec6777728357", nickName: 'KiiDii' }
 */
function wrapServiceToUniversalFunction(parameters) {
  const {
    service,
    serviceName = '',

    debug = false,
    shouldPromisify = false,
    shouldUseNativeReturnPromise = false,
  } = parameters;

  /**
   * @param {string} callFunctionPath - Path to target operation in service object
   * @param {...any} callFunctionArguments - Arguments for target operation
   * @returns {Function} Universal function
   */
  function universalFunctionWizard(callFunctionPath, ...callFunctionArguments) {
    const stringifiedOperationParameters = JSON.stringify(callFunctionArguments);
    const compiledOperationParameters    = nunjucks.compile(stringifiedOperationParameters);
    const operationPath                  = `${serviceName}.${callFunctionPath}`;

    /**
     * @param {object} payload - Universal function context
     * @param {Function|undefined} next - Next function in composed task
     * @returns {Function|*} call next function or return merged sources
     */
    async function universalFunction(payload, next) {
      if (debug) console.info('♻️', `context.${operationPath}.parameters.beforeTransformation`, callFunctionArguments);

      const callFunctionPathKeys                   = castPath(callFunctionPath, payload);
      const renderedStringifiedOperationParameters = compiledOperationParameters.render(payload);

      const operationParameters = nunjucks.JSONparseTemplateString(renderedStringifiedOperationParameters);

      if (debug) console.info('♻️', `context.${operationPath}.parameters.afterTransformation`, operationParameters);

      const operationResult = await callOperation({
        service,
        shouldPromisify,
        operationParameters,
        callFunctionPathKeys,
        shouldUseNativeReturnPromise,
      });

      set(payload, `context.${operationPath}.result`, operationResult);
      set(payload, `context.${operationPath}.parameters.beforeTransformation`, callFunctionArguments);
      set(payload, `context.${operationPath}.parameters.afterTransformation`, operationParameters);

      if (debug) console.info('♻️', `context.${operationPath}.result`, operationResult);

      return isFunction(next) ? next() : operationResult;
    }

    return universalFunction;
  }

  return universalFunctionWizard;
}

/**
 * Get operation and call it
 * For some services, example cognition, the lodash.get will not work.
 *
 * @param {object} parameters - Call operation parameters
 * @returns {*} operation result
 */
async function callOperation(parameters) {
  const {
    service,
    shouldPromisify,
    operationParameters,
    callFunctionPathKeys,
    shouldUseNativeReturnPromise,
  } = parameters;

  let operationResult;

  let object = service;
  let index  = 0;

  for (index; index < callFunctionPathKeys.length; index += 1) {
    if (index < callFunctionPathKeys.length - 1) {
      object = object[callFunctionPathKeys[index]];

      continue;
    }

    if (shouldPromisify) {
      operationResult = promisify(object[callFunctionPathKeys[index]])(...operationParameters);
    }

    else if (shouldUseNativeReturnPromise) {
      operationResult = object[callFunctionPathKeys[index]](...operationParameters).promise();
    }

    else {
      operationResult = object[callFunctionPathKeys[index]](...operationParameters);
    }
  }

  return operationResult;
}

module.exports = wrapServiceToUniversalFunction;
