const map         = require('lodash/map');
const isUndefined = require('lodash/isUndefined');

const prepareHandlersIteratorCounter = require('./prepare-handlers-iterator-counter');
const callHandler                    = require('./call-handler');

/**
 * Compose task handlers
 *
 * @param {object} options Compose task handlers options
 * @param {Function[]} options.taskHandlers - Handlers run one by one, when this task called
 * @param {Function} composedAbortHandlers - Abort handlers run when task throw exception
 * @returns {Function} Composed task handlers
 */
function composeTaskHandlers(options = {}, composedAbortHandlers) {
  const {
    taskHandlers = [],
    abortHandlers = [],
  } = options;

  return async (...composedTaskArguments) => {
    let exceptionError;

    const parent  = {}; // After handler execution - we put result to parent. It's necessary if function is the last in the list and returns nothing
    const context = {}; // Context needed to transfer data from one handler to another
    const payload = { context, parent, arguments: composedTaskArguments };

    context.handlersIteratorCounter = 0;
    context.composedTaskOptions     = options;
    context.state                   = 'task';
    context.taskHandlersNames       = map(taskHandlers, 'name');

    try {
      // Call the first task handler
      await callHandler(options, context, payload, next);
    }

    catch (error) {
      exceptionError = abortHandlers.length > 0
        ? composedAbortHandlers(error, payload.context, payload)
        : error;
    }

    /**
     * Call the next task handler
     *
     * @param {string} handlerNameOrIndex - Handler name or index. Ex: Run first handler (Run: saveExceptionErrorToDb function)
     */
    async function next(handlerNameOrIndex) {
      // Prepare task handler index before call
      prepareHandlersIteratorCounter(handlerNameOrIndex, options, context);

      try {
        // Call the next task handler
        await callHandler(options, context, payload, next);
      }

      catch (error) {
        exceptionError = abortHandlers.length > 0
          ? composedAbortHandlers(error, payload.context, payload)
          : error;
      }
    }

    if (exceptionError) return exceptionError;

    return !isUndefined(context.taskHandlersResult)
      ? context.taskHandlersResult
      : payload.parent;
  };
}

module.exports = composeTaskHandlers;
