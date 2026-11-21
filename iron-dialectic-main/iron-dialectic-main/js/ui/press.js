/* IRON DIALECTIC — The World Dispatch: the newspaper front page and its back issues.
   Editions are composed in sim/press.js; this file lays them out. */
(function () {
  'use strict';
  const ID = (globalThis.ID = globalThis.ID || {});
  const UI = ID.UI, esc = ID.esc, acts = UI.acts;
  const hex = (c) => '#' + c.map((v) => ('0' + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2)).join('');
  const KICK = { war: 'War', rev: 'Upheaval', dip: 'Diplomacy', eco: 'The economy', pol: 'Abroad', nuke: 'The bomb' };
  const ARTK = { war: 'war', rev: 'revolution', dip: 'peace', eco: 'crisis', pol: 'parliament', nuke: 'atom' };
  const flag = (G, id, cls) => { const n = G.nations[id]; return n ? ID.Flags.html(n, cls || 'sflag') : ''; };

  function paperHtml(G, ed, back) {
    const L = ed.lead, d = ID.dateOf(ed.t), nA = L.a ? G.nations[L.a] : null;
    const art = ID.Scene.svg(L.art || ARTK[L.kind] || 'parliament', 'paper' + ed.no, { n: nA ? hex(nA.color) : '#8a2a20', flag: nA ? hex(nA.color) : '#8a2a20', war: L.kind === 'war' ? 1 : 0 });
    const box = ed.box || { top: [], wars: [], nwars: 0, tension: 0 };
    let h = '<div class="paper"><div class="pp-sheet">' +
      '<div class="pp-mast"><span class="pp-ear">No. ' + (1200 + ed.no * 7) + '<br>Price one penny</span><h1>' + esc(ID.Press.NAME) + '</h1><span class="pp-ear r">' + esc(d.str) + '<br>Late edition</span></div>' +
      '<div class="pp-rule"></div>' +
      '<div class="pp-main"><div class="pp-lead">' +
      '<div class="pp-kick">' + esc(KICK[L.kind] || 'Abroad') + (nA ? ' · ' + esc(nA.base) : '') + '</div>' +
      '<h2>' + esc(L.title) + '</h2>' +
      '<div class="pp-art">' + art + (nA ? '<div class="pp-flags">' + flag(G, L.a, 'hflag') + (L.b ? flag(G, L.b, 'hflag') : '') + '</div>' : '') + '</div>' +
      '<div class="pp-cols"><p class="pp-drop">' + esc(L.text) + '</p></div></div>' +
      '<div class="pp-side"><h3>Elsewhere</h3>';
    if (ed.briefs && ed.briefs.length) for (const b of ed.briefs) h += '<div class="pp-brief"><b>' + (b.a ? flag(G, b.a, 'mini') : '') + esc(b.title) + '</b><p>' + esc(b.text.length > 230 ? b.text.slice(0, b.text.lastIndexOf(' ', 225)) + '…' : b.text) + '</p></div>';
    else h += '<p class="pp-quiet">A quiet season. The correspondents have filed nothing our readers need lose sleep over.</p>';
    h += '<h3>The balance of power</h3><ol class="pp-top">' + box.top.map((t) => '<li>' + flag(G, t[0], 'mini') + '<b>' + esc(G.nations[t[0]] ? G.nations[t[0]].base : t[1]) + '</b> <span>' + esc(t[2]) + '</span></li>').join('') + '</ol>' +
      '<div class="pp-wars">' + (box.nwars ? '<b>' + box.nwars + ' war' + (box.nwars > 1 ? 's' : '') + ' in progress</b>' + box.wars.map((w) => '<span>' + esc((G.nations[w[0]] || {}).base || '?') + ' – ' + esc((G.nations[w[1]] || {}).base || '?') + ', ' + (w[2] >= 12 ? Math.floor(w[2] / 12) + ' yr' : w[2] + ' mo') + '</span>').join('') : '<b>The world is at peace</b><span>No two states are at war this month.</span>') + '</div>' +
      '</div></div>' +
      '<div class="pp-foot">' + (back ? UI.btn('Back issues', 'papers', null, { cls: 'ghost' }) : (G.press && G.press.arch.length > 1 ? UI.btn('Back issues', 'papers', null, { cls: 'ghost' }) : '')) + '<span class="sp"></span>' + UI.btn('Put the paper down', 'paperOk', null, { cls: 'red big' }) + '</div>' +
      '</div></div>';
    return h;
  }

  UI.showPaper = function (ed, back) {
    const G = UI.G; if (!ed) return;
    UI.modal(paperHtml(G, ed, back), 'paper'); UI.retip();
    ID.Audio.play('stamp');
  };
  /* Called every frame: a fresh edition comes to the front page when nothing else is on screen. */
  UI.tickPaper = function () {
    const G = UI.G, S = G.press; if (!S || !S.fresh || UI.modalKind || G.over || G.evq.length || (G.superq && G.superq.length)) return;
    const ed = S.arch.find((e) => e.no === S.fresh); if (!ed) { S.fresh = 0; return; }
    const mode = UI.settings.papers || 'pop';
    if (mode === 'off' || (mode === 'big' && ed.lead.w < 4)) { if (S.told !== ed.no) { S.told = ed.no; UI.toast('The World Dispatch: ' + ed.lead.title + '. Read it under World.', true); } return; }
    S.fresh = 0; S.read = ed.no;
    UI.showPaper(ed);
  };
  acts.paperOk = () => { const G = UI.G; if (G && G.press) { G.press.fresh = 0; } UI.closeModal(); };
  acts.paper = (no) => { const G = UI.G, ed = G.press && G.press.arch.find((e) => e.no === no); if (ed) { G.press.fresh = 0; UI.showPaper(ed, true); } };
  acts.papers = () => {
    const G = UI.G, A = (G.press && G.press.arch) || [];
    let h = '<div class="dlg"><div class="dhd"><div class="k">BACK ISSUES</div><div class="d">' + esc(ID.Press.NAME) + '</div></div><div class="dbd"><h2>What the world has been reading</h2>';
    if (!A.length) h += '<p class="tx">No issue has been printed yet. The paper goes to press when something happens abroad that is worth a front page.</p>';
    else h += '<div class="pp-list">' + A.slice().reverse().map((e) => '<button class="choice" data-act="paper" data-a="' + e.no + '"><b>' + (e.lead.a ? flag(G, e.lead.a, 'mini') : '') + esc(e.lead.title) + '</b><span class="hint">' + ID.dateOf(e.t).str + (e.briefs.length ? ' · and ' + e.briefs.length + ' other stor' + (e.briefs.length > 1 ? 'ies' : 'y') : '') + '</span></button>').join('') + '</div>';
    h += '<div class="row" style="margin-top:12px"><span class="sp"></span>' + UI.btn('Close', 'closeModal', null, { cls: 'ghost' }) + '</div></div></div>';
    UI.modal(h, 'dlg'); UI.retip();
  };
  /* For the World panel. */
  UI.paperCard = function (G) {
    const S = G.press, A = (S && S.arch) || [];
    if (!A.length) return '<p class="dim">No issue yet. The World Dispatch reports what happens in other countries: revolutions, wars, the choices other governments make.</p>';
    const last = A[A.length - 1];
    return '<div class="card"><div class="row nw"><b style="flex:1">' + esc(last.lead.title) + '</b><span class="dim num">' + ID.dateOf(last.t).short + '</span></div><div class="row" style="margin-top:6px">' + UI.btn('Read the latest issue', 'paper', last.no, { cls: 'sm' }) + UI.btn('Back issues (' + A.length + ')', 'papers', null, { cls: 'sm ghost' }) + '</div></div>';
  };
})();
