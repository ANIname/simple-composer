const isUndefined = require('lodash/isUndefined');

/**
 * @param {object} options - Compose task handlers options
 * @param {object} context - Handlers context. Needed to transfer data from one handler to another
 * @param {object} payload - Task payload
 * @param {Function} next - Call the next handler function
 */
async function callHandler(options, context, payload, next) {
  const { state, handlersIteratorCounter } = context;

  const handler = options[`${state}Handlers`][handlersIteratorCounter];

  if (handler) {
    const handlerResult = await handler.call(undefined, payload, next);

    if (!isUndefined(handlerResult)) context[`${state}HandlersResult`] = handlerResult;
  }
}

module.exports = callHandler;
