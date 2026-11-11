/**
 * OneSignal no-device replies must not fail the beta alert run.
 * Usage: node tests/testMySharpAlerts.mjs
 */
import assert from 'node:assert/strict';
import { oneSignalNoDevice } from '../src/lib/mySharpAlerts.js';

const deadSeat = {
  errors: { invalid_aliases: { external_id: ['joBv51a9A8TF7YAuAYDHdB9FgD43'] } },
};

assert.equal(oneSignalNoDevice(deadSeat), true);
assert.equal(oneSignalNoDevice({ id: 'notif-1', errors: deadSeat.errors }), false);
assert.equal(oneSignalNoDevice({ errors: ['All included players are not subscribed'] }), true);
assert.equal(oneSignalNoDevice({ errors: ['Invalid app id'] }), false);
assert.equal(oneSignalNoDevice({ id: 'notif-2' }), false);
assert.equal(oneSignalNoDevice(null), false);

console.log('my sharp alert checks ok');
