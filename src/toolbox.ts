import { getCategoryColor } from './colors';
import { serviceGroups } from './serviceBlocks';

const CATEGORY_DATA: { [key: string]: { icon: string, color: string } } = {
  'Comment': { icon: 'BookOpen', color: '#78909C' },
  'Debug': { icon: 'Terminal', color: '#FFB74D' },
  'Logic': { icon: 'Zap', color: '#42A5F5' },
  'Math': { icon: 'Activity', color: '#66BB6A' },
  'Text': { icon: 'Code2', color: '#FFCA28' },
  'Sound': { icon: 'Music', color: '#9CCC65' },
  'Values': { icon: 'Layers', color: '#4FC3F7' },
  'Variables': { icon: 'User', color: '#FF7043' },
  'Lists': { icon: 'Layers', color: '#EF5350' },
  'Loops': { icon: 'RefreshCw', color: '#43A047' },
  'World': { icon: 'Globe', color: '#29B6F6' },
  'Instance': { icon: 'Box', color: '#7E57C2' },
  'Part': { icon: 'Box', color: '#546E7A' },
  'Character': { icon: 'User', color: '#EC407A' },
  'Model': { icon: 'Box', color: '#9575CD' },
  'Gui': { icon: 'Image', color: '#AB47BC' },
  'ClickDetector': { icon: 'MousePointer2', color: '#A1887F' },
  'Marketplace': { icon: 'Save', color: '#3F51B5' },
  'Tweening': { icon: 'Sparkles', color: '#00897B' },
  'Client': { icon: 'Monitor', color: '#FB8C00' },
  'Server': { icon: 'Cpu', color: '#00ACC1' },
  'Leaderstats': { icon: 'CheckCircle', color: '#FBC02D' },
  'Datastore': { icon: 'Database', color: '#1565C0' },
  'Functions': { icon: 'Code2', color: '#E53935' },
  'Events': { icon: 'Zap', color: '#F4511E' },
  'Animation': { icon: 'Play', color: '#D81B60' },
  'Input': { icon: 'MousePointer2', color: '#0097A7' },
  'Camera': { icon: 'Eye', color: '#7CB342' },
  'Effects': { icon: 'Sparkles', color: '#AD1457' },
  'AdService': { icon: 'Info', color: '#FF3D00' },
  'AnalyticsService': { icon: 'Activity', color: '#455A64' },
  'AnimationClipProvider': { icon: 'Play', color: '#8E24AA' },
  'AssetService': { icon: 'Save', color: '#283593' },
  'AvatarEditorService': { icon: 'User', color: '#FF8F00' },
  'BadgeService': { icon: 'CheckCircle', color: '#FFEA00' },
  'BrowserService': { icon: 'Globe', color: '#1976D2' },
  'ChangeHistoryService': { icon: 'RefreshCw', color: '#0097A7' },
  'Chat': { icon: 'MessageSquare', color: '#00838F' },
  'CollectionService': { icon: 'Layers', color: '#B71C1C' },
  'ContentProvider': { icon: 'Cloud', color: '#1A237E' },
  'ContextActionService': { icon: 'Zap', color: '#311B92' },
  'ControllerService': { icon: 'Cpu', color: '#00796B' },
  'CoreGui': { icon: 'Image', color: '#388E3C' },
  'CorePackages': { icon: 'Box', color: '#689F38' },
  'CSGDictionaryService': { icon: 'Database', color: '#9E9D24' },
  'DataStoreService': { icon: 'Database', color: '#1B5E20' },
  'Debris': { icon: 'Trash2', color: '#004D40' },
  'DebuggerManager': { icon: 'Terminal', color: '#FBC02D' },
  'DeviceService': { icon: 'Monitor', color: '#FFA000' },
  'FriendService': { icon: 'User', color: '#F57C00' },
  'GamepadService': { icon: 'MousePointer2', color: '#E64A19' },
  'Geometry': { icon: 'Box', color: '#5D4037' },
  'GroupService': { icon: 'User', color: '#616161' },
  'GuiService': { icon: 'Image', color: '#283593' },
  'HapticService': { icon: 'Zap', color: '#546E7A' },
  'HttpService': { icon: 'Globe', color: '#4E342E' },
  'InsertService': { icon: 'Plus', color: '#006064' },
  'JointsService': { icon: 'Layers', color: '#D32F2F' },
  'KeyframeSequenceProvider': { icon: 'Play', color: '#C2185B' },
  'LanguageService': { icon: 'Globe', color: '#7B1FA2' },
  'Lighting': { icon: 'Sun', color: '#FFD600' },
  'LocalizationService': { icon: 'Globe', color: '#512DA8' },
  'LogService': { icon: 'Terminal', color: '#303F9F' },
  'LuaSettings': { icon: 'Settings', color: '#1976D2' },
  'MarketplaceService': { icon: 'Save', color: '#2E7D32' },
  'MaterialService': { icon: 'Layers', color: '#2E7D32' },
  'MemoryStoreService': { icon: 'Database', color: '#880E4F' },
  'MessagingService': { icon: 'MessageSquare', color: '#01579B' },
  'NetworkClient': { icon: 'Globe', color: '#0288D1' },
  'NetworkServer': { icon: 'Cpu', color: '#0288D1' },
  'NotificationService': { icon: 'Bell', color: '#0097A7' },
  'PathfindingService': { icon: 'Navigation', color: '#004D40' },
  'PhysicsService': { icon: 'Activity', color: '#37474F' },
  'Players': { icon: 'User', color: '#26A69A' },
  'PluginDebugService': { icon: 'Terminal', color: '#00796B' },
  'PluginGuiService': { icon: 'Image', color: '#388E3C' },
  'PointsService': { icon: 'CheckCircle', color: '#689F38' },
  'PolicyService': { icon: 'Lock', color: '#9E9D24' },
  'ProximityPromptService': { icon: 'Zap', color: '#BF360C' },
  'ReplicatedFirst': { icon: 'Zap', color: '#C2185B' },
  'ReplicatedStorage': { icon: 'Database', color: '#7B1FA2' },
  'RunService': { icon: 'Play', color: '#2E7D32' },
  'ScriptContext': { icon: 'Terminal', color: '#FBC02D' },
  'Selection': { icon: 'MousePointer2', color: '#FFA000' },
  'ServerScriptService': { icon: 'Terminal', color: '#303F9F' },
  'ServerStorage': { icon: 'Database', color: '#0097A7' },
  'SoundService': { icon: 'Music', color: '#EF6C00' },
  'StarterGui': { icon: 'Image', color: '#FFA000' },
  'StarterPack': { icon: 'Box', color: '#558B2F' },
  'StarterPlayer': { icon: 'User', color: '#0277BD' },
  'Stats': { icon: 'Activity', color: '#F57C00' },
  'StudioData': { icon: 'Database', color: '#E64A19' },
  'Teams': { icon: 'User', color: '#AFB42B' },
  'TeleportService': { icon: 'Navigation', color: '#4527A0' },
  'TestService': { icon: 'Terminal', color: '#5D4037' },
  'TextChatService': { icon: 'MessageSquare', color: '#E65100' },
  'TextService': { icon: 'Code2', color: '#D84315' },
  'TweenService': { icon: 'Sparkles', color: '#00897B' },
  'UserGameSettings': { icon: 'Settings', color: '#607D8B' },
  'UserInputService': { icon: 'MousePointer2', color: '#0097A7' },
  'VRService': { icon: 'Eye', color: '#7E57C2' },
  'Workspace': { icon: 'Globe', color: '#29B6F6' },
};

const rawToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Comment',
      contents: [{ kind: 'block', type: 'comment' }]
    },
    {
      kind: 'category',
      name: 'Debug',
      contents: [
        { kind: 'block', type: 'print' },
        { kind: 'block', type: 'warn' },
        { kind: 'block', type: 'run_lua' }
      ]
    },
    {
      kind: 'category',
      name: 'Logic',
      contents: [
        { kind: 'block', type: 'lua_if' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_compare_eq' },
        { kind: 'block', type: 'logic_compare_lt' },
        { kind: 'block', type: 'logic_compare_gt' },
        { kind: 'block', type: 'logic_compare_neq' },
        { kind: 'block', type: 'logic_boolean_true' },
        { kind: 'block', type: 'logic_boolean_false' },
        { kind: 'block', type: 'logic_operation_and' },
        { kind: 'block', type: 'logic_operation_or' }
      ]
    },
    {
      kind: 'category',
      name: 'Math',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'math_single' },
        { kind: 'block', type: 'math_trig' },
        { kind: 'block', type: 'math_constant' },
        { kind: 'block', type: 'math_number_property' },
        { kind: 'block', type: 'math_round' },
        { kind: 'block', type: 'math_on_list' },
        { kind: 'block', type: 'math_modulo' },
        { kind: 'block', type: 'math_constrain' },
        { kind: 'block', type: 'math_random_int' },
        { kind: 'block', type: 'math_random_float' },
        { kind: 'block', type: 'math_atan2' }
      ]
    },
    {
      kind: 'category',
      name: 'Text',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_join' },
        { kind: 'block', type: 'text_append' },
        { kind: 'block', type: 'text_length' },
        { kind: 'block', type: 'text_isEmpty' },
        { kind: 'block', type: 'text_indexOf' },
        { kind: 'block', type: 'text_charAt' },
        { kind: 'block', type: 'text_getSubstring' },
        { kind: 'block', type: 'text_changeCase' },
        { kind: 'block', type: 'text_trim' },
        { kind: 'block', type: 'text_print' },
        { kind: 'block', type: 'text_prompt_ext' }
      ]
    },
    {
      kind: 'category',
      name: 'Sound',
      contents: [
        { kind: 'block', type: 'sound_play' },
        { kind: 'block', type: 'sound_stop' },
        { kind: 'block', type: 'sound_pause' },
        { kind: 'block', type: 'sound_soundid' },
        { kind: 'block', type: 'sound_volume' },
        { kind: 'block', type: 'sound_looped' },
        { kind: 'block', type: 'sound_playing' },
        { kind: 'block', type: 'sound_playbackspeed' },
        { kind: 'block', type: 'sound_timeposition' },
        { kind: 'block', type: 'sound_ended' }
      ]
    },
    {
      kind: 'category',
      name: 'Values',
      contents: []
    },
    {
      kind: 'category',
      name: 'Variables',
      custom: 'VARIABLE',
    },
    {
      kind: 'category',
      name: 'Lists',
      contents: []
    },
    {
      kind: 'category',
      name: 'Loops',
      contents: [
        { kind: 'block', type: 'wait' },
        { kind: 'block', type: 'loops_while_lua' },
        { kind: 'block', type: 'loops_repeat_lua' },
        { kind: 'block', type: 'loops_for_children' },
        { kind: 'block', type: 'loops_for_descendants' },
        { kind: 'block', type: 'loops_break_lua' }
      ]
    },
    {
      kind: 'category',
      name: 'Datastore',
      contents: [
        { kind: 'block', type: 'datastore_setup' },
        { kind: 'block', type: 'datastore_instance' },
        { kind: 'block', type: 'datastore_use' },
        { kind: 'block', type: 'datastore_get' },
        { kind: 'block', type: 'datastore_save' }
      ]
    },
    // New Service Categories
    ...serviceGroups.map(serviceName => {
      const color = getCategoryColor(serviceName) || getCategoryColor('Roblox Services');
      const truncatedName = serviceName.length > 13 ? serviceName.substring(0, 13) + '...' : serviceName;
      return {
        kind: 'category',
        name: truncatedName,
        contents: [
          { kind: 'label', text: 'Methods / Blocks' },
          ...[
            { name: 'GetService', args: [] },
            { name: 'FindFirstChild', args: [{ name: 'NAME', shadow: 'placeholder_string' }] },
            { name: 'WaitForChild', args: [{ name: 'NAME', shadow: 'placeholder_string' }] },
            { name: 'GetChildren', args: [] },
            { name: 'GetDescendants', args: [] },
            { name: 'Clone', args: [] },
            { name: 'Destroy', args: [] },
            { name: 'SetAttribute', args: [{ name: 'NAME', shadow: 'placeholder_string' }, { name: 'VALUE', shadow: 'placeholder_any' }] },
            { name: 'GetAttribute', args: [{ name: 'NAME', shadow: 'placeholder_string' }] }
          ].map(method => ({
            kind: 'block',
            type: `rbx_${serviceName.toLowerCase()}_method_${method.name.toLowerCase()}`,
            inputs: method.args.reduce((acc: any, arg: any) => {
              acc[arg.name] = { shadow: { type: arg.shadow, extraState: { color: color } } };
              return acc;
            }, {})
          })),
          { kind: 'label', text: 'Properties / Blocks' },
          ...['Name', 'Parent', 'ClassName', 'Archivable'].flatMap(prop => [
            { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_property_get_${prop.toLowerCase()}` },
            { 
              kind: 'block', 
              type: `rbx_${serviceName.toLowerCase()}_property_set_${prop.toLowerCase()}`,
              inputs: {
                VALUE: { shadow: { type: 'placeholder_any', extraState: { color: color } } }
              }
            }
          ]),
          { kind: 'label', text: 'Events / Blocks' },
          ...['ChildAdded', 'ChildRemoved', 'DescendantAdded', 'DescendantRemoving', 'Changed'].map(event => ({
            kind: 'block',
            type: `rbx_${serviceName.toLowerCase()}_event_${event.toLowerCase()}`
          })),
          { kind: 'label', text: 'Child Objects / Blocks' },
          ...[
            { name: 'Create Instance', args: [{ name: 'CLASS', shadow: 'placeholder_string' }] },
            { name: 'Parent Object To Service', args: [{ name: 'INSTANCE', shadow: 'placeholder_instance' }] }
          ].map(obj => ({
            kind: 'block',
            type: `rbx_${serviceName.toLowerCase()}_child_${obj.name.toLowerCase().replace(/ /g, '_')}`,
            inputs: obj.args.reduce((acc: any, arg: any) => {
              acc[arg.name] = { shadow: { type: arg.shadow, extraState: { color: color } } };
              return acc;
            }, {})
          }))
        ]
      };
    }),
    {
      kind: 'category',
      name: 'World',
      contents: [
        { kind: 'block', type: 'world_game' },
        { kind: 'block', type: 'world_workspace' },
        { kind: 'block', type: 'world_me' },
        { kind: 'block', type: 'world_this_script' },
        { kind: 'block', type: 'world_instance' },
        { kind: 'block', type: 'world_get_instance_by_path' },
        { kind: 'block', type: 'world_set_property' },
        { kind: 'block', type: 'world_get_property' },
        { kind: 'block', type: 'world_set_property_direct' },
        { kind: 'block', type: 'world_get_property_direct' },
        { kind: 'block', type: 'world_find_first_child' },
        { kind: 'block', type: 'world_find_first_child_direct' },
        { kind: 'block', type: 'world_create_instance_direct' },
        { kind: 'block', type: 'world_vector3' },
        { kind: 'block', type: 'world_vector3_values' },
        { kind: 'block', type: 'world_color3' },
        { kind: 'block', type: 'world_color3_values' }
      ]
    },
    {
      kind: 'category',
      name: 'Instance',
      contents: [
        { kind: 'block', type: 'instance_selector' }
      ]
    },
    {
      kind: 'category',
      name: 'Events',
      colour: getCategoryColor('Events'),
      cssConfig: {
        'row': 'scratch-category-row scratch-cat-events',
        'icon': 'scratch-category-icon',
        'label': 'scratch-category-label'
      },
      contents: [
        { kind: 'block', type: 'event_game_loaded' },
        { kind: 'block', type: 'event_player_joined' },
        { kind: 'block', type: 'event_player_left' },
        { kind: 'block', type: 'event_character_added' },
        { kind: 'block', type: 'event_character_removing' },
        { 
          kind: 'block', 
          type: 'event_touched',
          inputs: { INSTANCE: { shadow: { type: 'world_me' } } }
        },
        { 
          kind: 'block', 
          type: 'event_touch_ended',
          inputs: { INSTANCE: { shadow: { type: 'world_me' } } }
        },
        { 
          kind: 'block', 
          type: 'event_child_added',
          inputs: { INSTANCE: { shadow: { type: 'world_workspace' } } }
        },
        { 
          kind: 'block', 
          type: 'event_child_removed',
          inputs: { INSTANCE: { shadow: { type: 'world_workspace' } } }
        },
        { 
          kind: 'block', 
          type: 'event_property_changed',
          inputs: { INSTANCE: { shadow: { type: 'world_me' } } }
        },
        { 
          kind: 'block', 
          type: 'event_remote_event_fired',
          inputs: { REMOTE: { shadow: { type: 'placeholder_instance' } } }
        },
        { 
          kind: 'block', 
          type: 'event_remote_function_called',
          inputs: { REMOTE: { shadow: { type: 'placeholder_instance' } } }
        },
        { 
          kind: 'block', 
          type: 'event_proximity_prompt_triggered',
          inputs: { PROMPT: { shadow: { type: 'placeholder_instance' } } }
        },
        { 
          kind: 'block', 
          type: 'event_tool_equipped',
          inputs: { TOOL: { shadow: { type: 'placeholder_instance' } } }
        },
        { 
          kind: 'block', 
          type: 'event_tool_unequipped',
          inputs: { TOOL: { shadow: { type: 'placeholder_instance' } } }
        },
        { 
          kind: 'block', 
          type: 'event_humanoid_died',
          inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
        },
        { 
          kind: 'block', 
          type: 'event_humanoid_jumping',
          inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
        },
        { 
          kind: 'block', 
          type: 'event_humanoid_running',
          inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
        },
        { kind: 'block', type: 'event_heartbeat' },
        { kind: 'block', type: 'event_render_stepped' },
        { kind: 'block', type: 'event_stepped' },
        { kind: 'block', type: 'event_chat_message_received' },
        { 
          kind: 'block', 
          type: 'event_attribute_changed',
          inputs: { INSTANCE: { shadow: { type: 'world_me' } } }
        }
      ]
    },
    {
      kind: 'category',
      name: 'Input',
      colour: getCategoryColor('Input'),
      cssConfig: {
        'row': 'scratch-category-row scratch-cat-input',
        'icon': 'scratch-category-icon',
        'label': 'scratch-category-label'
      },
      contents: [
        { kind: 'block', type: 'input_key_pressed' },
        { kind: 'block', type: 'input_key_released' },
        { kind: 'block', type: 'input_mouse_button_down' },
        { kind: 'block', type: 'input_mouse_button_up' },
        { kind: 'block', type: 'input_mouse_move' },
        { kind: 'block', type: 'input_mouse_position' },
        { kind: 'block', type: 'input_is_key_down' },
        { kind: 'block', type: 'input_get_keys_pressed' },
        { kind: 'block', type: 'input_touch_started' },
        { kind: 'block', type: 'input_touch_ended' },
        { kind: 'block', type: 'input_touch_moved' },
        { kind: 'block', type: 'input_gamepad_button_pressed' },
        { kind: 'block', type: 'input_gamepad_button_released' },
        { kind: 'block', type: 'input_began' },
        { kind: 'block', type: 'input_ended' },
        { kind: 'block', type: 'input_changed' },
        { kind: 'block', type: 'input_lock_mouse' },
        { kind: 'block', type: 'input_unlock_mouse' },
        { 
          kind: 'block', 
          type: 'input_set_mouse_icon',
          inputs: { ICON: { shadow: { type: 'placeholder_string' } } }
        }
      ]
    },
    {
      kind: 'category',
      name: 'Camera',
      colour: getCategoryColor('Camera'),
      contents: [
        { kind: 'block', type: 'camera_get_current' },
        { kind: 'block', type: 'camera_set_type' },
        { kind: 'block', type: 'camera_set_subject' },
        { kind: 'block', type: 'camera_set_cframe' },
        { kind: 'block', type: 'camera_get_cframe' },
        { kind: 'block', type: 'camera_move' },
        { kind: 'block', type: 'camera_look_at' },
        { kind: 'block', type: 'camera_shake' },
        { kind: 'block', type: 'camera_zoom' },
        { kind: 'block', type: 'camera_set_fov' },
        { kind: 'block', type: 'camera_get_fov' },
        { kind: 'block', type: 'camera_follow_player' },
        { kind: 'block', type: 'camera_scriptable' },
        { kind: 'block', type: 'camera_reset' },
      ],
    },
    {
      kind: 'category',
      name: 'Animation',
      colour: getCategoryColor('Animation'),
      contents: [
        { kind: 'block', type: 'animation_load' },
        { kind: 'block', type: 'animation_play' },
        { kind: 'block', type: 'animation_stop' },
        { kind: 'block', type: 'animation_pause' },
        { kind: 'block', type: 'animation_adjust_speed' },
        { kind: 'block', type: 'animation_adjust_weight' },
        { kind: 'block', type: 'animation_get_playing' },
        { kind: 'block', type: 'animation_stopped' },
        { kind: 'block', type: 'animation_played' },
        { kind: 'block', type: 'animation_set_priority' },
        { kind: 'block', type: 'animation_get_length' },
        { kind: 'block', type: 'animation_is_playing' },
      ],
    },
    {
      kind: 'category',
      name: 'Effects',
      colour: getCategoryColor('Effects'),
      contents: [
        { kind: 'block', type: 'effects_create_particle' },
        { kind: 'block', type: 'effects_emit_particles' },
        { kind: 'block', type: 'effects_stop_particles' },
        { kind: 'block', type: 'effects_create_explosion' },
        { kind: 'block', type: 'effects_create_highlight' },
        { kind: 'block', type: 'effects_enable_highlight' },
        { kind: 'block', type: 'effects_disable_highlight' },
        { kind: 'block', type: 'effects_create_beam' },
        { kind: 'block', type: 'effects_create_trail' },
        { kind: 'block', type: 'effects_play_sound' },
        { kind: 'block', type: 'effects_stop_sound' },
        { kind: 'block', type: 'effects_set_sound_volume' },
        { kind: 'block', type: 'effects_set_sound_pitch' },
        { kind: 'block', type: 'effects_create_tween' },
        { kind: 'block', type: 'effects_play_tween' },
        { kind: 'block', type: 'effects_stop_tween' },
        { kind: 'block', type: 'effects_camera_shake' },
        { kind: 'block', type: 'effects_flash_screen' },
        { kind: 'block', type: 'effects_blur' },
        { kind: 'block', type: 'effects_color_correction' },
      ],
    },
    {
      kind: 'category',
      name: 'Functions',
      custom: 'PROCEDURE',
    }
  ]
};

export const fullToolbox = {
  ...rawToolbox,
  contents: rawToolbox.contents.map(cat => {
    const name = cat.name || '';
    const truncatedName = name.length > 13 ? name.substring(0, 13) + '...' : name;
    const data = CATEGORY_DATA[name] || { icon: 'Box', color: '#666' };
    
    let categoryContents: any[] = cat.contents || [];
    
    // Add dynamic blocks for service groups if it's a service category
    if (serviceGroups.includes(name)) {
      const serviceName = name;
      categoryContents = [
        { kind: 'label', text: 'Methods / Blocks' },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_method_getservice` },
        { 
          kind: 'block', 
          type: `rbx_${serviceName.toLowerCase()}_method_findfirstchild`,
          inputs: { NAME: { shadow: { type: 'placeholder_string' } } }
        },
        { 
          kind: 'block', 
          type: `rbx_${serviceName.toLowerCase()}_method_waitforchild`,
          inputs: { NAME: { shadow: { type: 'placeholder_string' } } }
        },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_method_getchildren` },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_method_getdescendants` },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_method_clone` },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_method_destroy` },
        { 
          kind: 'block', 
          type: `rbx_${serviceName.toLowerCase()}_method_setattribute`,
          inputs: { 
            NAME: { shadow: { type: 'placeholder_string' } },
            VALUE: { shadow: { type: 'placeholder_any' } }
          }
        },
        { 
          kind: 'block', 
          type: `rbx_${serviceName.toLowerCase()}_method_getattribute`,
          inputs: { NAME: { shadow: { type: 'placeholder_string' } } }
        },
        { kind: 'label', text: 'Properties / Blocks' },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_property_get_name` },
        { 
          kind: 'block', 
          type: `rbx_${serviceName.toLowerCase()}_property_set_name`,
          inputs: { VALUE: { shadow: { type: 'placeholder_string' } } }
        },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_property_get_parent` },
        { 
          kind: 'block', 
          type: `rbx_${serviceName.toLowerCase()}_property_set_parent`,
          inputs: { VALUE: { shadow: { type: 'placeholder_instance' } } }
        },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_property_get_classname` },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_property_get_archivable` },
        { 
          kind: 'block', 
          type: `rbx_${serviceName.toLowerCase()}_property_set_archivable`,
          inputs: { VALUE: { shadow: { type: 'placeholder_boolean' } } }
        },
        { kind: 'label', text: 'Events / Blocks' },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_event_childadded` },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_event_childremoved` },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_event_descendantadded` },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_event_descendantremoving` },
        { kind: 'block', type: `rbx_${serviceName.toLowerCase()}_event_changed` },
        { kind: 'label', text: 'Child Objects / Blocks' },
        { 
          kind: 'block', 
          type: `rbx_${serviceName.toLowerCase()}_child_create_instance`,
          inputs: { CLASS: { shadow: { type: 'placeholder_string' } } }
        },
        { 
          kind: 'block', 
          type: `rbx_${serviceName.toLowerCase()}_child_parent_object_to_service`,
          inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
        }
      ];
    }

    return {
      ...cat,
      name: truncatedName,
      colour: data.color,
      icon: data.icon,
      contents: categoryContents
    };
  })
};

export const initialToolbox = {
  ...fullToolbox,
  contents: fullToolbox.contents.filter(cat => ['Comment', 'Logic', 'Math'].includes(cat.name))
};

export const toolbox = fullToolbox;
