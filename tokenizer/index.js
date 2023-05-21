const tokenizeCharacter = (type, value, input, current) => {
    return value === input[current] ? [1, { type, value }] : [0, null];
};

const tokenizePattern = (type, pattern, input, current) => {
    let char = input[current];
    let consumedChars = 0;

    if (!pattern.test(char)) return [0, null];
    let value = '';
    while (char && pattern.test(char)) {
        value += char;
        consumedChars++;
        char = input[current + consumedChars];
    }
    return [consumedChars, { type, value }];
};

const tokenizeString = (input, current) => {
    let char = input[current];
    if (char !== `"`) return [0, null];

    let value = '';
    let consumedChars = 0;
    consumedChars++;
    char = input[current + consumedChars];

    while (char !== '"') {
        if (char === undefined) throw new TypeError('Unterminated string');
        value += char;
        consumedChars++;
        char = input[current + consumedChars];
    }

    console.log(value);
    return [consumedChars + 1, { type: 'string', value }];
};

const tokenizeParenOpen = (input, current) =>
    tokenizeCharacter('paren', '(', input, current);

const tokenizeParenClose = (input, current) =>
    tokenizeCharacter('paren', ')', input, current);

const tokenizeNumber = (input, current) =>
    tokenizePattern('number', /[0-9]/, input, current);

const tokenizeName = (input, current) =>
    tokenizePattern('name', /[a-z]/i, input, current);

const skipWhiteSpace = (input, current) =>
    /\s/.test(input[current]) ? [1, null] : [0, null];

const tokenizers = [
    skipWhiteSpace,
    tokenizeParenOpen,
    tokenizeParenClose,
    tokenizeString,
    tokenizeNumber,
    tokenizeName,
];

const tokenizer = (input) => {
    let current = 0;
    let tokens = [];
    while (current < input.length) {
        let tokenized = false;
        tokenizers.forEach((tokenizer_fn) => {
            if (tokenized) {
                return;
            }
            let [consumedChars, token] = tokenizer_fn(input, current);
            if (consumedChars !== 0) {
                tokenized = true;
                current += consumedChars;
            }
            if (token) {
                tokens.push(token);
            }
        });
        if (!tokenized) {
            throw new TypeError('Unrecognized char: ' + input[current]);
        }
    }
    return tokens;
};

module.exports = {
    tokenizer,
    skipWhiteSpace,
    tokenizeParenOpen,
    tokenizeParenClose,
    tokenizeString,
    tokenizeNumber,
    tokenizeName,
};
