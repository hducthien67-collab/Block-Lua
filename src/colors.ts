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
  'GUI': '#AB47BC', // Muted Magenta
  'Players': '#26A69A', // Muted Teal
  'ClickDetector': '#A1887F', // Muted Brown
  'Marketplace': '#3F51B5', // Muted Indigo
  'Tweening': '#00897B', // Unique Teal
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
  'Lighting': '#FFD600', // Unique Bright Gold
  'Effects': '#AD1457', // Muted Deep Pink
  'Workspace': '#00796B', // Unique Dark Teal
  'MaterialService': '#2E7D32', // Unique Forest Green
  'NetworkClient': '#0288D1', // Unique Blue
  'ReplicatedFirst': '#C2185B',
  'ReplicatedStorage': '#7B1FA2', // Unique Purple
  'ServerScriptService': '#303F9F', // Unique Indigo
  'ServerStorage': '#0097A7', // Unique Cyan
  'StarterPack': '#558B2F', // Unique Light Green
  'Teams': '#AFB42B', // Unique Lime
  'SoundService': '#EF6C00', // Unique Orange
  'TextChatService': '#E65100', // Unique Deep Orange
  'StarterPlayer': '#0277BD', // Unique Light Blue
  'StarterGui': '#FFA000', // Unique Amber
  'TweenService': '#D84315', // Unique Deep Orange/Red
  'UserInputService': '#0D47A1', // Unique Dark Blue
  'ContextActionService': '#311B92', // Unique Deep Violet
  'CollectionService': '#B71C1C', // Unique Dark Red
  'Debris': '#004D40',
  'DataStoreService': '#1B5E20', // Unique Dark Green
  'MemoryStoreService': '#880E4F',
  'MessagingService': '#01579B', // Unique Blue
  'HttpService': '#4E342E', // Unique Brown
  'MarketplaceService': '#2E7D32', // Unique Green
  'TeleportService': '#4527A0', // Unique Purple
  'BadgeService': '#FFEA00', // Unique Yellow
  'PathfindingService': '#004D40', // Unique Teal
  'ProximityPromptService': '#BF360C', // Unique Rust
  'TextService': '#D84315', // Unique Orange
  'AvatarEditorService': '#FF8F00', // Unique Amber
  'ContentProvider': '#1A237E', // Unique Navy
  'InsertService': '#006064',
  'GuiService': '#283593', // Unique Indigo
  'PhysicsService': '#37474F', // Unique Blue Gray
  'AdService': '#FF3D00', // Unique Red Orange
  'AnalyticsService': '#455A64', // Unique Gray
  'AnimationClipProvider': '#8E24AA', // Unique Purple
  'AssetService': '#283593', // Unique Indigo
  'BrowserService': '#1976D2', // Unique Blue
  'ChangeHistoryService': '#0097A7', // Unique Cyan
  'ControllerService': '#00796B', // Unique Teal
  'CoreGui': '#388E3C', // Unique Green
  'CorePackages': '#689F38', // Unique Light Green
  'CSGDictionaryService': '#9E9D24', // Unique Lime
  'DebuggerManager': '#FBC02D', // Unique Gold
  'DeviceService': '#FFA000', // Unique Amber
  'FriendService': '#F57C00', // Unique Orange
  'GamepadService': '#E64A19', // Unique Deep Orange
  'Geometry': '#5D4037', // Unique Brown
  'GroupService': '#616161', // Unique Gray
  'HapticService': '#546E7A', // Unique Blue Gray
  'JointsService': '#D32F2F', // Unique Red
  'KeyframeSequenceProvider': '#C2185B', // Unique Pink
  'LanguageService': '#7B1FA2', // Unique Purple
  'LocalizationService': '#512DA8', // Unique Deep Purple
  'LogService': '#303F9F', // Unique Indigo
  'LuaSettings': '#1976D2', // Unique Blue
  'NetworkServer': '#0288D1', // Unique Light Blue
  'NotificationService': '#0097A7', // Unique Cyan
  'PluginDebugService': '#00796B', // Unique Teal
  'PluginGuiService': '#388E3C', // Unique Green
  'PointsService': '#689F38', // Unique Light Green
  'PolicyService': '#9E9D24', // Unique Lime
  'ScriptContext': '#FBC02D', // Unique Gold
  'Selection': '#FFA000', // Unique Amber
  'Stats': '#F57C00', // Unique Orange
  'StudioData': '#E64A19', // Unique Deep Orange
  'TestService': '#5D4037', // Unique Brown
  'UserGameSettings': '#616161', // Unique Gray
  'VRService': '#546E7A', // Unique Blue Gray
  'Chat': '#00838F', // Unique Cyan
};

export const getCategoryColor = (categoryName: string): string => {
  return CATEGORY_COLORS[categoryName] || '#4c97ff';
};
