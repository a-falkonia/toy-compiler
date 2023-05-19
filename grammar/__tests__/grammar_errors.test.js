/*
 * Grammar Error Tests
 *
 */

const syntaxCheck = require('../syntax-checker');

const errors = [
  ['keyword as id', 'print = 5;'],
  ['unclosed paren', 'x = (2 * 3'],
  ['unknown operator', 'x = 2 *** 5;'],
  // TODO: Need more test cases here....
];

describe('The syntax checker', () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, done => {
      expect(syntaxCheck(program)).toBe(false);
      done();
    });
  });
});