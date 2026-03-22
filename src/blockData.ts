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

export const allAvailableCategories = [
  { id: 'Comment', name: 'Comment', name_vi: 'Chú thích', color: '#999999', icon: 'MessageSquare' },
  { id: 'Debug', name: 'Debug', name_vi: 'Gỡ lỗi', color: '#ff8c1a', icon: 'Bug' },
  { id: 'Sound', name: 'Sound', name_vi: 'Âm thanh', color: '#59c059', icon: 'Volume2' },
  { id: 'RemoteEvent', name: 'RemoteEvent', name_vi: 'Sự kiện', color: '#ffab19', icon: 'Zap' },
  { id: 'Instance', name: 'Instance', name_vi: 'Đối tượng', color: '#6600ff', icon: 'Box' },
  { id: 'Logic', name: 'Logic', name_vi: 'Logic', color: '#4c97ff', icon: 'GitBranch' },
  { id: 'Loops', name: 'Loops', name_vi: 'Vòng lặp', color: '#48a868', icon: 'Repeat' },
  { id: 'Math', name: 'Math', name_vi: 'Toán học', color: '#59c059', icon: 'Plus' },
  { id: 'Text', name: 'Text', name_vi: 'Văn bản', color: '#ffab19', icon: 'Type' },
  { id: 'Values', name: 'Values', name_vi: 'Giá trị', color: '#4cbfe6', icon: 'Hash' },
  { id: 'Variables', name: 'Variables', name_vi: 'Biến', color: '#ff661a', icon: 'Variable' },
  { id: 'Lists', name: 'Lists', name_vi: 'Danh sách', color: '#cf142b', icon: 'List' },
  { id: 'World', name: 'World', name_vi: 'Thế giới', color: '#4c97ff', icon: 'Globe' },
  { id: 'Part', name: 'Part', name_vi: 'Part', color: '#4d4d4d', icon: 'Square' },
  { id: 'Character', name: 'Character', name_vi: 'Nhân vật', color: '#ff3355', icon: 'User' },
  { id: 'Model', name: 'Model', name_vi: 'Model', color: '#9966ff', icon: 'Package' },
  { id: 'Gui', name: 'Gui', name_vi: 'Giao diện', color: '#cf63cf', icon: 'Layout' },
  { id: 'Player', name: 'Player', name_vi: 'Người chơi', color: '#0fbd8c', icon: 'Users' },
  { id: 'Clickdetector', name: 'Clickdetector', name_vi: 'ClickDetector', color: '#ff8c1a', icon: 'MousePointer' },
  { id: 'Marketplace', name: 'Marketplace', name_vi: 'Cửa hàng', color: '#4c97ff', icon: 'ShoppingCart' },
  { id: 'Tweening', name: 'Tweening', name_vi: 'Hiệu ứng', color: '#59c059', icon: 'Move' },
  { id: 'Client', name: 'Client', name_vi: 'Client', color: '#ffab19', icon: 'Monitor' },
  { id: 'Server', name: 'Server', name_vi: 'Server', color: '#40bf4a', icon: 'Server' },
  { id: 'Leaderstats', name: 'Leaderstats', name_vi: 'Bảng điểm', color: '#ff8c1a', icon: 'Trophy' },
  { id: 'Functions', name: 'Functions', name_vi: 'Hàm', color: '#ff661a', icon: 'Code' },
  { id: 'Datastore', name: 'Datastore', name_vi: 'Dữ liệu', color: '#4c97ff', icon: 'Database' },
];
