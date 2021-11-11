const noop   = require('lodash/noop');
const sample = require('lodash/sample');

const anonymousFunction = (payload, next) => {
  const { state } = payload.context;

  console.info('🟡', `[${state}]`, 'This is anonymous function');

  return next();
};

// Will generate in functionThatReturnsRandomValue
const randomData = {};

const taskHandlers = [
  firstFunction,
  functionWhereUpdateParentVariable,
  functionWhereUpdateContextValues,
  functionWhereLogPayload,
  functionThatCallsAnotherFunctionByIndex,
  functionThatWillNotCalled,

  (payload, next) => {
    console.info('🟡', '[task]', 'This is inline arrow function');

    return next();
  },

  functionThatCallsAnotherFunctionByName,
  functionThatWillNotCalled,
  functionThatWasCalledByName,
  anonymousFunction,

  functionThatReturnsRandomValue,

  functionThatWillNotCalled,
];

const abortHandlers = [
  firstFunction,
  functionWhereUpdateParentVariable,
  functionWhereUpdateContextValues,
  functionWhereLogPayload,
  functionThatCallsAnotherFunctionByIndex,
  functionThatWillNotCalled,

  (payload, next) => {
    console.info('🟡', '[abort]', 'This is inline arrow function');

    return next();
  },

  functionThatCallsAnotherFunctionByName,
  functionThatWillNotCalled,
  functionThatWasCalledByName,
  anonymousFunction,

  functionThatReturnsRandomValue,

  functionThatWillNotCalled,
];

/**
 * @param {object} payload - Handler payload
 * @param {Function} next - Next handler
 * @returns {any} Call next handler
 */
function firstFunction(payload, next) {
  const { state } = payload.context;

  console.info('🏃‍♀️', `[${state}]`, 'This is first abort function');

  return next();
}

/**
 * Try to update parent variable
 *
 * @param {object} payload - Handler payload
 * @param {Function} next - Next handler
 * @returns {any} Call next handler
 */
function functionWhereUpdateParentVariable(payload, next) {
  const { state } = payload.context;

  console.info('🚹', `[${state}]`, 'payload parent before transformation:', payload.parent);

  payload.parent = 'PARENT TEST MESSAGE';

  console.info('🚺', `[${state}]`, 'payload parent after transformation:', payload.parent);

  return next();
}

/**
 * Try to update context values
 *
 * @param {object} payload - Handler payload
 * @param {Function} next - Next handler
 * @returns {any} Call next handler
 */
function functionWhereUpdateContextValues(payload, next) {
  const { state } = payload.context;

  console.info('🚹', `[${state}]`, 'context before transformation:', payload.context);

  payload.context.firstValue  = 'CONTEXT FIRST VALUE TEST MESSAGE';
  payload.context.secondValue = 'CONTEXT SECOND VALUE TEST MESSAGE';
  payload.context.thirdValue  = 'CONTEXT THIRD VALUE TEST MESSAGE';

  console.info('🚺', `[${state}]`, 'context after transformation:', payload.context);

  return next();
}

/**
 * Log payload variables
 *
 * @param {object} payload - Handler payload
 * @param {Function} next - Next handler
 * @returns {any} Call next handler
 */
function functionWhereLogPayload(payload, next) {
  const {
    state, firstValue, secondValue, thirdValue,
  } = payload.context;

  console.info('🗒', `[${state}]`, 'Payload parent:',  payload.parent);

  console.info('🗒', `[${state}]`, 'Payload context firstValue:', firstValue);
  console.info('🗒', `[${state}]`, 'Payload context secondValue:', secondValue);
  console.info('🗒', `[${state}]`, 'Payload context thirdValue:', thirdValue);

  console.info('🗒', `[${state}]`, 'Payload context first input argument:', payload.arguments[0]);
  console.info('🗒', `[${state}]`, 'Payload context second input argument:', payload.arguments[1]);
  console.info('🗒', `[${state}]`, 'Payload context third input argument:', payload.arguments[2]);

  return next();
}

/**
 * This function try to call another function by index
 *
 * @param {object} payload - Handler payload
 * @param {Function} next - Next handler
 * @returns {any} Call next handler
 */
function functionThatCallsAnotherFunctionByIndex(payload, next) {
  const { state } = payload.context;

  console.info('♻️', `[${state}]`, 'This function try to call another function by index');

  return next(6);
}

/**
 * This function try to call another function by name
 *
 * @param {object} payload - Handler payload
 * @param {Function} next - Next handler
 * @returns {any} Call next handler
 */
function functionThatCallsAnotherFunctionByName(payload, next) {
  const { state } = payload.context;

  console.info('♻️', `[${state}]`, 'This function try to call another function by name');

  // eslint-disable-next-line no-secrets/no-secrets
  return next('functionThatWasCalledByName');
}

/**
 * This function called by name
 *
 * @param {object} payload - Handler payload
 * @param {Function} next - Next handler
 * @returns {any} Call next handler
 */
function functionThatWasCalledByName(payload, next) {
  const { state } = payload.context;

  console.info('♻️', `[${state}]`, 'This function was called by name');

  return next();
}

/**
 * This is must be a last function
 *
 * @param {object} payload - Handler payload
 * @returns {any} Random Value
 */
function functionThatReturnsRandomValue(payload) {
  const { state, exceptionError } = payload.context;
  const randomDataArray           = [
    // eslint-disable-next-line unicorn/no-null
    null,
    () => noop,
    { testKeyInObject: 'testValueInObject' },
    ['testValueInArray'],
    'testValueInString',
    1,
    2,
    3,
    0,
    '',
    {},
    [],
    true,
    false,
  ];

  if (state === 'abort') randomDataArray.push(exceptionError.message);

  randomData.data = sample(randomDataArray);

  console.info('💱', `[${state}]`, 'This function will return a random value');

  return randomData.data;
}

/**
 * This function will not called because that previous function will call another function
 *
 * @param {object} payload - Handler payload
 * @param {Function} next - Next handler
 * @returns {any} Call next handler
 */
function functionThatWillNotCalled(payload, next) {
  const { state } = payload.context;

  console.error('❌', `[${state}]`, 'This function shouldn\'t have been called!');

  return next();
}

module.exports = {
  taskHandlers,
  abortHandlers,
  generatedRandomData: randomData,
};
