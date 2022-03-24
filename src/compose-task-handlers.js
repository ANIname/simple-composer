const split = require('lodash/split');
const map = require('lodash/map');
const get = require('lodash/get');

const prepareHandlersIteratorCounter = require('./prepare-handlers-iterator-counter');
const callHandler                    = require('./call-handler');

/**
 * Compose task handlers
 *
 * @param {object} options Compose task handlers options
 * @param {Function} composedAbortHandlers Handlers run one by one, when task throw exception
 * @returns {Function} Composed task handlers
 */
function composeTaskHandlers(options = {}, composedAbortHandlers) {
  const {
    taskHandlers = [],
    abortHandlers = [],

    useContextFromInputArgumentsIndex,
    useContextFromInputArgumentsPath,
  } = options;

  return async (...composedTaskArguments) => {
    let abortHandlersResult;

    // Context needed to transfer data from one handler to another
    let context = {};

    if (useContextFromInputArgumentsIndex) {
      context = { ...context, ...composedTaskArguments[useContextFromInputArgumentsIndex] };
    }

    if (useContextFromInputArgumentsPath) {
      const inputArgumentsPathArray = split(useContextFromInputArgumentsPath, '.')
      const inputArgumentsPathLastIndex = inputArgumentsPathArray[inputArgumentsPathArray.length - 1];

      context = {
        ...context,

        [inputArgumentsPathLastIndex]: get(composedTaskArguments, useContextFromInputArgumentsPath)
      };
    }

    const payload = { context, arguments: composedTaskArguments };

    context.handlersIteratorCounter = 0;
    context.state                   = 'task';
    context.composedTaskOptions     = options;
    context.composedTaskArguments   = composedTaskArguments;
    context.taskHandlersNames       = map(taskHandlers, 'name');

    context.composedTasksArguments = context.composedTasksArguments || [];
    context.composedTasksArguments.push(composedTaskArguments);

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
