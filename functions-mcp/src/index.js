const admin = require('firebase-admin');

admin.initializeApp();

const { sharpflowMcp } = require('./sharpflowMcp');
const { sharpflowMcpMember, createSharpflowConnectorKey } = require('./sharpflowMcpMember');

exports.sharpflowMcp = sharpflowMcp;
exports.sharpflowMcpMember = sharpflowMcpMember;
exports.createSharpflowConnectorKey = createSharpflowConnectorKey;
