const keys       = require('lodash/keys');
const isFunction = require('lodash/isFunction');

const { taskHandlers, abortHandlers }    = require('../constants');
const { compose, composedTasksHandlers } = require('../../../src');

module.exports = () => {
  const composedTasksHandlersLengthBeforeCompose = keys(composedTasksHandlers).length;

  const task = compose({ taskHandlers, abortHandlers });

  const composedTasksHandlersLengthAfterCompose = keys(composedTasksHandlers).length;

  expect(isFunction(task)).toBe(true);
  expect(composedTasksHandlersLengthAfterCompose).toBe(composedTasksHandlersLengthBeforeCompose + 1);
};
