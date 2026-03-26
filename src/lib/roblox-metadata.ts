
export interface RobloxClass {
  name: string;
  category: string;
  description?: string;
  icon?: string;
  color?: string;
}

export const ROBLOX_CLASSES: RobloxClass[] = [
  // 1. Basic / Thường sử dụng
  { name: 'Part', category: 'Basic', icon: 'Box', color: '#00A2FF' },
  { name: 'Script', category: 'Basic', icon: 'FileCode', color: '#00A2FF' },
  { name: 'Folder', category: 'Basic', icon: 'Folder', color: '#FFD700' },
  { name: 'Tool', category: 'Basic', icon: 'Wrench', color: '#AAAAAA' },
  { name: 'SpawnLocation', category: 'Basic', icon: 'MapPin', color: '#32CD32' },
  { name: 'MeshPart', category: 'Basic', icon: 'Component', color: '#00A2FF' },
  { name: 'Model', category: 'Basic', icon: 'Package', color: '#FFD700' },

  // 2. Audio (Âm thanh)
  { name: 'Sound', category: 'Audio', icon: 'Volume2', color: '#FF69B4' },
  { name: 'SoundGroup', category: 'Audio', icon: 'Layers', color: '#FF69B4' },
  { name: 'AudioPlayer', category: 'Audio', icon: 'Play', color: '#FF69B4' },
  { name: 'AudioListener', category: 'Audio', icon: 'Ear', color: '#FF69B4' },
  { name: 'AudioEmitter', category: 'Audio', icon: 'Radio', color: '#FF69B4' },
  { name: 'AudioAnalyzer', category: 'Audio', icon: 'Activity', color: '#FF69B4' },
  { name: 'AudioEqualizer', category: 'Audio', icon: 'Filter', color: '#FF69B4' },
  { name: 'AudioFader', category: 'Audio', icon: 'Volume1', color: '#FF69B4' },
  { name: 'AudioFilter', category: 'Audio', icon: 'Filter', color: '#FF69B4' },
  { name: 'AudioFlanger', category: 'Audio', icon: 'Wind', color: '#FF69B4' },
  { name: 'AudioGate', category: 'Audio', icon: 'Lock', color: '#FF69B4' },
  { name: 'AudioLimiter', category: 'Audio', icon: 'Minus', color: '#FF69B4' },
  { name: 'AudioPitchShifter', category: 'Audio', icon: 'ArrowUpCircle', color: '#FF69B4' },
  { name: 'AudioReverb', category: 'Audio', icon: 'Maximize', color: '#FF69B4' },
  { name: 'AudioTremolo', category: 'Audio', icon: 'Activity', color: '#FF69B4' },
  { name: 'AudioChannelMixer', category: 'Audio', icon: 'Sliders', color: '#FF69B4' },
  { name: 'AudioChannelSplitter', category: 'Audio', icon: 'Split', color: '#FF69B4' },
  { name: 'AudioChorus', category: 'Audio', icon: 'Waves', color: '#FF69B4' },
  { name: 'AudioCompressor', category: 'Audio', icon: 'Minimize', color: '#FF69B4' },
  { name: 'AudioDistortion', category: 'Audio', icon: 'Zap', color: '#FF69B4' },
  { name: 'AudioEcho', category: 'Audio', icon: 'Repeat', color: '#FF69B4' },
  { name: 'AudioDeviceInput', category: 'Audio', icon: 'Mic', color: '#FF69B4' },
  { name: 'AudioDeviceOutput', category: 'Audio', icon: 'Speaker', color: '#FF69B4' },
  { name: 'AudioSpeechToText', category: 'Audio', icon: 'Type', color: '#FF69B4' },
  { name: 'AudioTextToSpeech', category: 'Audio', icon: 'MessageSquare', color: '#FF69B4' },
  { name: 'ChorusSoundEffect', category: 'Audio', icon: 'Waves', color: '#FF69B4' },
  { name: 'CompressorSoundEffect', category: 'Audio', icon: 'Minimize', color: '#FF69B4' },
  { name: 'DistortionSoundEffect', category: 'Audio', icon: 'Zap', color: '#FF69B4' },
  { name: 'EchoSoundEffect', category: 'Audio', icon: 'Repeat', color: '#FF69B4' },
  { name: 'EqualizerSoundEffect', category: 'Audio', icon: 'Filter', color: '#FF69B4' },
  { name: 'FlangeSoundEffect', category: 'Audio', icon: 'Wind', color: '#FF69B4' },
  { name: 'PitchShiftSoundEffect', category: 'Audio', icon: 'ArrowUpCircle', color: '#FF69B4' },
  { name: 'ReverbSoundEffect', category: 'Audio', icon: 'Maximize', color: '#FF69B4' },
  { name: 'TremoloSoundEffect', category: 'Audio', icon: 'Activity', color: '#FF69B4' },

  // 3. Lighting (Ánh sáng)
  { name: 'PointLight', category: 'Lighting', icon: 'Lightbulb', color: '#FFA500' },
  { name: 'SpotLight', category: 'Lighting', icon: 'Sun', color: '#FFA500' },
  { name: 'SurfaceLight', category: 'Lighting', icon: 'Lamp', color: '#FFA500' },

  // 4. Avatar / Character
  { name: 'Accessory', category: 'Avatar', icon: 'Shirt', color: '#FFFFFF' },
  { name: 'AirController', category: 'Avatar', icon: 'Wind', color: '#FFFFFF' },
  { name: 'Animation', category: 'Avatar', icon: 'Activity', color: '#FFFFFF' },
  { name: 'Animator', category: 'Avatar', icon: 'Cpu', color: '#FFFFFF' },
  { name: 'Bone', category: 'Avatar', icon: 'Bone', color: '#FFFFFF' },
  { name: 'IKControl', category: 'Avatar', icon: 'Move', color: '#FFFFFF' },
  { name: 'BodyColors', category: 'Avatar', icon: 'Palette', color: '#FFFFFF' },
  { name: 'BuoyancySensor', category: 'Avatar', icon: 'Droplets', color: '#FFFFFF' },
  { name: 'ClimbController', category: 'Avatar', icon: 'ArrowUpCircle', color: '#FFFFFF' },
  { name: 'ControllerManager', category: 'Avatar', icon: 'Settings', color: '#FFFFFF' },
  { name: 'ControllerPartSensor', category: 'Avatar', icon: 'Sensor', color: '#FFFFFF' },
  { name: 'ForceField', category: 'Avatar', icon: 'Shield', color: '#FF8C00' },
  { name: 'GroundController', category: 'Avatar', icon: 'Move', color: '#8BC34A' },
  { name: 'Humanoid', category: 'Avatar', icon: 'User', color: '#FFFFFF' },
  { name: 'Motor6D', category: 'Avatar', icon: 'Settings', color: '#FFFFFF' },
  { name: 'Pants', category: 'Avatar', icon: 'UserSquare', color: '#FFFFFF' },
  { name: 'Shirt', category: 'Avatar', icon: 'Shirt', color: '#FFFFFF' },
  { name: 'ShirtGraphic', category: 'Avatar', icon: 'Image', color: '#FFFFFF' },
  { name: 'SwimController', category: 'Avatar', icon: 'Droplets', color: '#FFFFFF' },

  // 5. Map
  { name: 'Part', category: 'Building', icon: 'Box', color: '#00A2FF' }, 
  { name: 'TrussPart', category: 'Building', icon: 'Box', color: '#00A2FF' },
  { name: 'WedgePart', category: 'Building', icon: 'Box', color: '#00A2FF' },
  { name: 'CornerWedgePart', category: 'Building', icon: 'Box', color: '#00A2FF' },

  // 7. Sensors
  { name: 'AtmosphereSensor', category: 'Sensors', icon: 'Cloud', color: '#87CEEB' },
  { name: 'FluidForceSensor', category: 'Sensors', icon: 'Droplets', color: '#87CEEB' },

  // 8. Camera / Configuration
  { name: 'Camera', category: 'System', icon: 'Camera', color: '#AAAAAA' },
  { name: 'Configuration', category: 'System', icon: 'Settings', color: '#AAAAAA' },

  // 9. Character Description
  { name: 'BodyPartDescription', category: 'AvatarDescription', icon: 'User', color: '#FFFFFF' },
  { name: 'HumanoidDescription', category: 'AvatarDescription', icon: 'UserCircle', color: '#FFFFFF' },
  { name: 'MakeupDescription', category: 'AvatarDescription', icon: 'User', color: '#FFFFFF' },
  { name: 'AccessoryDescription', category: 'AvatarDescription', icon: 'Shirt', color: '#FFFFFF' },
  { name: 'HumanoidRigDescription', category: 'AvatarDescription', icon: 'User', color: '#FFFFFF' },

  // 10. Input System
  { name: 'InputAction', category: 'Input', icon: 'Zap', color: '#AAAAAA' },
  { name: 'InputBinding', category: 'Input', icon: 'Link', color: '#AAAAAA' },
  { name: 'InputContext', category: 'Input', icon: 'Settings', color: '#AAAAAA' },

  // 11. Values (Data objects)
  { name: 'BoolValue', category: 'Values', icon: 'CheckSquare', color: '#9370DB' },
  { name: 'BrickColorValue', category: 'Values', icon: 'Palette', color: '#9370DB' },
  { name: 'CFrameValue', category: 'Values', icon: 'Move', color: '#9370DB' },
  { name: 'Color3Value', category: 'Values', icon: 'Palette', color: '#9370DB' },
  { name: 'IntValue', category: 'Values', icon: 'Binary', color: '#9370DB' },
  { name: 'NumberValue', category: 'Values', icon: 'Hash', color: '#9370DB' },
  { name: 'ObjectValue', category: 'Values', icon: 'Hash', color: '#9370DB' },
  { name: 'RayValue', category: 'Values', icon: 'Hash', color: '#9370DB' },
  { name: 'StringValue', category: 'Values', icon: 'Hash', color: '#9370DB' },
  { name: 'Vector3Value', category: 'Values', icon: 'Hash', color: '#9370DB' },

  // 12. Interaction / Gameplay
  { name: 'ClickDetector', category: 'Interaction', icon: 'MousePointerClick', color: '#FFD700' },
  { name: 'Dialog', category: 'Interaction', icon: 'MessageCircle', color: '#FFD700' },
  { name: 'DialogChoice', category: 'Interaction', icon: 'MessageSquare', color: '#FFD700' },
  { name: 'DragDetector', category: 'Interaction', icon: 'Move', color: '#FFD700' },
  { name: 'ProximityPrompt', category: 'Interaction', icon: 'Hand', color: '#FFD700' },

  // 13. GUI (2D UI)
  { name: 'ScreenGui', category: 'GUI', icon: 'Monitor', color: '#00FF7F' },
  { name: 'SurfaceGui', category: 'GUI', icon: 'Square', color: '#00FF7F' },
  { name: 'BillboardGui', category: 'GUI', icon: 'StickyNote', color: '#00FF7F' },
  { name: 'Frame', category: 'GUI', icon: 'Square', color: '#00FF7F' },
  { name: 'CanvasGroup', category: 'GUI', icon: 'Layers', color: '#00FF7F' },
  { name: 'ImageButton', category: 'GUI', icon: 'ImagePlus', color: '#00FF7F' },
  { name: 'ImageLabel', category: 'GUI', icon: 'Image', color: '#00FF7F' },
  { name: 'TextBox', category: 'GUI', icon: 'TextInput', color: '#00FF7F' },
  { name: 'TextButton', category: 'GUI', icon: 'MousePointer', color: '#00FF7F' },
  { name: 'TextLabel', category: 'GUI', icon: 'Type', color: '#00FF7F' },
  { name: 'VideoFrame', category: 'GUI', icon: 'Video', color: '#00FF7F' },
  { name: 'ViewportFrame', category: 'GUI', icon: 'View', color: '#00FF7F' },
  { name: 'ScrollingFrame', category: 'GUI', icon: 'MousePointer2', color: '#00FF7F' },
  { name: 'UIAspectRatioConstraint', category: 'GUI', icon: 'BoxSelect', color: '#00FF7F' },
  { name: 'UIListLayout', category: 'GUI', icon: 'List', color: '#00FF7F' },
  { name: 'UIGridLayout', category: 'GUI', icon: 'Grid', color: '#00FF7F' },
  { name: 'UITableLayout', category: 'GUI', icon: 'Table', color: '#00FF7F' },
  { name: 'UIPageLayout', category: 'GUI', icon: 'Columns', color: '#00FF7F' },
  { name: 'UIFlexItem', category: 'GUI', icon: 'StretchHorizontal', color: '#00FF7F' },
  { name: 'UIGradient', category: 'GUI', icon: 'Palette', color: '#00FF7F' },
  { name: 'UIStroke', category: 'GUI', icon: 'Pencil', color: '#00FF7F' },
  { name: 'UICorner', category: 'GUI', icon: 'Circle', color: '#00FF7F' },
  { name: 'UIPadding', category: 'GUI', icon: 'Maximize', color: '#00FF7F' },
  { name: 'UIScale', category: 'GUI', icon: 'Maximize', color: '#00FF7F' },
  { name: 'UITextSizeConstraint', category: 'GUI', icon: 'Type', color: '#00FF7F' },
  { name: 'UISizeConstraint', category: 'GUI', icon: 'Minimize', color: '#00FF7F' },
  { name: 'UIDragDetector', category: 'GUI', icon: 'Move', color: '#00FF7F' },

  // 14. Effects (Hiệu ứng)
  { name: 'Beam', category: 'Effects', icon: 'Zap', color: '#FF8C00' },
  { name: 'Explosion', category: 'Effects', icon: 'Bomb', color: '#FF8C00' },
  { name: 'Fire', category: 'Effects', icon: 'Flame', color: '#FF8C00' },
  { name: 'Highlight', category: 'Effects', icon: 'Sun', color: '#FF8C00' },
  { name: 'ParticleEmitter', category: 'Effects', icon: 'Sparkles', color: '#FF8C00' },
  { name: 'Smoke', category: 'Effects', icon: 'Cloud', color: '#FF8C00' },
  { name: 'Sparkles', category: 'Effects', icon: 'Sparkles', color: '#FF8C00' },
  { name: 'Trail', category: 'Effects', icon: 'Wind', color: '#FF8C00' },
  { name: 'SelectionBox', category: 'Effects', icon: 'BoxSelect', color: '#00A2FF' },
  { name: 'SelectionSphere', category: 'Effects', icon: 'Circle', color: '#00A2FF' },

  // 15. Post Effects (Hiệu ứng hậu kỳ)
  { name: 'BloomEffect', category: 'PostProcessing', icon: 'Sun', color: '#FFD700' },
  { name: 'BlurEffect', category: 'PostProcessing', icon: 'EyeOff', color: '#FFD700' },
  { name: 'ColorCorrectionEffect', category: 'PostProcessing', icon: 'Sliders', color: '#FFD700' },
  { name: 'ColorGradingEffect', category: 'PostProcessing', icon: 'Palette', color: '#FFD700' },
  { name: 'DepthOfFieldEffect', category: 'PostProcessing', icon: 'Focus', color: '#FFD700' },
  { name: 'SunRaysEffect', category: 'PostProcessing', icon: 'SunMedium', color: '#FFA500' },

  // 16. Mesh / Deformation
  { name: 'WrapLayer', category: 'Mesh', icon: 'Layers', color: '#FFFFFF' },
  { name: 'WrapTarget', category: 'Mesh', icon: 'Target', color: '#FFFFFF' },
  { name: 'WrapDeformer', category: 'Mesh', icon: 'Activity', color: '#FFFFFF' },
  { name: 'WrapTextureTransfer', category: 'Mesh', icon: 'Repeat', color: '#FFFFFF' },
  { name: 'BlockMesh', category: 'Mesh', icon: 'Box', color: '#00A2FF' },
  { name: 'CharacterMesh', category: 'Mesh', icon: 'Component', color: '#FFFFFF' },
  { name: 'SpecialMesh', category: 'Mesh', icon: 'Box', color: '#00A2FF' },

  // 17. Environment
  { name: 'Atmosphere', category: 'Environment', icon: 'Cloud', color: '#87CEEB' },
  { name: 'Clouds', category: 'Environment', icon: 'Cloudy', color: '#87CEEB' },
  { name: 'Sky', category: 'Environment', icon: 'CloudSun', color: '#87CEEB' },

  // 18. Constraints / Physics
  { name: 'AlignOrientation', category: 'Constraints', icon: 'Compass', color: '#AAAAAA' },
  { name: 'AlignPosition', category: 'Constraints', icon: 'Target', color: '#AAAAAA' },
  { name: 'AngularVelocity', category: 'Constraints', icon: 'RotateCcw', color: '#AAAAAA' },
  { name: 'AnimationConstraint', category: 'Constraints', icon: 'Activity', color: '#AAAAAA' },
  { name: 'Attachment', category: 'Constraints', icon: 'Anchor', color: '#AAAAAA' },
  { name: 'BallSocketConstraint', category: 'Constraints', icon: 'CircleDot', color: '#AAAAAA' },
  { name: 'CylindricalConstraint', category: 'Constraints', icon: 'Circle', color: '#AAAAAA' },
  { name: 'HingeConstraint', category: 'Constraints', icon: 'RotateCw', color: '#AAAAAA' },
  { name: 'LineForce', category: 'Constraints', icon: 'Move', color: '#AAAAAA' },
  { name: 'LinearVelocity', category: 'Constraints', icon: 'MoveRight', color: '#AAAAAA' },
  { name: 'NoCollisionConstraint', category: 'Constraints', icon: 'ShieldOff', color: '#AAAAAA' },
  { name: 'PlaneConstraint', category: 'Constraints', icon: 'Square', color: '#AAAAAA' },
  { name: 'PrismaticConstraint', category: 'Constraints', icon: 'ArrowRightLeft', color: '#AAAAAA' },
  { name: 'RigidConstraint', category: 'Constraints', icon: 'Link', color: '#AAAAAA' },
  { name: 'RodConstraint', category: 'Constraints', icon: 'Spline', color: '#AAAAAA' },
  { name: 'RopeConstraint', category: 'Constraints', icon: 'Spline', color: '#AAAAAA' },
  { name: 'SpringConstraint', category: 'Constraints', icon: 'Waves', color: '#AAAAAA' },
  { name: 'Torque', category: 'Constraints', icon: 'RotateCw', color: '#AAAAAA' },
  { name: 'TorsionSpringConstraint', category: 'Constraints', icon: 'RefreshCw', color: '#AAAAAA' },
  { name: 'UniversalConstraint', category: 'Constraints', icon: 'Globe', color: '#AAAAAA' },
  { name: 'VectorForce', category: 'Constraints', icon: 'Move', color: '#AAAAAA' },
  { name: 'WeldConstraint', category: 'Constraints', icon: 'Link2', color: '#AAAAAA' },

  // 19. Ad / Monetization
  { name: 'AdGui', category: 'Advertising', icon: 'Monitor', color: '#00FF7F' },

  // 20. Styling System
  { name: 'StyleDerive', category: 'Style', icon: 'Palette', color: '#AAAAAA' },
  { name: 'StyleLink', category: 'Style', icon: 'Link', color: '#AAAAAA' },
  { name: 'StyleQuery', category: 'Style', icon: 'Search', color: '#AAAAAA' },
  { name: 'StyleRule', category: 'Style', icon: 'Settings', color: '#AAAAAA' },
  { name: 'StyleSheet', category: 'Style', icon: 'FileText', color: '#AAAAAA' },

  // 21. World / Simulation
  { name: 'WorldModel', category: 'World', icon: 'Layers', color: '#FFD700' },

  // 22. Seats / Teams
  { name: 'Seat', category: 'Gameplay', icon: 'Armchair', color: '#FFD700' },
  { name: 'VehicleSeat', category: 'Gameplay', icon: 'Car', color: '#FFD700' },
  { name: 'Team', category: 'Gameplay', icon: 'Users', color: '#FFD700' },

  // 24. Scripting / Networking
  { name: 'Actor', category: 'Scripting', icon: 'Cpu', color: '#FF4500' },
  { name: 'BindableEvent', category: 'Scripting', icon: 'Signal', color: '#FF4500' },
  { name: 'BindableFunction', category: 'Scripting', icon: 'SignalMedium', color: '#FF4500' },
  { name: 'LocalScript', category: 'Scripting', icon: 'FileCode2', color: '#FF4B4B' },
  { name: 'ModuleScript', category: 'Scripting', icon: 'FileJson', color: '#FFD700' },
  { name: 'RemoteEvent', category: 'Scripting', icon: 'Zap', color: '#FF4500' },
  { name: 'RemoteFunction', category: 'Scripting', icon: 'ZapOff', color: '#FF4500' },
  { name: 'Script', category: 'Scripting', icon: 'FileCode', color: '#00A2FF' },
  { name: 'UnreliableRemoteEvent', category: 'Scripting', icon: 'Zap', color: '#FF4500' },

  // 25. Misc Objects
  { name: 'Wire', category: 'Misc', icon: 'Spline', color: '#AAAAAA' },
  { name: 'VideoDisplay', category: 'Misc', icon: 'Monitor', color: '#FF69B4' },
  { name: 'VideoPlayer', category: 'Misc', icon: 'Video', color: '#FF69B4' },
  { name: 'Weld', category: 'Misc', icon: 'Link', color: '#AAAAAA' },
  { name: 'HapticEffect', category: 'Misc', icon: 'Smartphone', color: '#AAAAAA' },
  { name: 'Path2D', category: 'Misc', icon: 'Spline', color: '#AAAAAA' },
  { name: 'PathfindingLink', category: 'Misc', icon: 'Link', color: '#87CEEB' },
  { name: 'PathfindingModifier', category: 'Misc', icon: 'Navigation', color: '#87CEEB' },
  { name: 'MaterialVariant', category: 'Misc', icon: 'Layers', color: '#8BC34A' },
  { name: 'SurfaceAppearance', category: 'Misc', icon: 'Palette', color: '#87CEEB' },
  { name: 'TerrainDetail', category: 'Misc', icon: 'Mountain', color: '#8BC34A' },
  { name: 'Texture', category: 'Misc', icon: 'Grid', color: '#87CEEB' },
  { name: 'Decal', category: 'Misc', icon: 'Image', color: '#87CEEB' },
  { name: 'ArcHandles', category: 'Misc', icon: 'RotateCw', color: '#AAAAAA' },
  { name: 'Handles', category: 'Misc', icon: 'Move', color: '#AAAAAA' },
  { name: 'SurfaceSelection', category: 'Misc', icon: 'Square', color: '#AAAAAA' },
  { name: 'BoxHandleAdornment', category: 'Misc', icon: 'Box', color: '#AAAAAA' },
  { name: 'SphereHandleAdornment', category: 'Misc', icon: 'Circle', color: '#AAAAAA' },

  // Services
  { name: 'Workspace', category: 'Services', icon: 'Globe', color: '#4CAF50' },
  { name: 'Players', category: 'Services', icon: 'Users', color: '#2196F3' },
  { name: 'Lighting', category: 'Services', icon: 'Sun', color: '#FFEB3B' },
  { name: 'MaterialService', category: 'Services', icon: 'Layers', color: '#8BC34A' },
  { name: 'NetworkClient', category: 'Services', icon: 'Network', color: '#4CAF50' },
  { name: 'ReplicatedFirst', category: 'Services', icon: 'Zap', color: '#9C27B0' },
  { name: 'ReplicatedStorage', category: 'Services', icon: 'Database', color: '#03A9F4' },
  { name: 'ServerScriptService', category: 'Services', icon: 'Cpu', color: '#607D8B' },
  { name: 'ServerStorage', category: 'Services', icon: 'Database', color: '#9E9E9E' },
  { name: 'StarterGui', category: 'Services', icon: 'Monitor', color: '#E91E63' },
  { name: 'StarterPack', category: 'Services', icon: 'Package', color: '#FF9800' },
  { name: 'StarterPlayer', category: 'Services', icon: 'User', color: '#3F51B5' },
  { name: 'Teams', category: 'Services', icon: 'Shield', color: '#F44336' },
  { name: 'SoundService', category: 'Services', icon: 'Music', color: '#4CAF50' },
  { name: 'StarterCharacterScripts', category: 'Services', icon: 'Folder', color: '#FFD700' },
  { name: 'StarterPlayerScripts', category: 'Services', icon: 'Folder', color: '#FFD700' },
  { name: 'DataModel', category: 'Services', icon: 'Layers', color: '#AAAAAA' },
  { name: 'Camera', category: 'Services', icon: 'Camera', color: '#AAAAAA' },
  { name: 'Terrain', category: 'Services', icon: 'Mountain', color: '#8BC34A' },
  { name: 'TextChatService', category: 'Services', icon: 'MessagesSquare', color: '#00BCD4' },
  { name: 'Chat', category: 'Services', icon: 'MessageCircle', color: '#00BCD4' },
  { name: 'LocalizationService', category: 'Services', icon: 'Globe', color: '#795548' },
];

export const CATEGORIES = [
  '1. Basic / Thường sử dụng',
  '2. Audio (Âm thanh)',
  '3. Lighting (Ánh sáng)',
  '4. Avatar / Character',
  '5. Map',
  '6. Parts / Building',
  '7. Sensors',
  '8. Camera / Configuration',
  '9. Character Description',
  '10. Input System',
  '11. Values (Data objects)',
  '12. Interaction / Gameplay',
  '13. GUI (2D UI)',
  '14. Effects (Hiệu ứng)',
  '15. Post Effects (Hiệu ứng hậu kỳ)',
  '16. Mesh / Deformation',
  '17. Environment',
  '18. Constraints / Physics',
  '19. Ad / Monetization',
  '20. Styling System',
  '21. World / Simulation',
  '22. Seats / Teams',
  '23. Scripting / Networking',
  '24. Misc Objects'
];

export const OBJECT_CATEGORIES = [
  { name: '1. Basic / Thường sử dụng', classes: ['Part', 'Script', 'Folder', 'Tool', 'SpawnLocation', 'MeshPart', 'Model'] },
  { name: '2. Audio (Âm thanh)', classes: [
    'Sound', 'SoundGroup', 'AudioPlayer', 'AudioListener', 'AudioEmitter', 'AudioAnalyzer',
    'AudioEqualizer', 'AudioFader', 'AudioFilter', 'AudioFlanger', 'AudioGate', 'AudioLimiter', 'AudioPitchShifter', 'AudioReverb', 'AudioTremolo',
    'AudioChannelMixer', 'AudioChannelSplitter', 'AudioChorus', 'AudioCompressor', 'AudioDistortion', 'AudioEcho',
    'AudioDeviceInput', 'AudioDeviceOutput', 'AudioSpeechToText', 'AudioTextToSpeech',
    'ChorusSoundEffect', 'CompressorSoundEffect', 'DistortionSoundEffect', 'EchoSoundEffect', 'EqualizerSoundEffect', 'FlangeSoundEffect', 'PitchShiftSoundEffect', 'ReverbSoundEffect', 'TremoloSoundEffect'
  ] },
  { name: '3. Lighting (Ánh sáng)', classes: ['PointLight', 'SpotLight', 'SurfaceLight'] },
  { name: '4. Avatar / Character', classes: ['Accessory', 'AirController', 'Animation', 'Animator', 'Bone', 'IKControl', 'BodyColors', 'BuoyancySensor', 'ClimbController', 'ControllerManager', 'ControllerPartSensor', 'ForceField', 'GroundController', 'Humanoid', 'Motor6D', 'Pants', 'Shirt', 'ShirtGraphic', 'SwimController'] },
  { name: '5. Map', classes: [] },
  { name: '6. Parts / Building', classes: ['Part', 'MeshPart', 'TrussPart', 'WedgePart', 'CornerWedgePart'] },
  { name: '7. Sensors', classes: ['AtmosphereSensor', 'FluidForceSensor'] },
  { name: '8. Camera / Configuration', classes: ['Camera', 'Configuration'] },
  { name: '9. Character Description', classes: ['BodyPartDescription', 'HumanoidDescription', 'MakeupDescription', 'AccessoryDescription', 'HumanoidRigDescription'] },
  { name: '10. Input System', classes: ['InputAction', 'InputBinding', 'InputContext'] },
  { name: '11. Values (Data objects)', classes: ['BoolValue', 'BrickColorValue', 'CFrameValue', 'Color3Value', 'IntValue', 'NumberValue', 'ObjectValue', 'RayValue', 'StringValue', 'Vector3Value'] },
  { name: '12. Interaction / Gameplay', classes: ['ClickDetector', 'Dialog', 'DialogChoice', 'DragDetector', 'ProximityPrompt'] },
  { name: '13. GUI (2D UI)', classes: [
    'ScreenGui', 'SurfaceGui', 'BillboardGui',
    'Frame', 'CanvasGroup', 'ImageButton', 'ImageLabel', 'TextBox', 'TextButton', 'TextLabel', 'VideoFrame', 'ViewportFrame', 'ScrollingFrame',
    'UIAspectRatioConstraint', 'UIListLayout', 'UIGridLayout', 'UITableLayout', 'UIPageLayout', 'UIFlexItem',
    'UIGradient', 'UIStroke', 'UICorner', 'UIPadding', 'UIScale', 'UITextSizeConstraint', 'UISizeConstraint',
    'UIDragDetector'
  ] },
  { name: '14. Effects (Hiệu ứng)', classes: ['Beam', 'Explosion', 'Fire', 'Highlight', 'ParticleEmitter', 'Smoke', 'Sparkles', 'Trail', 'SelectionBox', 'SelectionSphere'] },
  { name: '15. Post Effects (Hiệu ứng hậu kỳ)', classes: ['BloomEffect', 'BlurEffect', 'ColorCorrectionEffect', 'ColorGradingEffect', 'DepthOfFieldEffect', 'SunRaysEffect'] },
  { name: '16. Mesh / Deformation', classes: ['WrapLayer', 'WrapTarget', 'WrapDeformer', 'WrapTextureTransfer', 'BlockMesh', 'CharacterMesh', 'SpecialMesh'] },
  { name: '17. Environment', classes: ['Atmosphere', 'Clouds', 'Sky'] },
  { name: '18. Constraints / Physics', classes: [
    'AlignOrientation', 'AlignPosition', 'AngularVelocity', 'AnimationConstraint', 'Attachment', 'BallSocketConstraint', 'CylindricalConstraint', 'HingeConstraint', 'LineForce', 'LinearVelocity', 'NoCollisionConstraint', 'PlaneConstraint', 'PrismaticConstraint', 'RigidConstraint', 'RodConstraint', 'RopeConstraint', 'SpringConstraint', 'Torque', 'TorsionSpringConstraint', 'UniversalConstraint', 'VectorForce', 'WeldConstraint'
  ] },
  { name: '19. Ad / Monetization', classes: ['AdGui'] },
  { name: '20. Styling System', classes: ['StyleDerive', 'StyleLink', 'StyleQuery', 'StyleRule', 'StyleSheet'] },
  { name: '21. World / Simulation', classes: ['WorldModel'] },
  { name: '22. Seats / Teams', classes: ['Seat', 'VehicleSeat', 'Team'] },
  { name: '23. Scripting / Networking', classes: ['Actor', 'BindableEvent', 'BindableFunction', 'LocalScript', 'ModuleScript', 'RemoteEvent', 'RemoteFunction', 'Script', 'UnreliableRemoteEvent'] },
  { name: '24. Misc Objects', classes: ['Wire', 'VideoDisplay', 'VideoPlayer', 'Weld', 'HapticEffect', 'Path2D', 'PathfindingLink', 'PathfindingModifier', 'MaterialVariant', 'SurfaceAppearance', 'TerrainDetail', 'Texture', 'Decal', 'ArcHandles', 'Handles', 'SurfaceSelection', 'BoxHandleAdornment', 'SphereHandleAdornment'] },
  { name: 'Services', classes: ['Workspace', 'Players', 'Lighting', 'MaterialService', 'NetworkClient', 'ReplicatedFirst', 'ReplicatedStorage', 'ServerScriptService', 'ServerStorage', 'StarterGui', 'StarterPack', 'StarterPlayer', 'Teams', 'SoundService', 'TextChatService', 'Chat', 'LocalizationService'] },
];
