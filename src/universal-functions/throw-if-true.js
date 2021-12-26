const nunjucks = require('../../services/nunjucks');

/**
 * Throw error if the input condition expression converted to truthy
 *
 * @param {string} stringTemplateExpression - Nunjucks if expression.
 * Example: https://mozilla.github.io/nunjucks/templating.html#if-expression
 * @param {Error} ErrorInstance - The error instance class. Ex: UserInputError.
 * More native javascript Error types: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Error#error_types
 * @param {*[]} errorParameters - The error parameters: Ex: ERROR_MESSAGE, ...additionalParameters.
 * @returns {Function} Universal function.
 */
function throwIfTrue(stringTemplateExpression, ErrorInstance = Error, ...errorParameters) {
  const stringifiedErrorParameters  = JSON.stringify(errorParameters);
  const compiledConditionExpression = nunjucks.compile(stringTemplateExpression);
  const compiledErrorParameters     = nunjucks.compile(stringifiedErrorParameters);

  return (payload, next) => {
    const renderedConditionExpression = compiledConditionExpression.render(payload);
    const renderedErrorParameters     = compiledErrorParameters.render(payload);
    const parsedErrorParameters       = nunjucks.JSONparseTemplateString(renderedErrorParameters);

    console.info('tes', stringTemplateExpression);
    console.info('test', renderedConditionExpression);

    if (renderedConditionExpression !== 'false') {
      throw new ErrorInstance(...parsedErrorParameters);
    }

    return next();
  };
}

module.exports = throwIfTrue;
