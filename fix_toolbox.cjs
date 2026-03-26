const fs = require('fs');
const path = require('path');

const toolboxPath = path.join(__dirname, 'src', 'toolbox.ts');
let content = fs.readFileSync(toolboxPath, 'utf8');

// Remove all lines containing "colour: RAINBOW_COLORS"
content = content.replace(/.*colour:\s*RAINBOW_COLORS\[\d+\],?\n/g, '');

fs.writeFileSync(toolboxPath, content);
console.log('Done modifying toolbox.ts');
