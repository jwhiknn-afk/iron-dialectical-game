/* IRON DIALECTIC — foreign policy programmes (historical campaigns on The Two Continents).
   Each country gets a pair of programmes aimed at named neighbours, appended to its national project
   column. They act through notes: ['note2', base, kind] sends a diplomatic note that the other
   government answers (the player through a dispatch, AI countries by weighing power and opinion),
   and the answer is printed in The World Dispatch. Kinds:
     treaty  a trade treaty and a non-aggression pact
     cede    hand over the provinces we claim (refused: the claim becomes a cause for war)
     bloc    join our bloc
     aid     accept a gift of 120 gold and our advisers
     toll    pay a yearly toll for passage (accepted: 8 gold a month to us while it lasts) */
(function () {
  'use strict';
  const ID = (globalThis.ID = globalThis.ID || {});
  const PERM = 600;
  const F = ID.FOCUS, P = F.projects || (F.projects = {});
  const add = (base, pre, L) => {
    const cur = (P[base] || []).concat(F.nations[base] || []); if (!cur.length) return;
    const X = Math.max(...cur.map((f) => f.x)) + 1.2;
    const id = (s) => pre + '_f_' + s[0];
    const [a, b] = L;
    (P[base] = P[base] || []).push(
      { id: id(a), name: a[1], desc: a[2], fx: a[3], x: X, y: 0, days: 120, proj: 1, foreign: 1, excl: [id(b)], year: a[4] || 0 },
      { id: id(b), name: b[1], desc: b[2], fx: b[3], x: X, y: 1, days: 120, proj: 1, foreign: 1, excl: [id(a)], year: b[4] || 0 });
  };
  const n2 = (base, kind) => ['note2', base, kind];
  /* Karsova starts as a giant on clay feet: a peasant army, a ruined industry and a dozen nations in one state. */
  if (ID.NATIONAL && ID.NATIONAL.Karsova) ID.NATIONAL.Karsova.mods = [['prod', -0.1, 360, 'The backward giant'], ['atk', -0.08, 240, 'An army of peasants'], ['unrest', 3, 240, 'A prison of nations'], ['mob', -0.01, 300, 'A peasant army that goes home'], ['eff', -0.04, 240, 'The backward giant']];

  add('Aurelia', 'au', [
    ['concert', 'The Concert’s protector', 'Invite the northern kingdom into the Concert of Crowns, and make the Guardians of Irkal a gift.', [n2('Norvik', 'bloc'), n2('Irkal', 'aid'), ['mod', 'legit', 3, PERM, 'Protector of thrones']]],
    ['mission', 'The Pan-Aurelian mission', 'The Aurelian-speaking provinces of Drava are to come home, by treaty or otherwise.', [['claim', 'Drava'], n2('Drava', 'cede'), ['sup', 'military', 5]]],
  ]);
  add('Cassine', 'ca', [
    ['lend', 'Arsenal of the democracies', 'Credits and advisers for the republics of the north, before someone else offers.', [n2('Norvik', 'aid'), n2('Tessaly', 'aid'), ['mod', 'trade', 0.05, PERM, 'Arsenal of the democracies']]],
    ['hemi', 'The hemisphere doctrine', 'The southern continent is Cassine’s backyard. Its governments will sign, or find out why.', [n2('Antara', 'treaty'), n2('Meridia', 'treaty'), ['mod', 'rev', 0.04, PERM, 'The hemisphere doctrine']]],
  ]);
  add('Norvik', 'no', [
    ['union', 'The northern union', 'Free trade and common defence with the islands of the north sea.', [n2('Kelda', 'treaty'), n2('Vess', 'treaty'), ['mod', 'def', 0.04, PERM, 'The northern union']]],
    ['broker', 'The honest broker', 'Norvik offers its good offices to both blocs, and a conference hall nobody else will lend.', [['op', 'Aurelia', 15], ['op', 'Hesperia', 15], ['opAll', 4]]],
  ]);
  add('Tessaly', 'te', [
    ['offices', 'Good offices', 'The confederation offers itself as the place where enemies meet: a peace palace, a red cross, a bank that asks no questions.', [['opAll', 8], n2('Lys', 'treaty'), ['mod', 'trade', 0.05, PERM, 'Neutral ground']]],
    ['redoubt', 'The national redoubt', 'Tunnels in the mountains, a militia in every canton, and a note to every neighbour that the passes will be blown.', [['mod', 'def', 0.12, PERM, 'The national redoubt'], n2('Hesperia', 'treaty')]],
  ]);
  add('Verano', 've', [
    ['intl', 'The international brigades', 'Volunteers from every country come to Verano; Verano’s unions go to every country.', [['subvertNb', 25], ['troops', 0.03], ['opAll', -4]]],
    ['sister', 'The sister republic', 'A treaty of friendship with Antara across the ocean: copper for olive oil, refugees for rifles.', [n2('Antara', 'treaty'), n2('Antara', 'aid')]],
  ]);
  add('Drava', 'dr', [
    ['lost', 'The lost provinces', 'Every schoolroom in Drava has a map with a black border. Aurelia will be asked, once, to give them back.', [['claim', 'Aurelia'], n2('Aurelia', 'cede'), ['sup', 'military', 6]]],
    ['anvil', 'The anvil of the Accord', 'Drava offers itself as the Steel Accord’s fortress in the east.', [['ally', 'Hesperia'], ['mod', 'def', 0.06, PERM, 'The anvil']]],
  ]);
  add('Lys', 'ly', [
    ['toll', 'The chain across the straits', 'The empires on either shore will pay for every warship that passes, or find the chain across the water.', [n2('Hesperia', 'toll'), n2('Aurelia', 'toll'), ['nq', 10]]],
    ['ships', 'Hulls for Cassine', 'The yards of Lys will build Cassine’s merchant fleet, at a price, and Cassine’s navy will remember who did.', [n2('Cassine', 'treaty'), ['gold', 120], ['mod', 'navy', 0.3, PERM, 'Cassine’s friendship']]],
  ]);
  add('Karsova', 'ka', [
    ['comintern', 'The Communist International', 'A general staff of world revolution, with sections in every country and a budget in Karsovan gold.', [['subvertNb', 35], n2('Suyan', 'aid'), ['opAll', -5]]],
    ['border', 'The treaty of the borderlands', 'Ruthe holds provinces that were Karsovan before the war. They will be returned, peacefully if Ruthe is sensible.', [['claim', 'Ruthe'], n2('Ruthe', 'cede')]],
  ]);
  add('Ruthe', 'ru', [
    ['oath', 'The legions’ oath', 'The legions swear to free the Ruthenian villages beyond the Karsovan frontier.', [['claim', 'Karsova'], ['sup', 'military', 8], ['mod', 'atk', 0.05, PERM, 'The legions’ oath']]],
    ['guarantee', 'A guarantee from Hesperia', 'Hesperia has offered to guarantee Ruthe’s frontiers. The guarantee comes with a garrison.', [n2('Hesperia', 'bloc'), ['mod', 'def', 0.06, PERM, 'The guarantee']]],
  ]);
  add('Suyan', 'su', [
    ['river', 'The river treaty', 'Buy peace on the river with trade concessions to Hesperia, and time to build an army.', [n2('Hesperia', 'treaty'), ['mod', 'def', 0.05, PERM, 'Time bought']]],
    ['front', 'The united front', 'Ask Karsova for rifles and advisers, and ask nothing about the price.', [['op', 'Karsova', 25], n2('Karsova', 'bloc'), ['troops', 0.03]]],
  ]);
  add('Hesperia', 'he', [
    ['lake', 'The lake conference', 'A conference by a lake at which Pavon’s border provinces are discussed by everyone except Pavon.', [['claim', 'Pavon'], n2('Pavon', 'cede'), ['sup', 'military', 4]]],
    ['axis', 'An axis of steel', 'A pact with Drava and Ruthe against the reds and the democracies alike.', [n2('Drava', 'bloc'), n2('Ruthe', 'bloc'), ['mod', 'atk', 0.04, PERM, 'The axis']]],
  ]);
  add('Irkal', 'ir', [
    ['road', 'The pilgrims’ road', 'A railway for pilgrims to the holy city, built with Aurelian money and run by the Guardians.', [n2('Aurelia', 'treaty'), ['mod', 'legit', 4, PERM, 'The pilgrims’ road']]],
    ['faithful', 'The faithful abroad', 'Preachers and money for the faithful in every neighbouring state.', [['subvertNb', 20], ['sup', 'clergy', 6]]],
  ]);
  add('Pavon', 'pv', [
    ['protect', 'Hesperian protection', 'Hesperia offers loans, officers and a guarantee. Shqiri says the price is the country.', [n2('Hesperia', 'bloc'), ['gold', 150], ['nq', -12]]],
    ['entente', 'The mountain entente', 'A defensive pact with Drava, the only neighbour as poor and as stubborn as Pavon.', [n2('Drava', 'treaty'), ['mod', 'def', 0.06, PERM, 'The mountain entente'], ['nq', 4]]],
  ]);
  add('Meridia', 'me', [
    ['export', 'Export the model', 'Planning missions to Antara, with the model’s forecasts and the engineers to read them.', [n2('Antara', 'aid'), n2('Antara', 'treaty'), ['mod', 'eff', 0.03, PERM, 'Feedback from abroad']]],
    ['closed', 'A closed system', 'The model works best without noise from abroad. Tariffs on everything it cannot predict.', [['law', 'trade', 'protect'], ['mod', 'eff', 0.05, PERM, 'A closed system'], ['op', 'Cassine', -15]]],
  ]);
  add('Antara', 'an', [
    ['copper', 'Copper for Cassine', 'A fifty-year concession for the Cassine copper companies, and a Cassine loan for the railways.', [n2('Cassine', 'treaty'), ['gold', 140], ['sup', 'capital', 5], ['sup', 'workers', -4]]],
    ['nation', 'The copper is ours', 'Nationalise the mines without compensation, and dare Cassine to do anything about it.', [['op', 'Cassine', -30], ['mod', 'rev', 0.1, PERM, 'Antaran copper'], ['sup', 'workers', 8], ['sup', 'capital', -10]]],
  ]);
  add('Kelda', 'ke', [
    ['haven', 'The open haven', 'Kelda takes everyone the mainland throws out, and their savings.', [['opAll', 6], ['pop', 0.02], n2('Norvik', 'treaty')]],
    ['offshore', 'Offshore', 'Accounts without names for anyone, under a treaty with Lys that neither will discuss.', [n2('Lys', 'treaty'), ['gold', 160], ['mod', 'rev', 0.06, PERM, 'Accounts without names']]],
  ]);
  add('Vess', 've2', [
    ['harbour', 'Harbour of the north', 'Vess sells coal and harbour rights to Norvik’s fleet.', [n2('Norvik', 'treaty'), ['mod', 'trade', 0.06, PERM, 'Harbour of the north']]],
    ['captain', 'The captain’s fleet', 'Brekke wants gunboats, and a toll on the fishing grounds from anyone who fishes them.', [['mod', 'navy', 0.5, PERM, 'The captain’s fleet'], n2('Norvik', 'toll')]],
  ]);
})();
/* The note and its answer, as the player receives it. */
(function () {
  'use strict';
  const ID = globalThis.ID;
  const K = {
    treaty: ['A treaty from {F}', '{F} proposes a trade treaty and a pact of non-aggression. Its ambassador has brought the text already signed.', 'Sign it', 'Return it unsigned', 'Trade and a non-aggression pact; relations +15.', 'Relations −8.'],
    cede: ['{F} demands provinces', '{F} demands the border provinces it claims, by the end of the month. Its note does not say what happens otherwise. It does not need to.', 'Give them up', 'Refuse', 'The claimed provinces pass to {F}. Stability −6.', 'Relations −25. {F} now has a cause for war, and may use it.'],
    bloc: ['{F} offers an alliance', '{F} invites us to stand with it: one bloc, one staff, one enemy list. Its friends would become ours, and its enemies.', 'Join', 'Decline politely', 'We join {F}’s bloc, or sign a pact of friendship if it leads none.', 'Relations −5.'],
    aid: ['A gift from {F}', '{F} offers 120 gold in credits and a mission of advisers, to be spent as we see fit and to be remembered.', 'Accept', 'We need nothing from them', '+120 gold, stability +3, relations +20.', 'Relations −5.'],
    toll: ['{F} names a price for passage', '{F} informs us that our ships will pay a toll on every passage from now on, as everyone else does. The alternative is not spelled out.', 'Pay the toll', 'Our ships will pass free', 'Revenue −2% for ten years; relations +10.', 'Relations −15.'],
  };
  K.concession = ['{F} wants our oil', '{F} asks for a concession on our oil fields: its company will drill, refine and ship, and pay us royalties and a large sum on signature.', 'Sign the concession', 'The oil stays ours', 'Gold now; the company takes most of the oil income for as long as the concession lasts.', 'Relations −5.'];
  K.base = ['{F} asks for a base', '{F} proposes a treaty of friendship: an air base and a naval station on our soil, aid every year, and its protection if anyone attacks us.', 'Grant the base', 'No foreign soldiers on our soil', 'We become {F}\u2019s client: protection and aid, a foreign garrison, and our neighbours\u2019 suspicion.', 'Relations −5.'];
  K.arms = ['{F} offers arms', '{F} offers rifles, artillery and instructors, on credit, with no conditions written down.', 'Accept the arms', 'Refuse', 'Troops and equipment; relations +15. The unwritten conditions will come later.', 'Relations −5.'];
  ID.NOTE_KINDS = K;
  ID.EVENT_DEFS.push({ id: 'fp_note', sys: 1, tone: 'mixed', sfx: 'stamp', kicker: 'A diplomatic note',
    title: (n, G, c) => K[c.kind][0].replace('{F}', G.nations[c.from].base),
    text: (n, G, c) => K[c.kind][1].replace(/\{F\}/g, G.nations[c.from].name),
    opts: (G, n, c) => [
      { label: K[c.kind][2], tip: K[c.kind][4].replace(/\{F\}/g, G.nations[c.from].base), fx: [['fn', (G2, m, cc) => ID.Diplomacy.noteAnswer(G2, G2.nations[cc.from], m, cc.kind, true)]] },
      { label: K[c.kind][3], tip: K[c.kind][5].replace(/\{F\}/g, G.nations[c.from].base), fx: [['fn', (G2, m, cc) => ID.Diplomacy.noteAnswer(G2, G2.nations[cc.from], m, cc.kind, false)]] },
    ] });
})();
