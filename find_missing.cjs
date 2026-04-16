const fs = require('fs');

const appBlocks = fs.readFileSync('blocks_app_raw.txt', 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
const srcBlocks = fs.readFileSync('blocks_src_raw.txt', 'utf8').split('\n').map(l => l.trim()).filter(Boolean);

const missing = appBlocks.filter(b => !srcBlocks.includes(b));
console.log(missing.join('\n'));
