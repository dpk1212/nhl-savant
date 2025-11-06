const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Export all functions
const { handleStripeWebhook } = require('./stripeWebhook');
const { onUserCreated } = require('./onUserCreated');
const { checkSubscription } = require('./checkSubscription');

exports.stripeWebhook = handleStripeWebhook;
exports.createUserDocument = onUserCreated;
exports.checkSubscription = checkSubscription;

