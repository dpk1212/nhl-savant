const admin = require('firebase-admin');

admin.initializeApp();

const { sharpflowMcp } = require('./sharpflowMcp');
const {
  sharpflowMcpMember,
  sharpflowMorningCard,
  createSharpflowConnectorKey,
  listSharpflowConnectorApps,
  revokeSharpflowConnectorApp,
} = require('./sharpflowMcpMember');

exports.sharpflowMcp = sharpflowMcp;
exports.sharpflowMcpMember = sharpflowMcpMember;
exports.sharpflowMorningCard = sharpflowMorningCard;
exports.createSharpflowConnectorKey = createSharpflowConnectorKey;
exports.listSharpflowConnectorApps = listSharpflowConnectorApps;
exports.revokeSharpflowConnectorApp = revokeSharpflowConnectorApp;
