import { getCategoryColor } from './colors';

const SERVICES_LIST = [
  'Workspace', 'Players', 'Lighting', 'MaterialService', 'NetworkClient', 
  'ReplicatedFirst', 'ReplicatedStorage', 'ServerScriptService', 'ServerStorage', 
  'StarterPack', 'Teams', 'SoundService', 'TextChatService',
  'StarterPlayer', 'StarterGui', 'RunService', 'TweenService', 'UserInputService', 
  'ContextActionService', 'CollectionService', 'Debris', 'DataStoreService', 
  'MemoryStoreService', 'MessagingService', 'HttpService', 'MarketplaceService', 
  'TeleportService', 'BadgeService', 'PathfindingService', 'ProximityPromptService', 
  'TextService', 'AvatarEditorService', 'ContentProvider', 
  'InsertService', 'GuiService', 'PhysicsService'
];

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
      name: 'Roblox Services',
      contents: SERVICES_LIST.map(service => ({
        kind: 'block',
        type: `service_${service.toLowerCase()}`
      }))
    },
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
      name: 'Part',
      contents: []
    },
    {
      kind: 'category',
      name: 'Character',
      contents: []
    },
    {
      kind: 'category',
      name: 'Model',
      contents: []
    },
    {
      kind: 'category',
      name: 'Gui',
      contents: []
    },
    {
      kind: 'category',
      name: 'Player',
      contents: [
        { kind: 'block', type: 'player_joined' },
        { kind: 'block', type: 'player_leaving' },
        { kind: 'block', type: 'player_get_by_name' },
        { kind: 'block', type: 'player_get_user_id' },
        { kind: 'block', type: 'player_kick' },
        { kind: 'block', type: 'player_chat_added' },
        { kind: 'block', type: 'player_respawned' }
      ]
    },
    {
      kind: 'category',
      name: 'Clickdetector',
      contents: []
    },
    {
      kind: 'category',
      name: 'Marketplace',
      contents: []
    },
    {
      kind: 'category',
      name: 'Tweening',
      contents: []
    },
    {
      kind: 'category',
      name: 'Client',
      contents: []
    },
    {
      kind: 'category',
      name: 'Server',
      contents: []
    },
    {
      kind: 'category',
      name: 'Leaderstats',
      contents: []
    },
    {
      kind: 'category',
      name: 'Events',
      contents: [
        { kind: 'block', type: 'event_game_start' },
        { kind: 'block', type: 'event_player_join' },
        { kind: 'block', type: 'event_touched' },
        { kind: 'block', type: 'event_clicked' },
        { kind: 'block', type: 'event_value_changed' }
      ]
    },
    {
      kind: 'category',
      name: 'RemoteEvent',
      contents: [
        { kind: 'block', type: 'remote_on_server_event' },
        { kind: 'block', type: 'remote_fire_server' }
      ]
    },
    {
      kind: 'category',
      name: 'Input',
      contents: [
        { kind: 'block', type: 'input_key_pressed' },
        { kind: 'block', type: 'input_mouse_click' },
        { kind: 'block', type: 'input_touch' },
        { kind: 'block', type: 'input_button_pressed' },
        { kind: 'block', type: 'input_mouse_position' }
      ]
    },
    {
      kind: 'category',
      name: 'Camera',
      contents: [
        { kind: 'block', type: 'camera_set_type' },
        { kind: 'block', type: 'camera_set_subject' },
        { kind: 'block', type: 'camera_move' },
        { kind: 'block', type: 'camera_set_fov' }
      ]
    },
    {
      kind: 'category',
      name: 'Animation',
      contents: [
        { kind: 'block', type: 'animation_load' },
        { kind: 'block', type: 'animation_play' },
        { kind: 'block', type: 'animation_stop' },
        { kind: 'block', type: 'animation_adjust_speed' }
      ]
    },
    {
      kind: 'category',
      name: 'Physics',
      contents: [
        { kind: 'block', type: 'physics_apply_force' },
        { kind: 'block', type: 'physics_set_velocity' },
        { kind: 'block', type: 'physics_enable' },
        { kind: 'block', type: 'physics_set_mass' }
      ]
    },
    {
      kind: 'category',
      name: 'Raycast',
      contents: [
        { kind: 'block', type: 'raycast_forward' },
        { kind: 'block', type: 'raycast_down' },
        { kind: 'block', type: 'raycast_get_hit_object' },
        { kind: 'block', type: 'raycast_get_hit_position' }
      ]
    },
    {
      kind: 'category',
      name: 'Pathfinding',
      contents: [
        { kind: 'block', type: 'pathfinding_create' },
        { kind: 'block', type: 'pathfinding_compute' },
        { kind: 'block', type: 'pathfinding_move_to' },
        { kind: 'block', type: 'pathfinding_stop' }
      ]
    },
    {
      kind: 'category',
      name: 'Teleport',
      contents: [
        { kind: 'block', type: 'teleport_player' },
        { kind: 'block', type: 'teleport_players' },
        { kind: 'block', type: 'teleport_reserve_server' },
        { kind: 'block', type: 'teleport_async' }
      ]
    },
    {
      kind: 'category',
      name: 'Collection',
      contents: [
        { kind: 'block', type: 'collection_add_tag' },
        { kind: 'block', type: 'collection_remove_tag' },
        { kind: 'block', type: 'collection_get_tagged' }
      ]
    },
    {
      kind: 'category',
      name: 'RunService',
      contents: [
        { kind: 'block', type: 'runservice_heartbeat' },
        { kind: 'block', type: 'runservice_stepped' },
        { kind: 'block', type: 'runservice_renderstep' }
      ]
    },
    {
      kind: 'category',
      name: 'Lighting',
      contents: [
        { kind: 'block', type: 'lighting_set_brightness' },
        { kind: 'block', type: 'lighting_set_time' },
        { kind: 'block', type: 'lighting_change_sky' },
        { kind: 'block', type: 'lighting_set_ambient' }
      ]
    },
    {
      kind: 'category',
      name: 'Effects',
      contents: [
        { kind: 'block', type: 'effects_emit' },
        { kind: 'block', type: 'effects_enable' },
        { kind: 'block', type: 'effects_disable' },
        { kind: 'block', type: 'effects_spawn' }
      ]
    },
    {
      kind: 'category',
      name: 'Functions',
      custom: 'PROCEDURE',
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
    }
  ]
};

export const toolbox = {
  ...rawToolbox,
  contents: rawToolbox.contents.map(cat => ({
    ...cat,
    colour: getCategoryColor(cat.name)
  }))
};
