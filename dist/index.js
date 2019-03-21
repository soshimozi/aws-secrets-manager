"use strict";
// import AWS = require('aws-sdk');
Object.defineProperty(exports, "__esModule", { value: true });
// let ses:AWS.SES = new AWS.SES();
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const SecretCache_1 = require("./caching/SecretCache");
let secretCache = new SecretCache_1.SecretCache();
let secret = secretCache.getSecretString("dev/otm/appkeys");
secret.then(value => {
    console.log("value:", value);
});
secret.catch(error => {
    console.error("error:", error);
});
//# sourceMappingURL=index.js.map