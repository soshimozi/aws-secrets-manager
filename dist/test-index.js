"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const underscore = require("underscore");
let foo = {};
foo['bar'] = { message: 'baz' };
foo['a'] = { message: 'b' };
console.log(foo['bar'].message);
console.log(foo['blah']);
let pairs = underscore.pairs(foo);
console.log(pairs);
let found = underscore.findKey(foo, (value, key) => {
    return key.indexOf('bar') >= 0;
});
console.log(found);
found = underscore.findKey(foo, (value, key) => {
    return key.indexOf('blah') >= 0;
});
console.log(found);
//# sourceMappingURL=test-index.js.map