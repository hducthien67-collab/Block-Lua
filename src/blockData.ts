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
    type: 'remote_fire_server',
    name: 'Fire Server',
    category: 'RemoteEvent',
    description: 'Sends a signal from the client to the server via a RemoteEvent.',
    description_vi: 'Gửi một tín hiệu từ client lên server thông qua RemoteEvent.'
  },
  {
    type: 'remote_on_server_event',
    name: 'On Server Event',
    category: 'RemoteEvent',
    description: 'Listens for a signal from the client on the server.',
    description_vi: 'Lắng nghe tín hiệu từ client trên server.'
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
  }
];

import { getCategoryColor } from './colors';

export const allAvailableCategories = [
  { id: 'Comment', name: 'Comment', name_vi: 'Chú thích', color: getCategoryColor('Comment'), icon: 'MessageSquare' },
  { id: 'Debug', name: 'Debug', name_vi: 'Gỡ lỗi', color: getCategoryColor('Debug'), icon: 'Bug' },
  { id: 'Sound', name: 'Sound', name_vi: 'Âm thanh', color: getCategoryColor('Sound'), icon: 'Volume2' },
  { id: 'RemoteEvent', name: 'RemoteEvent', name_vi: 'Sự kiện', color: getCategoryColor('RemoteEvent'), icon: 'Radio' },
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
  { id: 'Input', name: 'Input', name_vi: 'Đầu vào', color: getCategoryColor('Input'), icon: 'MousePointer2' },
  { id: 'Camera', name: 'Camera', name_vi: 'Máy ảnh', color: getCategoryColor('Camera'), icon: 'Video' },
  { id: 'Animation', name: 'Animation', name_vi: 'Hoạt ảnh', color: getCategoryColor('Animation'), icon: 'Play' },
  { id: 'Physics', name: 'Physics', name_vi: 'Vật lý', color: getCategoryColor('Physics'), icon: 'Cpu' },
  { id: 'Raycast', name: 'Raycast', name_vi: 'Raycast', color: getCategoryColor('Raycast'), icon: 'Search' },
  { id: 'Pathfinding', name: 'Pathfinding', name_vi: 'Tìm đường', color: getCategoryColor('Pathfinding'), icon: 'Map' },
  { id: 'Teleport', name: 'Teleport', name_vi: 'Dịch chuyển', color: getCategoryColor('Teleport'), icon: 'MapPin' },
  { id: 'Collection', name: 'Collection', name_vi: 'Bộ sưu tập', color: getCategoryColor('Collection'), icon: 'Tag' },
  { id: 'RunService', name: 'RunService', name_vi: 'RunService', color: getCategoryColor('RunService'), icon: 'RefreshCw' },
  { id: 'Lighting', name: 'Lighting', name_vi: 'Ánh sáng', color: getCategoryColor('Lighting'), icon: 'Sun' },
  { id: 'Effects', name: 'Effects', name_vi: 'Hiệu ứng', color: getCategoryColor('Effects'), icon: 'Sparkles' },
];
