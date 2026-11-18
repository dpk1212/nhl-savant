/**
 * Member card tools. A hit draws a PNG, stores it, and returns the public links.
 */

const { validateRecentArgs } = require('./walletRecent');
const { profitCurve, moneyBoard, hotVsSlipping, streakStrip, morningRecap } = require('./cardData');
const { renderCard } = require('./cardRender');
const {
  TONIGHT_TTL_MS,
  SETTLED_TTL_MS,
  ISSUER,
  cardId,
  cardUrls,
  gcsCardStore,
} = require('./cardStore');

const CARD_TOOLS = ['profit_curve', 'money_board', 'hot_vs_slipping', 'streak_strip', 'morning_recap'];

function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

async function onBoard(ctx, id, date) {
  const { games, profiles } = await ctx.loadAction();
  const prices = ctx.loadPrices ? await ctx.loadPrices() : null;
  const open = ctx.openBoard(games, profiles, prices, date);
  const profile = profiles.get(id);
  if (!profile || !ctx.ticketsFor(open.games, id).length) return null;
  return { profile, games: open.games };
}

async function publish(ctx, { kind, args, date, built, ttl }) {
  const store = ctx.cardStore || gcsCardStore();
  const issuer = ctx.issuer || ISSUER;
  const id = cardId(kind, args, date);
  const now = ctx.now ? ctx.now() : Date.now();
  const hit = await store.getMeta(id);
  if (hit && hit.data && now - Number(hit.at) < ttl) {
    return { ...cardUrls(id, issuer), post: hit.post, data: hit.data };
  }
  const draw = ctx.renderCard || renderCard;
  const png = await draw(kind, built.data, { height: 1350 });
  const story = await draw(kind, built.data, { height: 1920 });
  await store.put(id, { kind, post: built.post, data: built.data, at: now, png, story });
  return { ...cardUrls(id, issuer), post: built.post, data: built.data };
}

async function answerCard(name, args, ctx) {
  const a = args || {};
  const today = ctx.etDate();
  if (name === 'profit_curve' || name === 'hot_vs_slipping' || name === 'streak_strip') {
    const check = validateRecentArgs({ id: a.id });
    if (check.error) return { error: check.error };
    const board = await onBoard(ctx, check.id, today);
    if (!board) return { error: 'No confirmed wallet with that id is on tonight\'s board.' };
    let rows = null;
    try {
      rows = ctx.loadWalletRecent ? await ctx.loadWalletRecent(check.id) : null;
    } catch {
      rows = null;
    }
    if (!Array.isArray(rows)) return { error: 'Recent bets are not loaded.' };
    if (name === 'profit_curve') {
      const window = a.window == null || a.window === '' ? '30d' : String(a.window);
      if (!['30d', '90d', 'all'].includes(window)) return { error: 'window is 30d, 90d, or all.' };
      const sport = a.sport ? String(a.sport).toUpperCase() : null;
      const market = a.market ? String(a.market).toUpperCase() : null;
      if (market && !['ML', 'SPREAD', 'TOTAL'].includes(market)) return { error: 'market is ML, SPREAD, or TOTAL.' };
      const built = profitCurve({
        id: check.id, profile: board.profile, rows, sport, market, window, today,
      });
      if (built.message) return { error: built.message };
      const card = await publish(ctx, {
        kind: name,
        args: { id: check.id, sport, market, window },
        date: today,
        built,
        ttl: SETTLED_TTL_MS,
      });
      return { card };
    }
    if (name === 'hot_vs_slipping') {
      const built = hotVsSlipping({ id: check.id, profile: board.profile, rows, today });
      if (built.message) return { error: built.message };
      const card = await publish(ctx, {
        kind: name,
        args: { id: check.id },
        date: today,
        built,
        ttl: SETTLED_TTL_MS,
      });
      return { card };
    }
    const slice = validateRecentArgs(a);
    if (slice.error) return { error: slice.error };
    if (!slice.filter.market && !slice.filter.size && !slice.filter.odds) {
      return { error: 'Pass one of market, size, or odds.' };
    }
    const built = streakStrip({
      id: slice.id,
      profile: board.profile,
      rows,
      sport: slice.sport,
      filter: slice.filter,
      today,
    });
    if (built.message) return { error: built.message };
    const card = await publish(ctx, {
      kind: name,
      args: { id: slice.id, sport: slice.sport, ...slice.filter },
      date: today,
      built,
      ttl: SETTLED_TTL_MS,
    });
    return { card };
  }
  if (name === 'money_board') {
    const sport = a.sport ? String(a.sport).toUpperCase() : null;
    if (a.date && a.date !== today) return { error: 'The money board is tonight\'s card.' };
    const { games, profiles } = await ctx.loadAction();
    const prices = ctx.loadPrices ? await ctx.loadPrices() : null;
    const open = ctx.openBoard(games, profiles, prices, today);
    const built = moneyBoard({ games: open.games, sport, date: today });
    if (built.message) return { error: built.message };
    const card = await publish(ctx, {
      kind: name,
      args: { sport },
      date: today,
      built,
      ttl: TONIGHT_TTL_MS,
    });
    return { card };
  }
  if (name === 'morning_recap') {
    const date = a.date || addDays(today, -1);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: 'date must be YYYY-MM-DD' };
    let rows = null;
    try {
      rows = ctx.loadDayBets ? await ctx.loadDayBets(date) : null;
    } catch {
      rows = null;
    }
    if (!Array.isArray(rows)) return { error: 'Last night is not loaded.' };
    const built = morningRecap({ rows, date });
    if (built.message) return { error: built.message };
    const card = await publish(ctx, {
      kind: name,
      args: { date },
      date,
      built,
      ttl: SETTLED_TTL_MS,
    });
    return { card };
  }
  return { error: `Unknown tool ${name}` };
}

module.exports = { CARD_TOOLS, answerCard };
