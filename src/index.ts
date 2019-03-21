// import AWS = require('aws-sdk');

// let ses:AWS.SES = new AWS.SES();

var AWS = require('aws-sdk');
AWS.config.update({region:'us-west-2'});

import { SecretCache } from './caching/SecretCache';


let secretCache = new SecretCache();


let secret = secretCache.getSecretString("dev/otm/appkeys");

secret.then(value => {
  console.log("value:", value);
});

secret.catch(error => {
  console.error("error:", error);
});
