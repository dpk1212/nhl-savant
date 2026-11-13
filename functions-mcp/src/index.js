const admin = require('firebase-admin');

admin.initializeApp();

const { sharpflowMcp } = require('./sharpflowMcp');
const {
  sharpflowMcpMember,
  createSharpflowConnectorKey,
  listSharpflowConnectorApps,
  revokeSharpflowConnectorApp,
} = require('./sharpflowMcpMember');

exports.sharpflowMcp = sharpflowMcp;
exports.sharpflowMcpMember = sharpflowMcpMember;
exports.createSharpflowConnectorKey = createSharpflowConnectorKey;
exports.listSharpflowConnectorApps = listSharpflowConnectorApps;
exports.revokeSharpflowConnectorApp = revokeSharpflowConnectorApp;
