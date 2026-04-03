export interface BlockInfo {
  type: string;
  name: string;
  category: string;
  description: string;
  description_vi: string;
  image?: string;
}

export const blockData: BlockInfo[] = [
  {
    type: 'comment',
    name: 'Comment',
    category: 'Comment',
    description: 'Adds a comment to the code. Comments are ignored by the script.',
    description_vi: 'Thêm một chú thích vào mã. Chú thích sẽ bị bỏ qua khi chạy script.'
  },
  {
    type: 'print',
    name: 'Print',
    category: 'Debug',
    description: 'Prints a message to the output window.',
    description_vi: 'In một thông báo ra cửa sổ output.'
  },
  {
    type: 'warn',
    name: 'Warn',
    category: 'Debug',
    description: 'Prints a warning message to the output window in orange text.',
    description_vi: 'In một thông báo cảnh báo ra cửa sổ output với chữ màu cam.'
  },
  {
    type: 'run_lua',
    name: 'Run Lua',
    category: 'Debug',
    description: 'Executes raw Luau code directly.',
    description_vi: 'Chạy trực tiếp mã Luau thô.'
  },
  {
    type: 'sound_play',
    name: 'Play Sound',
    category: 'Sound',
    description: 'Plays a sound from a given Sound object or ID.',
    description_vi: 'Phát âm thanh từ một đối tượng Sound hoặc ID cho trước.'
  },
  {
    type: 'sound_stop',
    name: 'Stop Sound',
    category: 'Sound',
    description: 'Stops a playing sound.',
    description_vi: 'Dừng âm thanh đang phát.'
  },
  {
    type: 'instance_selector',
    name: 'Select Instance',
    category: 'Instance',
    description: 'Allows you to select an object from the Explorer.',
    description_vi: 'Cho phép bạn chọn một đối tượng từ Explorer.'
  },
  {
    type: 'lua_if',
    name: 'If Then',
    category: 'Logic',
    description: 'Executes blocks inside if the condition is true.',
    description_vi: 'Chạy các khối lệnh bên trong nếu điều kiện là đúng.'
  },
  {
    type: 'logic_negate',
    name: 'Not',
    category: 'Logic',
    description: 'Returns the opposite of a boolean value.',
    description_vi: 'Trả về giá trị ngược lại của một giá trị boolean.'
  },
  {
    type: 'logic_compare_eq',
    name: 'Equals',
    category: 'Logic',
    description: 'Checks if two values are equal.',
    description_vi: 'Kiểm tra xem hai giá trị có bằng nhau không.'
  },
  {
    type: 'wait',
    name: 'Wait',
    category: 'Loops',
    description: 'Pauses the script for a specified number of seconds.',
    description_vi: 'Tạm dừng script trong một số giây nhất định.'
  },
  {
    type: 'loops_while_lua',
    name: 'While Loop',
    category: 'Loops',
    description: 'Repeats blocks as long as the condition is true.',
    description_vi: 'Lặp lại các khối lệnh chừng nào điều kiện còn đúng.'
  },
  {
    type: 'loops_repeat_lua',
    name: 'Repeat Until',
    category: 'Loops',
    description: 'Repeats blocks until the condition becomes true.',
    description_vi: 'Lặp lại các khối lệnh cho đến khi điều kiện trở nên đúng.'
  },
  {
    type: 'loops_for_children',
    name: 'For Each Child',
    category: 'Loops',
    description: 'Iterates through all children of an object.',
    description_vi: 'Lặp qua tất cả các con của một đối tượng.'
  },
  {
    type: 'loops_for_descendants',
    name: 'For Each Descendant',
    category: 'Loops',
    description: 'Iterates through all descendants of an object.',
    description_vi: 'Lặp qua tất cả các hậu duệ của một đối tượng.'
  },
  {
    type: 'loops_break_lua',
    name: 'Break',
    category: 'Loops',
    description: 'Exits the current loop immediately.',
    description_vi: 'Thoát khỏi vòng lặp hiện tại ngay lập tức.'
  },
  {
    type: 'math_number',
    name: 'Number',
    category: 'Math',
    description: 'A number block.',
    description_vi: 'Một khối số.'
  },
  {
    type: 'math_arithmetic',
    name: 'Arithmetic',
    category: 'Math',
    description: 'Arithmetic operations.',
    description_vi: 'Các phép tính số học.'
  },
  {
    type: 'text',
    name: 'Text',
    category: 'Text',
    description: 'A text block.',
    description_vi: 'Một khối văn bản.'
  },
  {
    type: 'text_join',
    name: 'Join Text',
    category: 'Text',
    description: 'Joins text.',
    description_vi: 'Nối văn bản.'
  },
  { type: 'sound_play', name: 'Play Sound', category: 'Sound', description: 'Plays a sound.', description_vi: 'Phát âm thanh.' },
  { type: 'sound_stop', name: 'Stop Sound', category: 'Sound', description: 'Stops a sound.', description_vi: 'Dừng âm thanh.' },
  { type: 'sound_pause', name: 'Pause Sound', category: 'Sound', description: 'Pauses a sound.', description_vi: 'Tạm dừng âm thanh.' },
  { type: 'sound_soundid', name: 'SoundId', category: 'Sound', description: 'Sets SoundId.', description_vi: 'Đặt SoundId.' },
  { type: 'sound_volume', name: 'Volume', category: 'Sound', description: 'Sets Volume.', description_vi: 'Đặt âm lượng.' },
  { type: 'sound_looped', name: 'Looped', category: 'Sound', description: 'Sets Looped.', description_vi: 'Đặt lặp lại.' },
  { type: 'sound_playing', name: 'Playing', category: 'Sound', description: 'Sets Playing.', description_vi: 'Đặt trạng thái phát.' },
  { type: 'sound_playbackspeed', name: 'Playback Speed', category: 'Sound', description: 'Sets Playback Speed.', description_vi: 'Đặt tốc độ phát.' },
  { type: 'sound_timeposition', name: 'Time Position', category: 'Sound', description: 'Sets Time Position.', description_vi: 'Đặt vị trí thời gian.' },
  { type: 'sound_ended', name: 'On Sound Ended', category: 'Sound', description: 'On sound ended.', description_vi: 'Khi âm thanh kết thúc.' },
  { type: 'datastore_setup', name: 'Setup Datastore', category: 'Datastore', description: 'Setup Datastore', description_vi: 'Cài đặt Datastore' },
  { type: 'datastore_instance', name: 'Datastore Instance', category: 'Datastore', description: 'Datastore Instance', description_vi: 'Đối tượng Datastore' },
  { type: 'datastore_use', name: 'Use Datastore', category: 'Datastore', description: 'Use Datastore', description_vi: 'Sử dụng Datastore' },
  { type: 'datastore_get', name: 'Get Data', category: 'Datastore', description: 'Get Data', description_vi: 'Lấy dữ liệu' },
  { type: 'datastore_save', name: 'Save Data', category: 'Datastore', description: 'Save Data', description_vi: 'Lưu dữ liệu' },
  { type: 'world_game', name: 'Game', category: 'World', description: 'Game', description_vi: 'Game' },
  { type: 'world_workspace', name: 'Workspace', category: 'World', description: 'Workspace', description_vi: 'Workspace' },
  { type: 'world_me', name: 'Me', category: 'World', description: 'Me', description_vi: 'Tôi' },
  { type: 'world_this_script', name: 'This Script', category: 'World', description: 'This Script', description_vi: 'Script này' },
  { type: 'world_instance', name: 'Instance', category: 'World', description: 'Instance', description_vi: 'Đối tượng' },
  { type: 'world_get_instance_by_path', name: 'Get Instance By Path', category: 'World', description: 'Get Instance By Path', description_vi: 'Lấy đối tượng theo đường dẫn' },
  { type: 'world_set_property', name: 'Set Property', category: 'World', description: 'Set Property', description_vi: 'Đặt thuộc tính' },
  { type: 'world_get_property', name: 'Get Property', category: 'World', description: 'Get Property', description_vi: 'Lấy thuộc tính' },
  { type: 'world_set_property_direct', name: 'Set Property Direct', category: 'World', description: 'Set Property Direct', description_vi: 'Đặt thuộc tính trực tiếp' },
  { type: 'world_get_property_direct', name: 'Get Property Direct', category: 'World', description: 'Get Property Direct', description_vi: 'Lấy thuộc tính trực tiếp' },
  { type: 'world_find_first_child', name: 'Find First Child', category: 'World', description: 'Find First Child', description_vi: 'Tìm con đầu tiên' },
  { type: 'world_find_first_child_direct', name: 'Find First Child Direct', category: 'World', description: 'Find First Child Direct', description_vi: 'Tìm con đầu tiên trực tiếp' },
  { type: 'world_create_instance_direct', name: 'Create Instance Direct', category: 'World', description: 'Create Instance Direct', description_vi: 'Tạo đối tượng trực tiếp' },
  { type: 'world_vector3', name: 'Vector3', category: 'World', description: 'Vector3', description_vi: 'Vector3' },
  { type: 'world_vector3_values', name: 'Vector3 Values', category: 'World', description: 'Vector3 Values', description_vi: 'Giá trị Vector3' },
  { type: 'world_color3', name: 'Color3', category: 'World', description: 'Color3', description_vi: 'Color3' },
  { type: 'world_color3_values', name: 'Color3 Values', category: 'World', description: 'Color3 Values', description_vi: 'Giá trị Color3' },
  { type: 'event_game_loaded', name: 'Game Loaded', category: 'Events', description: 'Triggers when the game has finished loading.', description_vi: 'Kích hoạt khi trò chơi đã tải xong.' },
  { type: 'event_player_joined', name: 'Player Joined', category: 'Events', description: 'Triggers when a player joins the game.', description_vi: 'Kích hoạt khi một người chơi tham gia trò chơi.' },
  { type: 'event_player_left', name: 'Player Left', category: 'Events', description: 'Triggers when a player leaves the game.', description_vi: 'Kích hoạt khi một người chơi rời khỏi trò chơi.' },
  { type: 'event_character_added', name: 'Character Added', category: 'Events', description: 'Triggers when a character is added to a player.', description_vi: 'Kích hoạt khi một nhân vật được thêm vào một người chơi.' },
  { type: 'event_character_removing', name: 'Character Removing', category: 'Events', description: 'Triggers when a character is being removed.', description_vi: 'Kích hoạt khi một nhân vật đang bị xóa.' },
  { type: 'event_touched', name: 'Touched', category: 'Events', description: 'Triggers when an object is touched.', description_vi: 'Kích hoạt khi một đối tượng được chạm vào.' },
  { type: 'event_touch_ended', name: 'Touch Ended', category: 'Events', description: 'Triggers when a touch ends.', description_vi: 'Kích hoạt khi một lần chạm kết thúc.' },
  { type: 'event_child_added', name: 'Child Added', category: 'Events', description: 'Triggers when a child is added to an object.', description_vi: 'Kích hoạt khi một đối tượng con được thêm vào.' },
  { type: 'event_child_removed', name: 'Child Removed', category: 'Events', description: 'Triggers when a child is removed from an object.', description_vi: 'Kích hoạt khi một đối tượng con bị xóa.' },
  { type: 'event_property_changed', name: 'Property Changed', category: 'Events', description: 'Triggers when a property of an object changes.', description_vi: 'Kích hoạt khi một thuộc tính của đối tượng thay đổi.' },
  { type: 'event_proximity_prompt_triggered', name: 'Proximity Prompt Triggered', category: 'Events', description: 'Triggers when a ProximityPrompt is triggered.', description_vi: 'Kích hoạt khi một ProximityPrompt được kích hoạt.' },
  { type: 'event_tool_equipped', name: 'Tool Equipped', category: 'Events', description: 'Triggers when a tool is equipped.', description_vi: 'Kích hoạt khi một công cụ được trang bị.' },
  { type: 'event_tool_unequipped', name: 'Tool Unequipped', category: 'Events', description: 'Triggers when a tool is unequipped.', description_vi: 'Kích hoạt khi một công cụ bị bỏ trang bị.' },
  { type: 'event_humanoid_died', name: 'Humanoid Died', category: 'Events', description: 'Triggers when a humanoid dies.', description_vi: 'Kích hoạt khi một humanoid chết.' },
  { type: 'event_humanoid_jumping', name: 'Humanoid Jumping', category: 'Events', description: 'Triggers when a humanoid jumps.', description_vi: 'Kích hoạt khi một humanoid nhảy.' },
  { type: 'event_humanoid_running', name: 'Humanoid Running', category: 'Events', description: 'Triggers when a humanoid runs.', description_vi: 'Kích hoạt khi một humanoid chạy.' },
  { type: 'event_heartbeat', name: 'Heartbeat', category: 'Events', description: 'Triggers every frame after physics simulation.', description_vi: 'Kích hoạt mỗi khung hình sau khi mô phỏng vật lý.' },
  { type: 'event_render_stepped', name: 'Render Stepped', category: 'Events', description: 'Triggers every frame before rendering.', description_vi: 'Kích hoạt mỗi khung hình trước khi hiển thị.' },
  { type: 'event_stepped', name: 'Stepped', category: 'Events', description: 'Triggers every frame during physics simulation.', description_vi: 'Kích hoạt mỗi khung hình trong khi mô phỏng vật lý.' },
  { type: 'event_chat_message_received', name: 'Chat Message Received', category: 'Events', description: 'Triggers when a chat message is received.', description_vi: 'Kích hoạt khi nhận được tin nhắn chat.' },
  { type: 'event_attribute_changed', name: 'Attribute Changed', category: 'Events', description: 'Triggers when an attribute of an object changes.', description_vi: 'Kích hoạt khi một thuộc tính (attribute) của đối tượng thay đổi.' },
  { type: 'player_get_by_name', name: 'Get Player', category: 'Player', description: 'Get player by name.', description_vi: 'Lấy người chơi theo tên.' },
  { type: 'player_kick', name: 'Kick Player', category: 'Player', description: 'Kick player.', description_vi: 'Đá người chơi.' },
  { type: 'player_joined', name: 'Player Joined', category: 'Player', description: 'Player joined.', description_vi: 'Người chơi tham gia.' },
  { type: 'player_leaving', name: 'Player Leaving', category: 'Player', description: 'Player leaving.', description_vi: 'Người chơi rời đi.' },
  { type: 'player_get_user_id', name: 'User ID', category: 'Player', description: 'Get user ID.', description_vi: 'Lấy ID người dùng.' },
  { type: 'player_chat_added', name: 'Player Chat', category: 'Player', description: 'Player chat.', description_vi: 'Chat người chơi.' },
  { type: 'player_respawned', name: 'Player Respawned', category: 'Player', description: 'Player respawned.', description_vi: 'Người chơi hồi sinh.' },
  { type: 'variables_get', name: 'Get Variable', category: 'Variables', description: 'Get variable.', description_vi: 'Lấy biến.' },
  { type: 'variables_set', name: 'Set Variable', category: 'Variables', description: 'Set variable.', description_vi: 'Đặt biến.' },
  { type: 'procedures_callnoreturn', name: 'Call Function', category: 'Functions', description: 'Call function.', description_vi: 'Gọi hàm.' },
  { type: 'procedures_defnoreturn', name: 'Define Function', category: 'Functions', description: 'Define function.', description_vi: 'Định nghĩa hàm.' },
  // --- Camera Blocks ---
  { type: 'camera_get_current', name: 'Get Current Camera', category: 'Camera', description: 'Returns the current workspace camera.', description_vi: 'Lấy camera hiện tại của workspace.' },
  { type: 'camera_set_type', name: 'Set Camera Type', category: 'Camera', description: 'Sets the camera type.', description_vi: 'Đặt kiểu camera.' },
  { type: 'camera_set_subject', name: 'Set Camera Subject', category: 'Camera', description: 'Sets the object the camera should follow.', description_vi: 'Đặt đối tượng camera theo dõi.' },
  { type: 'camera_set_cframe', name: 'Set Camera CFrame', category: 'Camera', description: 'Sets the camera position and orientation.', description_vi: 'Đặt vị trí và hướng của camera.' },
  { type: 'camera_get_cframe', name: 'Get Camera CFrame', category: 'Camera', description: 'Returns the current camera CFrame.', description_vi: 'Lấy CFrame hiện tại của camera.' },
  { type: 'camera_move_to', name: 'Move Camera To', category: 'Camera', description: 'Moves the camera to a specific position.', description_vi: 'Di chuyển camera đến một vị trí.' },
  { type: 'camera_look_at', name: 'Camera Look At', category: 'Camera', description: 'Makes the camera look at a specific target.', description_vi: 'Làm camera nhìn vào một mục tiêu.' },
  { type: 'camera_shake', name: 'Shake Camera', category: 'Camera', description: 'Shakes the camera for a duration.', description_vi: 'Rung camera trong một khoảng thời gian.' },
  { type: 'camera_zoom', name: 'Zoom Camera', category: 'Camera', description: 'Zooms the camera.', description_vi: 'Phóng to/thu nhỏ camera.' },
  { type: 'camera_set_fov', name: 'Set Field Of View', category: 'Camera', description: 'Sets the camera FieldOfView.', description_vi: 'Đặt FieldOfView của camera.' },
  { type: 'camera_get_fov', name: 'Get Field Of View', category: 'Camera', description: 'Returns the current camera FieldOfView.', description_vi: 'Lấy FieldOfView hiện tại của camera.' },
  { type: 'camera_follow_player', name: 'Camera Follow Player', category: 'Camera', description: 'Makes the camera follow a specific player.', description_vi: 'Làm camera theo dõi một người chơi.' },
  { type: 'camera_scriptable', name: 'Camera Scriptable Mode', category: 'Camera', description: 'Sets camera to scriptable mode.', description_vi: 'Đặt camera sang chế độ scriptable.' },
  { type: 'camera_reset', name: 'Reset Camera', category: 'Camera', description: 'Resets the camera to default settings.', description_vi: 'Đặt lại camera về mặc định.' },

  // --- Animation Blocks ---
  { type: 'animation_load', name: 'Load Animation', category: 'Animation', description: 'Loads an animation onto a humanoid.', description_vi: 'Tải một hoạt ảnh lên humanoid.' },
  { type: 'animation_play', name: 'Play Animation', category: 'Animation', description: 'Plays an animation track.', description_vi: 'Phát một track hoạt ảnh.' },
  { type: 'animation_stop', name: 'Stop Animation', category: 'Animation', description: 'Stops an animation track.', description_vi: 'Dừng một track hoạt ảnh.' },
  { type: 'animation_pause', name: 'Pause Animation', category: 'Animation', description: 'Pauses an animation track.', description_vi: 'Tạm dừng một track hoạt ảnh.' },
  { type: 'animation_adjust_speed', name: 'Adjust Animation Speed', category: 'Animation', description: 'Adjusts the playback speed.', description_vi: 'Điều chỉnh tốc độ phát.' },
  { type: 'animation_adjust_weight', name: 'Adjust Animation Weight', category: 'Animation', description: 'Adjusts the weight of an animation.', description_vi: 'Điều chỉnh trọng số của hoạt ảnh.' },
  { type: 'animation_get_playing', name: 'Get Playing Animations', category: 'Animation', description: 'Returns playing animation tracks.', description_vi: 'Lấy các track hoạt ảnh đang phát.' },
  { type: 'animation_stopped_event', name: 'Animation Stopped', category: 'Animation', description: 'Event triggered when an animation stops.', description_vi: 'Sự kiện khi hoạt ảnh dừng.' },
  { type: 'animation_played_event', name: 'Animation Played', category: 'Animation', description: 'Event triggered when an animation starts playing.', description_vi: 'Sự kiện khi hoạt ảnh bắt đầu phát.' },
  { type: 'animation_set_priority', name: 'Set Animation Priority', category: 'Animation', description: 'Sets the priority of an animation track.', description_vi: 'Đặt mức ưu tiên của track hoạt ảnh.' },
  { type: 'animation_get_length', name: 'Get Animation Length', category: 'Animation', description: 'Returns the length of an animation track.', description_vi: 'Lấy độ dài của track hoạt ảnh.' },
  { type: 'animation_is_playing', name: 'Is Animation Playing', category: 'Animation', description: 'Returns whether an animation track is playing.', description_vi: 'Kiểm tra xem track hoạt ảnh có đang phát không.' },

  // --- Effects Blocks ---
  { type: 'effects_create_particle', name: 'Create Particle', category: 'Effects', description: 'Creates a new particle emitter.', description_vi: 'Tạo một particle emitter mới.' },
  { type: 'effects_emit_particles', name: 'Emit Particles', category: 'Effects', description: 'Emits a number of particles.', description_vi: 'Phát ra một số lượng hạt.' },
  { type: 'effects_stop_particles', name: 'Stop Particles', category: 'Effects', description: 'Stops a particle emitter.', description_vi: 'Dừng particle emitter.' },
  { type: 'effects_create_explosion', name: 'Create Explosion', category: 'Effects', description: 'Creates an explosion at a position.', description_vi: 'Tạo một vụ nổ tại một vị trí.' },
  { type: 'effects_create_highlight', name: 'Create Highlight', category: 'Effects', description: 'Creates a highlight effect.', description_vi: 'Tạo hiệu ứng highlight.' },
  { type: 'effects_enable_highlight', name: 'Enable Highlight', category: 'Effects', description: 'Enables a highlight effect.', description_vi: 'Bật hiệu ứng highlight.' },
  { type: 'effects_disable_highlight', name: 'Disable Highlight', category: 'Effects', description: 'Disables a highlight effect.', description_vi: 'Tắt hiệu ứng highlight.' },
  { type: 'effects_create_beam', name: 'Create Beam', category: 'Effects', description: 'Creates a beam between two parts.', description_vi: 'Tạo một chùm tia giữa hai phần.' },
  { type: 'effects_create_trail', name: 'Create Trail', category: 'Effects', description: 'Creates a trail effect.', description_vi: 'Tạo hiệu ứng trail.' },
  { type: 'effects_play_sound', name: 'Play Sound', category: 'Effects', description: 'Plays a sound object.', description_vi: 'Phát một đối tượng âm thanh.' },
  { type: 'effects_stop_sound', name: 'Stop Sound', category: 'Effects', description: 'Stops a sound object.', description_vi: 'Dừng một đối tượng âm thanh.' },
  { type: 'effects_set_sound_volume', name: 'Set Sound Volume', category: 'Effects', description: 'Sets the volume of a sound.', description_vi: 'Đặt âm lượng của âm thanh.' },
  { type: 'effects_set_sound_pitch', name: 'Set Sound Pitch', category: 'Effects', description: 'Sets the pitch of a sound.', description_vi: 'Đặt độ cao của âm thanh.' },
  { type: 'effects_create_tween', name: 'Create Tween', category: 'Effects', description: 'Creates a tween for an object.', description_vi: 'Tạo một tween cho đối tượng.' },
  { type: 'effects_play_tween', name: 'Play Tween', category: 'Effects', description: 'Plays a tween.', description_vi: 'Chạy một tween.' },
  { type: 'effects_stop_tween', name: 'Stop Tween', category: 'Effects', description: 'Stops a tween.', description_vi: 'Dừng một tween.' },
  { type: 'effects_camera_shake', name: 'Camera Shake', category: 'Effects', description: 'Applies a shake effect to the camera.', description_vi: 'Áp dụng hiệu ứng rung cho camera.' },
  { type: 'effects_flash_screen', name: 'Flash Screen', category: 'Effects', description: 'Flashes the screen with a color.', description_vi: 'Làm màn hình nháy một màu.' },
  { type: 'effects_blur', name: 'Blur', category: 'Effects', description: 'Applies a blur effect.', description_vi: 'Áp dụng hiệu ứng làm mờ.' },
  { type: 'effects_color_correction', name: 'Color Correction', category: 'Effects', description: 'Applies color correction.', description_vi: 'Áp dụng hiệu chỉnh màu sắc.' },
];

import { getCategoryColor } from './colors';

export const allAvailableCategories = [
  { id: 'Comment', name: 'Comment', name_vi: 'Chú thích', color: getCategoryColor('Comment'), icon: 'MessageSquare' },
  { id: 'Debug', name: 'Debug', name_vi: 'Gỡ lỗi', color: getCategoryColor('Debug'), icon: 'Bug' },
  { id: 'Sound', name: 'Sound', name_vi: 'Âm thanh', color: getCategoryColor('Sound'), icon: 'Volume2' },
  { id: 'Instance', name: 'Instance', name_vi: 'Đối tượng', color: getCategoryColor('Instance'), icon: 'Box' },
  { id: 'Logic', name: 'Logic', name_vi: 'Logic', color: getCategoryColor('Logic'), icon: 'GitBranch' },
  { id: 'Loops', name: 'Loops', name_vi: 'Vòng lặp', color: getCategoryColor('Loops'), icon: 'Repeat' },
  { id: 'Math', name: 'Math', name_vi: 'Toán học', color: getCategoryColor('Math'), icon: 'Plus' },
  { id: 'Text', name: 'Text', name_vi: 'Văn bản', color: getCategoryColor('Text'), icon: 'Type' },
  { id: 'Values', name: 'Values', name_vi: 'Giá trị', color: getCategoryColor('Values'), icon: 'Hash' },
  { id: 'Variables', name: 'Variables', name_vi: 'Biến', color: getCategoryColor('Variables'), icon: 'Variable' },
  { id: 'Lists', name: 'Lists', name_vi: 'Danh sách', color: getCategoryColor('Lists'), icon: 'List' },
  { id: 'World', name: 'World', name_vi: 'Thế giới', color: getCategoryColor('World'), icon: 'Globe' },
  { id: 'Part', name: 'Part', name_vi: 'Part', color: getCategoryColor('Part'), icon: 'Square' },
  { id: 'Character', name: 'Character', name_vi: 'Nhân vật', color: getCategoryColor('Character'), icon: 'User' },
  { id: 'Model', name: 'Model', name_vi: 'Model', color: getCategoryColor('Model'), icon: 'Package' },
  { id: 'Gui', name: 'Gui', name_vi: 'Giao diện', color: getCategoryColor('Gui'), icon: 'Layout' },
  { id: 'Player', name: 'Player', name_vi: 'Người chơi', color: getCategoryColor('Player'), icon: 'Users' },
  { id: 'Clickdetector', name: 'Clickdetector', name_vi: 'ClickDetector', color: getCategoryColor('Clickdetector'), icon: 'MousePointer' },
  { id: 'Marketplace', name: 'Marketplace', name_vi: 'Cửa hàng', color: getCategoryColor('Marketplace'), icon: 'ShoppingCart' },
  { id: 'Tweening', name: 'Tweening', name_vi: 'Hiệu ứng', color: getCategoryColor('Tweening'), icon: 'Move' },
  { id: 'Client', name: 'Client', name_vi: 'Client', color: getCategoryColor('Client'), icon: 'Monitor' },
  { id: 'Server', name: 'Server', name_vi: 'Server', color: getCategoryColor('Server'), icon: 'Server' },
  { id: 'Leaderstats', name: 'Leaderstats', name_vi: 'Bảng điểm', color: getCategoryColor('Leaderstats'), icon: 'Trophy' },
  { id: 'Functions', name: 'Functions', name_vi: 'Hàm', color: getCategoryColor('Functions'), icon: 'Code' },
  { id: 'Datastore', name: 'Datastore', name_vi: 'Dữ liệu', color: getCategoryColor('Datastore'), icon: 'Database' },
  { id: 'Roblox Services', name: 'Roblox Services', name_vi: 'Dịch vụ Roblox', color: getCategoryColor('Roblox Services'), icon: 'Layers' },
  { id: 'Events', name: 'Events', name_vi: 'Sự kiện', color: getCategoryColor('Events'), icon: 'Zap' },
  { id: 'Animation', name: 'Animation', name_vi: 'Hoạt ảnh', color: getCategoryColor('Animation'), icon: 'Play' },
  { id: 'Camera', name: 'Camera', name_vi: 'Camera', color: getCategoryColor('Camera'), icon: 'Camera' },
  { id: 'Effects', name: 'Effects', name_vi: 'Hiệu ứng', color: getCategoryColor('Effects'), icon: 'Sparkles' },
  { id: 'Physics', name: 'Physics', name_vi: 'Vật lý', color: getCategoryColor('Physics'), icon: 'Cpu' },
  { id: 'Raycast', name: 'Raycast', name_vi: 'Raycast', color: getCategoryColor('Raycast'), icon: 'Search' },
  { id: 'Pathfinding', name: 'Pathfinding', name_vi: 'Tìm đường', color: getCategoryColor('Pathfinding'), icon: 'Map' },
  { id: 'Teleport', name: 'Teleport', name_vi: 'Dịch chuyển', color: getCategoryColor('Teleport'), icon: 'MapPin' },
  { id: 'Collection', name: 'Collection', name_vi: 'Bộ sưu tập', color: getCategoryColor('Collection'), icon: 'Tag' },
  { id: 'RunService', name: 'RunService', name_vi: 'RunService', color: getCategoryColor('RunService'), icon: 'RefreshCw' },
  { id: 'Lighting', name: 'Lighting', name_vi: 'Ánh sáng', color: getCategoryColor('Lighting'), icon: 'Sun' },
];
