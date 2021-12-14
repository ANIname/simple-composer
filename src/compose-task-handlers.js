const map = require('lodash/map');

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

    useContextFromInputArgumentsIndex,
  } = options;

  return async (...composedTaskArguments) => {
    let abortHandlersResult;

    // Context needed to transfer data from one handler to another
    const context = useContextFromInputArgumentsIndex
      ? composedTaskArguments[useContextFromInputArgumentsIndex]
      : {};

    const payload = { context, arguments: composedTaskArguments };

    context.handlersIteratorCounter = 0;
    context.composedTaskOptions     = options;
    context.state                   = 'task';
    context.taskHandlersNames       = map(taskHandlers, 'name');

    try {
      // Call the first task handler
      await callHandler(options, context, payload, next);
    }

    catch (error) {
      if (abortHandlers.length > 0) {
        abortHandlersResult = composedAbortHandlers(error, payload.context, payload);
      }

      else {
        throw error;
      }
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
        if (abortHandlers.length > 0) {
          abortHandlersResult = composedAbortHandlers(error, payload.context, payload);
        }

        else {
          throw error;
        }
      }
    }

    return abortHandlersResult || context.taskHandlersResult;
  };
}

module.exports = composeTaskHandlers;
