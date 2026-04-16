import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const robloxTheme = {
  ...vscDarkPlus,
  'keyword': { color: '#f86d7c' }, // Pink/Red
  'function': { color: '#f86d7c' }, // Pink/Red
  'string': { color: '#32cd32' }, // Green
  'number': { color: '#ff8c00' }, // Orange/Red
  'comment': { color: '#666666' }, // Grey
  'operator': { color: '#ffffff' },
  'punctuation': { color: '#ffffff' },
  'builtin': { color: '#84d6f7' }, // Light Blue
  'class-name': { color: '#84d6f7' }, // Light Blue
  'boolean': { color: '#ffc600' }, // Yellow
  'constant': { color: '#ffc600' }, // Yellow (for nil)
};
