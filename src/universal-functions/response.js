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

  return (payload) => {
    const renderedResponseData = compiledResponseData.render(payload);

    return nunjucks.JSONparseTemplateString(renderedResponseData);
  };
}

module.exports = universalResponse;
