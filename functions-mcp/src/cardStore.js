/**
 * Card cache. The PNG and the caption live together, keyed by tool, args, and date.
 */

const crypto = require('crypto');

const TONIGHT_TTL_MS = 15 * 60 * 1000;
const SETTLED_TTL_MS = 24 * 60 * 60 * 1000;
const BUCKET = process.env.SHARPFLOW_CARD_BUCKET || 'nhl-savant.appspot.com';
const ISSUER = 'https://sharpflowmcpmember-lviwud3q2q-uc.a.run.app';

function cardId(kind, args, date) {
  return crypto.createHash('sha256').update(JSON.stringify({ kind, args, date })).digest('hex').slice(0, 20);
}

function cardUrls(id, issuer = ISSUER) {
  const root = String(issuer || ISSUER).replace(/\/$/, '');
  return {
    image_url: `${root}/card/${id}.png`,
    story_url: `${root}/card/${id}-story.png`,
    share_url: `${root}/card/${id}`,
  };
}

function memoryCardStore() {
  const saved = new Map();
  return {
    async getMeta(id) {
      const row = saved.get(id);
      return row ? { kind: row.kind, post: row.post, data: row.data, at: row.at } : null;
    },
    async getImage(id, story) {
      const row = saved.get(id);
      if (!row) return null;
      return story ? row.story : row.png;
    },
    async put(id, record) {
      saved.set(id, record);
    },
  };
}

function gcsCardStore() {
  const admin = require('firebase-admin');
  const bucket = () => admin.storage().bucket(BUCKET);
  const file = (name) => bucket().file(`sharpflow-cards/${name}`);
  return {
    async getMeta(id) {
      const json = file(`${id}.json`);
      const [exists] = await json.exists();
      if (!exists) return null;
      const [buf] = await json.download();
      return JSON.parse(buf.toString());
    },
    async getImage(id, story) {
      const image = file(story ? `${id}-story.png` : `${id}.png`);
      const [exists] = await image.exists();
      if (!exists) return null;
      const [buf] = await image.download();
      return buf;
    },
    async put(id, record) {
      await file(`${id}.png`).save(record.png, { contentType: 'image/png', resumable: false });
      await file(`${id}-story.png`).save(record.story, { contentType: 'image/png', resumable: false });
      await file(`${id}.json`).save(JSON.stringify({
        kind: record.kind,
        post: record.post,
        data: record.data,
        at: record.at,
      }), { contentType: 'application/json', resumable: false });
    },
  };
}

function sharePage({ id, post, issuer = ISSUER }) {
  const urls = cardUrls(id, issuer);
  const caption = String(post || 'SharpFlow').replace(/[&<>"]/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
  }[ch]));
  const site = 'https://nhlsavant.com/?utm_source=mcp_card&utm_medium=share#/sharps';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SharpFlow</title>
<meta property="og:title" content="SharpFlow">
<meta property="og:description" content="${caption.split('\n')[0]}">
<meta property="og:image" content="${urls.image_url}">
<meta property="og:url" content="${urls.share_url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${urls.image_url}">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet">
<style>
  body { margin: 0; min-height: 100vh; background: #0B0F1F; color: #F8FAFC; font-family: Inter, system-ui, sans-serif; }
  main { max-width: 28rem; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
  img { width: 100%; border-radius: 1.25rem; display: block; }
  p { white-space: pre-wrap; color: #94A3B8; line-height: 1.5; }
  a { display: inline-block; margin-top: 0.5rem; color: #0B0F1F; background: #D4AF37; text-decoration: none; font-weight: 700; padding: 0.8rem 1rem; border-radius: 999px; }
</style>
</head>
<body>
<main>
  <img src="${urls.image_url}" alt="SharpFlow card">
  <p>${caption}</p>
  <a href="${site}">See the sharps</a>
</main>
</body>
</html>`;
}

module.exports = {
  TONIGHT_TTL_MS,
  SETTLED_TTL_MS,
  ISSUER,
  cardId,
  cardUrls,
  memoryCardStore,
  gcsCardStore,
  sharePage,
};
