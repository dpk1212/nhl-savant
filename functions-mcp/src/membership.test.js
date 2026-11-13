const test = require('node:test');
const assert = require('node:assert/strict');
const {
  membershipFromUser,
  hashKey,
  bearerKey,
  asksForCard,
  newKey,
} = require('./membership');

test('active and trialing paid tiers pass', () => {
  for (const tier of ['scout', 'elite', 'pro']) {
    assert.deepEqual(membershipFromUser({ status: 'active', tier }).trial, false);
    assert.equal(membershipFromUser({ status: 'trialing', tier }).trial, true);
  }
});

test('free, lapsed, and empty accounts fail', () => {
  assert.equal(membershipFromUser(null), null);
  assert.equal(membershipFromUser({}), null);
  assert.equal(membershipFromUser({ status: 'active', tier: 'free' }), null);
  assert.equal(membershipFromUser({ status: 'canceled', tier: 'elite' }), null);
  assert.equal(membershipFromUser({ status: 'past_due', tier: 'pro' }), null);
  assert.equal(membershipFromUser({ status: 'trialing', tier: 'free' }), null);
});

test('the key is read from bearer or an api key header', () => {
  assert.equal(bearerKey({ authorization: 'Bearer sf_abc' }), 'sf_abc');
  assert.equal(bearerKey({ Authorization: 'bearer sf_abc' }), 'sf_abc');
  assert.equal(bearerKey({ 'x-api-key': 'sf_xyz' }), 'sf_xyz');
  assert.equal(bearerKey({}), '');
});

test('only a tool call asks for the card', () => {
  assert.equal(asksForCard({ method: 'initialize' }), false);
  assert.equal(asksForCard({ method: 'tools/list' }), false);
  assert.equal(asksForCard({ method: 'tools/call' }), true);
  assert.equal(asksForCard([{ method: 'initialize' }, { method: 'tools/call' }]), true);
});

test('a key hashes the same way twice and a new key is not the hash', () => {
  const key = newKey();
  assert.match(key, /^sf_[A-Za-z0-9_-]{40,}$/);
  assert.equal(hashKey(key), hashKey(key));
  assert.notEqual(hashKey(key), key);
});
