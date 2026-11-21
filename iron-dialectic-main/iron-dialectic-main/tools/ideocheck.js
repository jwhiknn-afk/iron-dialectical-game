/* Self-check for ideologies: every system has its doctrine, regime body and lines, programme tree, leader title,
   emblem and starting weights; then each named ideology is forced on a few states and the world is run for years,
   with every doctrine action and war order exercised, to catch runtime errors.
   node tools/ideocheck.js [ideo,ideo,...] [years] */
'use strict';
const ID = require('./load.js');
const want = (process.argv[2] || 'juche,natsyn,technosoc,nrx,natsoc,nazacc').split(','), yrs = +(process.argv[3] || 30);
let bad = 0;
const fail = (m) => { bad++; console.log('FAIL ' + m); };
const emb = require('fs').readFileSync(require('path').join(__dirname, '../js/ui/flags.js'), 'utf8');
for (const I of ID.IDEO_LIST) {
  if (!ID.FAMILIES[I.family]) fail(I.id + ': unknown family');
  if (!ID.DOCTRINE[I.id]) fail(I.id + ': no doctrine');
  if (!ID.REGIME.body[I.id]) fail(I.id + ': no regime body');
  if (!ID.REGIME.lines[I.id] || ID.REGIME.lines[I.id].length !== 3) fail(I.id + ': regime lines');
  if (!ID.FOCUS.ideos[I.id] || ID.FOCUS.ideos[I.id].length < 7) fail(I.id + ': ideology tree');
  if (ID.START_WEIGHTS[I.id] == null) fail(I.id + ': start weight');
  if (!ID.SIT_FOR[I.id]) fail(I.id + ': situations');
  if (!new RegExp('\\b' + I.id + ": '").test(emb)) fail(I.id + ': emblem');
  for (const d of I.drift) if (!ID.IDEOLOGIES[d.to]) fail(I.id + ': drift to unknown ' + d.to);
  for (const r of I.rivals) if (!ID.IDEOLOGIES[r]) fail(I.id + ': unknown rival ' + r);
  for (const c in I.laws) for (const o of I.laws[c]) if (!ID.LAWS[c].opts[o]) fail(I.id + ': unknown law ' + c + '.' + o);
  for (const c in I.lawDef) if (I.laws[c].indexOf(I.lawDef[c]) < 0) fail(I.id + ': default law not allowed ' + c);
  const D = ID.DOCTRINE[I.id]; if (D && D.order && !ID.Combat.ABIL[D.order.key]) fail(I.id + ': order not registered');
}
console.log('ideologies:', ID.IDEO_LIST.length, '| families:', Object.keys(ID.FAMILIES).length);

const seen = {};
for (const scen of ['meridia', 'random']) for (const seed of [3, 11]) {
  const G = ID.newGame({ seed, scenario: scen, headless: true });
  const al = ID.alive(G);
  want.forEach((id, k) => { const n = al[(k * 3 + seed) % al.length]; ID.Politics.changeIdeology(G, n, id, 'reform'); });
  let err = null;
  try {
    while (G.tick < yrs * 360 && !G.over) {
      ID.Game.tick(G);
      if (G.tick % 360 === 0) for (const n of ID.alive(G)) if (want.indexOf(n.ideo) >= 0) {
        seen[n.ideo] = (seen[n.ideo] || 0) + 1;
        const D = ID.DOCTRINE[n.ideo];
        for (const a of D.acts) { n.cd['dc_' + a.id] = 0; n.auth = 100; n.gold = Math.max(n.gold, 500); ID.Doctrine.run(G, n, a.id); }
        const ab = ID.Combat.ABIL[D.order.key];
        if (n.nwars && ab) { const en = ID.Diplomacy.enemies(G, n)[0]; ID.Combat.useAbil(G, n, D.order.key, en ? en.capital : -1); }
        const mods = ID.Doctrine.describe(n.sigm || {}); if (mods.some((m) => !/\S/.test(m.t))) fail('empty mod text');
        for (const k of ['sig', 'stab', 'legit', 'gold', 'pop', 'troops']) if (!isFinite(n[k])) fail(n.base + ' ' + n.ideo + ' ' + k + ' not finite');
      }
    }
  } catch (e) { err = e; }
  if (err) fail(scen + ' seed ' + seed + ': ' + err.stack.split('\n').slice(0, 4).join(' | '));
  const end = {}; for (const n of ID.alive(G)) end[n.ideo] = (end[n.ideo] || 0) + 1;
  const ch = G.chronicle.filter((c) => want.some((w) => c.text.indexOf(ID.IDEOLOGIES[w].name) >= 0)).length;
  console.log(scen, seed, ID.dateOf(G.tick).str, 'alive', ID.alive(G).length, 'new ideologies at end:', want.map((w) => w + ' ' + (end[w] || 0)).join(', '), '| chronicle mentions', ch);
  const s = ID.Game.save(G); const G2 = ID.Game.load(s); if (!G2 || G2.nations.length !== G.nations.length) fail('save round trip');
}
console.log('state-years under each:', JSON.stringify(seen));
console.log(bad ? bad + ' problems' : 'all checks passed');
process.exit(bad ? 1 : 0);
