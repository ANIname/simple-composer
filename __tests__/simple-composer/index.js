const importDir   = require('directory-import');
const executeTest = require('../execute-test');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Expected success', () => {
  importDir({ directoryPath: './tests-expected-success' }, executeTest);
});

describe('Expected failure', () => {
  importDir({ directoryPath: './tests-expected-failure' }, executeTest);
});
