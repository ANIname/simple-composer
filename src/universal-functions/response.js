const nunjucks = require('../../services/nunjucks');

/**
 * Return data in composed task after executing universal function
 *
 * @param {*} data - Data that will be return in the composed task after executing universal function
 * @returns {Function} universal function
 */
function universalResponse(data) {
  const stringifiedResponseData = JSON.stringify(data);
  const compiledResponseData    = nunjucks.compile(stringifiedResponseData);

  /**
   * @param {object} payload - Universal function context
   * @returns {*} data from payload
   */
  function universalFunction(payload) {
    const renderedResponseData = compiledResponseData.render(payload);

    return nunjucks.JSONparseTemplateString(renderedResponseData);
  }

  return universalFunction;
}

module.exports = universalResponse;
