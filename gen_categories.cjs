const fs = require('fs');

const serviceGroups = [
  {
    name: 'Workspace',
    blocks: ['Workspace', 'Raycast', 'FindPartOnRay', 'GetPartsInPart', 'GetPartBoundsInBox', 'GetPartBoundsInRadius', 'BulkMoveTo', 'GetChildren', 'GetDescendants', 'FindFirstChild', 'FindFirstChildWhichIsA', 'WaitForChild', 'Clone', 'Destroy', 'ClearAllChildren', 'GetAttribute', 'SetAttribute', 'GetAttributes', 'ChildAdded', 'ChildRemoved', 'DescendantAdded', 'DescendantRemoving', 'Changed', 'Gravity', 'CurrentCamera', 'FallenPartsDestroyHeight', 'StreamingEnabled', 'GlobalWind', 'Terrain']
  },
  {
    name: 'Players',
    blocks: ['Players', 'GetPlayers', 'GetPlayerFromCharacter', 'CreateHumanoidModelFromUserId', 'GetNameFromUserIdAsync', 'GetUserIdFromNameAsync', 'GetCharacterAppearanceAsync', 'Chat', 'PlayerAdded', 'PlayerRemoving', 'CharacterAutoLoads', 'RespawnTime', 'MaxPlayers', 'GetChildren', 'FindFirstChild', 'WaitForChild']
  },
  {
    name: 'Lighting',
    blocks: ['Lighting', 'GetMinutesAfterMidnight', 'SetMinutesAfterMidnight', 'GetMoonDirection', 'Ambient', 'Brightness', 'ClockTime', 'FogEnd', 'FogStart', 'Technology', 'Changed', 'GetChildren', 'FindFirstChild']
  },
  {
    name: 'MaterialService',
    blocks: ['MaterialService', 'GetBaseMaterialOverride', 'SetBaseMaterialOverride', 'Use2022Materials', 'Changed', 'GetChildren', 'FindFirstChild']
  },
  {
    name: 'NetworkClient',
    blocks: ['NetworkClient', 'ClientReplicator', 'ConnectionAccepted', 'ConnectionFailed', 'Changed', 'GetChildren']
  },
  {
    name: 'ReplicatedFirst',
    blocks: ['ReplicatedFirst', 'RemoveDefaultLoadingScreen', 'IsFinishedReplicating', 'FinishedReplicating', 'GetChildren', 'FindFirstChild', 'WaitForChild']
  },
  {
    name: 'ReplicatedStorage',
    blocks: ['ReplicatedStorage', 'GetChildren', 'GetDescendants', 'FindFirstChild', 'WaitForChild', 'Clone', 'Destroy', 'ChildAdded', 'ChildRemoved']
  },
  {
    name: 'ServerScriptService',
    blocks: ['ServerScriptService', 'LoadStringEnabled', 'GetChildren', 'FindFirstChild', 'WaitForChild', 'ChildAdded', 'ChildRemoved']
  },
  {
    name: 'ServerStorage',
    blocks: ['ServerStorage', 'GetChildren', 'GetDescendants', 'FindFirstChild', 'WaitForChild', 'ChildAdded', 'ChildRemoved']
  },
  {
    name: 'StarterPack',
    blocks: ['StarterPack', 'GetChildren', 'FindFirstChild', 'WaitForChild', 'ChildAdded', 'ChildRemoved']
  },
  {
    name: 'Teams',
    blocks: ['Teams', 'GetTeams', 'RebalanceTeams', 'ChildAdded', 'ChildRemoved', 'GetChildren', 'FindFirstChild']
  },
  {
    name: 'SoundService',
    blocks: ['SoundService', 'PlayLocalSound', 'RespectFilteringEnabled', 'AmbientReverb', 'DistanceFactor', 'DopplerScale', 'Changed', 'GetChildren']
  },
  {
    name: 'TextChatService',
    blocks: ['TextChatService', 'SendAsync', 'OnIncomingMessage', 'ChatVersion', 'CreateDefaultTextChannels', 'TextChannels', 'Changed', 'GetChildren']
  },
  {
    name: 'StarterPlayer',
    blocks: ['StarterPlayer', 'LoadCharacterAppearance', 'CameraMode', 'CharacterWalkSpeed', 'CharacterJumpPower', 'GetChildren', 'FindFirstChild']
  },
  {
    name: 'StarterGui',
    blocks: ['StarterGui', 'SetCore', 'SetCoreGuiEnabled', 'GetCoreGuiEnabled', 'ProcessUserInput', 'ResetPlayerGuiOnSpawn', 'GetChildren', 'FindFirstChild']
  },
  {
    name: 'RunService',
    blocks: ['RunService', 'BindToRenderStep', 'UnbindFromRenderStep', 'IsClient', 'IsServer', 'IsStudio', 'Heartbeat', 'RenderStepped', 'Stepped', 'GetChildren']
  },
  {
    name: 'TweenService',
    blocks: ['TweenService', 'Create', 'GetValue', 'GetChildren', 'Changed']
  },
  {
    name: 'UserInputService',
    blocks: ['UserInputService', 'GetMouseLocation', 'IsKeyDown', 'GetKeysPressed', 'GetGamepadState', 'InputBegan', 'InputEnded', 'InputChanged', 'TouchEnabled', 'KeyboardEnabled', 'MouseEnabled']
  },
  {
    name: 'ContextActionService',
    blocks: ['ContextActionService', 'BindAction', 'BindActionAtPriority', 'UnbindAction', 'SetTitle', 'SetPosition', 'GetButton', 'BoundActionAdded', 'BoundActionRemoved']
  },
  {
    name: 'CollectionService',
    blocks: ['CollectionService', 'GetTagged', 'GetTags', 'HasTag', 'AddTag', 'RemoveTag', 'TagAdded', 'TagRemoved']
  },
  {
    name: 'Debris',
    blocks: ['Debris', 'AddItem', 'MaxItems']
  },
  {
    name: 'DataStoreService',
    blocks: ['DataStoreService', 'GetDataStore', 'GetOrderedDataStore', 'ListDataStoresAsync', 'AutomaticRetry']
  },
  {
    name: 'MemoryStoreService',
    blocks: ['MemoryStoreService', 'GetQueue', 'GetSortedMap', 'GetChildren']
  },
  {
    name: 'MessagingService',
    blocks: ['MessagingService', 'PublishAsync', 'SubscribeAsync']
  },
  {
    name: 'HttpService',
    blocks: ['HttpService', 'GetAsync', 'PostAsync', 'RequestAsync', 'JSONEncode', 'JSONDecode', 'GenerateGUID', 'UrlEncode', 'HttpEnabled']
  },
  {
    name: 'MarketplaceService',
    blocks: ['MarketplaceService', 'PromptPurchase', 'PromptGamePassPurchase', 'PromptProductPurchase', 'UserOwnsGamePassAsync', 'PlayerOwnsAsset', 'GetProductInfo', 'PromptBundlePurchase']
  },
  {
    name: 'TeleportService',
    blocks: ['TeleportService', 'Teleport', 'TeleportAsync', 'TeleportPartyAsync', 'TeleportToPlaceInstance', 'GetPlayerPlaceInstanceAsync', 'SetTeleportGui']
  },
  {
    name: 'BadgeService',
    blocks: ['BadgeService', 'AwardBadge', 'UserHasBadgeAsync', 'GetBadgeInfoAsync']
  },
  {
    name: 'PathfindingService',
    blocks: ['PathfindingService', 'CreatePath', 'FindPathAsync', 'EmptyCutoff']
  },
  {
    name: 'ProximityPromptService',
    blocks: ['ProximityPromptService', 'PromptShown', 'PromptHidden', 'PromptTriggered', 'MaxPromptsVisible']
  },
  {
    name: 'TextService',
    blocks: ['TextService', 'FilterStringAsync', 'FilterAndTranslateStringAsync', 'GetTextSize']
  },
  {
    name: 'AvatarEditorService',
    blocks: ['AvatarEditorService', 'PromptSaveAvatar', 'PromptAllowInventoryReadAccess', 'GetInventory', 'SearchCatalog', 'GetFavorite']
  },
  {
    name: 'ContentProvider',
    blocks: ['ContentProvider', 'PreloadAsync', 'GetAssetFetchStatus', 'AssetFetchFailed', 'RequestQueueSize']
  },
  {
    name: 'InsertService',
    blocks: ['InsertService', 'LoadAsset', 'LoadAssetVersion', 'GetLatestAssetVersionAsync']
  },
  {
    name: 'GuiService',
    blocks: ['GuiService', 'OpenBrowserWindow', 'CloseBrowserWindow', 'AddSelectionParent', 'SelectedObject', 'MenuOpened', 'MenuClosed']
  },
  {
    name: 'PhysicsService',
    blocks: ['PhysicsService', 'CreateCollisionGroup', 'RemoveCollisionGroup', 'SetPartCollisionGroup', 'CollisionGroupSetCollidable', 'GetCollisionGroups']
  }
];

const extraCategories = {
  "Comment": ["comment"],
  "Debug": ["print", "warn", "run_lua"],
  "Sound": ["sound_play", "sound_stop", "sound_pause", "sound_soundid", "sound_volume", "sound_looped", "sound_playing", "sound_playbackspeed", "sound_timeposition", "sound_ended"]
};

const result = {};

// Add extra categories
for (const [name, blocks] of Object.entries(extraCategories)) {
  result[name] = blocks;
}

// Add service groups
for (const group of serviceGroups) {
  result[group.name] = group.blocks.map(b => `rbx_${group.name.toLowerCase()}_${b.toLowerCase()}`);
}

console.log(JSON.stringify(result, null, 2));
