

import { checkForName } from '../nameChecker';

// Mock the alert function before running the tests
global.alert = jest.fn();

test('checkForName should recognize valid captain names', () => {
  checkForName('Picard');
  expect(global.alert).toHaveBeenCalledWith('Welcome, Captain!');
});

test('checkForName should reject invalid names', () => {
  checkForName('John');
  expect(global.alert).toHaveBeenCalledWith('Enter a valid captain name');
});
