const noop       = require('lodash/noop');
const isFunction = require('lodash/isFunction');

const { abortHandlers, generatedRandomData } = require('../constants');
const { compose }                            = require('../../../src');

module.exports = async () => {
  const consoleInfoSpy  = jest.spyOn(console, 'info');
  const consoleWarnSpy  = jest.spyOn(console, 'warn');
  const consoleErrorSpy = jest.spyOn(console, 'error');

  const taskHandlers = [
    () => {
      console.info('🟡', 'this function will throw error');

      throw new Error('test exception error!');
    },

    (payload) => {
      const { state } = payload.context;

      console.error('❌', `[${state}]`, 'This function shouldn\'t have been called!');
    },
  ];

  const task = compose({
    taskName: 'task with fully filled data for executing with exception error and abort handlers',
    taskHandlers,
    abortHandlers,
  });

  try {
    await task('firstArgument', {}, () => noop);
  }

  catch (error) {
    expect(error).toBe(generatedRandomData.data);
  }

  finally {
    const [
      consoleInfoArguments1, , consoleInfoArguments3, consoleInfoArguments4,
      consoleInfoArguments5, consoleInfoArguments6, consoleInfoArguments7,
      consoleInfoArguments8, consoleInfoArguments9, consoleInfoArguments10,
      consoleInfoArguments11, consoleInfoArguments12, consoleInfoArguments13,
      consoleInfoArguments14, consoleInfoArguments15, consoleInfoArguments16,
      consoleInfoArguments17, consoleInfoArguments18, consoleInfoArguments19,
    ] = consoleInfoSpy.mock.calls;

    expect(consoleInfoSpy.mock.calls.length).toBe(19);
    expect(consoleWarnSpy.mock.calls.length).toBe(0);
    expect(consoleErrorSpy.mock.calls.length).toBe(0);

    expect(consoleInfoArguments1[1]).toBe('this function will throw error');
    expect(consoleInfoArguments3[3]).toBe(undefined);

    expect(consoleInfoArguments4[3]).toBe('PARENT TEST MESSAGE');
    expect(consoleInfoArguments5[2]).toBe('context before transformation:');
    expect(consoleInfoArguments6[3].firstValue).toBe('CONTEXT FIRST VALUE TEST MESSAGE');
    expect(consoleInfoArguments6[3].secondValue).toBe('CONTEXT SECOND VALUE TEST MESSAGE');
    expect(consoleInfoArguments6[3].thirdValue).toBe('CONTEXT THIRD VALUE TEST MESSAGE');

    expect(consoleInfoArguments7[3]).toBe('PARENT TEST MESSAGE');
    expect(consoleInfoArguments8[3]).toBe('CONTEXT FIRST VALUE TEST MESSAGE');
    expect(consoleInfoArguments9[3]).toBe('CONTEXT SECOND VALUE TEST MESSAGE');
    expect(consoleInfoArguments10[3]).toBe('CONTEXT THIRD VALUE TEST MESSAGE');

    expect(consoleInfoArguments11[3]).toBe('firstArgument');
    expect(consoleInfoArguments12[3]).toEqual({});
    expect(isFunction(consoleInfoArguments13[3])).toBe(true);

    expect(consoleInfoArguments14[2]).toBe('This function try to call another function by index');
    expect(consoleInfoArguments15[2]).toBe('This is inline arrow function');
    expect(consoleInfoArguments16[2]).toBe('This function try to call another function by name');
    expect(consoleInfoArguments17[2]).toBe('This function was called by name');
    expect(consoleInfoArguments18[2]).toBe('This is anonymous function');
    expect(consoleInfoArguments19[2]).toBe('This function will return a random value');
  }
};
