/* IRON DIALECTIC — the Sovereignty panel (key U): who owns what, and how to get it back. For a dependency:
   its overlord, what the overlord takes and forbids, the resistance gauge and its causes, and every road to
   independence with its requirement and odds. For an overlord: its dependencies and the levers over them.
   For everyone: oil fields and who holds the concession, unions of the nation, and (historical) the
   liberation fronts. Also a handbook page, Report items and the map's oil marks (ui/render.js). */
(function () {
  'use strict';
  const ID = (globalThis.ID = globalThis.ID || {});
  const UI = ID.UI, esc = ID.esc, Pn = ID.Panels, acts = UI.acts, Sv = ID.Sov;
  const tip = (h) => UI.tip(h);
  const sec = (title, body, small) => '<div class="sec"><h3>' + title + (small ? '<small>' + small + '</small>' : '') + '</h3>' + body + '</div>';
  const P = () => UI.G.nations[UI.G.player];
  const sw = (o) => (ID.Render && ID.Render.swatch ? ID.Render.swatch(o) : '') + esc(o.base);
  const pct = (v) => Math.round(v * 100) + '%';
  const kv = UI.kv;

  /* the causes of the resistance gauge's monthly movement, in words (mirrors depMonth in sim/sovereignty.js) */
  function causes(G, n) {
    const over = Sv.over(G, n), K = Sv.kindOf(n), dp = n.dep, out = [];
    const I = ID.ideo(n), era = ID.eraOf(G.tick);
    out.push([K.drift > 0 ? 'up' : 'down', 'Being a ' + K.name.toLowerCase(), K.drift]);
    if (dp.share > 0) out.push(['up', 'The tribute (' + pct(dp.share) + ' of revenue)', dp.share * 1.2]);
    if (era) out.push(['up', 'The spirit of the age', era * 0.06]);
    if (n.ideo === 'thirdpos' || n.ideo === 'pannat' || n.ideo === 'revival' || n.ideo === 'juche' || n.ideo === 'natsyn' || n.ideo === 'natsoc' || n.ideo === 'nazacc') out.push(['up', 'A nationalist regime', 0.45]);
    else if (I.family === 'heterodox' || I.family === 'authoritarian' || I.family === 'socialist') out.push(['up', 'The regime’s convictions', 0.2]);
    if (over.nwars) out.push(['up', over.base + ' is at war', 0.25]);
    if (over.stab < 35) out.push(['up', over.base + ' is unstable', 0.35]);
    if (over.lostWarAt != null && over.age - over.lostWarAt < 24) out.push(['up', over.base + ' has just lost a war', 0.5]);
    if (dp.gar > 0) out.push(['down', 'The garrison', dp.gar * 0.15]);
    const op = ID.op(G, n.id, over.id); if (Math.abs(op) > 5) out.push([op > 0 ? 'down' : 'up', 'Our opinion of ' + over.base + ' (' + Math.round(op) + ')', Math.abs(op) * 0.004]);
    return out;
  }
  const arrow = (c) => '<span class="' + (c[0] === 'up' ? 'bad' : 'good') + '">' + (c[0] === 'up' ? '▲' : '▼') + ' ' + esc(c[1]) + '</span>';

  function dependency(G, n) {
    const over = Sv.over(G, n), K = Sv.kindOf(n), dp = n.dep, union = dp.kind === 'union';
    let h = '<div class="card"><b>' + esc(n.name) + ' is ' + (union ? 'a region of a union with ' : 'a ' + K.name.toLowerCase() + ' of ') + sw(over) + '</b><p style="margin-top:4px">' + esc(K.desc) + '</p></div>';
    const vet = [K.veto.war ? 'war and peace' : '', K.veto.law ? 'trade, recruitment and mobilisation laws' : ''].filter(Boolean).join('; ');
    h += sec('What ' + esc(over.base) + ' takes and decides', kv([
      ['Tribute', pct(dp.share) + ' of revenue and oil income' + (n.a.tribute ? ' <span class="dim">(' + Math.round(n.a.tribute) + ' gold last month)</span>' : '')],
      ['Decides', vet || '<span class="dim">nothing; a friend with a base</span>'],
      ['Garrison', dp.gar > 0 ? (dp.gar >= 1 ? 'large' : dp.gar >= 0.5 ? 'regular' : 'small') + ' <span class="dim">(defence +' + Math.round(dp.gar * 10) + '%, unrest −' + (dp.gar * 3).toFixed(1) + ')</span>' : 'none'],
      ['Can depose the government', K.depose ? '<span class="bad">yes</span>' : 'no'],
      ['Since', ID.dateOf(dp.since).short],
    ]));
    const res = Math.round(dp.res);
    h += sec(union ? 'The union’s tension' : 'Collaboration ↔ resistance', '<div class="row nw" style="align-items:center;gap:10px"><span class="dim">' + (union ? 'Harmony' : 'Collaboration') + '</span>' + UI.bar(res, 100, res > 70 ? 'r' : res > 45 ? 'o' : 'g', union ? 100 : 80) + '<span class="dim">' + (union ? 'Break' : 'Resistance') + '</span><b>' + res + '</b></div>' +
      '<p class="dim" style="margin:6px 0">' + (union ? 'At 100 the union breaks and ' + esc(n.base) + ' is a state again.' : 'Resistance grows the nationalists’ legitimacy and, above 70, unrest. Collaboration buys aid and quiet. At 80 the country can rise; at 55 it can ask for a treaty.') + '</p>' +
      '<div class="chips">' + causes(G, n).map(arrow).join(' ') + '</div>');
    if (union) return h;
    const odds = Sv.petitionOdds(G, n);
    const road = (name, status, btn) => '<div class="card"><b>' + name + '</b><p style="margin-top:3px">' + status + '</p>' + (btn ? '<div class="row" style="margin-top:6px">' + btn + '</div>' : '') + '</div>';
    let ways = '';
    ways += road('A treaty', 'Resistance 55 or more, then petition. Granted if the overlord is weak, busy, or the age is against empires: about <b>' + pct(odds) + '</b> now. The bases stay.', UI.btn(Sv.ACTS.petition.name + ' <span>' + Sv.ACTS.petition.auth + ' auth</span>', 'sovAct', 'petition', { cls: 'sm', off: Sv.actBlock(G, n, 'petition'), tip: Sv.ACTS.petition.desc }));
    ways += road('A rising', 'Resistance 80 or more. A war of independence against ' + esc(over.base) + ' (' + Math.round(ID.Diplomacy.power(over) / Math.max(1, ID.Diplomacy.power(n)) * 10) / 10 + '× our strength), whose garrison becomes an enemy army.', UI.btn(Sv.ACTS.rise.name + ' <span>' + Sv.ACTS.rise.auth + ' auth</span>', 'sovAct', 'rise', { cls: 'sm red', off: Sv.actBlock(G, n, 'rise'), tip: Sv.ACTS.rise.desc }));
    ways += road('The overlord’s weakness', esc(over.base) + ': stability ' + Math.round(over.stab) + (over.nwars ? ', at war' : ', at peace') + '. If it collapses, loses most of its land or is conquered, we are free.', '');
    if (G.historical && n.dep.script) ways += road('History', 'In this history the great powers’ own chapters may redraw who rules us: the peace conferences, the mandates, the treaties. The World Dispatch prints what is coming months ahead.', '');
    h += sec('Ways out', ways);
    h += sec('Meanwhile', '<div class="row">' + UI.btn(Sv.ACTS.collaborate.name, 'sovAct', 'collaborate', { cls: 'sm ghost', off: Sv.actBlock(G, n, 'collaborate'), tip: Sv.ACTS.collaborate.desc + '<br>Resistance −12, gold +60.' }) + UI.btn(Sv.ACTS.resist.name, 'sovAct', 'resist', { cls: 'sm ghost', off: Sv.actBlock(G, n, 'resist'), tip: Sv.ACTS.resist.desc + '<br>Resistance +12.' }) + '</div>');
    return h;
  }

  function overlord(G, n) {
    const L = Sv.dependents(G, n); if (!L.length) return '';
    let h = '';
    for (const o of L) {
      const K = Sv.kindOf(o), dp = o.dep, b = (k, label) => UI.btn(label, 'sovOver', [o.id, k], { cls: 'sm ghost', tip: Sv.OVER[k].desc });
      h += '<div class="card"><b>' + sw(o) + '</b> <span class="dim">' + K.name + (dp.kind === 'union' ? '' : ' · tribute ' + pct(dp.share)) + '</span>' +
        '<div class="row nw" style="align-items:center;gap:8px;margin:6px 0"><span class="dim">' + (dp.kind === 'union' ? 'Tension' : 'Resistance') + '</span>' + UI.bar(dp.res, 100, dp.res > 70 ? 'r' : dp.res > 45 ? 'o' : 'g') + '<b>' + Math.round(dp.res) + '</b></div>' +
        (dp.kind === 'union' ? '<p class="dim">A region of our union. At 100 tension it breaks away.</p>' : '<div class="row">' + b('tribute', 'Raise tribute') + b('ease', 'Ease') + b('garrison', 'Garrison') + (K.depose ? b('depose', 'Depose') : '') + b('grant', 'Grant independence') + '</div>') + '</div>';
    }
    return sec('Our dependencies', h, L.length + '');
  }

  function oil(G, n) {
    const own = Sv.oilProvs(G, n), held = Sv.held(G, n), price = Sv.price(G);
    let unfound = 0; for (let p = 1; p < G.provinces.length; p++) { const Pr = G.provinces[p]; if (Pr.oil && !Pr.oilFound && Pr.owner === n.id) unfound += Pr.oil; }
    if (!own.length && !held.length && !unfound) return sec('Oil', '<p class="dim">No oil has been found on our land' + (ID.eraOf(G.tick) < 2 ? ' yet' : '') + '. Oil is struck by chance, by programme or by history, mostly in deserts.</p>');
    let h = '<p class="lead">Oil earns ' + price.toFixed(1) + ' gold a field a month' + (G.world.oilShock ? ' (after the oil shock)' : '') + ', rising with each era. A foreign company keeps its share until its concession is nationalised.</p>';
    if (own.length) {
      h += '<table class="t"><tr><th>Field</th><th class="n">Fields</th><th>Concession</th><th class="n">Their share</th></tr>' + own.map((Pr) => { const co = Pr.oilCo && Pr.oilCo !== n.id ? G.nations[Pr.oilCo] : null; return '<tr><td>' + (Pr.canal ? 'The Canal' : 'Province ' + Pr.id) + '</td><td class="n">' + Pr.oil + '</td><td>' + (co ? sw(co) : '<span class="good">ours</span>') + '</td><td class="n">' + (co ? pct(Pr.oilShare || 0.7) : '—') + '</td></tr>'; }).join('') + '</table>';
      h += kv([['Our oil income', Math.round(n.a.oilInc || 0) + ' gold a month'], ['Unexplored fields', unfound ? unfound + ' (struck in time, or by a drilling programme)' : 'none known']]);
      const foreign = own.some((Pr) => Pr.oilCo && Pr.oilCo !== n.id), free = own.some((Pr) => !Pr.oilCo || Pr.oilCo === n.id);
      const buyers = ID.alive(G).filter((o) => o !== n && ID.rankOf(G, o, 'power') <= 6 && !ID.atWar(G, n.id, o.id)).sort((a, b) => ID.Diplomacy.power(b) - ID.Diplomacy.power(a)).slice(0, 3);
      h += '<div class="row">' + (foreign ? UI.btn('Nationalise <span>20 auth</span>', 'sovNat', null, { cls: 'sm red', off: n.auth < 20 ? 'Needs 20 authority.' : '', tip: '<h5>Nationalise every foreign concession</h5>The oil becomes ours. The companies’ countries will answer: an embargo, a coup, an invasion, or a settlement. It is a crisis, and the whole world watches.' }) : '') +
        (free ? buyers.map((o) => UI.btn('Sell to ' + esc(o.base) + ' <span>+' + Sv.concessionValue(G, n) + 'g</span>', 'sovSell', o.id, { cls: 'sm ghost', tip: 'Gold now; the ' + esc(o.adj) + ' company takes 70% of the oil income for as long as the concession lasts.' })).join('') : '') + '</div>';
    } else if (unfound) h += '<p>' + unfound + ' fields lie unexplored under our land.</p>';
    if (held.length) h += '<div class="note">Our companies hold concessions abroad: ' + held.map((Pr) => sw(G.nations[Pr.owner]) + ' (' + Pr.oil + ')').join(', ') + '. They earn us ' + Math.round(n.a.oilCoInc || 0) + ' gold a month.</div>';
    return sec('Oil', h);
  }

  function union(G, n) {
    if (!ID.ideo(n).flags.panNation && !Sv.inUnion(G, n)) return '';
    const c = n.dep ? [] : Sv.unionCands(G, n);
    return sec('One nation', '<p>' + (Sv.inUnion(G, n) ? 'We are in a union of the nation. Each state of the nation that joins counts toward the objective; a union’s tension, like a dependency’s resistance, decides whether it lasts.' : 'States of the nation that border us or lie near, and are not at war with us, may join us in a union: one republic, one army, one president. Two pan-national regimes not in the same union treat each other as traitors.') + '</p>' +
      (n.dep ? '' : '<div class="row">' + UI.btn('Call for union', 'sovUnion', null, { cls: 'sm', off: c.length ? '' : 'No state of the nation is ready.', tip: c.length ? 'Candidates: ' + c.map((o) => esc(o.base)).join(', ') : '' }) + '</div>'));
  }

  function fronts(G) {
    if (!G.fronts) return '';
    const L = Object.keys(G.fronts).map((k) => [k, G.fronts[k], ID.FRONTS[k]]).filter((x) => x[2]);
    if (!L.length) return '';
    return sec('Peoples without a state', L.map(([k, F, d]) => '<div class="card"><b>' + esc(d.name.charAt(0).toUpperCase() + d.name.slice(1)) + '</b> <span class="dim">' + (F.state ? 'now ' + esc(G.nations[F.state] ? G.nations[F.state].name : d.base) : 'strength ' + Math.round(F.str) + (F.host && G.nations[F.host] ? ' · in ' + esc(G.nations[F.host].base) : '') + (F.sponsor && G.nations[F.sponsor] ? ' · backed by ' + esc(G.nations[F.sponsor].base) : '')) + '</span><p style="margin-top:3px">' + esc(d.blurb) + '</p>' +
      (F.state ? '' : '<div class="row nw" style="align-items:center;gap:8px">' + UI.bar(F.str, 100, F.str > 70 ? 'r' : 'o', d.riseAt || 85) + '<span class="dim">rises at ' + (d.riseAt || 85) + '</span></div>') + '</div>').join(''));
  }

  Pn.sov = function (G, n) {
    let h = '';
    if (n.dep) h += dependency(G, n);
    else h += '<p class="lead">' + esc(n.name) + ' answers to no foreign power.' + (n.flags.wasDependent ? ' It did, once.' : '') + ' Here: our dependencies, our oil, the nation’s unions and the peoples who have no state.</p>';
    h += overlord(G, n) + oil(G, n) + union(G, n) + fronts(G);
    return h;
  };
  acts.sovAct = (k) => { const G = UI.G; if (UI.tryDo(Sv.act(G, P(), k))) UI.after(); };
  acts.sovOver = (a) => { const G = UI.G, o = G.nations[a[0]]; if (o && UI.tryDo(Sv.overAct(G, P(), o, a[1]))) UI.after(); };
  acts.sovNat = () => { const G = UI.G, n = P(); if (n.auth < 20) return; n.auth -= 20; const k = Sv.nationaliseAll(G, n); UI.toast(k ? 'The oil is ours. Now the answer.' : 'Nothing to nationalise.'); UI.after(); };
  acts.sovSell = (id) => { const G = UI.G; if (UI.tryDo(Sv.sell(G, P(), G.nations[id]))) UI.after(); };
  acts.sovUnion = () => { const G = UI.G, r = Sv.proposeUnion(G, P()); UI.toast(r || 'The call has gone out.'); UI.after(); };

  /* Report items: a rising within reach, a petition worth trying, a union about to break */
  Sv.advice = function (G, n, add) {
    if (!n.dep) return;
    const over = Sv.over(G, n); if (!over) return;
    if (n.dep.kind === 'union') { if (n.dep.res > 75) add(62, 'The union is straining', 'Tension ' + Math.round(n.dep.res) + ' of 100. At 100 it breaks.', [{ label: 'Sovereignty', act: 'tab', arg: 'sov', cls: 'ghost' }]); return; }
    if (n.dep.res >= 80) add(66, 'The country is ready to rise', 'Resistance ' + Math.round(n.dep.res) + '. A rising against ' + esc(over.base) + ' is possible now.', [{ label: 'Raise the country', act: 'sovAct', arg: 'rise', off: Sv.actBlock(G, n, 'rise'), cls: 'em' }, { label: 'Sovereignty', act: 'tab', arg: 'sov', cls: 'ghost' }]);
    else if (n.dep.res >= 55 && !Sv.actBlock(G, n, 'petition')) add(48, 'A treaty may be within reach', 'Resistance ' + Math.round(n.dep.res) + '; ' + esc(over.base) + ' might grant a treaty (about ' + pct(Sv.petitionOdds(G, n)) + ').', [{ label: 'Petition', act: 'sovAct', arg: 'petition', cls: 'em' }, { label: 'Sovereignty', act: 'tab', arg: 'sov', cls: 'ghost' }]);
  };

  Pn.helpSov = function () {
    return '<p class="lead">Not every state is sovereign. Some are ruled from another capital; some own their land and not what lies under it.</p>' +
      sec('Dependencies', '<ul><li><b>Vilayets, protectorates and mandates</b> pay their overlord a share of revenue and oil, cannot make war or change trade and army laws without it, house its garrison, and can have their government deposed.</li><li><b>Treaty states</b> are independent in name: the bases stay and wars still need permission. <b>Clients</b> host a base by choice, in return for aid and protection.</li><li>The <b>gauge</b> runs from collaboration to resistance. It rises with nationalist regimes, the tribute, the age and the overlord’s wars and troubles; it falls with garrisons and good relations.</li><li><b>Ways out:</b> petition for a treaty (resistance 55), rise (resistance 80), or wait for the overlord to collapse. An overlord defends its dependencies when they are attacked.</li></ul>') +
      sec('Oil', '<ul><li>Oil fields lie mostly under deserts, and are found by chance, by drilling programmes or by history. Their income rises with each era, and jumps after an oil shock.</li><li>A <b>concession</b> sold to a foreign company brings gold now and gives the company most of the income for ever.</li><li><b>Nationalising</b> takes it back, and is a crisis: the company’s country answers with an embargo, a coup, an invasion or a settlement.</li></ul>') +
      sec('Intervention', '<ul><li>Bloc leaders arm one side of wars where the other side leans to a rival bloc, court states that belong to no bloc with aid, take bases, and invade dependencies in civil war to restore order.</li></ul>') +
      sec('Unions', '<ul><li>Two pan-national states can unite. The junior partner becomes a region of the union; its tension rises with the senior’s dominance and its own officers’ resentment, and at 100 the union breaks.</li></ul>');
  };
})();
