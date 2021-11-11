const isString = require('lodash/isString');

/**
 * Prepare next index of a handler
 *
 * @param {string} handlerNameOrIndex - Handler name or index. Ex: Run first handler (Run: saveExceptionErrorToDb function)
 * @param {object} options - Compose task handlers options
 * @param {object} context - Handlers context. Needed to transfer data from one handler to another
 */
function prepareHandlersIteratorCounter(handlerNameOrIndex, options, context) {
  let handlerIndex;

  const { state, handlersIteratorCounter } = context;

  if (handlerNameOrIndex) {
    handlerIndex = isString(handlerNameOrIndex)
      ? context[`${state}HandlersNames`].indexOf(handlerNameOrIndex)
      : handlerNameOrIndex;
  }

  context.handlersIteratorCounter = handlerIndex || handlersIteratorCounter + 1;

  if (!options[`${state}Handlers`][handlersIteratorCounter]) {
    throw new Error(
      `Compose error: ${state}Handler ${handlerNameOrIndex}(with index ${handlersIteratorCounter}) not found!`,
    );
  }
}

module.exports = prepareHandlersIteratorCounter;
