export const CATEGORY_COLORS: Record<string, string> = {
  'Comment': '#78909C', // Muted Blue Gray
  'Debug': '#FFB74D', // Muted Orange
  'Logic': '#42A5F5', // Muted Blue
  'Math': '#66BB6A', // Muted Green
  'Text': '#FFCA28', // Muted Amber
  'Sound': '#9CCC65', // Muted Light Green
  'Values': '#4FC3F7', // Muted Light Blue
  'Variables': '#FF7043', // Muted Deep Orange
  'Lists': '#EF5350', // Muted Red
  'Loops': '#43A047', // Muted Dark Green
  'World': '#29B6F6', // Muted Sky Blue
  'Instance': '#7E57C2', // Muted Purple
  'Part': '#546E7A', // Muted Slate
  'Character': '#EC407A', // Muted Pink
  'Model': '#9575CD', // Muted Lavender
  'Gui': '#AB47BC', // Muted Magenta
  'Player': '#26A69A', // Muted Teal
  'Clickdetector': '#A1887F', // Muted Brown
  'Marketplace': '#3F51B5', // Muted Indigo
  'Tweening': '#26A69A', // Muted Teal (Shared with Player for consistency)
  'Client': '#FB8C00', // Muted Vivid Orange
  'Server': '#00ACC1', // Muted Cyan
  'Leaderstats': '#FBC02D', // Muted Gold
  'Functions': '#E53935', // Muted Deep Red
  'Datastore': '#1565C0', // Muted Navy Blue
  'Roblox Services': '#5E35B1', // Muted Dark Purple
  'Events': '#F4511E', // Muted Burnt Orange
  'Input': '#0097A7', // Muted Dark Cyan
  'Camera': '#7CB342', // Muted Electric Lime
  'Animation': '#D81B60', // Muted Pink
  'Physics': '#1E88E5', // Muted Dodger Blue
  'Raycast': '#8D6E63', // Muted Brown
  'Pathfinding': '#388E3C', // Muted Forest Green
  'Teleport': '#512DA8', // Muted Dark Violet
  'Collection': '#FDD835', // Muted Bright Yellow
  'RunService': '#2E7D32', // Muted Dark Green
  'Lighting': '#FBC02D', // Muted Bright Gold
  'Effects': '#AD1457', // Muted Deep Pink
  'RemoteEvent': '#FFB300' // Muted Amber
};

export const getCategoryColor = (categoryName: string): string => {
  return CATEGORY_COLORS[categoryName] || '#4c97ff';
};
