const admin = require('firebase-admin');

admin.initializeApp();

const { sharpflowMcp } = require('./sharpflowMcp');

exports.sharpflowMcp = sharpflowMcp;
