/* Loads the simulation into Node in the order index.html loads it (core, data and sim scripts only),
   so the tools can never drift from the game's own file list. Returns the global ID. */
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
globalThis.ID = {};
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const m of html.matchAll(/src="(js\/(?:core|data|sim)\/[\w-]+\.js)"/g)) require(path.join(root, m[1]));
module.exports = globalThis.ID;
