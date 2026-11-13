const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const {
  pkceS256,
  redirectAllowed,
  cleanRedirects,
  refreshDecision,
  protectedResourceMetadata,
  authorizationServerMetadata,
} = require('./connectorOauth');

test('PKCE accepts the matching verifier and rejects a mismatch', () => {
  const verifier = 'a'.repeat(50);
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  assert.equal(pkceS256(verifier, challenge), true);
  assert.equal(pkceS256(`${verifier}b`, challenge), false);
  assert.equal(pkceS256('', challenge), false);
});

test('redirects are limited to ChatGPT, Claude, Grok, and local inspector', () => {
  assert.equal(redirectAllowed('https://chatgpt.com/connector_platform_oauth_redirect'), true);
  assert.equal(redirectAllowed('https://chatgpt.com/connector/oauth/callback'), true);
  assert.equal(redirectAllowed('https://claude.ai/api/mcp/auth_callback'), true);
  assert.equal(redirectAllowed('https://claude.com/api/mcp/auth_callback'), true);
  assert.equal(redirectAllowed('https://grok.com/connectors-oauth-exchange-code/'), true);
  assert.equal(redirectAllowed('https://grok.com/oauth/other'), true);
  assert.equal(redirectAllowed('http://127.0.0.1:6274/oauth/callback'), true);
  assert.equal(redirectAllowed('https://evil.com/callback'), false);
  assert.equal(redirectAllowed('https://chatgpt.com/account'), false);
  assert.equal(redirectAllowed('https://grok.com/somewhere'), false);
  assert.equal(cleanRedirects([
    'https://grok.com/connectors-oauth-exchange-code/',
    'https://evil.com/callback',
  ]).length, 1);
});

test('a reused refresh token revokes the family, and the current one rotates', () => {
  const now = 1_000_000;
  const family = { generation: 2, revoked: false };
  const current = { type: 'refresh', generation: 2, revoked: false, expiresAt: now + 10 };
  const old = { type: 'refresh', generation: 1, revoked: true, expiresAt: now + 10 };
  assert.deepEqual(refreshDecision(current, family, now), { ok: true, nextGeneration: 3 });
  assert.deepEqual(refreshDecision(old, family, now), { ok: false, revokeFamily: true });
  assert.equal(refreshDecision({ type: 'refresh', generation: 2, revoked: false, expiresAt: now - 1 }, family, now).ok, false);
});

test('discovery documents point at the member host', () => {
  const issuer = 'https://sharpflowmcpmember-lviwud3q2q-uc.a.run.app';
  const resource = protectedResourceMetadata(issuer);
  const auth = authorizationServerMetadata(issuer);
  assert.equal(resource.resource, issuer);
  assert.equal(resource.authorization_servers[0], issuer);
  assert.equal(auth.issuer, issuer);
  assert.equal(auth.token_endpoint, `${issuer}/oauth/token`);
  assert.equal(auth.registration_endpoint, `${issuer}/oauth/register`);
  assert.deepEqual(auth.code_challenge_methods_supported, ['S256']);
  assert.equal(auth.client_id_metadata_document_supported, true);
  assert.ok(auth.grant_types_supported.includes('refresh_token'));
});
