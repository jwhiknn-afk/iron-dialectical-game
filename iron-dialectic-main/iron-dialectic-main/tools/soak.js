/* Passive-player soak test: take each nation, never touch a lever, answer dispatches at random.
   node tools/soak.js [meridia|random] [difficulty] [auto] [hist]   ('auto' lets the AI play the player's nation instead; 'hist' turns on historical mode) */
'use strict';
const ID = require('./load.js');
const scen = process.argv[2] || 'meridia', diff = process.argv[3] || 'iron', auto = process.argv.includes('auto'), hist = process.argv.includes('hist');
const base = ID.newGame({ seed: 5, scenario: scen, headless: true });
const ids = ID.alive(base).map((n) => n.id);
for (const id of ids) {
  const G = ID.newGame({ seed: 5, scenario: scen, headless: true, difficulty: diff, historical: hist });
  ID.setPlayer(G, id); G.autoPlayer = auto; const n = G.nations[id]; const name = n.base, start = n.ideo;
  const rng = new ID.RNG(id * 99);
  while (!G.over && ID.yearOf(G.tick) < 1976) {
    ID.Game.tick(G);
    while (G.evq.length) { const e = G.evq[0]; const def = ID.Events.def(e.id); const opts = ID.Events.options(G, G.nations[e.n], def, e.ctx); ID.Events.choose(G, Math.floor(rng.next() * opts.length)); }
    // a conspiracy lives in two places, the backer's ops and the figure's backer: they must agree
    if (G.tick % 30 === 0) for (const t of ID.alive(G)) for (const f of t.circle || []) {
      const b = f.backer && G.nations[f.backer]; if (!b || !b.alive) continue;
      if (!b.ops.some((o) => o.type === 'coup' && o.target === t.id && o.seat === f.seat && o.name === f.name)) throw new Error(ID.yearOf(G.tick) + ': ' + f.name + ' of ' + t.base + ' is backed by ' + b.base + ', which has no plot there');
    }
  }
  const p = G.nations[G.player];
  const o = G.over;
  console.log(name.padEnd(9), start.padEnd(11), '->', (p.ideo + (p.id !== id ? '(switched)' : '')).padEnd(13), o ? (o.result + ' ' + o.type + ' ' + o.year + (o.pm ? ' | ' + o.pm.head + (o.pm.turned ? ' / ' + o.pm.fname : '') : '')) : 'survived to 1976 rank #' + ID.rankOf(G, p, 'score') + ' land ' + Math.round(p.tiles / G.landCount * 100) + '%');
}
