const fs = require('fs');
const path = require('path');

// 1. Parse toolbox.ts to get block -> category mapping
const toolboxPath = path.join(__dirname, 'src', 'toolbox.ts');
const toolboxContent = fs.readFileSync(toolboxPath, 'utf8');

const blockToCategory = {};
let currentCategory = null;

const lines = toolboxContent.split('\n');
for (const line of lines) {
  const catMatch = line.match(/name:\s*'([^']+)'/);
  if (catMatch) {
    currentCategory = catMatch[1];
  }
  
  const blockMatch = line.match(/type:\s*'([^']+)'/);
  if (blockMatch && currentCategory) {
    blockToCategory[blockMatch[1]] = currentCategory;
  }
}

// 2. Update blocks.ts
const blocksPath = path.join(__dirname, 'src', 'blocks.ts');
let blocksContent = fs.readFileSync(blocksPath, 'utf8');

// Add import if not exists
if (!blocksContent.includes('getCategoryColor')) {
  blocksContent = "import { getCategoryColor } from './colors';\n" + blocksContent;
}

let currentBlockType = null;
const blockLines = blocksContent.split('\n');
for (let i = 0; i < blockLines.length; i++) {
  const line = blockLines[i];
  
  const typeMatch = line.match(/Blockly\.Blocks\['([^']+)'\]/);
  if (typeMatch) {
    currentBlockType = typeMatch[1];
  }
  
  if (line.includes('this.setColour(') && currentBlockType) {
    const category = blockToCategory[currentBlockType];
    if (category) {
      blockLines[i] = line.replace(/this\.setColour\([^)]+\)/, `this.setColour(getCategoryColor('${category}'))`);
    } else {
      // For blocks not explicitly in toolbox (like logic_compare_eq which is generated dynamically)
      // We can try to guess or leave it. Wait, logic_compare_eq IS in toolbox!
      // What about blocks defined in a loop?
      // e.g. defineCompare('eq', '==') -> logic_compare_eq
      // Let's just do a generic replacement for those if possible.
    }
  }
}

blocksContent = blockLines.join('\n');

// Handle dynamic blocks
blocksContent = blocksContent.replace(/this\.setColour\([^)]+\);/g, (match, offset, string) => {
  if (match.includes('getCategoryColor')) return match;
  
  // Find the closest Blockly.Blocks['...'] before this
  const before = string.substring(0, offset);
  const typeMatch = [...before.matchAll(/Blockly\.Blocks\[\`([^`]+)\`\]/g)].pop();
  if (typeMatch) {
    const typeStr = typeMatch[1];
    if (typeStr.startsWith('logic_')) return `this.setColour(getCategoryColor('Logic'));`;
    if (typeStr.startsWith('math_')) return `this.setColour(getCategoryColor('Math'));`;
    if (typeStr.startsWith('text_')) return `this.setColour(getCategoryColor('Text'));`;
  }
  
  return match;
});

// Also fix any remaining hardcoded colors just in case
blocksContent = blocksContent.replace(/this\.setColour\(['"]#[0-9A-Fa-f]+['"]\);/g, "this.setColour(getCategoryColor('Logic')); // fallback");

fs.writeFileSync(blocksPath, blocksContent);
console.log('Done modifying blocks.ts');
