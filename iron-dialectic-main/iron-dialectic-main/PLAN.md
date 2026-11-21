# Plan: ideological specialization

Goal: make play itself, not just the numbers, depend on the country's system. Today every state uses the same
verbs (budget sliders, laws, programmes, the war bar); ideology mostly changes modifiers plus one gauge and four
actions. Each idea below gives a system its own decisions.

## Principles

- **A decision every few minutes, never bookkeeping.** No new numbers to watch unless they ask for a choice.
- **Something you cannot do.** Every system needs a forbidden verb as well as new powers; constraints make identity.
- **Its own way to lose.** Each system should fail in a way that teaches you something about it.
- **Stories, not percentages.** Aim for “I faked the plan figures and got caught”, not “+5% efficiency”.

## Ideas by family

### Socialist
- **Marxism-Leninism: plan quotas, with a lie button.** Each Five-Year Plan sets targets for steel, grain and arms.
  Overshoot and heroes of labour raise fervour. Miss one and choose: blame the managers (purge), blame saboteurs
  (show trial), or **report false figures**: free now, hidden distortion later, and a heavy price when exposed.
- **Maoism: mass campaigns.** Launch the Hundred Flowers, the Great Leap or the Cultural Revolution as gambles.
  The Red Guards become a second gauge that grows on its own: a weapon against party rivals that must be reined in.
- **Trotskyism and Techno-Socialism: a chain-reaction meter.** Each revolution abroad within two years of the last
  raises a multiplier (cheaper subversion, more velocity, a stronger broadcast). Break the chain and it resets.
- **Council Communism: agenda cards.** Each congress tables a few motions; you hold a few influence tokens to lobby
  delegates. You shape the vote, you never force it.
- **Juche: on-the-spot guidance.** The Leader tours one province at a time for a large local boost. Embargoes raise
  self-reliance. The heir must be groomed over years.

### Anarchist
- **Anarcho-Syndicalism: the strike fund.** Save it up, then call a general strike against an enemy or your own
  capitalists. How long it holds depends on the fund.
- **Anarcho-Communism: guerrilla mode.** Occupied communes give ambush and sabotage orders. Losing land becomes a
  different way to play, not just losing.

### Liberal
- **Classical Liberalism and Social Democracy: election promises.** Pick three or four promises before each
  election. Each wins votes now and becomes a dated obligation; breaking one costs mandate.
- **Social Democracy: the annual bargain.** Workers and capital each table demands; you assemble a package of wages,
  taxes and welfare. Short-change either side and they strike.
- **Minarchism: no spending, only selling.** No public building at all: sell charters, concessions and defence
  contracts, and private firms build for their own purposes.

### Conservative
- **Absolute Monarchy: dynastic marriages and claims.** Marriages make alliances; a dead foreign king can leave an
  inheritance claim. The heir’s education (soldier, scholar, priest) shapes the next reign.
- **Theocracy: irreversible edicts.** Strong bonuses that close options for good. Holy sites on the map matter;
  heresy outbreaks must be stamped out or tolerated.
- **Agrarian Traditionalism: the seasons.** Spring and autumn councils choose planting and the harvest share; famine
  and festival follow from your calls.

### Authoritarian
- **Military Junta: the handover clock.** You promised to return power by a date. Victories and crushed risings
  buy years; postponing costs legitimacy and splits army, navy and air force.
- **Personalist Dictatorship: loyalty tests.** Put a member of the circle to the test: loyalty, or the choice between
  mercy and a purge. The cult needs statues and titles or it decays.
- **Corporatist State: sector chambers.** Steel, farming and shipping each bargain separately, replacing the single
  pact slider.

### Heterodox
- **Merchant Republic: visible trade routes.** Convoys on the map that can be raided, monopoly contracts to bid for,
  and wars bought by subsidising others.
- **NRX Accelerationism: the quarterly earnings call.** Announce a growth figure every quarter. Beat it and
  acceleration jumps; miss it and the shareholders sell; guide too low and they sell anyway.
- **Third Positionism: an aid auction.** Both blocs bid for you in rounds; push too hard and one leaves for good.
- **Cybernetic Planning: computing capacity as a resource.** Assign the network’s capacity among sectors each year.

## Across systems
- **Peace by ideology.** Socialists install governments or take a white peace; monarchs take tribute and land;
  liberals take reparations and bases; the fire annexes everything.
- **International bodies.** A socialist International that votes on its leadership; royal weddings and funerals as
  diplomacy; League votes for the democracies.
- **A map mode and a musical theme per system.** Plan fulfilment by province, faith, the network’s reach.

## Build order
1. **Election promises** — one mechanic improves all four democratic systems.
2. **Plan quotas with false figures** — the clearest bluffing loop; Marxism-Leninism is common in the campaign.
3. **The junta’s handover clock** — small to build, tension at once.
4. **Dynastic marriages** — monarchies are the commonest starting system on The Three Continents.
5. **The revolutionary chain meter** — a combo for the spreading ideologies.

Each fits the existing hooks: a national-question-style gauge with a monthly `tick` and its own actions, or a
doctrine `month` and `extra` (see `js/data/accel.js`), plus a section on the State panel.
