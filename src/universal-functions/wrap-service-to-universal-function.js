const { promisify } = require('util');
const set           = require('lodash/set');

const nunjucks = require('../../services/nunjucks');

/**
 * @param {object} service Module/Service that will wrap to universal function
 * @param {string} serviceName Module/Service name (optional)
 * @param {boolean} shouldPromisify Takes a function following the common error-first callback style, i.e. taking a (err, value) => ... callback as the last argument, and returns a version that returns promises.
 * @returns {Function} Universal function
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
function wrapServiceToUniversalFunction(service, serviceName = '', shouldPromisify = false) {
  return (callFunctionPath, ...callFunctionParameters) => {
    const stringifiedOperationParameters = JSON.stringify(callFunctionParameters);
    const compiledOperationParameters    = nunjucks.compile(stringifiedOperationParameters);

    const operationPath = `${serviceName}.${callFunctionPath}`;
    const operation     = shouldPromisify
      ? promisify(service[callFunctionPath])
      : service[callFunctionPath];

    return async (payload, next) => {
      const renderedStringifiedOperationParameters = compiledOperationParameters.render(payload);

      const operationParameters = nunjucks.JSONparseTemplateString(renderedStringifiedOperationParameters);
      const operationResult     = await operation(operationParameters);

      set(payload, `${operationPath}.result`, operationResult);
      set(payload, `${operationPath}.parameters.beforeTransformation`, callFunctionParameters);
      set(payload, `${operationPath}.parameters.afterTransformation`, operationParameters);

      return next();
    };
  };
}

module.exports = wrapServiceToUniversalFunction;
