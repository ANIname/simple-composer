const map         = require('lodash/map');
const isUndefined = require('lodash/isUndefined');

const prepareHandlersIteratorCounter = require('./prepare-handlers-iterator-counter');
const callHandler                    = require('./call-handler');

/**
 * Compose abort handlers
 *
 * @param {object} options Compose task handlers options
 * @param {Function[]} options.abortHandlers - Handlers run one by one, when task throw exception
 * @returns {Function} Composed abort handlers
 */
function composeAbortHandlers(options = {}) {
  const abortHandlers = options.abortHandlers || [];

  return async (error, context, payload) => {
    context.handlersIteratorCounter = 0;
    context.exceptionError          = error;
    context.composedTaskOptions     = options;
    context.state                   = 'abort';
    context.abortHandlersNames      = map(abortHandlers, 'name');

    // Call the first abort handler
    await callHandler(options, context, payload, next);

    /**
     * Call the next abort handler
     *
     * @param {string} handlerNameOrIndex - Handler name or index. Ex: Run first handler (Run: saveExceptionErrorToDb function)
     */
    async function next(handlerNameOrIndex) {
      // Prepare abort handler index before call
      prepareHandlersIteratorCounter(handlerNameOrIndex, options, context);

      // Call the next abort handler
      await callHandler(options, context, payload, next);
    }

    throw !isUndefined(context.abortHandlersResult) ? context.abortHandlersResult : error;
  };
}

module.exports = composeAbortHandlers;
