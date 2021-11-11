const noop       = require('lodash/noop');
const isFunction = require('lodash/isFunction');

const { taskHandlers, abortHandlers, generatedRandomData } = require('../constants');
const { compose, composedTasksHandlers }                   = require('../../../src');

module.exports = async () => {
  compose({ taskName: 'task with fully filled data for executing', taskHandlers, abortHandlers });

  const consoleInfoSpy  = jest.spyOn(console, 'info');
  const consoleWarnSpy  = jest.spyOn(console, 'warn');
  const consoleErrorSpy = jest.spyOn(console, 'error');

  const task   = composedTasksHandlers['task with fully filled data for executing'];
  const result = await task('firstArgument', {}, () => noop);

  const [
    , consoleInfoArguments2, consoleInfoArguments3,
    consoleInfoArguments4, consoleInfoArguments5, consoleInfoArguments6,
    consoleInfoArguments7, consoleInfoArguments8, consoleInfoArguments9,

    consoleInfoArguments10, consoleInfoArguments11, consoleInfoArguments12,
    consoleInfoArguments13, consoleInfoArguments14, consoleInfoArguments15,
    consoleInfoArguments16, consoleInfoArguments17, consoleInfoArguments18,
  ] = consoleInfoSpy.mock.calls;

  expect(consoleInfoSpy.mock.calls.length).toBe(18);
  expect(consoleWarnSpy.mock.calls.length).toBe(0);
  expect(consoleErrorSpy.mock.calls.length).toBe(0);

  expect(consoleInfoArguments2[3]).toEqual({});

  expect(consoleInfoArguments3[3]).toBe('PARENT TEST MESSAGE');
  expect(consoleInfoArguments4[2]).toBe('context before transformation:');
  expect(consoleInfoArguments5[3].firstValue).toBe('CONTEXT FIRST VALUE TEST MESSAGE');
  expect(consoleInfoArguments5[3].secondValue).toBe('CONTEXT SECOND VALUE TEST MESSAGE');
  expect(consoleInfoArguments5[3].thirdValue).toBe('CONTEXT THIRD VALUE TEST MESSAGE');

  expect(consoleInfoArguments6[3]).toBe('PARENT TEST MESSAGE');
  expect(consoleInfoArguments7[3]).toBe('CONTEXT FIRST VALUE TEST MESSAGE');
  expect(consoleInfoArguments8[3]).toBe('CONTEXT SECOND VALUE TEST MESSAGE');
  expect(consoleInfoArguments9[3]).toBe('CONTEXT THIRD VALUE TEST MESSAGE');

  expect(consoleInfoArguments10[3]).toBe('firstArgument');
  expect(consoleInfoArguments11[3]).toEqual({});
  expect(isFunction(consoleInfoArguments12[3])).toBe(true);

  expect(consoleInfoArguments13[2]).toBe('This function try to call another function by index');
  expect(consoleInfoArguments14[2]).toBe('This is inline arrow function');
  expect(consoleInfoArguments15[2]).toBe('This function try to call another function by name');
  expect(consoleInfoArguments16[2]).toBe('This function was called by name');
  expect(consoleInfoArguments17[2]).toBe('This is anonymous function');
  expect(consoleInfoArguments18[2]).toBe('This function will return a random value');

  expect(result).toBe(generatedRandomData.data);
};
