const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Export all functions
const { handleStripeWebhook } = require('./stripeWebhook');
const { onUserCreated } = require('./onUserCreated');
const { checkSubscription } = require('./checkSubscription');
const { createPortalSession } = require('./createPortalSession');
const { updateLiveScores, triggerScoreUpdate } = require('./liveScores');
const { updateBetResults, triggerBetUpdate } = require('./betTracking');
const { ncaaProxy } = require('./ncaaProxy');
const { updateBasketballBetResults, triggerBasketballBetGrading } = require('./basketballBetGrading');

exports.stripeWebhook = handleStripeWebhook;
exports.createUserDocument = onUserCreated;
exports.checkSubscription = checkSubscription;
exports.createPortalSession = createPortalSession;
exports.updateLiveScores = updateLiveScores;
exports.triggerScoreUpdate = triggerScoreUpdate;
exports.updateBetResults = updateBetResults;
exports.triggerBetUpdate = triggerBetUpdate;
exports.ncaaProxy = ncaaProxy;
exports.updateBasketballBetResults = updateBasketballBetResults;
exports.triggerBasketballBetGrading = triggerBasketballBetGrading;

