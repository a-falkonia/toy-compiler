/*
 * Grammar Success Test
 *
 */

const syntaxCheck = require('../syntax-checker');
const program = String.raw`
    radius = 55.2 * (-cos(2.8E-20) + 89) % 21;    // assignment statement
    the_area = π * radius ** 2;                   // another assignment
    print(hypot(2.28, 3 - radius) / the_area);    // print statement
`;  

describe('The syntax checker', () => {
    test('accepts the sample program with all syntactic forms', done => {
      expect(syntaxCheck(program)).toBe(true);
      done();
    });
  });