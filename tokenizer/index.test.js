const { tokenizer } = require("./index");

const fixtures = [
    {
        name: "parentheses",
        source: "()",
        expected: [
            { type: "paren", value: "(" },
            { type: "paren", value: ")" },
        ],
    },
    {
        name: "string literals",
        source: "\"aaa\" \"bbb\"",
        expected: [
            { type: "string", value: "aaa" },
            { type: "string", value: "bbb" },
        ],
    },
    {
        name: "numbers",
        source: "add(3 2)",
        expected: [
            { type: "name", value: "add" },
            { type: "paren", value: "(" },
            { type: "number", value: "3" },
            { type: "number", value: "2" },
            { type: "paren", value: ")" },
        ],
    },
];

describe("The tokenizer", () => {
    fixtures.map(({ name, source, expected }) =>
        test(`produces correct tokens for ${name}`, (done) => {
            expect(tokenizer(source)).toEqual(expected);
            done();
        })
    );
    test(`throws a TypeError when encounters untermindated string`, (done) => {
        expect.assertions(2);
        try {
            tokenizer('"unterminated', 4);
        } catch (error) {
            expect(error).toBeInstanceOf(TypeError);
            expect(error).toHaveProperty('message', 'Unterminated string');
        }
        done();
    })
    test(`throws a TypeError when encounters unrecognized char`, (done) => {
        expect.assertions(2);
        try {
            tokenizer('a = "str"', 4);
        } catch (error) {
            expect(error).toBeInstanceOf(TypeError);
            expect(error).toHaveProperty('message', 'Unrecognized char: =');
        }
        done();
    })
});
