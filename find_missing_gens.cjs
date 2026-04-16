const fs = require('fs');

const appGens = fs.readFileSync('gens_app_raw.txt', 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
const srcGens = fs.readFileSync('gens_src_raw.txt', 'utf8').split('\n').map(l => l.trim()).filter(Boolean);

const missing = appGens.filter(b => !srcGens.includes(b));
console.log(missing.join('\n'));
