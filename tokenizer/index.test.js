const {
    tokenizeParenOpen,
    tokenizeParenClose,
    tokenizeNumber,
    tokenizeName,
    tokenizeString,
    skipWhiteSpace,
    tokenizer,
} = require('./index');

describe('tokenizer success tests', () => {
    test('tokenizes `aa(bbb`, 2 as [1, {"paren", "("}]', () => {
        expect(tokenizeParenOpen('aa(bbb', 2)).toEqual([
            1,
            { type: 'paren', value: '(' },
        ]);
    });
    test('tokenizes `aabbb`, 2 as [0, null]', () => {
        expect(tokenizeParenOpen('aabbb', 2)).toEqual([0, null]);
    });
    test('tokenizes `aa)bbb`, 2 as [1, {"paren", ")"}]', () => {
        expect(tokenizeParenClose('aa)bbb', 2)).toEqual([
            1,
            { type: 'paren', value: ')' },
        ]);
    });
    test('tokenizes `aa234bbb`, 2 as [1, {"paren", ")"}]', () => {
        expect(tokenizeNumber('aa234bbb', 2)).toEqual([
            3,
            { type: 'number', value: '234' },
        ]);
    });
    test('tokenizes `aabbb`, 2 as [0, null]', () => {
        expect(tokenizeNumber('aabbb', 2)).toEqual([0, null]);
    });
    test('tokenizes `hello world`, 4 as [5, {"name", "hello"}]', () => {
        expect(tokenizeName('hello world', 0)).toEqual([
            5,
            { type: 'name', value: 'hello' },
        ]);
    });
    test('tokenizes `a = "string literal"`, 4 as [16, {"string", "string literal"}]', () => {
        expect(tokenizeString('a = "string literal"', 4)).toEqual([
            16,
            { type: 'string', value: 'string literal' },
        ]);
    });
    test('tokenizes `a = bbbb`, 0 as [0, null]', () => {
        expect(tokenizeString('a = bbbb', 0)).toEqual([0, null]);
    });
    test('throws TypeError when tokenizing `a = "unterminated`, 4', () => {
        expect.assertions(2);
        try {
            tokenizeString('a = "unterminated', 4);
        } catch (error) {
            expect(error).toBeInstanceOf(TypeError);
            expect(error).toHaveProperty('message', 'Unterminated string');
        }
    });
    test('tokenizes whitespace in `a = b`, 1 as [1, null]', () => {
        expect(skipWhiteSpace('a = b', 1)).toEqual([1, null]);
    });
    test('tokenizes whitespace in `a=b`, 1 as [0, null]', () => {
        expect(skipWhiteSpace('a=b', 0)).toEqual([0, null]);
    });
    test('tokenizes "(add 2 3)" successfully', () => {
        expect(tokenizer('(add 2 3)')).toEqual([
            { type: 'paren', value: '(' },
            { type: 'name', value: 'add' },
            { type: 'number', value: '2' },
            { type: 'number', value: '3' },
            { type: 'paren', value: ')' },
        ]);
    });
    test('throws unknown char error when tokeniing "сложи 2 и 3"', () => {
        expect.assertions(2);
        const ruString = 'сложи 2 и 3';
        try {
            tokenizer(ruString);
        } catch (error) {
            expect(error).toBeInstanceOf(TypeError);
            expect(error).toHaveProperty(
                'message',
                `Unrecognized char: ${ruString[0]}`
            );
        }
    });
    test('tokenizes nested expressions successfully', () => {
        expect(tokenizer('(add 2 (subtract "314" 2))')).toEqual([
            { type: 'paren', value: '(' },
            { type: 'name', value: 'add' },
            { type: 'number', value: '2' },
            { type: 'paren', value: '(' },
            { type: 'name', value: 'subtract' },
            { type: 'string', value: '314' },
            { type: 'number', value: '2' },
            { type: 'paren', value: ')' },
            { type: 'paren', value: ')' },
        ]);
    });
});
