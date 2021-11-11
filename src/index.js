const uuid                 = require('uuid');
const composeAbortHandlers = require('./compose-abort-handlers');
const composeTaskHandlers  = require('./compose-task-handlers');

const composedTasksHandlers = {};

/**
 * Compose handlers to task
 *
 * @param {object} options Compose task handlers options
 * @param {string} options.taskName - Name of the task
 * @param {Function[]} options.taskHandlers - Handlers run one by one, when this task called
 * @param {Function[]} options.abortHandlers - Handlers run one by one, when task throw exception
 * @returns {Function} Composed task handlers
 * @example
 *
 * compose({
 *   taskName: 'updateUser',
 *
 *   // These is task functions
 *   taskHandlers: [
 *     findUserInDb,
 *     checkInputDataIsCorrect,
 *     updateUserInDb,
 *   ],
 *
 *   // These functions used to restore the previous state.
 *   // Or for some other exception error work
 *   abortHandlers: [
 *     saveExceptionErrorToDb,
 *   ],
 * });
 */
function compose(options = {}) {
  const taskName = options.taskName || uuid.v4();

  options.taskName      = options.taskName || uuid.v4();
  options.taskHandlers  = options.taskHandlers || [];
  options.abortHandlers = options.abortHandlers || [];

  if (composedTasksHandlers[taskName]) {
    console.warn(`⚠️ Duplicate task ${taskName} found! The task will be overwritten!`);
  }

  const composedAbortHandlers = composeAbortHandlers(options);
  const composedTaskHandlers  = composeTaskHandlers(options, composedAbortHandlers);

  composedTasksHandlers[taskName] = composedTaskHandlers;

  return composedTaskHandlers;
}

module.exports = { compose, composedTasksHandlers };
