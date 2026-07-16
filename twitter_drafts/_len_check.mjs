const hero = `Trent put Brewers ML on a +1000 slip.

We froze the other market.
Over 8.5 · TOP+ · 5u.

Final: Brewers 8, Cards 4.
+4.9u.

Also cashed: France SUPER +3.53u · Braves RL +3.5u
Also ate: Sox · Phillies -1.5 · Cubs Over

3-3 staked. Flat. 2 still live.

ML for the feel…
or Over for the tape?`;

const qt = `They took four of five in St. Louis.

We took Over 8.5.

TOP+ · 5u · locked on Trent's ML night
Final 8-4. +4.9u.

Still think the moneyline was the play?`;

const zack = `It was.

Phillies -1.5 RANK 4u ❌
Path was 24-12. Still lost.

Board posts include the traps —
Braves RL and Brewers Over printed.
This one didn't.

Fade the next RANK… or still trust the path?`;

const self = `Day board so far: 3-3 · ~flat
+11.93u cashed · -12u lost

2 still sweating:
Dbacks ML MINI 2.5u
Giants ML MINI- 1u

Lock alerts caught the freezes.
nhlsavant.com`;

for (const [n, t] of [
  ['hero', hero],
  ['qt', qt],
  ['zack', zack],
  ['self', self],
]) {
  const e = (t.match(/\p{Extended_Pictographic}/gu) || []).length;
  const nch = [...t].length;
  let band =
    nch > 280
      ? 'OVER'
      : nch >= 220 && nch <= 280
        ? 'LONG'
        : nch >= 71 && nch <= 100
          ? 'PUNCH'
          : nch >= 101 && nch <= 219
            ? 'VALLEY'
            : 'THIN';
  console.log(n, nch, band, 'emoji', e);
  console.log(t);
  console.log('---');
}
