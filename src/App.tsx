/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly';
import { luaGenerator, Order } from 'blockly/lua';

class CustomZelosConstantProvider extends Blockly.zelos.ConstantProvider {
  constructor() {
    super();
    this.FIELD_TEXT_FONTSIZE = 14;
    this.FIELD_TEXT_HEIGHT = 20;
    this.FIELD_TEXT_FONTWEIGHT = '500';
  }
  shapeFor(connection: Blockly.RenderedConnection) {
    const shape = super.shapeFor(connection);
    if (shape === this.HEXAGONAL) {
      return this.ROUNDED;
    }
    return shape;
  }
}

class CustomZelosRenderer extends Blockly.zelos.Renderer {
  makeConstants_() {
    return new CustomZelosConstantProvider();
  }
}

Blockly.blockRendering.register('custom_zelos', CustomZelosRenderer);

import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  CheckCircle2, 
  CheckCircle,
  AlertCircle,
  Code2, 
  Layers, 
  Play, 
  Save, 
  Trash2, 
  Plus,
  Server,
  MessageSquare,
  X,
  Info,
  ChevronRight,
  Sparkles,
  MousePointer2,
  Cpu,
  Globe,
  AlertTriangle,
  Settings,
  Monitor,
  Search,
  RefreshCw,
  Copy,
  FileCode2,
  Download,
  History,
  PlayCircle,
  Library,
  Smartphone,
  LayoutDashboard,
  HelpCircle,
  Eye,
  Edit3,
  Box,
  Wrench,
  Music,
  User,
  Moon,
  Zap,
  Trophy,
  Database,
  Terminal,
  Mail,
  Lock,
  LogIn,
  UserPlus
} from 'lucide-react';
import * as luaparse from 'luaparse';
import { useExplorer } from './explorer';
import { ExplorerTree, getIcon } from './components/Explorer/Explorer';
import { InsertObjectMenu } from './components/Explorer/InsertObjectMenu';
import * as blocks from './blocks';
import { defineCustomGenerators } from './generators';
import { toolbox } from './toolbox';
import { getCategoryColor } from './colors';
import { serviceGroups } from './serviceBlocks';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
const Type = { OBJECT: 'object', STRING: 'string', NUMBER: 'number' };
import { auth, db, googleProvider, OperationType, handleFirestoreError } from './firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  Timestamp,
  writeBatch
} from 'firebase/firestore';

const CATEGORIES = [
  { name: 'Comment' },
  { name: 'Debug' },
  { name: 'Logic' },
  { name: 'Math' },
  { name: 'Text' },
  { name: 'Sound' },
  { name: 'Values' },
  { name: 'Variables' },
  { name: 'Lists' },
  { name: 'Loops' },
  { name: 'World' },
  { name: 'Instance' },
  { name: 'Part' },
  { name: 'Character' },
  { name: 'Model' },
  { name: 'Raycast' },
  { name: 'GUI' },
  { name: 'ClickDetector' },
  { name: 'Marketplace' },
  { name: 'Tweening' },
  { name: 'Client' },
  { name: 'Server' },
  { name: 'Leaderstats' },
  { name: 'Datastore' },
  { name: 'Functions' },
  { name: 'Events' },
  { name: 'Animation' },
  { name: 'Input' },
  { name: 'Camera' },
  { name: 'Effects' },
  { name: 'Optimization' },
  { name: 'AdService' },
  { name: 'AnalyticsService' },
  { name: 'AnimationClipProvider' },
  { name: 'AssetService' },
  { name: 'AvatarEditorService' },
  { name: 'BadgeService' },
  { name: 'BrowserService' },
  { name: 'ChangeHistoryService' },
  { name: 'Chat' },
  { name: 'CollectionService' },
  { name: 'ContentProvider' },
  { name: 'ContextActionService' },
  { name: 'ControllerService' },
  { name: 'CoreGui' },
  { name: 'CorePackages' },
  { name: 'CSGDictionaryService' },
  { name: 'DataStoreService' },
  { name: 'Debris' },
  { name: 'DebuggerManager' },
  { name: 'DeviceService' },
  { name: 'FriendService' },
  { name: 'GamepadService' },
  { name: 'Geometry' },
  { name: 'GroupService' },
  { name: 'GuiService' },
  { name: 'HapticService' },
  { name: 'HttpService' },
  { name: 'InsertService' },
  { name: 'JointsService' },
  { name: 'KeyframeSequenceProvider' },
  { name: 'LanguageService' },
  { name: 'Lighting' },
  { name: 'LocalizationService' },
  { name: 'LogService' },
  { name: 'LuaSettings' },
  { name: 'MarketplaceService' },
  { name: 'MaterialService' },
  { name: 'MemoryStoreService' },
  { name: 'MessagingService' },
  { name: 'NetworkClient' },
  { name: 'NetworkServer' },
  { name: 'NotificationService' },
  { name: 'PathfindingService' },
  { name: 'PhysicsService' },
  { name: 'Players' },
  { name: 'PluginDebugService' },
  { name: 'PluginGuiService' },
  { name: 'PointsService' },
  { name: 'PolicyService' },
  { name: 'ProximityPromptService' },
  { name: 'ReplicatedFirst' },
  { name: 'ReplicatedStorage' },
  { name: 'RunService' },
  { name: 'ScriptContext' },
  { name: 'Selection' },
  { name: 'ServerScriptService' },
  { name: 'ServerStorage' },
  { name: 'SoundService' },
  { name: 'StarterGui' },
  { name: 'StarterPack' },
  { name: 'StarterPlayer' },
  { name: 'Stats' },
  { name: 'StudioData' },
  { name: 'Teams' },
  { name: 'TeleportService' },
  { name: 'TestService' },
  { name: 'TextChatService' },
  { name: 'TextService' },
  { name: 'TweenService' },
  { name: 'UserGameSettings' },
  { name: 'UserInputService' },
  { name: 'VRService' },
  { name: 'Workspace' },
].map((cat) => ({
  ...cat,
  color: getCategoryColor(cat.name)
}));

const BlocklyPreview = React.memo(({ blockType }: { blockType: string }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!previewRef.current) return;

    // Clean up previous workspace
    if (workspaceRef.current) {
      try {
        workspaceRef.current.dispose();
      } catch (e) {
        console.warn("Error disposing workspace:", e);
      }
      workspaceRef.current = null;
    }

    // Inject new read-only workspace
    workspaceRef.current = Blockly.inject(previewRef.current, {
      readOnly: true,
      sounds: false,
      scrollbars: false,
      trashcan: false,
      renderer: 'custom_zelos',
      move: {
        scrollbars: false,
        drag: false,
        wheel: false
      },
      theme: Blockly.Theme.defineTheme('previewTheme', {
        name: 'previewTheme',
        base: Blockly.Themes.Classic,
        componentStyles: {
          workspaceBackgroundColour: 'transparent',
          toolboxBackgroundColour: 'transparent',
          toolboxForegroundColour: '#fff',
          flyoutBackgroundColour: '#252526',
          flyoutForegroundColour: '#ccc',
          flyoutOpacity: 1,
          scrollbarColour: '#797979',
          insertionMarkerColour: '#fff',
          insertionMarkerOpacity: 0.3,
          scrollbarOpacity: 0.4,
          cursorColour: '#d0d0d0'
        }
      })
    });

    // Create the block
    try {
      const block = workspaceRef.current.newBlock(blockType);
      block.initSvg();
      block.render();

      // Center the block
      const metrics = workspaceRef.current.getMetrics();
      const blockMetrics = block.getBoundingRectangle();
      
      const width = blockMetrics.right - blockMetrics.left;
      const height = blockMetrics.bottom - blockMetrics.top;
      
      const x = (metrics.viewWidth - width) / 2;
      const y = (metrics.viewHeight - height) / 2;
      
      block.moveBy(x, y);
    } catch (e) {
      console.error("Failed to render preview block:", e);
    }

    return () => {
      if (workspaceRef.current) {
        try {
          workspaceRef.current.dispose();
        } catch (e) {
          console.warn("Error disposing workspace:", e);
        }
        workspaceRef.current = null;
      }
    };
  }, [blockType]);

  return <div ref={previewRef} className="w-full h-full" />;
});

const getBlockDescription = (block: any, lang: string) => {
  const type = block.type.toLowerCase();
  const name = block.name;
  
  // Variables Custom
  if (type.startsWith('variables_')) {
    if (type.includes('create')) {
      return lang === 'vi'
        ? "Khởi tạo một biến mới và gán giá trị bắt đầu cho nó. Biến là linh hồn của kịch bản, giúp bạn lưu trữ các dữ liệu thay đổi như: Số tiền người chơi có, Tên của thú cưng, hoặc Trạng thái cửa đang đóng hay mở. Việc 'khai báo' biến ở đầu kịch bản giúp máy tính hiểu được bạn sẽ dùng tên này để đại diện cho một giá trị nào đó trong suốt vòng đời của Script. Lưu ý: Tên biến phải duy nhất, không bắt đầu bằng số và không được trùng với các từ khóa hệ thống như 'local', 'if', 'then'..."
        : "Initializes a new variable and assigns it a starting value. Variables are the soul of your script, allowing you to store dynamic data like: Player's balance, Pet's name, or if a Door is open/closed. Declaring a variable at the start helps the computer understand that this name represents a specific value throughout the Script's lifecycle. Note: Variable names must be unique, cannot start with a number, and must not conflict with system keywords like 'local', 'if', 'then'...";
    }
    if (type.includes('set')) {
      return lang === 'vi'
        ? "Gán một giá trị mới hoàn toàn cho một biến đã tồn tại. Khối này sẽ ghi đè (thay thế) giá trị cũ bằng giá trị mới mà bạn cung cấp. Ví dụ: Khi người chơi nhặt được một thanh kiếm mới, bạn có thể 'Set' biến 'VũKhíHiệnTại' thành tên thanh kiếm đó. Đây là cách cơ bản nhất để cập nhật dữ liệu trong game. Bạn cần đảm bảo đã tạo biến bằng khối 'create' trước khi sử dụng khối này để tránh lỗi 'Unknown variable'."
        : "Assigns a brand-new value to an existing variable. This block overwrites (replaces) the old value with the new one you provide. Example: When a player picks up a new sword, you can 'Set' the 'CurrentWeapon' variable to that sword's name. This is the most fundamental way to update game data. Ensure you've created the variable using the 'create' block before using this to avoid 'Unknown variable' errors.";
    }
    if (type.includes('change')) {
      return lang === 'vi'
        ? "Thay đổi giá trị của một biến kiểu số bằng cách cộng thêm hoặc trừ đi một giá trị cụ thể. Đây là 'xương sống' của hệ thống vật lý và kinh tế trong game như tính điểm, kinh nghiệm hoặc tiền tệ. Ví dụ: Khối 'change Money by 50' sẽ lấy số tiền hiện có và cộng thêm 50. Nếu bạn muốn trừ điểm, hãy nhập số âm như '-10'. Khối này chỉ hoạt động hiệu quả và logic với các biến đang chứa giá trị kiểu Số (Number)."
        : "Modifies a numeric variable by adding or subtracting a specific value. This is the 'backbone' of physics and economy systems in games, such as scoring, experience, or currency. Example: 'change Money by 50' takes existing money and adds 50. To subtract points, enter a negative number like '-10'. This block only works effectively and logically with variables currently holding Number values.";
    }
    if (type.includes('get')) {
      return lang === 'vi'
        ? "Truy xuất (đọc) giá trị hiện tại của một biến để sử dụng cho mục đích khác. Khối này không làm thay đổi dữ liệu gốc mà chỉ 'mượn' thông tin để bạn thực hiện các phép tính hoặc so sánh logic. Ví dụ: Lấy biến 'CấpĐộ' để kiểm tra xem 'CấpĐộ > 10' thì mới cho mở cửa. Bạn có thể kéo khối này vào bất kỳ ô trống nào yêu cầu giá trị đầu vào (Input slot)."
        : "Retrieves (reads) the current value of a variable for other purposes. This block does not change the original data but 'borrows' information for you to perform calculations or logic comparisons. Example: Get the 'Level' variable to check 'Level > 10' before allowing a door to open. You can drag this block into any empty input slot.";
    }
  }

  // Raycast
  if (type.startsWith('raycast_')) {
    if (type.includes('create')) {
      return lang === 'vi'
        ? "Tạo một đối tượng RaycastParams (Tham số bắn tia). Đây là một 'bản danh sách quy tắc' để định cấu hình cho các hoạt động bắn tia (Raycast). Bạn có thể thiết lập danh sách các đối tượng cần bỏ qua (Ignore) hoặc chỉ chạm vào một vài đối tượng định sẵn (Include). Đây là bước chuẩn bị sống còn để tia cast hoạt động chính xác, ví dụ như giúp tia đạn xuyên qua lá cây hoặc không bao giờ tự bắn trúng bản thân người bắn."
        : "Creates a RaycastParams object. This is a 'rule list' to configure raycasting operations. You can set up a list of instances to ignore or only include specific targets. This is a vital setup step to ensure your rays function correctly, such as allowing bullets to pass through leaves or preventing a ray from hitting the character firing it.";
    }
    if (type.includes('workspace_raycast')) {
      return lang === 'vi'
        ? "Bắn một tia tàng hình từ vị trí gốc (Origin) theo một hướng và chiều dài xác định (Direction). Nếu tia này chạm vào bất kỳ vật thể nào có tính chất va chạm trong không gian 3D, nó sẽ trả về một 'RaycastResult' chứa thông tin cực kỳ chi tiết: Vật thể đó là gì, tọa độ chính xác điểm chạm, bề mặt đó hướng về đâu. Đây là công nghệ hiện đại nhất để làm súng (Hitscan gun), kiểm tra khoảng cách rơi, hoặc các hệ thống nhận diện mục tiêu."
        : "Fires an invisible ray from an origin point in a specific direction and length. If the ray hits any collidable object in 3D space, it returns a 'RaycastResult' containing extremely detailed info: What object was hit, exact hit coordinates, and surface normal. This is the state-of-the-art technology for Hitscan guns, fall-distance checks, or automated targeting systems.";
    }
    if (type.includes('get_result_property')) {
      return lang === 'vi'
        ? "Trích xuất thông tin từ kết quả của một lần bắn tia thành công. Kết quả RaycastResult là một gói dữ liệu lớn, khối này giúp bạn 'mở gói' để lấy ra đúng thứ bạn cần như: part bị trúng (Instance), vị trí trúng (Position - Vector3), hay chất liệu của vật đó (Material). Nếu tia không trúng gì, kết quả sẽ là 'nil' (trống rỗng)."
        : "Extracts specific information from a successful RaycastResult. The result is a large data package; this block helps you 'unpack' exactly what you need, such as: hit part (Instance), hit position (Vector3), or the surface Material. If the ray hits nothing, the result will be 'nil'.";
    }
  }

  // Events
  if (type.startsWith('event_')) {
    if (type.includes('touched')) return lang === 'vi' ? "Kích hoạt khi một vật thể chạm vào vật thể được chỉ định. Đây là cách phổ biến nhất để tạo bẫy chông, cửa tự động, hoặc nhặt vật phẩm. Biến 'otherPart' sẽ cho bạn biết cái gì đã chạm vào nó (ví dụ: chân nhân vật)." : "Triggers when an object touches the specified object. The most common way to create spikes, automatic doors, or item pickups. The 'otherPart' variable tells you exactly what made the contact (e.g., player's leg).";
    if (type.includes('game_start')) return lang === 'vi' ? "Khối sự kiện 'Tối Thượng' - Nó sẽ chạy ngay lập tức khi Script bắt đầu hoạt động. Thường dùng để thiết lập các giá trị ban đầu, tạo biến, hoặc khởi tạo các hệ thống quan trọng của trò chơi ngay khi Server khởi động." : "The 'Ultimate' event block - It runs immediately when the Script starts. Typically used to set up initial values, create variables, or initialize core game systems as soon as the Server boots.";
    if (type.includes('player_joined')) return lang === 'vi' ? "Theo dõi khi có một người chơi mới tham gia vào máy chủ. Bạn có thể dùng khối này để chào mừng người chơi, tặng thưởng cho họ, hoặc tải dữ liệu cũ của họ lên." : "Monitors when a new player joins the server. Use this to welcome players, grant rewards, or load their previous data.";
  }

  // World / Workspace
  if (type.startsWith('world_')) {
    if (type.includes('me')) return lang === 'vi' ? "Đại diện cho chính đối tượng đang chứa kịch bản này (script.Parent). Nếu bạn bỏ kịch bản vào một Part đỏ, 'Me' chính là Part đỏ đó. 'Me' giúp các khối lệnh bên trong linh hoạt và không bị lỗi khi bạn đổi tên vật thể hoặc di chuyển nó sang vị trí khác trong Explorer." : "Represents the specific object containing this script (script.Parent). If you put the script in a red Part, 'Me' is that red Part. Using 'Me' makes your logic flexible and prevents errors if you rename the object or move it elsewhere in the Explorer.";
    if (type.includes('instance')) return lang === 'vi' ? "Một công cụ chọn vật thể mạnh mẽ. Bạn có thể nhấn vào để chọn trực tiếp bất kỳ Part, Model hay Folder nào từ cây Explorer của game. Khối này biến đường dẫn phức tạp thành một tham chiếu trực quan dễ dùng." : "A powerful object selector. You can click to select any Part, Model, or Folder directly from your game's Explorer tree. It turns complex paths into a simple, visual reference.";
  }

  // Default fallback
  return lang === 'vi' 
    ? `Khối lệnh "${name}" thuộc nhóm ${block.category}. Nó cung cấp các công cụ cần thiết để xây dựng logic trò chơi chuyên nghiệp. Các khối này đã được tối ưu hóa để tương thích hoàn toàn với nền tảng Roblox. Hãy kết hợp chúng theo logic để tạo ra trải nghiệm độc đáo cho người chơi.`
    : `The "${name}" block belongs to the ${block.category} category. It provides essential tools for professional game logic construction. These blocks are optimized for full compatibility with the Roblox platform. Combine them logically to create unique player experiences.`;
};

const getBlockUsage = (block: any, lang: string) => {
  const type = block.type.toLowerCase();
  
  if (type.startsWith('variables_')) {
    if (type.includes('create')) {
      return lang === 'vi'
        ? [
            "Bước 1: Quyết định xem bạn muốn lưu trữ loại dữ liệu nào (Số, Chữ, hay Vật thể).",
            "Bước 2: Kéo khối 'variable create' và đặt vào vị trí khởi đầu. Nhấn vào ô 'x' để đặt tên (Vd: 'DiemSo').",
            "Bước 3: Lắp giá trị mặc định ban đầu vào ô 'with value' (Vd: số 0).",
            "Bước 4: Sử dụng các khối 'variable get DiemSo' ở các phần khác của Code để kiểm tra điểm của người chơi.",
            "Lưu ý: Luôn gán giá trị hợp lý ngay từ đầu để tránh lỗi kịch bản khi chạy."
          ]
        : [
            "Step 1: Decide what kind of data you want to store (Number, String, or Object).",
            "Step 2: Drag 'variable create' and place it at a startup position. Click 'x' to name it (e.g., 'Score').",
            "Step 3: Snap a default starting value into 'with value' (e.g., the number 0).",
            "Step 4: Use 'variable get Score' blocks elsewhere to check the player's performance.",
            "Note: Always assign a sensible initial value to prevent script errors during execution."
          ];
    }
    if (type.includes('set') || type.includes('change')) {
      return lang === 'vi'
        ? [
            "Bước 1: Chắc chắn rằng biến đó đã được khai báo ở đâu đó trong cùng một Script hoặc một Script liên quan.",
            "Bước 2: Click vào ô tên biến. Một bảng tìm kiếm thông minh sẽ hiện ra liệt kê các biến đã có.",
            "Bước 3: Gõ tên để lọc hoặc chọn trực tiếp từ danh sách. Nếu bạn nhấn chuột ra ngoài Workspace hoặc vùng trống, bảng chọn sẽ tự ẩn đi.",
            "Bước 4: Gắn giá trị mới vào. Nếu dùng 'Change', giá trị bạn nhập sẽ được cộng dồn vào giá trị cũ.",
            "Mẹo: Dùng 'change' cho tiền tệ, dùng 'set' cho các trạng thái như 'TênNgườiChơi' hoặc 'ĐangChạy'."
          ]
        : [
            "Step 1: Ensure the variable has been declared somewhere within the same or a related script.",
            "Step 2: Click the variable name field. A smart search dropdown listing available variables will appear.",
            "Step 3: Type to filter or select directly. Clicking anywhere on the Workspace background will hide this dropdown.",
            "Step 4: Attach the new value. If using 'Change', your input will be added to the existing value.",
            "Tip: Use 'change' for currencies, and 'set' for states like 'PlayerName' or 'IsRunning'."
          ];
    }
  }

  if (type.startsWith('raycast_')) {
    return lang === 'vi'
      ? [
          "Bước 1: Khởi tạo RaycastParams và cấu hình nó (ví dụ: thêm nhân vật chính vào danh sách bỏ qua).",
          "Bước 2: Xác định điểm Gốc (Origin) - dùng khối 'get position of' một Part hoặc súng.",
          "Bước 3: Xác định Hướng (Direction) - Vector3 xác định tia sẽ dài bao nhiêu và bắn về đâu.",
          "Bước 4: Chạy khối 'Raycast' và lưu kết quả vào một biến tạm.",
          "Bước 5: Dùng khối logic 'if' để kiểm tra 'nếu kết quả ~= nil', sau đó dùng khối 'Get Property from Result' để lấy Part bị bắn trúng."
        ]
      : [
          "Step 1: Initialize RaycastParams and configure it (e.g., add the shooter to the ignore list).",
          "Step 2: Define the Origin - use a 'get position' block of a Part or a gun muzzle.",
          "Step 3: Define the Direction - a Vector3 determining how long and where the ray points.",
          "Step 4: Execute the 'Raycast' block and store the returned value in a temporary variable.",
          "Step 5: Use an 'if' block to check 'if result ~= nil', then use 'Get Property from Result' to fetch the hit Part."
        ];
  }

  if (type.startsWith('world_')) {
    return lang === 'vi'
      ? [
          "Bước 1: Dùng khối 'Instance' chọn vật phẩm từ Explorer hoặc dùng 'Me' cho vật phẩm đang chứa script.",
          "Bước 2: Lắp khối này vào đầu vào 'Instance' của các khối hành động như 'set Color' hoặc 'clone'.",
          "Bước 3: Để tìm vật phẩm nằm sâu bên trong, hãy dùng khối 'find Child' hoặc 'get instance by path'.",
          "Ưu điểm: Việc chọn trực tiếp giúp bạn không bao giờ sai đường dẫn (Path) - một lỗi cực kỳ phổ biến trong lập trình."
        ]
      : [
          "Step 1: Use the 'Instance' selector to pick an item from Explorer, or 'Me' for the item containing the script.",
          "Step 2: Snap this block into the 'Instance' input of action blocks like 'set Color' or 'clone'.",
          "Step 3: To find items deep inside folders, use 'find Child' or 'get instance by path' blocks.",
          "Pro Tip: Selecting directly ensures you never mess up the 'Path' - a very common error in game dev."
        ];
  }

  return lang === 'vi'
    ? [
        `Bước 1: Tìm khối "${name}" trong mục ${block.category}.`,
        `Bước 2: Kéo khối ra và kết nối nó vào chuỗi logic của bạn.`,
        `Bước 3: Chú ý các ô đầu vào (Input) và đầu ra (Output). Bạn chỉ có thể lắp các khối có hình dáng tương ứng.`,
        `Bước 4: Sau khi lắp xong, mã máy sẽ tự động được tạo ở tab bên phải. Bạn có thể nhấn 'RUN' để kiểm tra kết quả ngay lập tức.`
      ]
    : [
        `Step 1: Find the "${name}" block in the ${block.category} section.`,
        `Step 2: Drag the block out and connect it to your logic chain.`,
        `Step 3: Pay attention to Input and Output slots. Only blocks with matching shapes can be connected.`,
        `Step 4: Once connected, the machine code is auto-generated in the right tab. You can hit 'RUN' to test the results immediately.`
      ];
};

const getBlockSyntax = (block: any) => {
  const type = block.type.toLowerCase();
  
  // -- Variables Custom --
  if (type === 'variables_create') return "local [VariableName] = [Value]";
  if (type === 'variables_set_custom') return "[VariableName] = [Value]";
  if (type === 'variables_change_custom') return "[VariableName] = [VariableName] + [Amount]";
  if (type === 'variables_get_custom') return "[VariableName]";
  
  // -- Logic --
  if (type === 'lua_if') return "if [Condition] then\n    [Action]\nend";
  if (type === 'logic_negate') return "not [Boolean]";
  if (type === 'logic_compare_eq') return "[A] == [B]";
  if (type === 'logic_compare_lt') return "[A] < [B]";
  if (type === 'logic_compare_gt') return "[A] > [B]";
  if (type === 'logic_compare_neq') return "[A] ~= [B]";
  if (type === 'logic_boolean_true') return "true";
  if (type === 'logic_boolean_false') return "false";
  if (type === 'logic_operation_and') return "[A] and [B]";
  if (type === 'logic_operation_or') return "[A] or [B]";
  if (type === 'wait') return "task.wait([Seconds])";

  // -- Loops --
  if (type === 'loops_while_lua') return "while [Condition] do\n    [Action]\nend";
  if (type === 'loops_repeat_lua') return "for [Var] = [From], [To] do\n    [Action]\nend";
  if (type === 'loops_for_children') return "for _, [Child] in ipairs([Instance]:GetChildren()) do\n    [Action]\nend";
  if (type === 'loops_for_descendants') return "for _, [Descendant] in ipairs([Instance]:GetDescendants()) do\n    [Action]\nend";
  if (type === 'loops_break_lua') return "break";

  // -- World / Workspace --
  if (type === 'world_me') return "script.Parent";
  if (type === 'world_game') return "game";
  if (type === 'world_workspace' || type === 'workspace') return 'game:GetService("Workspace")';
  if (type === 'world_this_script') return "script";
  if (type === 'world_instance' || type === 'instance_selector') return "game.[Path].[To].[Object]";
  if (type === 'world_set_property_direct') return "[Instance].[Property] = [Value]";
  if (type === 'world_get_property_direct') return "[Instance].[Property]";
  if (type === 'world_find_first_child_direct' || type === 'workspace_findfirstchild') return "local [Var] = [Instance]:FindFirstChild([Name])";
  if (type === 'workspace_waitforchild') return "local [Var] = [Instance]:WaitForChild([Name])";
  if (type === 'world_vector3') return "Vector3.new([X], [Y], [Z])";
  if (type === 'world_set_property') return "[Instance][[PropertyName]] = [Value]";
  if (type === 'world_get_property') return "[Instance][[PropertyName]]";
  if (type === 'world_find_first_child') return "local [Var] = [Instance]:FindFirstChild([Name])";
  if (type === 'world_color3') return "Color3.new([R], [G], [B])";
  if (type === 'world_create_instance_direct') return "Instance.new([ClassName], [Parent])";
  if (type === 'world_clone_instance') return "local _clone = [Instance]:Clone()\n_clone.Parent = [Parent]";

  // -- Raycast (Matching generators.ts) --
  if (type === 'raycast_params_create' || type === 'raycast_params_new') return "RaycastParams.new()";
  if (type === 'raycast_params_set_filter') return "[Params].FilterDescendantsInstances = [List]";
  if (type === 'raycast_params_set_type') return "[Params].FilterType = [Enum.RaycastFilterType]";
  if (type === 'raycast_workspace_raycast' || type === 'workspace_raycast') return "local [Var] = [Instance]:Raycast([Origin], [Direction], [Params])";
  if (type === 'raycast_workspace_spherecast') return "local [Var] = [Instance]:Spherecast([Origin], [Radius], [Direction], [Params])";
  if (type === 'raycast_workspace_blockcast') return "local [Var] = [Instance]:Blockcast([CFrame], [Size], [Direction], [Params])";
  if (type === 'raycast_get_result_property') return "[Result] and [Result].[Property]";

  // -- Events --
  if (type === 'event_game_start') return "task.spawn(function()\n    [Action]\nend)";
  if (type === 'event_touched' || type === 'lua_event_touched') return "[Instance].Touched:Connect(function(otherPart)\n    [Action]\nend)";
  if (type === 'event_clicked') return "[ClickDetector].MouseClick:Connect(function(player)\n    [Action]\nend)";
  if (type === 'event_player_joined' || type === 'lua_event_player_added') return "game.Players.PlayerAdded:Connect(function(player)\n    [Action]\nend)";
  if (type === 'event_heartbeat') return "game:GetService('RunService').Heartbeat:Connect(function(deltaTime)\n    [Action]\nend)";
  if (type === 'event_value_changed') return "[Value].Changed:Connect(function(newValue)\n    [Action]\nend)";
  if (type === 'event_game_loaded') return "game.Loaded:Connect(function()\n    [Action]\nend)";

  // -- Instance Methods/Props (Dynamic matching for rbx_ blocks) --
  if (type.startsWith('rbx_')) {
    const parts = type.split('_');
    const serviceNameRaw = parts[1];
    const serviceName = serviceNameRaw.charAt(0).toUpperCase() + serviceNameRaw.slice(1);
    const serviceVar = serviceName === 'Workspace' ? 'workspace' : `game:GetService("${serviceName}")`;

    if (type.includes('_method_')) {
      const methodNameRaw = parts[parts.length - 1];
      const methodName = methodNameRaw.charAt(0).toUpperCase() + methodNameRaw.slice(1);
      return `${serviceVar}:${methodName}(...)`;
    }
    if (type.includes('_property_set_')) {
      const propNameRaw = parts[parts.length - 1];
      const propName = propNameRaw.charAt(0).toUpperCase() + propNameRaw.slice(1);
      return `${serviceVar}.${propName} = [Value]`;
    }
    if (type.includes('_property_get_')) {
      const propNameRaw = parts[parts.length - 1];
      const propName = propNameRaw.charAt(0).toUpperCase() + propNameRaw.slice(1);
      return `${serviceVar}.${propName}`;
    }
    if (type.includes('_event_')) {
      const eventNameRaw = parts[parts.length - 1];
      const eventName = eventNameRaw.charAt(0).toUpperCase() + eventNameRaw.slice(1);
      return `${serviceVar}.${eventName}:Connect(function()\n    [Action]\nend)`;
    }
    if (type.includes('_child_')) {
      if (type.includes('create_instance')) return `Instance.new([ClassName], ${serviceVar})`;
      if (type.includes('parent_object_to_service')) return `[Instance].Parent = ${serviceVar}`;
    }
  }

  // -- Sound --
  if (type === 'sound_play') return "[Sound]:Play()";
  if (type === 'sound_stop') return "[Sound]:Stop()";
  if (type === 'sound_volume') return "[Sound].Volume = [Value]";
  if (type === 'sound_timeposition') return "[Sound].TimePosition = [Value]";
  if (type === 'sound_soundid') return "[Sound].SoundId = [Url]";

  // -- Camera --
  if (type === 'camera_get_current') return "workspace.CurrentCamera";
  if (type === 'camera_set_type') return "workspace.CurrentCamera.CameraType = [Enum.CameraType]";
  if (type === 'camera_look_at') return "workspace.CurrentCamera.CFrame = CFrame.lookAt(workspace.CurrentCamera.CFrame.Position, [Target])";
  if (type === 'camera_set_fov') return "workspace.CurrentCamera.FieldOfView = [Number]";
  if (type === 'camera_set_cframe') return "workspace.CurrentCamera.CFrame = [CFrame]";

  // -- Effects --
  if (type === 'effects_emit_particles') return "[Emitter]:Emit([Count])";
  if (type === 'effects_create_explosion') return "(function()\n    local ex = Instance.new('Explosion')\n    ex.Position = [Pos]\n    ex.Parent = workspace\n    return ex\nend)()";

  // -- Debug / Comment --
  if (type === 'comment') return "-- [Text]";
  if (type === 'print') return "print([Text])";
  if (type === 'warn') return "warn([Text])";
  if (type === 'run_lua') return "[YourCode]";

  // -- Math --
  if (type === 'math_number' || type === 'math_number_custom') return "[Number]";
  if (type === 'math_arithmetic') return "([A] + [B])";
  if (type === 'math_single') return "math.sqrt([Value])";
  if (type === 'math_random_int') return "math.random([Min], [Max])";

  // -- Text --
  if (type === 'text') return "\"[String]\"";
  if (type === 'text_join') return "([A] .. [B])";
  if (type === 'text_length') return "#[String]";

  // -- Datastore --
  if (type === 'datastore_save' || type === 'datastore_setasync') return "[DataStore]:SetAsync([Key], [Value])";
  if (type === 'datastore_get' || type === 'datastore_getasync') return "[DataStore]:GetAsync([Key])";

  // Default fallback logic to approximate generator style
  if (type.includes('set')) return "[Target].[Property] = [Value]";
  if (type.includes('get')) return "[Target].[Property]";
  if (type.includes('event')) return "[Target].[Event]:Connect(function(...) [Actions] end)";

  return null;
};

const robloxTheme = {
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

export default function App() {
  const [currentLang, setCurrentLang] = useState<'vi' | 'en'>('vi');

  const { explorer, setExplorer, toggleExpand, addInstance, updateInstanceProperty, deleteInstance } = useExplorer();
  
  const explorerRef = useRef(explorer);
  useEffect(() => {
    explorerRef.current = explorer;
  }, [explorer]);
  const [selectedInstancePath, setSelectedInstancePath] = useState('game.Workspace');
  const [selectedInstanceId, setSelectedInstanceId] = useState('workspace');
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);
  const [view, setView] = useState<'blocks' | 'codes'>('blocks');
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showCanvasModal, setShowCanvasModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [showBlockInfoModal, setShowBlockInfoModal] = useState<boolean>(false);
  const [selectedBlockInfo, setSelectedBlockInfo] = useState<any>(null);
  const [infoActiveCategory, setInfoActiveCategory] = useState<string | null>(null);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const toolboxRef = useRef<any>(null);

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'warning' } | null>(null);
  const [storages, setStorages] = useState<{ id: string, name: string, time: string, data: string }[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i.toString(),
      name: `Storage ${i + 1}`,
      time: '-',
      data: ''
    }))
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const tutorials = [
    { title: currentLang === 'vi' ? 'Chào mừng!' : 'Welcome!', content: currentLang === 'vi' ? 'Chào mừng bạn đến với BlockLua! Đây là nơi bạn có thể tạo game Roblox bằng các khối lệnh trực quan.' : 'Welcome to BlockLua! This is where you can create Roblox games using visual blocks.' },
    { title: currentLang === 'vi' ? 'Khám phá Explorer' : 'Explore Explorer', content: currentLang === 'vi' ? 'Sử dụng bảng Explorer bên phải để quản lý các đối tượng trong game của bạn.' : 'Use the Explorer panel on the right to manage your game objects.' },
    { title: currentLang === 'vi' ? 'Kéo thả khối lệnh' : 'Drag & Drop Blocks', content: currentLang === 'vi' ? 'Kéo các khối từ Toolbox vào Workspace để bắt đầu lập trình.' : 'Drag blocks from the Toolbox into the Workspace to start programming.' }
  ];

  const [showControlCenter, setShowControlCenter] = useState(false);
  const [controlCenterTab, setControlCenterTab] = useState<'storage' | 'achievements' | 'test'>('storage');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [achievementsLoaded, setAchievementsLoaded] = useState(false);
  const isInitialLoading = useRef(true);
  const [logoClicks, setLogoClicks] = useState(0);
  const [explorerOpens, setExplorerOpens] = useState(0);
  const [activeAchievement, setActiveAchievement] = useState<any>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  
  const activeSlotIndexRef = useRef(0);
  useEffect(() => {
    activeSlotIndexRef.current = activeSlotIndex;
  }, [activeSlotIndex]);

  const storagesRef = useRef(storages);
  useEffect(() => {
    storagesRef.current = storages;
  }, [storages]);
  
  const achievementsRef = useRef<string[]>([]);
  useEffect(() => {
    achievementsRef.current = achievements;
  }, [achievements]);

  const achievementList = [
    { id: 'hello_world', icon: <Cpu size={20} />, title: { vi: 'Chào Thế Giới', en: 'Hello World' }, desc: { vi: 'Tạo khối lệnh đầu tiên của bạn.', en: 'Create your first block.' } },
    { id: 'spammer', icon: <MousePointer2 size={20} />, title: { vi: 'Kẻ Phá Hoại', en: 'Spammer' }, desc: { vi: 'Nhấn vào logo 10 lần liên tiếp.', en: 'Click the logo 10 times.' } },
    { id: 'night_owl', icon: <Moon size={20} />, title: { vi: 'Cú Đêm', en: 'Night Owl' }, desc: { vi: 'Sử dụng ứng dụng vào lúc nửa đêm.', en: 'Use the app at midnight.' } },
    { id: 'code_master', icon: <Code2 size={20} />, title: { vi: 'Bậc Thầy Code', en: 'Code Master' }, desc: { vi: 'Tạo ra hơn 100 dòng mã Luau.', en: 'Generate over 100 lines of Luau code.' } },
    { id: 'eraser', icon: <Trash2 size={20} />, title: { vi: 'Cục Tẩy', en: 'The Eraser' }, desc: { vi: 'Xóa sạch Workspace của bạn.', en: 'Clear your workspace.' } },
    { id: 'hacker', icon: <Terminal size={20} />, title: { vi: 'Bạn đang làm gì vậy?', en: 'What are you doing?' }, desc: { vi: 'Bạn đang cố gắng hack trang web này sao? 🙃', en: 'Are you trying to hack this website? 🙃' } },
    { id: 'stalker', icon: <Search size={20} />, title: { vi: 'Kẻ Theo Dõi', en: 'Stalker' }, desc: { vi: 'Mở bảng Explorer 20 lần.', en: 'Open the Explorer 20 times.' } },
    { id: 'block_hoarder', icon: <Layers size={20} />, title: { vi: 'Kẻ Thu Gom', en: 'Block Hoarder' }, desc: { vi: 'Có hơn 50 khối lệnh trên Workspace.', en: 'Have over 50 blocks on workspace.' } },
    { id: 'speedrunner', icon: <Zap size={20} />, title: { vi: 'Siêu Tốc', en: 'Speedrunner' }, desc: { vi: 'Sao chép mã trong vòng 30 giây.', en: 'Copy code within 30 seconds.' } },
    { id: 'rich_kid', icon: <Trophy size={20} />, title: { vi: 'Đại Gia', en: 'Rich Kid' }, desc: { vi: 'Đăng nhập để lưu trữ đám mây.', en: 'Login for cloud storage.' } },
  ];

  const unlockAchievement = async (id: string, force: boolean = false) => {
    if (!achievementsLoaded && !force) return;
    if (achievementsRef.current.includes(id)) return;
    
    const achievement = achievementList.find(a => a.id === id);
    if (!achievement) return;

    const newAchievements = Array.from(new Set([...achievementsRef.current, id]));
    setAchievements(newAchievements);
    achievementsRef.current = newAchievements; // Update ref synchronously
    
    // Show custom badge notification
    setActiveAchievement(achievement);
    setTimeout(() => setActiveAchievement(null), 5000);

    const currentUser = userRefState.current || auth.currentUser;

    if (currentUser) {
      setIsAutoSaving(true);
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { achievements: newAchievements });
      } catch (error) {
        console.error("Error saving achievements:", error);
        // We still save locally as fallback
        localStorage.setItem('blocklua_achievements', JSON.stringify(newAchievements));
      } finally {
        setTimeout(() => setIsAutoSaving(false), 1000);
      }
    } else {
      // Local storage only for guest users
      localStorage.setItem('blocklua_achievements', JSON.stringify(newAchievements));
    }
  };

  // Hacker achievement listener (F12)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        unlockAchievement('hacker');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Firebase State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const userRefState = useRef<FirebaseUser | null>(null);
  useEffect(() => {
    userRefState.current = user;
  }, [user]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const prevUser = userRefState.current;
      setUser(firebaseUser);
      setIsAuthReady(true);

      if (firebaseUser) {
        // Force state update immediately for auth ready state
        setUser(firebaseUser);
        userRefState.current = firebaseUser;

        const isVirtualEmail = firebaseUser.email?.endsWith('@mcb.app');
        
        // Ensure user document exists
        const userRef = doc(db, 'users', firebaseUser.uid);
        let userSnap = await getDoc(userRef);
        
        let currentAchievements: string[] = [];
        const localAchievements = JSON.parse(localStorage.getItem('blocklua_achievements') || '[]');

        if (!userSnap.exists()) {
          // If this is a virtual email, we wait for the manual doc creation from handleSignup
          if (isVirtualEmail) {
            // Wait up to 5 seconds for the document to appear (manual registration is in progress)
            let attempts = 0;
            const checkExist = setInterval(async () => {
              attempts++;
              userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                clearInterval(checkExist);
                const userData = userSnap.data();
                const merged = Array.from(new Set([...(userData.achievements || []), ...localAchievements]));
                achievementsRef.current = merged;
                setAchievements(merged);
                setAchievementsLoaded(true);
                if (!merged.includes('rich_kid')) unlockAchievement('rich_kid', true);
              }
              if (attempts >= 10) clearInterval(checkExist);
            }, 500);
            return;
          }

          // If new user from Google, try to set up a default username mapping if possible
          let assignedUsername = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || `user_${firebaseUser.uid.slice(0, 5)}`;
          assignedUsername = assignedUsername.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
          
          // Check if this default username is available
          const usernameDoc = await getDoc(doc(db, 'usernames', assignedUsername));
          if (!usernameDoc.exists()) {
             // It's available! Map it.
             const batch = writeBatch(db);
             batch.set(doc(db, 'usernames', assignedUsername), {
               email: firebaseUser.email,
               uid: firebaseUser.uid,
               username: firebaseUser.displayName || assignedUsername,
               createdAt: Timestamp.now()
             });
             batch.set(userRef, {
               uid: firebaseUser.uid,
               email: firebaseUser.email,
               displayName: firebaseUser.displayName || assignedUsername,
               username: assignedUsername,
               photoURL: firebaseUser.photoURL,
               hasSeenTutorial: false,
               achievements: localAchievements,
               createdAt: Timestamp.now()
             });
             await batch.commit();
             currentAchievements = localAchievements;
          } else {
             // Username taken, just create the user doc without a mapping for now
             await setDoc(userRef, {
               uid: firebaseUser.uid,
               email: firebaseUser.email,
               displayName: firebaseUser.displayName,
               photoURL: firebaseUser.photoURL,
               hasSeenTutorial: false,
               achievements: localAchievements,
               createdAt: Timestamp.now()
             });
             currentAchievements = localAchievements;
          }
          setShowTutorialModal(false);
        } else {
          // Sync tutorial state from cloud
          const userData = userSnap.data();
          if (userData.hasSeenTutorial) {
            setShowTutorialModal(false);
          } else {
            setShowTutorialModal(false);
          }
          
          // Merge local achievements into cloud
          const cloudAchievements = userData.achievements || [];
          currentAchievements = Array.from(new Set([...cloudAchievements, ...localAchievements]));
          
          // One-time sync if something new added from guest session
          if (currentAchievements.length > cloudAchievements.length) {
            updateDoc(userRef, { achievements: currentAchievements }).catch(console.error);
          }
        }
        
        // Update state and ref synchronously to prevent race conditions
        achievementsRef.current = currentAchievements;
        setAchievements(currentAchievements);
        setAchievementsLoaded(true);

        // Now unlock rich_kid if not already unlocked
        if (!currentAchievements.includes('rich_kid')) {
          unlockAchievement('rich_kid', true);
        }
      } else {
        // Guest mode: only show tutorial if they haven't seen it and they didn't just log out
        // If prevUser was defined, it means they just logged out, so don't show tutorial immediately
        if (!prevUser) {
          const hasSeen = localStorage.getItem('blocklua_tutorial_seen');
          if (!hasSeen) {
            setShowTutorialModal(false);
          }
        }
        const savedAchievements = localStorage.getItem('blocklua_achievements');
        if (savedAchievements) {
          const parsedAchievements = JSON.parse(savedAchievements);
          setAchievements(parsedAchievements);
          achievementsRef.current = parsedAchievements;
        }
        setAchievementsLoaded(true);
      }
    });
    return () => unsubscribe();
  }, []); // Removed user dependency to fix infinite loop

  // Real-time Storage Sync
  useEffect(() => {
    if (!user) {
      // Load from localStorage for guests
      const saved = localStorage.getItem('blocklua_storages');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 10) {
            setStorages(parsed);
          }
        } catch (e) { console.error(e); }
      }
      return;
    }

    // Sync from Firestore for logged-in users
    const slotsRef = collection(db, 'users', user.uid, 'slots');
    const unsubscribe = onSnapshot(slotsRef, (snapshot) => {
      setStorages(prevStorages => {
        const newStorages = [...prevStorages];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const index = data.slotIndex;
          if (index >= 0 && index < 10) {
            newStorages[index] = {
              id: index.toString(),
              name: data.name || `Storage ${index + 1}`,
              time: data.updatedAt ? data.updatedAt.toDate().toLocaleString() : '-',
              data: data.data
            };
          }
        });
        return newStorages;
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/slots`);
    });

    return () => unsubscribe();
  }, [user]);

  const login = async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      showToast(currentLang === 'vi' ? 'Đăng nhập thành công!' : 'Logged in successfully!', 'success');
      setShowAuthModal(false);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        showToast(currentLang === 'vi' ? 'Cửa sổ đăng nhập đã bị đóng.' : 'Login popup was closed.', 'warning');
        return;
      }
      if (error.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.error(error);
      showToast(currentLang === 'vi' ? 'Lỗi đăng nhập!' : 'Login failed!', 'error');
    } finally {
      setAuthLoading(false);
    }
  };


  const logout = async () => {
    try {
      await signOut(auth);
      showToast(currentLang === 'vi' ? 'Đã đăng xuất!' : 'Logged out!', 'success');
      // Reset storages to local defaults
      setStorages(Array.from({ length: 10 }, (_, i) => ({
        id: i.toString(),
        name: `Storage ${i + 1}`,
        time: '-',
        data: ''
      })));
    } catch (error) {
      console.error(error);
    }
  };

  const markTutorialSeen = async () => {
    setShowTutorialModal(false);
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { hasSeenTutorial: true });
    } else {
      localStorage.setItem('blocklua_tutorial_seen', 'true');
    }
  };

  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      saveToStorage(activeSlotIndexRef.current, true);
    }, 5000);
  }, []);

  // Optimized code generation logic with persistent timer
  const updateTimeoutRef = useRef<any>(null);
  const debouncedUpdateCode = useCallback(() => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(() => {
      if (workspace.current) {
        // Update code
        const code = luaGenerator.workspaceToCode(workspace.current);
        const header = `-- Generated by BlockLua\n`;
        setGeneratedCode(code.trim() ? header + code : '');

        // Update variables - Throttle discovery
        const currentBlocks = workspace.current.getAllBlocks(false);
        const vars = currentBlocks
          .filter(b => b.type === 'variables_create')
          .map(b => b.getFieldValue('VAR'))
          .filter((v, i, a) => v && a.indexOf(v) === i);
        setDefinedVariables(vars);

        // Save to localStorage (Throttled)
        const xml = Blockly.Xml.workspaceToDom(workspace.current);
        const xmlText = Blockly.Xml.domToText(xml);
        localStorage.setItem('blocklua_workspace', xmlText);
        localStorage.setItem('blocklua_explorer', JSON.stringify(explorerRef.current));
        
        triggerAutoSave();
      }
    }, 500); // Increased debounce for smoother dragging
  }, [triggerAutoSave]);

  // Trigger auto-save when explorer state changes
  useEffect(() => {
    triggerAutoSave();
  }, [explorer, triggerAutoSave]);

  const saveToStorage = async (index: number, silent = false) => {
    if (!workspace.current) return;
    
    const blocks = workspace.current.getAllBlocks(false);
    if (blocks.length === 0 && !silent) {
      showToast(currentLang === 'vi' ? 'Không có khối lệnh nào để lưu!' : 'No blocks to save!', 'error');
      return;
    }

    const xml = Blockly.Xml.workspaceToDom(workspace.current);
    const xmlText = Blockly.Xml.domToText(xml);
    
    const currentStorages = storagesRef.current;
    const currentUser = userRefState.current;
    const currentExplorer = explorerRef.current;
    const newName = currentStorages[index].name;

    const saveData = JSON.stringify({
      xml: xmlText,
      explorer: currentExplorer
    });

    // Always save the latest state to localStorage for auto-recovery on reload
    localStorage.setItem('blocklua_workspace', xmlText);
    localStorage.setItem('blocklua_explorer', JSON.stringify(currentExplorer));

    if (!silent) setIsAutoSaving(true);

    if (currentUser) {
      // Save to Firestore
      try {
        const slotRef = doc(db, 'users', currentUser.uid, 'slots', `slot_${index}`);
        await setDoc(slotRef, {
          slotIndex: index,
          name: newName,
          data: saveData,
          updatedAt: Timestamp.now()
        });
        if (!silent) showToast(currentLang === 'vi' ? `Đã lưu vào bộ nhớ ${index + 1} (Cloud)!` : `Saved to storage ${index + 1} (Cloud)!`, 'success');
      } catch (error) {
        if (!silent) handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}/slots/slot_${index}`);
      }
    } else {
      // Save to LocalStorage
      const newStorages = [...currentStorages];
      newStorages[index] = { ...newStorages[index], time: new Date().toLocaleString(), data: saveData };
      setStorages(newStorages);
      localStorage.setItem('blocklua_storages', JSON.stringify(newStorages));
      if (!silent) showToast(currentLang === 'vi' ? `Đã lưu vào bộ nhớ ${index + 1} (Local)!` : `Saved to storage ${index + 1} (Local)!`, 'success');
    }

    if (!silent) {
      setTimeout(() => setIsAutoSaving(false), 1000);
    }
    
    setActiveSlotIndex(index);
  };

  const loadFromStorage = (index: number) => {
    const storage = storages[index];
    if (!storage.data) {
      showToast(currentLang === 'vi' ? 'Ô lưu trữ này đang trống!' : 'This storage slot is empty!', 'error');
      return;
    }

    let xmlText = storage.data;
    let explorerData = null;

    if (storage.data.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(storage.data);
        xmlText = parsed.xml;
        explorerData = parsed.explorer;
      } catch (e) {
        console.error("Failed to parse storage data", e);
      }
    }

    if (workspace.current && xmlText) {
      try {
        isInitialLoading.current = true;
        const xml = Blockly.utils.xml.textToDom(xmlText);
        workspace.current.clear();
        Blockly.Xml.domToWorkspace(xml, workspace.current);
        setTimeout(() => { isInitialLoading.current = false; }, 100);
      } catch (e) {
        isInitialLoading.current = false;
        console.error("Failed to load workspace XML", e);
      }
    }

    if (explorerData) {
      setExplorer(explorerData);
    }

    setActiveSlotIndex(index);
    showToast(currentLang === 'vi' ? `Đã tải ${storage.name}!` : `Loaded ${storage.name}!`);
  };

  const renameStorage = async (index: number, newName: string) => {
    const newStorages = [...storages];
    newStorages[index].name = newName;
    setStorages(newStorages);

    if (user) {
      try {
        const slotRef = doc(db, 'users', user.uid, 'slots', `slot_${index}`);
        const snap = await getDoc(slotRef);
        if (snap.exists()) {
          await updateDoc(slotRef, { name: newName });
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      localStorage.setItem('blocklua_storages', JSON.stringify(newStorages));
    }
  };

  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'done', logs: { line: number | string, message: string, type: 'error' | 'success' | 'warning' }[] }>( { status: 'idle', logs: [] } );
  const testCode = async () => {
    if (!workspace.current) return;
    setTestResult({ status: 'testing', logs: [] });

    // 1. Reset all blocks? 
    // Skipping reset for now to avoid runtime errors with Blockly API
    // We will directly set the colors and let the user re-trigger a test if styles get messy.

    if (!generatedCode.trim()) {
      setTestResult({ status: 'done', logs: [{ line: 'N/A', message: 'No code to check', type: 'error' }] });
      return;
    }
    
    try {
        const ast = luaparse.parse(generatedCode, { locations: true });
        
        const errors: { line: number, message: string }[] = [];
        const declared = new Set(['print', 'game', 'workspace', 'Instance', 'Color3', 'Vector3', 'UDim2', 'TweenInfo', 'Enum', 'math', 'table', 'string', 'coroutine', 'wait', 'spawn', 'delay', 'task']);
    
        function traverse(node: any, scope: Set<string>) {
            if (!node || typeof node !== 'object') return;
            
            if (node.type === 'LocalStatement') {
                node.variables.forEach((v: any) => scope.add(v.name));
            } else if (node.type === 'FunctionDeclaration') {
                if (node.identifier) scope.add(node.identifier.name);
            } else if (node.type === 'Identifier') {
                if (!scope.has(node.name) && !declared.has(node.name)) {
                    errors.push({ line: node.loc.start.line, message: `Undefined variable or function: ${node.name}` });
                }
            }
    
            for (const key in node) {
                 if (key === 'loc') continue;
                 const child = node[key];
                 if (Array.isArray(child)) {
                     child.forEach((c: any) => traverse(c, scope));
                 } else if (child && typeof child === 'object') {
                     traverse(child, scope);
                 }
            }
        }
        
        traverse(ast, new Set());
        
        if (errors.length > 0) {
            setTestResult({ status: 'done', logs: errors.map(e => ({ ...e, type: 'error' })) });
            // Highlight blocks with error logic
            allBlocks.forEach(block => {
                if (block && typeof (block as any).setColour === 'function') {
                    (block as any).setColour('#ef4444');
                }
            });
        } else {
            setTestResult({ status: 'done', logs: [{ line: 'N/A', message: 'Code syntax is valid and no undefined variables found!', type: 'success' }] });
            // Highlight blocks with success
            allBlocks.forEach(block => {
                if (block && typeof (block as any).setColour === 'function') {
                    (block as any).setColour('#22c55e');
                }
            });
        }
    } catch (e: any) {
        const error = e as { line: number, message: string };
        setTestResult({ status: 'done', logs: [{ line: error.line, message: error.message, type: 'error' }] });
        // Highlight error block
        allBlocks.forEach(block => {
            if (block && typeof (block as any).setColour === 'function') {
                (block as any).setColour('#ef4444');
            }
        });
    }
  };


  const downloadCurrentScript = () => {
    if (!generatedCode.trim()) return;
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "script.lua";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(currentLang === 'vi' ? 'Đã bắt đầu tải về!' : 'Download started!');
  };

  const [activeSyncTab, setActiveSyncTab] = useState<'copy' | 'plugin'>('copy');
  const [baseUrl, setBaseUrl] = useState(
    (window.location.origin && window.location.origin !== 'null' ? window.location.origin : window.location.href.split('/').slice(0, 3).join('/')).replace('ais-dev-', 'ais-pre-')
  );

  const robloxSyncPluginCode = `-- BlockLua ROBLOX SYNC PLUGIN (v2.5)
-- Paste this into a LOCAL PLUGIN (Right click ServerScriptService -> Save as Local Plugin)
-- This plugin synchronizes your web editor with Roblox Studio automatically.

local HttpService = game:GetService("HttpService")
local BASE_URL = "${baseUrl}"
local SYNC_URL = BASE_URL .. "/api/sync"
local EXPORT_URL = BASE_URL .. "/api/export"

print("📡 [BlockLua] Sync Service Initialized: " .. BASE_URL)

-- Helper to find object by dot-path
local function findObjectFromPath(path)
    if path == "game" then return game end
    local parts = string.split(path, ".")
    local current = game
    for i = 2, #parts do
        local found = current:FindFirstChild(parts[i])
        if not found then return nil end
        current = found
    end
    return current
end

-- Helper to serialize Studio tree to JSON
local function serializeInstance(instance)
    local className = instance.ClassName
    -- Only sync relevant services and objects to avoid massive trees
    local allowedClasses = {
        "DataModel", "Workspace", "ServerScriptService", "ReplicatedStorage", 
        "StarterPlayer", "StarterPlayerScripts", "StarterCharacterScripts",
        "StarterGui", "Folder", "Part", "Script", "LocalScript", "ModuleScript", "Sound"
    }
    
    local isAllowed = false
    for _, c in ipairs(allowedClasses) do
        if className == c then isAllowed = true break end
    end
    if not isAllowed and not (instance.Parent == game) then return nil end

    local node = {
        id = instance:GetAttribute("BlockLuaId") or instance.Name .. "_" .. tostring(math.random(1000, 9999)),
        Name = instance.Name,
        ClassName = className,
        Children = {}
    }
    
    -- Limit depth and child count for performance
    local children = instance:GetChildren()
    if #children > 50 then -- Sample first 50
        for i = 1, 50 do
            local childNode = serializeInstance(children[i])
            if childNode then table.insert(node.Children, childNode) end
        end
    else
        for _, child in ipairs(children) do
            local childNode = serializeInstance(child)
            if childNode then table.insert(node.Children, childNode) end
        end
    end
    
    return node
end

-- 1. Sync FROM Web TO Studio (Poll Exports)
task.spawn(function()
    while true do
        local success, result = pcall(function()
            return HttpService:GetAsync(EXPORT_URL)
        end)
        
        if success and result and #result > 2 then
            local data = HttpService:JSONDecode(result)
            if data and data.script then
                local target = findObjectFromPath(data.path)
                if target then
                    local scriptObj = target:FindFirstChild(data.type)
                    if not scriptObj or scriptObj.ClassName ~= data.type then
                        scriptObj = Instance.new(data.type)
                        scriptObj.Name = data.type
                        scriptObj.Parent = target
                    end
                    
                    if scriptObj.Source ~= data.code then
                        scriptObj.Source = data.code
                        warn("✅ [BlockLua] Updated " .. data.type .. " at " .. data.path)
                    end
                end
            end
        end
        task.wait(1)
    end
end)

-- 2. Sync FROM Studio TO Web (Push Tree)
task.spawn(function()
    while true do
        local tree = serializeInstance(game)
        if tree then
            local success, result = pcall(function()
                return HttpService:PostAsync(SYNC_URL, HttpService:JSONEncode({ tree = tree }))
            end)
            if not success then
                -- warn("⚠️ [BlockLua] Tree sync failed: " .. tostring(result))
            end
        end
        task.wait(5) -- Slower sync for tree to save performance
    end
end)`;

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleQuickExport = (type: 'Script' | 'LocalScript') => {
    if (!generatedCode.trim()) {
      showToast(currentLang === 'vi' ? 'Vui lòng thêm khối lệnh trước!' : 'Please add some blocks first!', 'error');
      return;
    }
    
    setExportScriptType(type);
    setSelectorTarget('export');
    showToast(currentLang === 'vi' ? 'Vui lòng chọn một đối tượng trong Explorer để tạo script' : 'Please select an object in the Explorer to create the script');
  };
  const [definedVariables, setDefinedVariables] = useState<string[]>([]);
  const [enableEffects, setEnableEffects] = useState<boolean>(true);

  useEffect(() => {
    (window as any).gameStructure = explorer;
  }, [explorer]);

  const [allBlocks, setAllBlocks] = useState<{ type: string, name: string, category: string, blockDef: any }[]>([]);
  
  // High-performance block counts for the UI categories
  const blockCountsByCategory = React.useMemo(() => {
    const counts: Record<string, number> = {};
    allBlocks.forEach(b => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }, [allBlocks]);

  // Memoized search results for high-speed filtering
  const searchResults = React.useMemo(() => {
    if (!categorySearchQuery || !categorySearchQuery.trim()) return [];
    const lowerQuery = categorySearchQuery.toLowerCase();
    return allBlocks.filter(b => 
      b.name.toLowerCase().includes(lowerQuery) || 
      b.type.toLowerCase().includes(lowerQuery)
    ).slice(0, 30);
  }, [allBlocks, categorySearchQuery]);

  // Memoized list for the actively viewed info category
  const infoModalBlocks = React.useMemo(() => {
    if (!infoActiveCategory) return [];
    return allBlocks.filter(b => b.category === infoActiveCategory);
  }, [allBlocks, infoActiveCategory]);

  const [selectorTarget, setSelectorTarget] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [isResizing, setIsResizing] = useState(false);
  const [showInsertObjectFor, setShowInsertObjectFor] = useState<string | null>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 150 && newWidth < 600) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  // Resize Blockly workspace when sidebar width changes
  useEffect(() => {
    if (workspace.current) {
      Blockly.svgResize(workspace.current);
    }
  }, [sidebarWidth, view]);

  // Bridge for Blockly to open Explorer
  useEffect(() => {
    (window as any).openInstanceSelector = (blockId: string) => {
      setSelectorTarget(blockId);
    };
  }, []);

  // Poll for Roblox Studio sync
  useEffect(() => {
    let lastTreeString = '';
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/sync');
        if (response.ok) {
          const data = await response.json();
          if (data.tree && data.tree.id === 'game') {
            const treeString = JSON.stringify(data.tree);
            if (treeString !== lastTreeString) {
              lastTreeString = treeString;
              setExplorer(prev => {
                // Helper to preserve expanded state
                const preserveExpanded = (newNode: any, oldNode: any): any => {
                  if (!oldNode) return newNode;
                  return {
                    ...newNode,
                    expanded: oldNode.expanded,
                    Children: (newNode.Children || []).map((child: any) => {
                      const oldChild = (oldNode.Children || []).find((c: any) => c.Name === child.Name && c.ClassName === child.ClassName);
                      return preserveExpanded(child, oldChild);
                    })
                  };
                };
                return preserveExpanded(data.tree, prev);
              });
            }
          }
        }
      } catch (err) {
        // Ignore fetch errors
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [setExplorer]);

  const [exportScriptType, setExportScriptType] = useState<'Script' | 'LocalScript' | null>(null);

  const handleInstanceSelect = (path: string, instanceId: string) => {
    // Keep full path as requested by user (e.g., game.Workspace.Part)
    const displayPath = path;
    
    if (selectorTarget === 'export') {
      // Create script locally
      const scriptName = exportScriptType === 'Script' ? 'Script' : 'LocalScript';
      addInstance(instanceId, scriptName, scriptName, { Source: generatedCode });
      
      // Also sync to external if needed
      fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: exportScriptType,
          path: displayPath,
          code: generatedCode
        })
      }).then(() => {
        showToast(currentLang === 'vi' ? `Đã xuất ${exportScriptType} tới ${displayPath}` : `Successfully exported ${exportScriptType} to ${displayPath}`);
      }).catch(err => {
        console.error(err);
        showToast(currentLang === 'vi' ? 'Lỗi khi xuất lệnh!' : 'Error exporting script!', 'error');
      });
      
      setSelectorTarget(null);
      setExportScriptType(null);
      return;
    }

    if (selectorTarget && workspace.current) {
      const block = workspace.current.getBlockById(selectorTarget);
      if (block) {
        block.setFieldValue(displayPath, 'INSTANCE');
      }
      setSelectorTarget(null);
    } else {
      setSelectedInstancePath(displayPath);
      setSelectedInstanceId(instanceId);
    }
  };

  const saveWorkspace = useCallback(() => {
    if (workspace.current) {
      const xml = Blockly.Xml.workspaceToDom(workspace.current);
      const xmlText = Blockly.utils.xml.domToText(xml);
      localStorage.setItem('blocklua_workspace', xmlText);
      alert('Workspace saved!');
    }
  }, []);

  const loadWorkspace = useCallback(() => {
    if (workspace.current) {
      const xmlText = localStorage.getItem('blocklua_workspace');
      if (xmlText) {
        try {
          isInitialLoading.current = true;
          const xml = Blockly.utils.xml.textToDom(xmlText);
          workspace.current.clear();
          Blockly.Xml.domToWorkspace(xml, workspace.current);
          setTimeout(() => { isInitialLoading.current = false; }, 100);
          showToast(currentLang === 'vi' ? 'Đã tải Workspace!' : 'Workspace loaded!');
        } catch (e) {
          isInitialLoading.current = false;
          console.error("Failed to load workspace", e);
        }
      } else {
        showToast(currentLang === 'vi' ? 'Không tìm thấy dữ liệu đã lưu.' : 'No saved workspace found.', 'error');
      }
    }
  }, [currentLang]);

  const isShiftPressedRef = useRef(false);
  const lastClickShiftState = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') isShiftPressedRef.current = true;
      
      // Handle Z and Y for Undo/Redo
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key.toLowerCase() === 'z' && !e.ctrlKey && !e.metaKey) {
        if (workspace.current) {
          workspace.current.undo(false);
        }
      } else if (e.key.toLowerCase() === 'y' && !e.ctrlKey && !e.metaKey) {
        if (workspace.current) {
          workspace.current.undo(true);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') isShiftPressedRef.current = false;
    };
    const handleMouseDown = (e: MouseEvent) => {
      lastClickShiftState.current = e.shiftKey;
    };
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('mousedown', handleMouseDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, []);

  useEffect(() => {
    if (!blocklyDiv.current) return;

    // Custom field for clickable variable labels
    class FieldClickableVarLabel extends Blockly.FieldLabel {
      constructor(value: string, classNames?: string) {
        super(value, classNames);
        this.EDITABLE = true;
        this.SERIALIZABLE = true;
      }
      init() {
        super.init();
        if (this.textElement_) {
          this.textElement_.style.pointerEvents = 'auto';
          this.textElement_.style.cursor = 'pointer';
        }
      }
      isClickable() {
        return true;
      }
      showEditor_() {
        let workspace = this.getSourceBlock()?.workspace;
        if (!workspace) return;
        
        if ((workspace as any).isFlyout) {
          workspace = (workspace as any).targetWorkspace;
          if (!workspace) return;
        }
        
        const text = this.getText();
        const cleanText = text.replace('var. ', '').trim();
        
        let blockType = 'var_' + cleanText.replace(/^_/, '');
        if (!Blockly.Blocks[blockType]) {
          blockType = 'var_reporter';
        }
        
        Blockly.Events.setGroup(true);
        try {
          const newBlock = workspace.newBlock(blockType);
          if (newBlock) {
            newBlock.setFieldValue(cleanText, 'NAME');
            // Set color based on the text
            if (text.includes('_count') || text.includes('_child') || text.includes('_descendant')) {
              newBlock.setColour('#ff66cc');
            }
            (newBlock as any).initSvg();
            (newBlock as any).render();
            
            // Position it near the source block
            const sourceBlock = this.getSourceBlock();
            const xy = (sourceBlock as any).getRelativeToSurfaceXY();
            newBlock.moveBy(xy.x + 150, xy.y);
            (newBlock as any).select();
          }
        } finally {
          Blockly.Events.setGroup(false);
        }
      }
    }
    // Set it as editable so it responds to clicks
    FieldClickableVarLabel.prototype.EDITABLE = true;

    const createVarLabel = (name: string, _color: string) => {
      return new FieldClickableVarLabel(name, "scratch-var-label");
    };

      // Define custom blocks to match the image

      // Comment Category
      Blockly.Blocks['comment'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("--")
              .appendField(new Blockly.FieldTextInput("comment"), "TEXT");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Comment'));
        }
      };

      // Debug Category
      Blockly.Blocks['print'] = {
        init: function() {
          this.appendValueInput("TEXT")
              .setCheck(null)
              .appendField("print");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Debug'));
        }
      };

      Blockly.Blocks['warn'] = {
        init: function() {
          this.appendValueInput("TEXT")
              .setCheck(null)
              .appendField("warn");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Debug'));
        }
      };

      Blockly.Blocks['run_lua'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("run lua")
              .appendField(new Blockly.FieldTextInput("-- lua code here"), "CODE");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Debug'));
        }
      };

      // Logic Category
      Blockly.Blocks['wait'] = {
        init: function() {
          this.appendValueInput("SECONDS")
              .setCheck("Number")
              .appendField("wait");
          this.appendDummyInput()
              .appendField("seconds");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Loops'));
        }
      };

      Blockly.Blocks['lua_if'] = {
        init: function() {
          this.appendValueInput("CONDITION")
              .setCheck(null)
              .appendField("if");
          this.appendDummyInput()
              .appendField("then");
          this.appendStatementInput("DO");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Logic'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['logic_negate'] = {
        init: function() {
          this.appendValueInput("BOOL").setCheck(null).appendField("not");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Logic'));
        }
      };

      Blockly.Blocks['logic_compare_eq'] = {
        init: function() {
          this.appendValueInput("A").setCheck(null);
          this.appendDummyInput().appendField("=");
          this.appendValueInput("B").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Logic'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['logic_compare_lt'] = {
        init: function() {
          this.appendValueInput("A").setCheck(null);
          this.appendDummyInput().appendField("<");
          this.appendValueInput("B").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Logic'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['logic_compare_gt'] = {
        init: function() {
          this.appendValueInput("A").setCheck(null);
          this.appendDummyInput().appendField(">");
          this.appendValueInput("B").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Logic'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['logic_compare_neq'] = {
        init: function() {
          this.appendValueInput("A").setCheck(null);
          this.appendDummyInput().appendField("≠");
          this.appendValueInput("B").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Logic'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['logic_boolean_true'] = {
        init: function() {
          this.appendDummyInput().appendField("true");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Logic'));
        }
      };

      Blockly.Blocks['logic_boolean_false'] = {
        init: function() {
          this.appendDummyInput().appendField("false");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Logic'));
        }
      };

      Blockly.Blocks['logic_operation_and'] = {
        init: function() {
          this.appendValueInput("A").setCheck(null);
          this.appendDummyInput().appendField("and");
          this.appendValueInput("B").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Logic'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['logic_operation_or'] = {
        init: function() {
          this.appendValueInput("A").setCheck(null);
          this.appendDummyInput().appendField("or");
          this.appendValueInput("B").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Logic'));
          this.setInputsInline(true);
        }
      };

      // World Category
      Blockly.Blocks['world_game'] = {
        init: function() {
          this.appendDummyInput().appendField("game");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
        }
      };
      Blockly.Blocks['world_workspace'] = {
        init: function() {
          this.appendDummyInput().appendField("workspace");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
        }
      };
      Blockly.Blocks['world_me'] = {
        init: function() {
          this.appendDummyInput().appendField("me");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
        }
      };

      Blockly.Blocks['world_this_script'] = {
        init: function() {
          this.appendDummyInput().appendField("this script");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
        }
      };

      Blockly.Blocks['world_instance'] = {
        init: function() {
          const field = new Blockly.FieldTextInput("Instance", function(newValue) {
            const val = newValue === '' ? 'Instance' : newValue;
            if (this.textElement_) {
              if (val === 'Instance') {
                this.textElement_.style.fillOpacity = '0.5';
                this.textElement_.style.fontStyle = 'italic';
              } else {
                this.textElement_.style.fillOpacity = '1';
                this.textElement_.style.fontStyle = 'normal';
              }
            }
            return val;
          });
          
          const originalInit = field.init;
          field.init = function() {
            originalInit.call(this);
            if (this.textElement_) {
              if (this.getValue() === 'Instance') {
                this.textElement_.style.fillOpacity = '0.5';
                this.textElement_.style.fontStyle = 'italic';
              } else {
                this.textElement_.style.fillOpacity = '1';
                this.textElement_.style.fontStyle = 'normal';
              }
            }
          };
          
          // Custom click handler for the field
          (field as any).showEditor_ = function(e: Event) {
            // Do not call originalShowEditor to prevent text input from appearing
            if ((window as any).openInstanceSelector) {
              (window as any).openInstanceSelector(this.getSourceBlock()?.id);
            }
          };

          this.appendDummyInput()
              .appendField("Instance")
              .appendField(field, "INSTANCE");
          this.setOutput(true, "Instance");
          this.setColour(getCategoryColor('World'));
        }
      };

      Blockly.Blocks['world_set_property_direct'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("set")
              .appendField(new Blockly.FieldTextInput("Transparency"), "PROPERTY")
              .appendField("of");
          this.appendValueInput("INSTANCE")
              .setCheck(null);
          this.appendDummyInput().appendField("to");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_get_property_direct'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldTextInput("Name"), "PROPERTY")
              .appendField("of");
          this.appendValueInput("INSTANCE")
              .setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_find_first_child_direct'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("find")
              .appendField(new Blockly.FieldTextInput("Child"), "NAME")
              .appendField("in");
          this.appendValueInput("INSTANCE")
              .setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_vector3'] = {
        init: function() {
          this.appendDummyInput().appendField("vector3");
          this.appendValueInput("X").setCheck("Number").appendField("x");
          this.appendValueInput("Y").setCheck("Number").appendField("y");
          this.appendValueInput("Z").setCheck("Number").appendField("z");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_vector3_values'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("vector3")
              .appendField(new Blockly.FieldTextInput("0"), "X")
              .appendField(new Blockly.FieldTextInput("0"), "Y")
              .appendField(new Blockly.FieldTextInput("0"), "Z");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_get_instance_by_path'] = {
        init: function() {
          this.appendDummyInput().appendField("get instance by path");
          this.appendValueInput("PATH").setCheck("String");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_set_property'] = {
        init: function() {
          this.appendDummyInput().appendField("set");
          this.appendValueInput("PROPERTY").setCheck("String");
          this.appendDummyInput().appendField("of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField("to");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_get_property'] = {
        init: function() {
          this.appendDummyInput().appendField("get property");
          this.appendValueInput("PROPERTY").setCheck("String");
          this.appendDummyInput().appendField("of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_find_first_child'] = {
        init: function() {
          this.appendDummyInput().appendField("find");
          this.appendValueInput("NAME").setCheck("String");
          this.appendDummyInput().appendField("in");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_color3'] = {
        init: function() {
          this.appendDummyInput().appendField("color 3");
          this.appendValueInput("R").setCheck("Number").appendField("r (number)");
          this.appendValueInput("G").setCheck("Number").appendField("g (number)");
          this.appendValueInput("B").setCheck("Number").appendField("b (number)");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_color3_values'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("color 3")
              .appendField(new Blockly.FieldTextInput("0"), "R")
              .appendField(new Blockly.FieldTextInput("0"), "G")
              .appendField(new Blockly.FieldTextInput("0"), "B");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_create_instance_direct'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("create")
              .appendField(new Blockly.FieldTextInput("Part"), "CLASS")
              .appendField("in");
          this.appendValueInput("PARENT").setCheck(null);
          this.appendDummyInput().appendField(createVarLabel("var. _instance", getCategoryColor('World')), "VAR_LABEL");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['world_clone_instance'] = {
        init: function() {
          this.appendDummyInput().appendField("clone");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(createVarLabel("var. _clone", getCategoryColor('World')), "VAR_LABEL");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('World'));
          this.setInputsInline(true);
        }
      };

      // Instance Category
      Blockly.Blocks['instance_new'] = {
        init: function() {
          this.appendDummyInput().appendField("new Instance")
              .appendField(new Blockly.FieldTextInput("Part"), "CLASS");
          this.appendValueInput("PARENT").setCheck(null).appendField("parented to");
          this.setOutput(true, null);
          this.setColour("#4c97ff");
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_wait_for_child'] = {
        init: function() {
          this.appendValueInput("PARENT").setCheck(null);
          this.appendDummyInput().appendField(":WaitForChild(");
          this.appendValueInput("NAME").setCheck("String");
          this.appendDummyInput().appendField(")");
          this.setOutput(true, null);
          this.setColour("#4c97ff");
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_find_first_child'] = {
        init: function() {
          this.appendValueInput("PARENT").setCheck(null);
          this.appendDummyInput().appendField(":FindFirstChild(");
          this.appendValueInput("NAME").setCheck("String");
          this.appendDummyInput().appendField(")");
          this.setOutput(true, null);
          this.setColour("#4c97ff");
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_get_children'] = {
        init: function() {
          this.appendValueInput("PARENT").setCheck(null);
          this.appendDummyInput().appendField(":GetChildren()");
          this.setOutput(true, "Array");
          this.setColour("#4c97ff");
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_get_descendants'] = {
        init: function() {
          this.appendValueInput("PARENT").setCheck(null);
          this.appendDummyInput().appendField(":GetDescendants()");
          this.setOutput(true, "Array");
          this.setColour("#4c97ff");
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_clone'] = {
        init: function() {
          this.appendDummyInput().appendField("clone");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Instance'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_child_added'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput()
              .appendField("child added")
              .appendField(createVarLabel("var. _child", getCategoryColor('Instance')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Instance'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_child_removed'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput()
              .appendField("child removed")
              .appendField(createVarLabel("var. _child", getCategoryColor('Instance')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Instance'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_descendant_added'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput()
              .appendField("descendant added")
              .appendField(createVarLabel("var. _descendant", getCategoryColor('Instance')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Instance'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_descendant_removing'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput()
              .appendField("descendant removing")
              .appendField(createVarLabel("var. _descendant", getCategoryColor('Instance')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Instance'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_destroy'] = {
        init: function() {
          this.appendDummyInput().appendField("destroy");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Instance'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_is_a'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput()
              .appendField("is a")
              .appendField(new Blockly.FieldTextInput("BasePart"), "CLASS");
          this.setOutput(true, "Boolean");
          this.setColour(getCategoryColor('Instance'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_set_name'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(".Name =");
          this.appendValueInput("VALUE").setCheck("String");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Instance'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_get_name'] = {
        init: function() {
          this.appendDummyInput().appendField("name of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setOutput(true, "String");
          this.setColour(getCategoryColor('Instance'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_get_parent'] = {
        init: function() {
          this.appendDummyInput().appendField("parent of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Instance'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['instance_set_parent'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(".Parent =");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Instance'));
          this.setInputsInline(true);
        }
      };

      // Part Category
      Blockly.Blocks['part_set_anchored'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(".Anchored =");
          this.appendValueInput("VALUE").setCheck("Boolean");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_set_cancollide'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(".CanCollide =");
          this.appendValueInput("VALUE").setCheck("Boolean");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_set_cantouch'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(".CanTouch =");
          this.appendValueInput("VALUE").setCheck("Boolean");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_set_castshadow'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(".CastShadow =");
          this.appendValueInput("VALUE").setCheck("Boolean");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_set_color'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(".Color =");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_set_orientation'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(".Orientation =");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_get_orientation'] = {
        init: function() {
          this.appendDummyInput().appendField("orientation of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_set_position'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(".Position =");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_get_position'] = {
        init: function() {
          this.appendDummyInput().appendField("position of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_set_size'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(".Size =");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_get_size'] = {
        init: function() {
          this.appendDummyInput().appendField("size of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_touched_by_part'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput()
              .appendField("touched by part")
              .appendField(createVarLabel("var. _touched_part", getCategoryColor('Part')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_touched_by_character'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput()
              .appendField("touched by character")
              .appendField(createVarLabel("var. _touched_part", getCategoryColor('Part')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['part_set_transparency'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(".Transparency =");
          this.appendValueInput("VALUE").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Part'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['math_number_custom'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("number")
              .appendField(new Blockly.FieldTextInput("0"), "NUM");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Math'));
        }
      };

      Blockly.Blocks['math_arithmetic_add'] = {
        init: function() {
          this.appendValueInput("A").setCheck("Number");
          this.appendDummyInput().appendField("+");
          this.appendValueInput("B").setCheck("Number");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Math'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['math_random_custom'] = {
        init: function() {
          this.appendDummyInput().appendField("random from");
          this.appendValueInput("FROM").setCheck("Number");
          this.appendDummyInput().appendField("to");
          this.appendValueInput("TO").setCheck("Number");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Math'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['math_round'] = {
        init: function() {
          this.appendDummyInput().appendField("round");
          this.appendValueInput("NUM").setCheck("Number");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Math'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['math_abs'] = {
        init: function() {
          this.appendDummyInput().appendField("abs");
          this.appendValueInput("NUM").setCheck("Number");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Math'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['math_ceil'] = {
        init: function() {
          this.appendDummyInput().appendField("ceil");
          this.appendValueInput("NUM").setCheck("Number");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Math'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['math_floor'] = {
        init: function() {
          this.appendDummyInput().appendField("floor");
          this.appendValueInput("NUM").setCheck("Number");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Math'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['math_expr_1'] = {
        init: function() {
          this.appendValueInput("NUM").setCheck("Number");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("* 2 + 1"), "EXPR");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Math'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['math_expr_2'] = {
        init: function() {
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("1 + 2 *"), "EXPR");
          this.appendValueInput("NUM").setCheck("Number");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Math'));
          this.setInputsInline(true);
        }
      };

      // Text Category
      Blockly.Blocks['text_string_custom'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("string")
              .appendField(new Blockly.FieldTextInput(""), "TEXT");
          this.setOutput(true, "String");
          this.setColour(getCategoryColor('Text'));
        }
      };

      Blockly.Blocks['text_join_custom'] = {
        init: function() {
          this.appendDummyInput().appendField("join");
          this.appendValueInput("A").setCheck("String");
          this.appendDummyInput().appendField("with");
          this.appendValueInput("B").setCheck("String");
          this.setOutput(true, "String");
          this.setColour(getCategoryColor('Text'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['text_length_custom'] = {
        init: function() {
          this.appendDummyInput().appendField("length of");
          this.appendValueInput("TEXT").setCheck("String");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Text'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['text_to_upper'] = {
        init: function() {
          this.appendDummyInput().appendField("to upper case");
          this.appendValueInput("TEXT").setCheck("String");
          this.setOutput(true, "String");
          this.setColour(getCategoryColor('Text'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['text_to_lower'] = {
        init: function() {
          this.appendDummyInput().appendField("to lower case");
          this.appendValueInput("TEXT").setCheck("String");
          this.setOutput(true, "String");
          this.setColour(getCategoryColor('Text'));
          this.setInputsInline(true);
        }
      };

      // Values Category
      Blockly.Blocks['values_to_string'] = {
        init: function() {
          this.appendValueInput("VALUE").setCheck(null);
          this.appendDummyInput().appendField("to string");
          this.setOutput(true, "String");
          this.setColour(getCategoryColor('Values'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['values_to_number'] = {
        init: function() {
          this.appendValueInput("VALUE").setCheck(null);
          this.appendDummyInput().appendField("to number");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Values'));
          this.setInputsInline(true);
        }
      };

      // Variables Category
      Blockly.Blocks['variables_create'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("variable create")
              .appendField(new Blockly.FieldTextInput("x"), "VAR")
              .appendField("with value");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Variables'));
          this.setInputsInline(true);
        }
      };

      // Helper for variable autocomplete
      const addVariableAutocomplete = (block: Blockly.Block, fieldName: string) => {
        const varField = block.getField(fieldName);
        if (varField) {
          (varField as any).showEditor_ = function(this: any, e?: Event) {
            const workspace = this.getSourceBlock()?.workspace;
            if (!workspace) return;
            
            // Capture mouse position
            let mouseX: number | undefined;
            let mouseY: number | undefined;
            if (e instanceof MouseEvent) {
              mouseX = e.clientX;
              mouseY = e.clientY;
            }
            const blocks = workspace.getAllBlocks(false);
            const vars = blocks
              .filter(b => b.type === 'variables_create')
              .map(b => b.getFieldValue('VAR'))
              .filter((v, i, a) => v && a.indexOf(v) === i);
            
            // Standard editor
            (Blockly.FieldTextInput.prototype as any).showEditor_.call(this, e);
            
            // Custom dropdown overlay
            const htmlInput = (Blockly as any).FieldTextInput.htmlInput_ || 
                              document.querySelector('.blocklyHtmlInput') as HTMLInputElement;
            
            if (htmlInput && vars.length > 0) {
              // Ensure only one dropdown exists
              const existingDropdown = document.getElementById('variable-autocomplete-dropdown');
              if (existingDropdown) {
                existingDropdown.remove();
              }

              const container = document.createElement('div');
              container.id = 'variable-autocomplete-dropdown';
              container.style.position = 'fixed';
              container.style.zIndex = '20000';
              container.style.background = '#252525';
              container.style.backdropFilter = 'blur(10px)';
              (container.style as any).webkitBackdropFilter = 'blur(10px)';
              container.style.border = '1px solid rgba(255,255,255,0.1)';
              container.style.borderRadius = '12px';
              container.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
              container.style.minWidth = '200px';
              container.style.padding = '8px';
              container.style.display = 'flex';
              container.style.flexDirection = 'column';
              container.style.gap = '6px';
              container.style.opacity = '0';
              container.style.transform = 'translateY(5px)';
              container.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
              container.style.fontFamily = 'Inter, sans-serif';
              
              // Search Header
              const searchWrapper = document.createElement('div');
              searchWrapper.style.padding = '4px';
              searchWrapper.style.position = 'sticky';
              searchWrapper.style.top = '0';
              searchWrapper.style.background = 'transparent';
              searchWrapper.style.zIndex = '1';

              const searchInput = document.createElement('input');
              searchInput.type = 'text';
              searchInput.placeholder = 'Search variables...';
              searchInput.style.width = '100%';
              searchInput.style.padding = '8px 12px';
              searchInput.style.fontSize = '12px';
              searchInput.style.border = '1px solid rgba(255,255,255,0.05)';
              searchInput.style.borderRadius = '8px';
              searchInput.style.outline = 'none';
              searchInput.style.background = 'rgba(255,255,255,0.05)';
              searchInput.style.color = 'white';
              searchInput.style.transition = 'all 0.2s';
              
              searchInput.onfocus = () => {
                searchInput.style.borderColor = '#4c97ff';
                searchInput.style.background = 'rgba(255,255,255,0.08)';
                searchInput.style.boxShadow = '0 0 0 2px rgba(76, 151, 255, 0.2)';
              };
              searchInput.onblur = () => {
                searchInput.style.borderColor = 'rgba(255,255,255,0.05)';
                searchInput.style.background = 'rgba(255,255,255,0.05)';
                searchInput.style.boxShadow = 'none';
              };
              
              const title = document.createElement('div');
              title.textContent = 'Variables';
              title.style.fontSize = '10px';
              title.style.fontWeight = '800';
              title.style.color = '#4c97ff';
              title.style.textTransform = 'uppercase';
              title.style.letterSpacing = '0.1em';
              title.style.padding = '4px 8px';
              
              searchWrapper.appendChild(title);
              searchWrapper.appendChild(searchInput);
              container.appendChild(searchWrapper);

              const listContainer = document.createElement('div');
              listContainer.style.overflowY = 'auto';
              listContainer.style.maxHeight = '120px';
              listContainer.style.display = 'flex';
              listContainer.style.flexDirection = 'column';
              listContainer.style.gap = '2px';
              listContainer.style.padding = '2px';
              listContainer.style.scrollbarWidth = 'thin';
              listContainer.style.scrollbarColor = 'rgba(255,255,255,0.1) transparent';
              container.appendChild(listContainer);
              
              let selectedIndex = -1;
              const updateDropdown = (filter = '') => {
                listContainer.innerHTML = '';
                selectedIndex = -1;
                const searchTerm = filter.toLowerCase();
                
                // Smart sorting: prefix matches first, then contains
                const filtered = vars
                  .filter(v => v.toLowerCase().includes(searchTerm))
                  .sort((a, b) => {
                    const aLow = a.toLowerCase();
                    const bLow = b.toLowerCase();
                    const aStarts = aLow.startsWith(searchTerm);
                    const bStarts = bLow.startsWith(searchTerm);
                    if (aStarts && !bStarts) return -1;
                    if (!aStarts && bStarts) return 1;
                    return aLow.localeCompare(bLow);
                  });
                
                if (filtered.length === 0) {
                  const item = document.createElement('div');
                  item.textContent = filter === '' ? 'No variables found' : 'No matches found';
                  item.style.padding = '16px';
                  item.style.fontSize = '12px';
                  item.style.color = '#666';
                  item.style.fontStyle = 'italic';
                  item.style.textAlign = 'center';
                  listContainer.appendChild(item);
                  return;
                }
                
                filtered.forEach((v, idx) => {
                  const item = document.createElement('div');
                  item.id = `autocomplete-item-${idx}`;
                  
                  // Highlight match
                  if (searchTerm && v.toLowerCase().includes(searchTerm)) {
                    const index = v.toLowerCase().indexOf(searchTerm);
                    const before = v.substring(0, index);
                    const match = v.substring(index, index + searchTerm.length);
                    const after = v.substring(index + searchTerm.length);
                    item.innerHTML = `${before}<span style="color: #4c97ff; font-weight: 700;">${match}</span>${after}`;
                  } else {
                    item.textContent = v;
                  }
                  
                  item.style.padding = '10px 14px';
                  item.style.cursor = 'pointer';
                  item.style.fontSize = '13px';
                  item.style.color = '#ccc';
                  item.style.borderRadius = '8px';
                  item.style.transition = 'all 0.2s';
                  item.style.marginBottom = '1px';
                  item.style.fontWeight = '500';
                  
                  const selectItem = () => {
                    this.setValue(v);
                    this.render_();
                    (Blockly as any).WidgetDiv.hide();
                  };

                  item.onmouseover = () => {
                    // Update index on hover
                    selectedIndex = idx;
                    updateSelection();
                  };
                  item.onmouseout = () => {
                    selectedIndex = -1;
                    updateSelection();
                  };
                  item.onmousedown = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    selectItem();
                  };
                  listContainer.appendChild(item);
                });

                const updateSelection = () => {
                  const items = listContainer.querySelectorAll('div[id^="autocomplete-item-"]');
                  items.forEach((item: any, idx) => {
                    if (idx === selectedIndex) {
                      item.style.background = '#4c97ff';
                      item.style.color = 'white';
                      item.style.transform = 'translateX(4px)';
                      item.scrollIntoView({ block: 'nearest' });
                    } else {
                      item.style.background = 'transparent';
                      item.style.color = '#ccc';
                      item.style.transform = 'translateX(0)';
                    }
                  });
                };

                // Expose for key handler
                (container as any).handleKey = (key: string) => {
                  const items = listContainer.querySelectorAll('div[id^="autocomplete-item-"]');
                  if (key === 'ArrowDown') {
                    selectedIndex = (selectedIndex + 1) % items.length;
                    updateSelection();
                  } else if (key === 'ArrowUp') {
                    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                    updateSelection();
                  } else if (key === 'Enter') {
                    if (selectedIndex >= 0 && selectedIndex < filtered.length) {
                      const v = filtered[selectedIndex];
                      this.setValue(v);
                      this.render_();
                      (Blockly as any).WidgetDiv.hide();
                    } else if (filtered.length > 0) {
                      // If nothing selected, pick the first match (best match)
                      const v = filtered[0];
                      this.setValue(v);
                      this.render_();
                      (Blockly as any).WidgetDiv.hide();
                    } else {
                      // If no matches, accept the typed text
                      const v = searchInput.value;
                      if (v) {
                        this.setValue(v);
                        this.render_();
                      }
                      (Blockly as any).WidgetDiv.hide();
                    }
                  }
                };
              };

              const positionDropdown = () => {
                const rect = htmlInput.getBoundingClientRect();
                container.style.minWidth = Math.max(220, rect.width) + 'px';
                
                // Use mouse position if available, otherwise fallback to input rect
                let targetX = mouseX !== undefined ? mouseX : rect.left;
                let targetY = mouseY !== undefined ? mouseY + 10 : rect.bottom + 4;

                container.style.left = targetX + 'px';
                container.style.top = targetY + 'px';
                document.body.appendChild(container);
                
                const dropdownRect = container.getBoundingClientRect();
                
                // Boundary checks
                if (targetX + dropdownRect.width > window.innerWidth) {
                  container.style.left = (window.innerWidth - dropdownRect.width - 16) + 'px';
                }
                if (targetY + dropdownRect.height > window.innerHeight) {
                  container.style.top = (targetY - dropdownRect.height - 20) + 'px';
                }

                requestAnimationFrame(() => {
                  container.style.opacity = '1';
                  container.style.transform = 'translateY(0)';
                });
              };

              updateDropdown('');
              positionDropdown();
              
              // Focus search input immediately
              setTimeout(() => searchInput.focus(), 50);

              // Handle Escape and Arrow keys
              searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                  (Blockly as any).WidgetDiv.hide();
                } else if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
                  if ((container as any).handleKey) {
                    e.preventDefault();
                    (container as any).handleKey(e.key);
                  }
                }
              });

              // Update on search input
              searchInput.addEventListener('input', (e: any) => {
                updateDropdown(e.target.value);
              });

              // Also update if user types in the original Blockly input
              const inputHandler = (e: any) => {
                searchInput.value = e.target.value;
                updateDropdown(e.target.value);
              };
              htmlInput.addEventListener('input', inputHandler);

              // Click outside logic
              const clickOutsideHandler = (e: Event) => {
                const target = e.target as HTMLElement;
                const dropdown = document.getElementById('variable-autocomplete-dropdown');
                
                // Cực kỳ quan trọng: Nếu nhấp vào bất kỳ đâu thuộc về Workspace SVG
                // thì chúng ta nên ẩn bảng đi vì Workspace thường chặn sự kiện
                const isWorkspaceClick = target.classList.contains('blocklyWorkspace') || 
                                          target.classList.contains('blocklyMainBackground') || 
                                          target.closest('.blocklySvg');

                // Nếu người dùng nhấp ra ngoài dropdown VÀ ngoài input field
                if (dropdown && !dropdown.contains(target) && target !== htmlInput) {
                  // Thêm điều kiện: nếu nhấp vào Workspace hoặc một vùng không liên quan
                  (Blockly as any).WidgetDiv.hide();
                }
              };
              
              // Sử dụng capture: true để bắt sự kiện trước khi Blockly kịp ngăn chặn sự kiện nổi lên
              document.addEventListener('pointerdown', clickOutsideHandler, true);
              document.addEventListener('mousedown', clickOutsideHandler, true);
              document.addEventListener('touchstart', clickOutsideHandler, true);

              const windowBlurHandler = () => {
                (Blockly as any).WidgetDiv.hide();
              };
              window.addEventListener('blur', windowBlurHandler);

              // Thêm sự kiện lắng nghe trực tiếp từ workspace để đảm bảo ẩn khi click vào vùng làm việc
              const workspaceListener = (event: any) => {
                if (event.type === (Blockly as any).Events.CLICK) {
                  (Blockly as any).WidgetDiv.hide();
                }
              };
              workspace.addChangeListener(workspaceListener);

              // Cleanup on hide
              const oldHide = (Blockly as any).WidgetDiv.hide;
              (Blockly as any).WidgetDiv.hide = function() {
                htmlInput.removeEventListener('input', inputHandler);
                document.removeEventListener('pointerdown', clickOutsideHandler, true);
                document.removeEventListener('mousedown', clickOutsideHandler, true);
                document.removeEventListener('touchstart', clickOutsideHandler, true);
                window.removeEventListener('blur', windowBlurHandler);
                workspace.removeChangeListener(workspaceListener);
                
                if (container.parentNode) {
                  container.style.opacity = '0';
                  container.style.transform = 'translateY(10px)';
                  setTimeout(() => {
                    if (container.parentNode) container.parentNode.removeChild(container);
                  }, 200);
                }
                
                (Blockly as any).WidgetDiv.hide = oldHide;
                oldHide.call(Blockly.WidgetDiv);
              };
            }
          };
        }
      };

      Blockly.Blocks['variables_set_custom'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("variable set")
              .appendField(new Blockly.FieldTextInput("x"), "VAR")
              .appendField("to");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Variables'));
          this.setInputsInline(true);
          addVariableAutocomplete(this, "VAR");
        }
      };

      Blockly.Blocks['variables_change_custom'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("variable change")
              .appendField(new Blockly.FieldTextInput("x"), "VAR")
              .appendField("by");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Variables'));
          this.setInputsInline(true);
          addVariableAutocomplete(this, "VAR");
        }
      };

      Blockly.Blocks['variables_get_custom'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("variable")
              .appendField(new Blockly.FieldTextInput("x"), "VAR");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Variables'));
          addVariableAutocomplete(this, "VAR");
        }
      };

      // Variables 2 Category Blocks
      const createVarReporter = (type: string, label: string) => {
        Blockly.Blocks[type] = {
          init: function() {
            let varName = label;
            if (varName.startsWith('var. ')) {
              varName = varName.substring(5);
            } else if (varName.startsWith('var.')) {
              varName = varName.substring(4);
            }
            this.appendDummyInput()
                .appendField("var.")
                .appendField(new Blockly.FieldTextInput(varName), "NAME");
            this.setOutput(true, null);
            this.setColour("#ff66cc"); // Match var_reporter color
          }
        };
      };

      createVarReporter('var_count', 'var. _count');
      createVarReporter('var_child', 'var. _child');
      createVarReporter('var_descendant', 'var. _descendant');
      createVarReporter('var_instance', 'var. _instance');
      createVarReporter('var_clone', 'var. _clone');
      createVarReporter('var_touched_part', 'var. _touched_part');
      createVarReporter('var_climb_speed', 'var. _climb_speed');
      createVarReporter('var_humanoid', 'var. _humanoid');
      createVarReporter('var_character_model', 'var. _character_model');
      createVarReporter('var_new_health', 'var. _new_health');
      createVarReporter('var_reached_goal', 'var. _reached_goal');
      createVarReporter('var_input', 'var. _input');
      createVarReporter('var_mouse_input', 'var. _mouse_input');
      createVarReporter('var_touch_input', 'var. _touch_input');
      createVarReporter('var_player', 'var. player');
      createVarReporter('var_click_detector', 'var. click_detector');
      createVarReporter('var_productid', 'var. productid');
      createVarReporter('var_key_input', 'var. key_input');
      createVarReporter('var_received_data', 'var. received_data');
      createVarReporter('var_data', 'var. data');
      createVarReporter('var_value', 'var. value');
      createVarReporter('var_character', 'var. character');
      createVarReporter('var_otherPart', 'var. otherPart');
      createVarReporter('var_child', 'var. child');
      createVarReporter('var_property', 'var. property');
      createVarReporter('var_active', 'var. active');
      createVarReporter('var_speed', 'var. speed');
      createVarReporter('var_deltaTime', 'var. deltaTime');
      createVarReporter('var_time', 'var. time');
      createVarReporter('var_message', 'var. message');
      createVarReporter('var_attributeName', 'var. attributeName');
      createVarReporter('var_animTrack', 'var. _animTrack');

      // Lists Category
      Blockly.Blocks['lists_empty'] = {
        init: function() {
          this.appendDummyInput().appendField("empty list");
          this.setOutput(true, "Array");
          this.setColour(getCategoryColor('Lists'));
        }
      };

      Blockly.Blocks['lists_set_item'] = {
        init: function() {
          this.appendDummyInput().appendField("set item");
          this.appendValueInput("INDEX").setCheck("Number");
          this.appendDummyInput().appendField("of");
          this.appendValueInput("LIST").setCheck(null);
          this.appendDummyInput().appendField("to");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Lists'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['lists_get_item'] = {
        init: function() {
          this.appendDummyInput().appendField("item");
          this.appendValueInput("INDEX").setCheck("Number");
          this.appendDummyInput().appendField("of");
          this.appendValueInput("LIST").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Lists'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['lists_insert'] = {
        init: function() {
          this.appendDummyInput().appendField("insert");
          this.appendValueInput("ITEM").setCheck(null);
          this.appendDummyInput().appendField("to");
          this.appendValueInput("LIST").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Lists'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['lists_remove'] = {
        init: function() {
          this.appendDummyInput().appendField("remove item");
          this.appendValueInput("INDEX").setCheck("Number");
          this.appendDummyInput().appendField("from");
          this.appendValueInput("LIST").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Lists'));
          this.setInputsInline(true);
        }
      };

      // Loops Category
      Blockly.Blocks['loops_while_lua'] = {
        init: function() {
          this.appendValueInput("CONDITION").setCheck(null).appendField("while");
          this.appendDummyInput().appendField("do");
          this.appendStatementInput("DO");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Loops'));
        }
      };

      Blockly.Blocks['loops_repeat_lua'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("repeat")
              .appendField(createVarLabel("var. _count", getCategoryColor('Loops')), "VAR_LABEL");
          this.appendDummyInput().appendField("from");
          this.appendValueInput("FROM").setCheck("Number");
          this.appendDummyInput().appendField("to");
          this.appendValueInput("TO").setCheck("Number");
          this.appendStatementInput("DO");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Loops'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['loops_for_children'] = {
        init: function() {
          this.appendDummyInput().appendField("loop through children of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(createVarLabel("var. _child", getCategoryColor('Loops')), "VAR_LABEL");
          this.appendStatementInput("DO");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Loops'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['loops_for_descendants'] = {
        init: function() {
          this.appendDummyInput().appendField("loop through descendants of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(createVarLabel("var. _descendant", getCategoryColor('Loops')), "VAR_LABEL");
          this.appendStatementInput("DO");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Loops'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['loops_break_lua'] = {
        init: function() {
          this.appendDummyInput().appendField("break this loop");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Loops'));
        }
      };

      // Special reporter blocks for the "var." labels
      Blockly.Blocks['var_reporter'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("var.")
              .appendField(new Blockly.FieldTextInput("name"), "NAME");
          this.setOutput(true, null);
          this.setColour("#ff66cc"); // Pink color
        }
      };

      // Placeholder blocks for inputs (Shadows) - Darker colors, with faded text
      Blockly.Blocks['placeholder_string'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("string", "faded-placeholder-text"));
          this.setOutput(true, "String");
          this.setColour("#3d99b8"); // Teal/Blue like in the image
        }
      };
      Blockly.Blocks['placeholder_number'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("number", "faded-placeholder-text"));
          this.setOutput(true, "Number");
          this.setColour("#666666"); // Grayish like in the image
        }
      };
      Blockly.Blocks['placeholder_boolean'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("true/false", "faded-placeholder-text"));
          this.setOutput(true, "Boolean");
          this.setColour("#4c97ff"); // Blue like in the image
        }
      };
      Blockly.Blocks['placeholder_color3'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("color3", "faded-placeholder-text"));
          this.setOutput(true, null);
          this.setColour("#666666");
        }
      };
      Blockly.Blocks['placeholder_vector3'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("vector3", "faded-placeholder-text"));
          this.setOutput(true, null);
          this.setColour("#666666");
        }
      };
      Blockly.Blocks['placeholder_instance'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("Instance", "faded-placeholder-text"));
          this.setOutput(true, null);
          this.setColour("#3d79cc"); // Darker World/Logic color
        }
      };
      Blockly.Blocks['placeholder_index'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("index", "faded-placeholder-text"));
          this.setOutput(true, "Number");
          this.setColour("#a61022"); // Darker Lists color
        }
      };
      Blockly.Blocks['placeholder_variable'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("variable", "faded-placeholder-text"));
          this.setOutput(true, null);
          this.setColour("#cc5214"); // Darker Variables color
        }
      };
      Blockly.Blocks['placeholder_any'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("any", "faded-placeholder-text"));
          this.setOutput(true, null);
          this.setColour("#3d99b8"); // Darker Values color
        }
      };
      Blockly.Blocks['placeholder_condition'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("condition", "faded-placeholder-text"));
          this.setOutput(true, null);
          this.setColour("#3d79cc"); // Darker Logic color
        }
      };

      // Character Category
      Blockly.Blocks['character_is_climbing'] = {
        init: function() {
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField("is climbing");
          this.appendDummyInput().appendField(createVarLabel("var. _climb_speed", getCategoryColor('Character')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_damage'] = {
        init: function() {
          this.appendDummyInput().appendField("damage");
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField("by");
          this.appendValueInput("NUMBER").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_died'] = {
        init: function() {
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField("died");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_equip_tool'] = {
        init: function() {
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField("equip tool:");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_get_humanoid'] = {
        init: function() {
          this.appendDummyInput().appendField("get humanoid from model");
          this.appendValueInput("MODEL").setCheck(null);
          this.appendDummyInput().appendField(createVarLabel("var. _humanoid", getCategoryColor('Character')), "VAR_LABEL");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_get_model_from_humanoid'] = {
        init: function() {
          this.appendDummyInput().appendField("get model from humanoid");
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField(createVarLabel("var. _character_model", getCategoryColor('Character')), "VAR_LABEL");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_set_health'] = {
        init: function() {
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField(".Health =");
          this.appendValueInput("VALUE").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_health_changed'] = {
        init: function() {
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField("Health changed");
          this.appendDummyInput().appendField(createVarLabel("var. _new_health", getCategoryColor('Character')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_jump'] = {
        init: function() {
          this.appendDummyInput().appendField("jump");
          this.appendValueInput("HUMANOID").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_set_jump_height'] = {
        init: function() {
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField(".JumpHeight =");
          this.appendValueInput("VALUE").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_set_jump_power'] = {
        init: function() {
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField(".JumpPower =");
          this.appendValueInput("VALUE").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_kill'] = {
        init: function() {
          this.appendDummyInput().appendField("kill");
          this.appendValueInput("HUMANOID").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_set_max_health'] = {
        init: function() {
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField(".MaxHealth =");
          this.appendValueInput("VALUE").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_move_to'] = {
        init: function() {
          this.appendDummyInput().appendField("move");
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField("to");
          this.appendValueInput("POSITION").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_finished_moving'] = {
        init: function() {
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField("finished moving");
          this.appendDummyInput().appendField(createVarLabel("var. _reached_goal", getCategoryColor('Character')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_player_of'] = {
        init: function() {
          this.appendDummyInput().appendField("player of");
          this.appendValueInput("CHARACTER").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_unequip_tool'] = {
        init: function() {
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField("unequip tool");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['character_set_walk_speed'] = {
        init: function() {
          this.appendValueInput("HUMANOID").setCheck(null);
          this.appendDummyInput().appendField(".WalkSpeed =");
          this.appendValueInput("VALUE").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Character'));
          this.setInputsInline(true);
        }
      };

      // Model Category
      Blockly.Blocks['model_break_joints'] = {
        init: function() {
          this.appendDummyInput().appendField("break joints of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Model'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['model_get_orientation'] = {
        init: function() {
          this.appendDummyInput().appendField("orientation of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Model'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['model_get_position'] = {
        init: function() {
          this.appendDummyInput().appendField("position of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Model'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['model_get_size'] = {
        init: function() {
          this.appendDummyInput().appendField("size of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Model'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['model_set_primary_part'] = {
        init: function() {
          this.appendDummyInput().appendField("set primary part of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField("to");
          this.appendValueInput("PART").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Model'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['model_set_orientation'] = {
        init: function() {
          this.appendDummyInput().appendField("set orientation of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField("to");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Model'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['model_set_position'] = {
        init: function() {
          this.appendDummyInput().appendField("set position of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField("to");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Model'));
          this.setInputsInline(true);
        }
      };

      // Gui Category
      Blockly.Blocks['gui_get_mouse'] = {
        init: function() {
          this.appendDummyInput().appendField("get mouse");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Gui'));
        }
      };
      Blockly.Blocks['gui_get_player_gui'] = {
        init: function() {
          this.appendDummyInput().appendField("get PlayerGui of");
          this.appendValueInput("PLAYER").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_new_instance'] = {
        init: function() {
          this.appendDummyInput().appendField("new Gui Instance")
              .appendField(new Blockly.FieldTextInput("ScreenGui"), "CLASS");
          this.appendValueInput("PARENT").setCheck(null).appendField("parented to");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_button_clicked'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField("(gui button) clicked");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_input_began'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField("input began");
          this.appendDummyInput().appendField(createVarLabel("var. _input", getCategoryColor('Gui')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_input_ended'] = {
        init: function() {
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField("input ended");
          this.appendDummyInput().appendField(createVarLabel("var. _input", getCategoryColor('Gui')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_is_left_mouse'] = {
        init: function() {
          this.appendDummyInput().appendField("if");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("is left mouse button");
          this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Gui')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_is_middle_mouse'] = {
        init: function() {
          this.appendDummyInput().appendField("if");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("is middle mouse button");
          this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Gui')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_is_right_mouse'] = {
        init: function() {
          this.appendDummyInput().appendField("if");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("is right mouse button");
          this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Gui')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_is_touch'] = {
        init: function() {
          this.appendDummyInput().appendField("if");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("is touch");
          this.appendDummyInput().appendField(createVarLabel("var. _touch_input", getCategoryColor('Gui')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_mouse_position'] = {
        init: function() {
          this.appendDummyInput().appendField("mouse input");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("position");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_set_invisible'] = {
        init: function() {
          this.appendDummyInput().appendField("invisible");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_set_visible'] = {
        init: function() {
          this.appendDummyInput().appendField("visible");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['gui_touch_position'] = {
        init: function() {
          this.appendDummyInput().appendField("touch input");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("position");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Gui'));
          this.setInputsInline(true);
        }
      };

      // Player Category
      Blockly.Blocks['player_get_character'] = {
        init: function() {
          this.appendDummyInput().appendField("character of");
          this.appendValueInput("PLAYER").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Player'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['player_get_by_name'] = {
        init: function() {
          this.appendDummyInput().appendField("get player by name");
          this.appendValueInput("NAME").setCheck("String");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Player'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['player_kick'] = {
        init: function() {
          this.appendDummyInput().appendField("kick");
          this.appendValueInput("PLAYER").setCheck(null);
          this.appendDummyInput().appendField("reason:");
          this.appendValueInput("REASON").setCheck("String");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Player'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['player_joined'] = {
        init: function() {
          this.appendDummyInput().appendField("player joined");
          this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Player')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Player'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['player_leaving'] = {
        init: function() {
          this.appendDummyInput().appendField("player leaving");
          this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Player')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Player'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['player_get_user_id'] = {
        init: function() {
          this.appendDummyInput().appendField("user id of");
          this.appendValueInput("PLAYER").setCheck(null);
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Player'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['player_chat_added'] = {
        init: function() {
          this.appendDummyInput().appendField("on player chat");
          this.appendValueInput("PLAYER").setCheck(null);
          this.appendDummyInput().appendField(createVarLabel("var. message", getCategoryColor('Player')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Player'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['player_respawned'] = {
        init: function() {
          this.appendDummyInput().appendField("on player respawned");
          this.appendValueInput("PLAYER").setCheck(null);
          this.appendDummyInput().appendField(createVarLabel("var. character", getCategoryColor('Player')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Player'));
          this.setInputsInline(true);
        }
      };

      // Clickdetector Category
      Blockly.Blocks['clickdetector_add'] = {
        init: function() {
          this.appendDummyInput().appendField("add click detector to");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(createVarLabel("var. _click_detector", getCategoryColor('Clickdetector')), "VAR_LABEL");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Clickdetector'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['clickdetector_clicked'] = {
        init: function() {
          this.appendValueInput("CLICK_DETECTOR").setCheck(null);
          this.appendDummyInput().appendField("clicked");
          this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Clickdetector')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Clickdetector'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['clickdetector_hover_enter'] = {
        init: function() {
          this.appendValueInput("CLICK_DETECTOR").setCheck(null);
          this.appendDummyInput().appendField("hover enter");
          this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Clickdetector')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Clickdetector'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['clickdetector_hover_leave'] = {
        init: function() {
          this.appendValueInput("CLICK_DETECTOR").setCheck(null);
          this.appendDummyInput().appendField("hover leave");
          this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Clickdetector')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Clickdetector'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['clickdetector_right_clicked'] = {
        init: function() {
          this.appendValueInput("CLICK_DETECTOR").setCheck(null);
          this.appendDummyInput().appendField("right clicked");
          this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Clickdetector')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Clickdetector'));
          this.setInputsInline(true);
        }
      };

      // Marketplace Category
      Blockly.Blocks['marketplace_owns_asset'] = {
        init: function() {
          this.appendDummyInput().appendField("does");
          this.appendValueInput("PLAYER").setCheck(null);
          this.appendDummyInput().appendField("owns asset");
          this.appendValueInput("ASSET_ID").setCheck(null);
          this.appendDummyInput().appendField("?");
          this.setOutput(true, "Boolean");
          this.setColour(getCategoryColor('Marketplace'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['marketplace_owns_gamepass'] = {
        init: function() {
          this.appendDummyInput().appendField("does");
          this.appendValueInput("PLAYER").setCheck(null);
          this.appendDummyInput().appendField("owns gamepass");
          this.appendValueInput("GAMEPASS_ID").setCheck(null);
          this.appendDummyInput().appendField("?");
          this.setOutput(true, "Boolean");
          this.setColour(getCategoryColor('Marketplace'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['marketplace_product_bought'] = {
        init: function() {
          this.appendDummyInput().appendField("product bought");
          this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Marketplace')), "VAR_LABEL_PLAYER");
          this.appendDummyInput().appendField(createVarLabel("var. _productId", getCategoryColor('Marketplace')), "VAR_LABEL_PRODUCT");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Marketplace'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['marketplace_prompt_asset'] = {
        init: function() {
          this.appendDummyInput().appendField("prompt asset");
          this.appendValueInput("ASSET_ID").setCheck(null);
          this.appendDummyInput().appendField("purchase to");
          this.appendValueInput("PLAYER").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Marketplace'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['marketplace_prompt_gamepass'] = {
        init: function() {
          this.appendDummyInput().appendField("prompt game pass");
          this.appendValueInput("GAMEPASS_ID").setCheck(null);
          this.appendDummyInput().appendField("purchase to");
          this.appendValueInput("PLAYER").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Marketplace'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['marketplace_prompt_product'] = {
        init: function() {
          this.appendDummyInput().appendField("prompt product");
          this.appendValueInput("PRODUCT_ID").setCheck(null);
          this.appendDummyInput().appendField("purchase to");
          this.appendValueInput("PLAYER").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Marketplace'));
          this.setInputsInline(true);
        }
      };

      // Tweening Category
      Blockly.Blocks['tween_animate'] = {
        init: function() {
          this.appendDummyInput().appendField("tween");
          this.appendValueInput("PROPERTY").setCheck("String");
          this.appendDummyInput().appendField("of");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField(":");
          this.appendValueInput("GOAL").setCheck(null);
          this.appendValueInput("TWEEN_INFO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Tweening'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['tween_info_create'] = {
        init: function() {
          const styleField = new Blockly.FieldDropdown([
            ["Linear", "Linear"],
            ["Sine", "Sine"],
            ["Back", "Back"],
            ["Quad", "Quad"],
            ["Quart", "Quart"],
            ["Quint", "Quint"],
            ["Bounce", "Bounce"],
            ["Elastic", "Elastic"],
            ["Exponential", "Exponential"],
            ["Circular", "Circular"],
            ["Cubic", "Cubic"]
          ]);

          const directionField = new Blockly.FieldDropdown([
            ["In", "In"],
            ["Out", "Out"],
            ["InOut", "InOut"]
          ]);

          this.appendDummyInput().appendField("tween info: time");
          this.appendValueInput("TIME").setCheck("Number");
          this.appendDummyInput()
              .appendField("easing style")
              .appendField(styleField, "STYLE");
          this.appendDummyInput()
              .appendField("easing direction")
              .appendField(directionField, "DIRECTION");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Tweening'));
          this.setInputsInline(true);
        }
      };

      Blockly.Blocks['placeholder_humanoid'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("humanoid", "faded-placeholder-text"));
          this.setOutput(true, null);
          this.setColour("#ff3355");
        }
      };
      Blockly.Blocks['placeholder_player'] = {
        init: function() {
          this.appendDummyInput()
              .appendField(new Blockly.FieldLabel("player", "faded-placeholder-text"));
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Player'));
        }
      };

      // Client Category
      Blockly.Blocks['client_fire_server'] = {
        init: function() {
          this.appendDummyInput().appendField("fire server");
          this.appendValueInput("EVENT").setCheck(null).appendField("remote event");
          this.appendValueInput("DATA").setCheck(null).appendField("data to send");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['client_input_began'] = {
        init: function() {
          this.appendDummyInput().appendField("user input began");
          this.appendDummyInput().appendField(createVarLabel("var. _input", getCategoryColor('Client')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['client_input_ended'] = {
        init: function() {
          this.appendDummyInput().appendField("user input ended");
          this.appendDummyInput().appendField(createVarLabel("var. _input", getCategoryColor('Client')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['client_is_keyboard'] = {
        init: function() {
          this.appendDummyInput().appendField("if");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("is keyboard");
          this.appendDummyInput().appendField(createVarLabel("var. _key_input", getCategoryColor('Client')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['client_is_left_mouse'] = {
        init: function() {
          this.appendDummyInput().appendField("if");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("is left mouse button");
          this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Client')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['client_is_middle_mouse'] = {
        init: function() {
          this.appendDummyInput().appendField("if");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("is middle mouse button");
          this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Client')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['client_is_right_mouse'] = {
        init: function() {
          this.appendDummyInput().appendField("if");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("is right mouse button");
          this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Client')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['client_is_touch'] = {
        init: function() {
          this.appendDummyInput().appendField("if");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("is touch");
          this.appendDummyInput().appendField(createVarLabel("var. _touch_input", getCategoryColor('Client')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['client_key_is'] = {
        init: function() {
          const keyField = new Blockly.FieldDropdown([
            ["Space", "Space"], ["W", "W"], ["A", "A"], ["S", "S"], ["D", "D"],
            ["Q", "Q"], ["E", "E"], ["R", "R"], ["T", "T"], ["Y", "Y"],
            ["U", "U"], ["I", "I"], ["O", "O"], ["P", "P"], ["F", "F"],
            ["G", "G"], ["H", "H"], ["J", "J"], ["K", "K"], ["L", "L"],
            ["Z", "Z"], ["X", "X"], ["C", "C"], ["V", "V"], ["B", "B"],
            ["N", "N"], ["M", "M"], ["Up", "Up"], ["Down", "Down"],
            ["Left", "Left"], ["Right", "Right"], ["Return", "Return"],
            ["Escape", "Escape"], ["Tab", "Tab"], ["LeftShift", "LeftShift"],
            ["RightShift", "RightShift"], ["LeftControl", "LeftControl"],
            ["RightControl", "RightControl"], ["LeftAlt", "LeftAlt"],
            ["RightAlt", "RightAlt"]
          ]);

          this.appendDummyInput().appendField("if key");
          this.appendValueInput("KEY").setCheck(null);
          this.appendDummyInput()
              .appendField("is")
              .appendField(keyField, "KEY_NAME");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['client_local_player'] = {
        init: function() {
          this.appendDummyInput().appendField("local player");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Client'));
        }
      };
      Blockly.Blocks['client_mouse_position'] = {
        init: function() {
          this.appendDummyInput().appendField("mouse input");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("position");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['client_fired_by_server'] = {
        init: function() {
          this.appendDummyInput().appendField("fired by server");
          this.appendValueInput("EVENT").setCheck(null).appendField("remote event");
          this.appendDummyInput().appendField(createVarLabel("var. _received_data", getCategoryColor('Client')), "VAR_LABEL");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['client_touch_position'] = {
        init: function() {
          this.appendDummyInput().appendField("touch input");
          this.appendValueInput("INPUT").setCheck(null);
          this.appendDummyInput().appendField("position");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Client'));
          this.setInputsInline(true);
        }
      };

      // Server Category
      Blockly.Blocks['server_fired_by_client'] = {
        init: function() {
          this.appendDummyInput().appendField("fired by client");
          this.appendValueInput("EVENT").setCheck(null).appendField("remote event");
          this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Server')), "VAR_LABEL_PLAYER");
          this.appendDummyInput().appendField(createVarLabel("var. _data", getCategoryColor('Server')), "VAR_LABEL_DATA");
          this.appendStatementInput("DO").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Server'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['server_fire_all_clients'] = {
        init: function() {
          this.appendDummyInput().appendField("fire all clients");
          this.appendValueInput("EVENT").setCheck(null).appendField("remote event");
          this.appendValueInput("DATA").setCheck(null).appendField("data to send");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Server'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['server_fire_client'] = {
        init: function() {
          this.appendDummyInput().appendField("fire client");
          this.appendValueInput("EVENT").setCheck(null).appendField("remote event");
          this.appendValueInput("PLAYER").setCheck(null).appendField("player");
          this.appendValueInput("DATA").setCheck(null).appendField("data to send");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Server'));
          this.setInputsInline(true);
        }
      };

      // Leaderstats Category
      Blockly.Blocks['leaderstats_create_number'] = {
        init: function() {
          this.appendDummyInput().appendField("create leaderstats value (number)");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("name"), "NAME");
          this.appendValueInput("DEFAULT").setCheck("Number").appendField("default value");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Leaderstats'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['leaderstats_create_string'] = {
        init: function() {
          this.appendDummyInput().appendField("create leaderstats value (string)");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("name"), "NAME");
          this.appendValueInput("DEFAULT").setCheck("String").appendField("default value");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Leaderstats'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['leaderstats_enable'] = {
        init: function() {
          this.appendDummyInput().appendField("enable leaderstats");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Leaderstats'));
        }
      };
      Blockly.Blocks['leaderstats_get'] = {
        init: function() {
          this.appendDummyInput().appendField("get leaderstats");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("name"), "NAME");
          this.appendValueInput("PLAYER").setCheck(null).appendField("of");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Leaderstats'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['leaderstats_set'] = {
        init: function() {
          this.appendDummyInput().appendField("set leaderstats");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("name"), "NAME");
          this.appendValueInput("PLAYER").setCheck(null).appendField("of");
          this.appendValueInput("VALUE").setCheck(null).appendField("to");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Leaderstats'));
          this.setInputsInline(true);
        }
      };

      // Functions Category
      Blockly.Blocks['functions_define'] = {
        init: function() {
          this.appendDummyInput().appendField("define function");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("name"), "NAME");
          this.appendDummyInput().appendField("arguments:");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("arg1, arg2"), "ARGS");
          this.appendStatementInput("STACK");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Functions'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['functions_call'] = {
        init: function() {
          this.appendDummyInput().appendField("call function");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("name"), "NAME");
          this.appendDummyInput().appendField("arguments:");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("val1, val2"), "ARGS");
          this.appendDummyInput().appendField(createVarLabel("var. _result", getCategoryColor('Functions')), "VAR_LABEL");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Functions'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['functions_return'] = {
        init: function() {
          this.appendDummyInput().appendField("return");
          this.appendValueInput("VALUE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Functions'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['functions_define_global'] = {
        init: function() {
          this.appendDummyInput().appendField("define global function");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("name"), "NAME");
          this.appendDummyInput().appendField("arguments:");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("arg1, arg2"), "ARGS");
          this.appendStatementInput("STACK");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Functions'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['functions_call_global'] = {
        init: function() {
          this.appendDummyInput().appendField("call global function");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("name"), "NAME");
          this.appendDummyInput().appendField("arguments:");
          this.appendDummyInput().appendField(new Blockly.FieldTextInput("val1, val2"), "ARGS");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Functions'));
          this.setInputsInline(true);
        }
      };

      // Datastore Category
      Blockly.Blocks['datastore_setup'] = {
        init: function() {
          this.appendDummyInput().appendField("setup Datastores for this script");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Datastore'));
        }
      };
      Blockly.Blocks['datastore_instance'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("datastore")
              .appendField(new Blockly.FieldTextInput("datastore name"), "NAME");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Datastore'));
        }
      };
      Blockly.Blocks['datastore_use'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("use datastore")
              .appendField(new Blockly.FieldTextInput("datastore name"), "NAME");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Datastore'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['datastore_get'] = {
        init: function() {
          this.appendDummyInput().appendField("get data");
          this.appendValueInput("DATASTORE").setCheck(null).appendField("datastore");
          this.appendValueInput("PLAYER").setCheck(null).appendField("player:");
          this.appendDummyInput().appendField("value:");
          this.appendDummyInput().appendField(createVarLabel("var. _value", getCategoryColor('Datastore')), "VAR_LABEL");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Datastore'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['datastore_save'] = {
        init: function() {
          this.appendDummyInput().appendField("save data");
          this.appendValueInput("DATASTORE").setCheck(null).appendField("datastore");
          this.appendValueInput("PLAYER").setCheck(null).appendField("player:");
          this.appendValueInput("VALUE").setCheck(null).appendField("value:");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Datastore'));
          this.setInputsInline(true);
        }
      };

      // Camera Category
      Blockly.Blocks['camera_get_current'] = {
        init: function() {
          this.appendDummyInput().appendField("Get Current Camera");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Camera'));
        }
      };
      Blockly.Blocks['camera_set_type'] = {
        init: function() {
          this.appendDummyInput().appendField("set camera type to")
              .appendField(new Blockly.FieldDropdown([
                ["Fixed", "Fixed"],
                ["Watch", "Watch"],
                ["Attach", "Attach"],
                ["Track", "Track"],
                ["Follow", "Follow"],
                ["Custom", "Custom"],
                ["Scriptable", "Scriptable"]
              ]), "TYPE");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Camera'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['camera_set_subject'] = {
        init: function() {
          this.appendDummyInput().appendField("Set Camera Subject");
          this.appendValueInput("SUBJECT").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Camera'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['camera_set_cframe'] = {
        init: function() {
          this.appendDummyInput().appendField("Set Camera CFrame");
          this.appendValueInput("CFRAME").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Camera'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['camera_get_cframe'] = {
        init: function() {
          this.appendDummyInput().appendField("Get Camera CFrame");
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Camera'));
        }
      };
      Blockly.Blocks['camera_move'] = {
        init: function() {
          this.appendDummyInput().appendField("Move Camera To");
          this.appendValueInput("POSITION").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Camera'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['camera_look_at'] = {
        init: function() {
          this.appendDummyInput().appendField("Camera Look At");
          this.appendValueInput("TARGET").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Camera'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['camera_shake'] = {
        init: function() {
          this.appendDummyInput().appendField("Shake Camera");
          this.appendValueInput("INTENSITY").setCheck("Number");
          this.appendDummyInput().appendField("Duration");
          this.appendValueInput("DURATION").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Camera'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['camera_zoom'] = {
        init: function() {
          this.appendDummyInput().appendField("Zoom Camera");
          this.appendValueInput("DISTANCE").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Camera'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['camera_set_fov'] = {
        init: function() {
          this.appendDummyInput().appendField("Set Field Of View");
          this.appendValueInput("FOV").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Camera'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['camera_get_fov'] = {
        init: function() {
          this.appendDummyInput().appendField("Get Field Of View");
          this.setOutput(true, "Number");
          this.setColour(getCategoryColor('Camera'));
        }
      };
      Blockly.Blocks['camera_follow_player'] = {
        init: function() {
          this.appendDummyInput().appendField("Camera Follow Player");
          this.appendValueInput("PLAYER").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Camera'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['camera_scriptable'] = {
        init: function() {
          this.appendDummyInput().appendField("Camera Scriptable Mode");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Camera'));
        }
      };
      Blockly.Blocks['camera_reset'] = {
        init: function() {
          this.appendDummyInput().appendField("Reset Camera");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Camera'));
        }
      };

      // Effects Category
      Blockly.Blocks['effects_create_particle'] = {
        init: function() {
          this.appendDummyInput().appendField("Create Particle");
          this.appendValueInput("PARENT").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_emit_particles'] = {
        init: function() {
          this.appendDummyInput().appendField("Emit Particles");
          this.appendValueInput("COUNT").setCheck("Number");
          this.appendDummyInput().appendField("From");
          this.appendValueInput("PARTICLE_EMITTER").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_stop_particles'] = {
        init: function() {
          this.appendDummyInput().appendField("Stop Particles");
          this.appendValueInput("PARTICLE_EMITTER").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_create_explosion'] = {
        init: function() {
          this.appendDummyInput().appendField("Create Explosion");
          this.appendValueInput("POSITION").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_create_highlight'] = {
        init: function() {
          this.appendDummyInput().appendField("Create Highlight");
          this.appendValueInput("PARENT").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_enable_highlight'] = {
        init: function() {
          this.appendDummyInput().appendField("Enable Highlight");
          this.appendValueInput("HIGHLIGHT").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_disable_highlight'] = {
        init: function() {
          this.appendDummyInput().appendField("Disable Highlight");
          this.appendValueInput("HIGHLIGHT").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_create_beam'] = {
        init: function() {
          this.appendDummyInput().appendField("Create Beam");
          this.appendValueInput("PARENT").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_create_trail'] = {
        init: function() {
          this.appendDummyInput().appendField("Create Trail");
          this.appendValueInput("PARENT").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_play_sound'] = {
        init: function() {
          this.appendDummyInput().appendField("Play Sound");
          this.appendValueInput("SOUND").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_stop_sound'] = {
        init: function() {
          this.appendDummyInput().appendField("Stop Sound");
          this.appendValueInput("SOUND").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_set_sound_volume'] = {
        init: function() {
          this.appendDummyInput().appendField("Set Sound Volume");
          this.appendValueInput("SOUND").setCheck(null);
          this.appendDummyInput().appendField("To");
          this.appendValueInput("VOLUME").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_set_sound_pitch'] = {
        init: function() {
          this.appendDummyInput().appendField("Set Sound Pitch");
          this.appendValueInput("SOUND").setCheck(null);
          this.appendDummyInput().appendField("To");
          this.appendValueInput("PITCH").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_create_tween'] = {
        init: function() {
          this.appendDummyInput().appendField("Create Tween");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.appendDummyInput().appendField("With Info");
          this.appendValueInput("INFO").setCheck(null);
          this.appendDummyInput().appendField("Goals");
          this.appendValueInput("GOALS").setCheck(null);
          this.setOutput(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_play_tween'] = {
        init: function() {
          this.appendDummyInput().appendField("Play Tween");
          this.appendValueInput("TWEEN").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_stop_tween'] = {
        init: function() {
          this.appendDummyInput().appendField("Stop Tween");
          this.appendValueInput("TWEEN").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_camera_shake'] = {
        init: function() {
          this.appendDummyInput().appendField("Camera Shake Effect");
          this.appendValueInput("INTENSITY").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_flash_screen'] = {
        init: function() {
          this.appendDummyInput().appendField("Flash Screen");
          this.appendValueInput("COLOR").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_blur'] = {
        init: function() {
          this.appendDummyInput().appendField("Blur Effect");
          this.appendValueInput("SIZE").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_color_correction'] = {
        init: function() {
          this.appendDummyInput().appendField("Color Correction");
          this.appendValueInput("SATURATION").setCheck("Number");
          this.appendDummyInput().appendField("Contrast");
          this.appendValueInput("CONTRAST").setCheck("Number");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      // Input Category
      Blockly.Blocks['input_key_pressed'] = {
        init: function() {
          const keyOptions: [string, string][] = [
            ["Space", "Space"], ["W", "W"], ["A", "A"], ["S", "S"], ["D", "D"],
            ["E", "E"], ["Q", "Q"], ["R", "R"], ["F", "F"], ["Shift", "LeftShift"],
            ["Ctrl", "LeftControl"], ["Alt", "LeftAlt"], ["Enter", "Return"],
            ["Tab", "Tab"], ["Escape", "Escape"], ["Backspace", "Backspace"],
            ["1", "One"], ["2", "Two"], ["3", "Three"], ["4", "Four"], ["5", "Five"],
            ["6", "Six"], ["7", "Seven"], ["8", "Eight"], ["9", "Nine"], ["0", "Zero"],
            ["Up", "Up"], ["Down", "Down"], ["Left", "Left"], ["Right", "Right"]
          ];
          this.appendDummyInput()
              .appendField("Key Pressed")
              .appendField(new Blockly.FieldDropdown(keyOptions as Blockly.MenuOption[]), "KEY")
              .appendField(createVarLabel("var. _input", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };
      Blockly.Blocks['input_key_released'] = {
        init: function() {
          const keyOptions: [string, string][] = [
            ["Space", "Space"], ["W", "W"], ["A", "A"], ["S", "S"], ["D", "D"],
            ["E", "E"], ["Q", "Q"], ["R", "R"], ["F", "F"], ["Shift", "LeftShift"],
            ["Ctrl", "LeftControl"], ["Alt", "LeftAlt"], ["Enter", "Return"],
            ["Tab", "Tab"], ["Escape", "Escape"], ["Backspace", "Backspace"],
            ["1", "One"], ["2", "Two"], ["3", "Three"], ["4", "Four"], ["5", "Five"],
            ["6", "Six"], ["7", "Seven"], ["8", "Eight"], ["9", "Nine"], ["0", "Zero"],
            ["Up", "Up"], ["Down", "Down"], ["Left", "Left"], ["Right", "Right"]
          ];
          this.appendDummyInput()
              .appendField("Key Released")
              .appendField(new Blockly.FieldDropdown(keyOptions as Blockly.MenuOption[]), "KEY")
              .appendField(createVarLabel("var. _input", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };
       Blockly.Blocks['input_mouse_button_down'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Mouse Button Down")
              .appendField(new Blockly.FieldDropdown([
                ["Left", "MouseButton1"],
                ["Right", "MouseButton2"],
                ["Middle", "MouseButton3"]
              ] as Blockly.MenuOption[]), "BUTTON")
              .appendField(createVarLabel("var. _input", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };
      Blockly.Blocks['input_mouse_button_up'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Mouse Button Up")
              .appendField(new Blockly.FieldDropdown([
                ["Left", "MouseButton1"],
                ["Right", "MouseButton2"],
                ["Middle", "MouseButton3"]
              ] as Blockly.MenuOption[]), "BUTTON")
              .appendField(createVarLabel("var. _input", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_mouse_move'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Mouse Move")
              .appendField(createVarLabel("var. _input", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_mouse_position'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Mouse Position");
          this.setOutput(true, "Vector2");
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_is_key_down'] = {
        init: function() {
          const keyOptions: [string, string][] = [
            ["Space", "Space"], ["W", "W"], ["A", "A"], ["S", "S"], ["D", "D"],
            ["E", "E"], ["Q", "Q"], ["R", "R"], ["F", "F"], ["Shift", "LeftShift"],
            ["Ctrl", "LeftControl"], ["Alt", "LeftAlt"], ["Enter", "Return"],
            ["Tab", "Tab"], ["Escape", "Escape"], ["Backspace", "Backspace"],
            ["1", "One"], ["2", "Two"], ["3", "Three"], ["4", "Four"], ["5", "Five"],
            ["6", "Six"], ["7", "Seven"], ["8", "Eight"], ["9", "Nine"], ["0", "Zero"],
            ["Up", "Up"], ["Down", "Down"], ["Left", "Left"], ["Right", "Right"]
          ];
          this.appendDummyInput()
              .appendField("Is Key Down")
              .appendField(new Blockly.FieldDropdown(keyOptions as Blockly.MenuOption[]), "KEY");
          this.setOutput(true, "Boolean");
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_get_keys_pressed'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Get Keys Pressed");
          this.setOutput(true, "Array");
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_touch_started'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Touch Started")
              .appendField(createVarLabel("var. _touch", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_touch_ended'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Touch Ended")
              .appendField(createVarLabel("var. _touch", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_touch_moved'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Touch Moved")
              .appendField(createVarLabel("var. _touch", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_gamepad_button_pressed'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Gamepad Button Pressed")
              .appendField(new Blockly.FieldDropdown([
                ["Button A", "ButtonA"], ["Button B", "ButtonB"], ["Button X", "ButtonX"], ["Button Y", "ButtonY"],
                ["DPad Up", "DPadUp"], ["DPad Down", "DPadDown"], ["DPad Left", "DPadLeft"], ["DPad Right", "DPadRight"],
                ["L1", "ButtonL1"], ["R1", "ButtonR1"], ["L2", "ButtonL2"], ["R2", "ButtonR2"]
              ] as Blockly.MenuOption[]), "BUTTON")
              .appendField(createVarLabel("var. _input", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };
      Blockly.Blocks['input_gamepad_button_released'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Gamepad Button Released")
              .appendField(new Blockly.FieldDropdown([
                ["Button A", "ButtonA"], ["Button B", "ButtonB"], ["Button X", "ButtonX"], ["Button Y", "ButtonY"],
                ["DPad Up", "DPadUp"], ["DPad Down", "DPadDown"], ["DPad Left", "DPadLeft"], ["DPad Right", "DPadRight"],
                ["L1", "ButtonL1"], ["R1", "ButtonR1"], ["L2", "ButtonL2"], ["R2", "ButtonR2"]
              ] as Blockly.MenuOption[]), "BUTTON")
              .appendField(createVarLabel("var. _input", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_began'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Input Began")
              .appendField(createVarLabel("var. _input", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_ended'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Input Ended")
              .appendField(createVarLabel("var. _input", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_changed'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Input Changed")
              .appendField(createVarLabel("var. _input", getCategoryColor('Input')), "VAR_LABEL")
              .appendField("do");
          this.appendStatementInput("DO")
              .setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_lock_mouse'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Lock Mouse");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_unlock_mouse'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Unlock Mouse");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      Blockly.Blocks['input_set_mouse_icon'] = {
        init: function() {
          this.appendValueInput("ICON")
              .setCheck("String")
              .appendField("Set Mouse Icon");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Input'));
        }
      };

      // Effects Category
      Blockly.Blocks['effects_emit'] = {
        init: function() {
          this.appendDummyInput().appendField("emit");
          this.appendValueInput("COUNT").setCheck("Number");
          this.appendDummyInput().appendField("particles from");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_enable'] = {
        init: function() {
          this.appendDummyInput().appendField("enable effect");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_disable'] = {
        init: function() {
          this.appendDummyInput().appendField("disable effect");
          this.appendValueInput("INSTANCE").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };
      Blockly.Blocks['effects_spawn'] = {
        init: function() {
          const typeField = new Blockly.FieldDropdown([
            ["Explosion", "Explosion"],
            ["Sparkles", "Sparkles"],
            ["Fire", "Fire"],
            ["Smoke", "Smoke"]
          ]);

          this.appendDummyInput()
              .appendField("spawn effect")
              .appendField(typeField, "TYPE")
              .appendField("on");
          this.appendValueInput("PARENT").setCheck(null);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(getCategoryColor('Effects'));
          this.setInputsInline(true);
        }
      };

    const defineGenerators = () => {
      // Comment
      luaGenerator.forBlock['comment'] = function(block: any) {
        const text = block.getFieldValue('TEXT');
        return '-- ' + text + '\n';
      };

      // Debug
      luaGenerator.forBlock['print'] = function(block: any) {
        const text = luaGenerator.valueToCode(block, 'TEXT', Order.NONE) || '""';
        return 'print(' + text + ')\n';
      };
      luaGenerator.forBlock['warn'] = function(block: any) {
        const text = luaGenerator.valueToCode(block, 'TEXT', Order.NONE) || '""';
        return 'warn(' + text + ')\n';
      };
      luaGenerator.forBlock['run_lua'] = function(block: any) {
        const code = block.getFieldValue('CODE');
        return code + '\n';
      };

      // Logic
      luaGenerator.forBlock['wait'] = function(block: any) {
        const seconds = luaGenerator.valueToCode(block, 'SECONDS', Order.NONE) || '0';
        return 'task.wait(' + seconds + ')\n';
      };
      luaGenerator.forBlock['lua_if'] = function(block: any) {
        const condition = luaGenerator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
        const branch = luaGenerator.statementToCode(block, 'DO');
        return 'if ' + condition + ' then\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['logic_negate'] = function(block: any) {
        const bool = luaGenerator.valueToCode(block, 'BOOL', Order.UNARY) || 'false';
        return ['not ' + bool, Order.UNARY];
      };
      luaGenerator.forBlock['logic_compare_eq'] = function(block: any) {
        const a = luaGenerator.valueToCode(block, 'A', Order.RELATIONAL) || 'nil';
        const b = luaGenerator.valueToCode(block, 'B', Order.RELATIONAL) || 'nil';
        return [a + ' == ' + b, Order.RELATIONAL];
      };
      luaGenerator.forBlock['logic_compare_lt'] = function(block: any) {
        const a = luaGenerator.valueToCode(block, 'A', Order.RELATIONAL) || '0';
        const b = luaGenerator.valueToCode(block, 'B', Order.RELATIONAL) || '0';
        return [a + ' < ' + b, Order.RELATIONAL];
      };
      luaGenerator.forBlock['logic_compare_gt'] = function(block: any) {
        const a = luaGenerator.valueToCode(block, 'A', Order.RELATIONAL) || '0';
        const b = luaGenerator.valueToCode(block, 'B', Order.RELATIONAL) || '0';
        return [a + ' > ' + b, Order.RELATIONAL];
      };
      luaGenerator.forBlock['logic_compare_neq'] = function(block: any) {
        const a = luaGenerator.valueToCode(block, 'A', Order.RELATIONAL) || 'nil';
        const b = luaGenerator.valueToCode(block, 'B', Order.RELATIONAL) || 'nil';
        return [a + ' ~= ' + b, Order.RELATIONAL];
      };
      luaGenerator.forBlock['logic_boolean_true'] = function() {
        return ['true', Order.ATOMIC];
      };
      luaGenerator.forBlock['logic_boolean_false'] = function() {
        return ['false', Order.ATOMIC];
      };
      luaGenerator.forBlock['logic_operation_and'] = function(block: any) {
        const a = luaGenerator.valueToCode(block, 'A', Order.AND) || 'false';
        const b = luaGenerator.valueToCode(block, 'B', Order.AND) || 'false';
        return [a + ' and ' + b, Order.AND];
      };
      luaGenerator.forBlock['logic_operation_or'] = function(block: any) {
        const a = luaGenerator.valueToCode(block, 'A', Order.OR) || 'false';
        const b = luaGenerator.valueToCode(block, 'B', Order.OR) || 'false';
        return [a + ' or ' + b, Order.OR];
      };

      // Math
      luaGenerator.forBlock['math_number_custom'] = function(block: any) {
        const num = block.getFieldValue('NUM');
        return [num, Order.ATOMIC];
      };
      luaGenerator.forBlock['math_arithmetic_add'] = function(block: any) {
        const a = luaGenerator.valueToCode(block, 'A', Order.ADDITIVE) || '0';
        const b = luaGenerator.valueToCode(block, 'B', Order.ADDITIVE) || '0';
        return [a + ' + ' + b, Order.ADDITIVE];
      };
      luaGenerator.forBlock['math_random_custom'] = function(block: any) {
        const from = luaGenerator.valueToCode(block, 'FROM', Order.NONE) || '1';
        const to = luaGenerator.valueToCode(block, 'TO', Order.NONE) || '10';
        return ['math.random(' + from + ', ' + to + ')', Order.HIGH];
      };
      luaGenerator.forBlock['math_expr_1'] = function(block: any) {
        const num = luaGenerator.valueToCode(block, 'NUM', Order.MULTIPLICATIVE) || '0';
        const expr = block.getFieldValue('EXPR') || '';
        return [num + ' ' + expr, Order.MULTIPLICATIVE];
      };
      luaGenerator.forBlock['math_expr_2'] = function(block: any) {
        const num = luaGenerator.valueToCode(block, 'NUM', Order.MULTIPLICATIVE) || '0';
        const expr = block.getFieldValue('EXPR') || '';
        return [expr + ' ' + num, Order.MULTIPLICATIVE];
      };
      luaGenerator.forBlock['math_round'] = function(block: any) {
        const num = luaGenerator.valueToCode(block, 'NUM', Order.NONE) || '0';
        return ['math.round(' + num + ')', Order.HIGH];
      };
      luaGenerator.forBlock['math_abs'] = function(block: any) {
        const num = luaGenerator.valueToCode(block, 'NUM', Order.NONE) || '0';
        return ['math.abs(' + num + ')', Order.HIGH];
      };
      luaGenerator.forBlock['math_ceil'] = function(block: any) {
        const num = luaGenerator.valueToCode(block, 'NUM', Order.NONE) || '0';
        return ['math.ceil(' + num + ')', Order.HIGH];
      };
      luaGenerator.forBlock['math_floor'] = function(block: any) {
        const num = luaGenerator.valueToCode(block, 'NUM', Order.NONE) || '0';
        return ['math.floor(' + num + ')', Order.HIGH];
      };

      // Text
      luaGenerator.forBlock['text_string_custom'] = function(block: any) {
        const text = block.getFieldValue('TEXT');
        return ['"' + text + '"', Order.ATOMIC];
      };
      luaGenerator.forBlock['text_join_custom'] = function(block: any) {
        const a = luaGenerator.valueToCode(block, 'A', Order.CONCATENATION) || '""';
        const b = luaGenerator.valueToCode(block, 'B', Order.CONCATENATION) || '""';
        return [a + ' .. ' + b, Order.CONCATENATION];
      };
      luaGenerator.forBlock['text_length_custom'] = function(block: any) {
        const text = luaGenerator.valueToCode(block, 'TEXT', Order.UNARY) || '""';
        return ['#' + text, Order.UNARY];
      };
      luaGenerator.forBlock['text_to_upper'] = function(block: any) {
        const text = luaGenerator.valueToCode(block, 'TEXT', Order.NONE) || '""';
        return [text + ':upper()', Order.HIGH];
      };
      luaGenerator.forBlock['text_to_lower'] = function(block: any) {
        const text = luaGenerator.valueToCode(block, 'TEXT', Order.NONE) || '""';
        return [text + ':lower()', Order.HIGH];
      };

      // Values
      luaGenerator.forBlock['values_to_string'] = function(block: any) {
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return ['tostring(' + val + ')', Order.HIGH];
      };
      luaGenerator.forBlock['values_to_number'] = function(block: any) {
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return ['tonumber(' + val + ')', Order.HIGH];
      };

      // Variables
      luaGenerator.forBlock['variables_create'] = function(block: any) {
        const name = block.getFieldValue('VAR');
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return 'local ' + name + ' = ' + val + '\n';
      };
      luaGenerator.forBlock['variables_set_custom'] = function(block: any) {
        const name = block.getFieldValue('VAR');
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return name + ' = ' + val + '\n';
      };
      luaGenerator.forBlock['variables_change_custom'] = function(block: any) {
        const name = block.getFieldValue('VAR');
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '0';
        return name + ' = ' + name + ' + ' + val + '\n';
      };
      luaGenerator.forBlock['variables_get_custom'] = function(block: any) {
        const name = block.getFieldValue('VAR');
        return [name, Order.ATOMIC];
      };
      luaGenerator.forBlock['var_reporter'] = function(block: any) {
        let name = block.getFieldValue('NAME');
        if (name && name.startsWith('var. ')) {
          name = name.substring(5);
        } else if (name && name.startsWith('var.')) {
          name = name.substring(4);
        }
        return [name, Order.ATOMIC];
      };

      const varReporterGenerator = function(block: any): [string, number] {
        let varName = block.getFieldValue('NAME');
        if (varName && varName.startsWith('var. ')) {
          varName = varName.substring(5);
        } else if (varName && varName.startsWith('var.')) {
          varName = varName.substring(4);
        }
        return [varName, Order.ATOMIC];
      };

      ['var_count', 'var_child', 'var_descendant', 'var_instance', 'var_clone', 'var_touched_part', 'var_climb_speed', 'var_humanoid', 'var_character_model', 'var_new_health', 'var_reached_goal', 'var_input', 'var_mouse_input', 'var_touch_input', 'var_player', 'var_click_detector', 'var_productid', 'var_key_input', 'var_received_data', 'var_data', 'var_value', 'var_character', 'var_otherPart', 'var_property', 'var_active', 'var_speed', 'var_deltaTime', 'var_time', 'var_message', 'var_attributeName'].forEach(type => {
        luaGenerator.forBlock[type] = varReporterGenerator;
      });

      // Lists
      luaGenerator.forBlock['lists_empty'] = function() {
        return ['{}', Order.ATOMIC];
      };
      luaGenerator.forBlock['lists_create'] = function() {
        return ['{}', Order.ATOMIC];
      };
      luaGenerator.forBlock['lists_add'] = function(block: any) {
        const list = luaGenerator.valueToCode(block, 'LIST', Order.NONE) || '{}';
        const item = luaGenerator.valueToCode(block, 'ITEM', Order.NONE) || 'nil';
        return 'table.insert(' + list + ', ' + item + ')\n';
      };
      luaGenerator.forBlock['lists_set_item'] = function(block: any) {
        const list = luaGenerator.valueToCode(block, 'LIST', Order.NONE) || '{}';
        const index = luaGenerator.valueToCode(block, 'INDEX', Order.NONE) || '1';
        const item = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return list + '[' + index + '] = ' + item + '\n';
      };
      luaGenerator.forBlock['lists_get_item'] = function(block: any) {
        const list = luaGenerator.valueToCode(block, 'LIST', Order.NONE) || '{}';
        const index = luaGenerator.valueToCode(block, 'INDEX', Order.NONE) || '1';
        return [list + '[' + index + ']', Order.HIGH];
      };
      luaGenerator.forBlock['lists_get'] = function(block: any) {
        const list = luaGenerator.valueToCode(block, 'LIST', Order.NONE) || '{}';
        const index = luaGenerator.valueToCode(block, 'INDEX', Order.NONE) || '1';
        return [list + '[' + index + ']', Order.HIGH];
      };
      luaGenerator.forBlock['lists_insert'] = function(block: any) {
        const list = luaGenerator.valueToCode(block, 'LIST', Order.NONE) || '{}';
        const item = luaGenerator.valueToCode(block, 'ITEM', Order.NONE) || 'nil';
        return 'table.insert(' + list + ', ' + item + ')\n';
      };
      luaGenerator.forBlock['lists_remove'] = function(block: any) {
        const list = luaGenerator.valueToCode(block, 'LIST', Order.NONE) || '{}';
        const index = luaGenerator.valueToCode(block, 'INDEX', Order.NONE) || '1';
        return 'table.remove(' + list + ', ' + index + ')\n';
      };
      luaGenerator.forBlock['lists_length'] = function(block: any) {
        const list = luaGenerator.valueToCode(block, 'LIST', Order.UNARY) || '{}';
        return ['#' + list, Order.UNARY];
      };

      // Loops
      luaGenerator.forBlock['loops_repeat_lua'] = function(block: any) {
        const from = luaGenerator.valueToCode(block, 'FROM', Order.NONE) || '1';
        const to = luaGenerator.valueToCode(block, 'TO', Order.NONE) || '10';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _count').replace('var. ', '');
        return 'for ' + varName + ' = ' + from + ', ' + to + ' do\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['loops_while_lua'] = function(block: any) {
        const condition = luaGenerator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
        const branch = luaGenerator.statementToCode(block, 'DO');
        return 'while ' + condition + ' do\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['loops_for_children'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _child').replace('var. ', '');
        return 'for _, ' + varName + ' in pairs(' + instance + ':GetChildren()) do\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['loops_for_descendants'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _descendant').replace('var. ', '');
        return 'for _, ' + varName + ' in pairs(' + instance + ':GetDescendants()) do\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['loops_break_lua'] = function() {
        return 'break\n';
      };
      luaGenerator.forBlock['loops_repeat'] = function(block: any) {
        const times = luaGenerator.valueToCode(block, 'TIMES', Order.NONE) || '0';
        const branch = luaGenerator.statementToCode(block, 'DO');
        return 'for i = 1, ' + times + ' do\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['loops_while'] = function(block: any) {
        const condition = luaGenerator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
        const branch = luaGenerator.statementToCode(block, 'DO');
        return 'while ' + condition + ' do\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['loops_for'] = function(block: any) {
        const varName = block.getFieldValue('VAR');
        const from = luaGenerator.valueToCode(block, 'FROM', Order.NONE) || '1';
        const to = luaGenerator.valueToCode(block, 'TO', Order.NONE) || '10';
        const branch = luaGenerator.statementToCode(block, 'DO');
        return 'for ' + varName + ' = ' + from + ', ' + to + ' do\n' + branch + 'end\n';
      };

      // World
      luaGenerator.forBlock['world_game'] = function() {
        return ['game', Order.ATOMIC];
      };
      luaGenerator.forBlock['world_workspace'] = function() {
        return ['workspace', Order.ATOMIC];
      };
      luaGenerator.forBlock['world_me'] = function() {
        return ['script.Parent', Order.ATOMIC];
      };
      luaGenerator.forBlock['world_this_script'] = function() {
        return ['script', Order.ATOMIC];
      };
      luaGenerator.forBlock['world_instance'] = function(block: any) {
        const instance = block.getFieldValue('INSTANCE');
        if (instance === 'Instance' || instance === '') return ['nil', Order.ATOMIC];
        return [instance, Order.ATOMIC];
      };
      luaGenerator.forBlock['world_vector3'] = function(block: any) {
        const x = luaGenerator.valueToCode(block, 'X', Order.NONE) || '0';
        const y = luaGenerator.valueToCode(block, 'Y', Order.NONE) || '0';
        const z = luaGenerator.valueToCode(block, 'Z', Order.NONE) || '0';
        return ['Vector3.new(' + x + ', ' + y + ', ' + z + ')', Order.HIGH];
      };
      luaGenerator.forBlock['world_vector3_values'] = function(block: any) {
        const x = block.getFieldValue('X');
        const y = block.getFieldValue('Y');
        const z = block.getFieldValue('Z');
        return ['Vector3.new(' + x + ', ' + y + ', ' + z + ')', Order.HIGH];
      };
      luaGenerator.forBlock['world_get_instance_by_path'] = function(block: any) {
        const path = luaGenerator.valueToCode(block, 'PATH', Order.NONE) || '""';
        return [path.replace(/"/g, ''), Order.HIGH];
      };
      luaGenerator.forBlock['world_set_property_direct'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const property = block.getFieldValue('PROPERTY');
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return instance + '.' + property + ' = ' + val + '\n';
      };
      luaGenerator.forBlock['world_get_property_direct'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const property = block.getFieldValue('PROPERTY');
        return [instance + '.' + property, Order.HIGH];
      };
      luaGenerator.forBlock['world_find_first_child_direct'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const name = block.getFieldValue('NAME');
        return [instance + ':FindFirstChild("' + name + '")', Order.HIGH];
      };
      luaGenerator.forBlock['world_set_property'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const property = luaGenerator.valueToCode(block, 'PROPERTY', Order.NONE) || '""';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return instance + '[' + property + '] = ' + val + '\n';
      };
      luaGenerator.forBlock['world_get_property'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const property = luaGenerator.valueToCode(block, 'PROPERTY', Order.NONE) || '""';
        return [instance + '[' + property + ']', Order.HIGH];
      };
      luaGenerator.forBlock['world_find_first_child'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const name = luaGenerator.valueToCode(block, 'NAME', Order.NONE) || '""';
        return [instance + ':FindFirstChild(' + name + ')', Order.HIGH];
      };
      luaGenerator.forBlock['world_color3'] = function(block: any) {
        const r = luaGenerator.valueToCode(block, 'R', Order.NONE) || '1';
        const g = luaGenerator.valueToCode(block, 'G', Order.NONE) || '1';
        const b = luaGenerator.valueToCode(block, 'B', Order.NONE) || '1';
        return ['Color3.new(' + r + ', ' + g + ', ' + b + ')', Order.HIGH];
      };
      luaGenerator.forBlock['world_color3_values'] = function(block: any) {
        const r = block.getFieldValue('R');
        const g = block.getFieldValue('G');
        const b = block.getFieldValue('B');
        return ['Color3.new(' + r + ', ' + g + ', ' + b + ')', Order.HIGH];
      };
      luaGenerator.forBlock['world_create_instance_direct'] = function(block: any) {
        const className = block.getFieldValue('CLASS');
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'nil';
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _instance').replace('var. ', '');
        return 'local ' + varName + ' = Instance.new("' + className + '", ' + parent + ')\n';
      };
      luaGenerator.forBlock['world_clone_instance'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _clone').replace('var. ', '');
        return 'local ' + varName + ' = ' + instance + ':Clone()\n';
      };

      // Instance
      luaGenerator.forBlock['instance_new'] = function(block: any) {
        const className = block.getFieldValue('CLASS');
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'nil';
        return [`Instance.new("${className}", ${parent})`, Order.ATOMIC];
      };
      luaGenerator.forBlock['instance_destroy'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return instance + ':Destroy()\n';
      };
      luaGenerator.forBlock['instance_wait_for_child'] = function(block: any) {
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'script.Parent';
        const name = luaGenerator.valueToCode(block, 'NAME', Order.NONE) || '""';
        return [`${parent}:WaitForChild(${name})`, Order.ATOMIC];
      };
      luaGenerator.forBlock['instance_find_first_child'] = function(block: any) {
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'script.Parent';
        const name = luaGenerator.valueToCode(block, 'NAME', Order.NONE) || '""';
        return [`${parent}:FindFirstChild(${name})`, Order.ATOMIC];
      };
      luaGenerator.forBlock['instance_get_children'] = function(block: any) {
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'script.Parent';
        return [`${parent}:GetChildren()`, Order.ATOMIC];
      };
      luaGenerator.forBlock['instance_get_descendants'] = function(block: any) {
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'script.Parent';
        return [`${parent}:GetDescendants()`, Order.ATOMIC];
      };
      luaGenerator.forBlock['instance_clone'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return [`${instance}:Clone()`, Order.ATOMIC];
      };
      luaGenerator.forBlock['instance_child_added'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _child').replace('var. ', '');
        return instance + '.ChildAdded:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['instance_child_removed'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _child').replace('var. ', '');
        return instance + '.ChildRemoved:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['instance_descendant_added'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _descendant').replace('var. ', '');
        return instance + '.DescendantAdded:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['instance_descendant_removing'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _descendant').replace('var. ', '');
        return instance + '.DescendantRemoving:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['instance_is_a'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const className = block.getFieldValue('CLASS');
        return [instance + ':IsA("' + className + '")', Order.HIGH];
      };
      luaGenerator.forBlock['instance_set_name'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const name = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '""';
        return instance + '.Name = ' + name + '\n';
      };
      luaGenerator.forBlock['instance_get_name'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return [instance + '.Name', Order.HIGH];
      };
      luaGenerator.forBlock['instance_set_parent'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const parent = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return instance + '.Parent = ' + parent + '\n';
      };
      luaGenerator.forBlock['instance_get_parent'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return [instance + '.Parent', Order.HIGH];
      };

      // Part
      luaGenerator.forBlock['part_get_transparency'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return [instance + '.Transparency', Order.HIGH];
      };
      luaGenerator.forBlock['part_set_transparency'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '0';
        return instance + '.Transparency = ' + val + '\n';
      };
      luaGenerator.forBlock['part_set_anchored'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const val = block.getFieldValue('VALUE') === 'TRUE' ? 'true' : 'false';
        return instance + '.Anchored = ' + val + '\n';
      };
      luaGenerator.forBlock['part_set_cancollide'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const val = block.getFieldValue('VALUE') === 'TRUE' ? 'true' : 'false';
        return instance + '.CanCollide = ' + val + '\n';
      };
      luaGenerator.forBlock['part_set_cantouch'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const val = block.getFieldValue('VALUE') === 'TRUE' ? 'true' : 'false';
        return instance + '.CanTouch = ' + val + '\n';
      };
      luaGenerator.forBlock['part_set_castshadow'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const val = block.getFieldValue('VALUE') === 'TRUE' ? 'true' : 'false';
        return instance + '.CastShadow = ' + val + '\n';
      };
      luaGenerator.forBlock['part_set_color'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'Color3.new(1,1,1)';
        return instance + '.Color = ' + val + '\n';
      };
      luaGenerator.forBlock['part_set_orientation'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'Vector3.new(0,0,0)';
        return instance + '.Orientation = ' + val + '\n';
      };
      luaGenerator.forBlock['part_get_orientation'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return [instance + '.Orientation', Order.HIGH];
      };
      luaGenerator.forBlock['part_set_position'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'Vector3.new(0,0,0)';
        return instance + '.Position = ' + val + '\n';
      };
      luaGenerator.forBlock['part_get_position'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return [instance + '.Position', Order.HIGH];
      };
      luaGenerator.forBlock['part_set_size'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'Vector3.new(1,1,1)';
        return instance + '.Size = ' + val + '\n';
      };
      luaGenerator.forBlock['part_get_size'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return [instance + '.Size', Order.HIGH];
      };
      luaGenerator.forBlock['part_touched_by_part'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _touched_part').replace('var. ', '');
        return instance + '.Touched:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['part_touched_by_character'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _touched_part').replace('var. ', '');
        return instance + '.Touched:Connect(function(' + varName + ')\n  local character = ' + varName + '.Parent\n  local humanoid = character:FindFirstChildOfClass("Humanoid")\n  if humanoid then\n' + branch + '  end\nend)\n';
      };

      // Character
      luaGenerator.forBlock['character_damage'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const amount = luaGenerator.valueToCode(block, 'NUMBER', Order.NONE) || '0';
        return humanoid + ':TakeDamage(' + amount + ')\n';
      };
      luaGenerator.forBlock['character_is_climbing'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _climb_speed').replace('var. ', '');
        return humanoid + '.Climbing:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['character_died'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        return humanoid + '.Died:Connect(function()\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['character_equip_tool'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const tool = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return humanoid + ':EquipTool(' + tool + ')\n';
      };
      luaGenerator.forBlock['character_get_humanoid'] = function(block: any) {
        const model = luaGenerator.valueToCode(block, 'MODEL', Order.NONE) || 'nil';
        const varName = block.getFieldValue('VAR_LABEL') || 'var. _humanoid';
        const cleanVarName = varName.replace('var. ', '');
        return 'local ' + cleanVarName + ' = ' + model + ':FindFirstChildOfClass("Humanoid")\n';
      };
      luaGenerator.forBlock['character_get_model_from_humanoid'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const varName = block.getFieldValue('VAR_LABEL') || 'var. _character_model';
        const cleanVarName = varName.replace('var. ', '');
        return 'local ' + cleanVarName + ' = ' + humanoid + '.Parent\n';
      };
      luaGenerator.forBlock['character_set_health'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '100';
        return humanoid + '.Health = ' + val + '\n';
      };
      luaGenerator.forBlock['character_health_changed'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _new_health').replace('var. ', '');
        return humanoid + '.HealthChanged:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['character_jump'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        return humanoid + '.Jump = true\n';
      };
      luaGenerator.forBlock['character_set_jump_height'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '7.2';
        return humanoid + '.JumpHeight = ' + val + '\n';
      };
      luaGenerator.forBlock['character_set_jump_power'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '50';
        return humanoid + '.JumpPower = ' + val + '\n';
      };
      luaGenerator.forBlock['character_kill'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        return humanoid + '.Health = 0\n';
      };
      luaGenerator.forBlock['character_set_max_health'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '100';
        return humanoid + '.MaxHealth = ' + val + '\n';
      };
      luaGenerator.forBlock['character_move_to'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const pos = luaGenerator.valueToCode(block, 'POSITION', Order.NONE) || 'Vector3.new(0,0,0)';
        return humanoid + ':MoveTo(' + pos + ')\n';
      };
      luaGenerator.forBlock['character_finished_moving'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _reached_goal').replace('var. ', '');
        return humanoid + '.MoveToFinished:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['character_player_of'] = function(block: any) {
        const char = luaGenerator.valueToCode(block, 'CHARACTER', Order.NONE) || 'nil';
        const varName = block.getFieldValue('VAR_LABEL') || 'var. _player';
        const cleanVarName = varName.replace('var. ', '');
        return 'local ' + cleanVarName + ' = game.Players:GetPlayerFromCharacter(' + char + ')\n';
      };
      luaGenerator.forBlock['character_unequip_tool'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        return humanoid + ':UnequipTools()\n';
      };
      luaGenerator.forBlock['character_set_walk_speed'] = function(block: any) {
        const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '16';
        return humanoid + '.WalkSpeed = ' + val + '\n';
      };

      // Model
      luaGenerator.forBlock['model_break_joints'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return instance + ':BreakJoints()\n';
      };
      luaGenerator.forBlock['model_get_orientation'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return [instance + ':GetPrimaryPartOrientation()', Order.HIGH];
      };
      luaGenerator.forBlock['model_get_position'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return [instance + ':GetPrimaryPartCFrame().Position', Order.HIGH];
      };
      luaGenerator.forBlock['model_get_size'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return [instance + ':GetExtentsSize()', Order.HIGH];
      };
      luaGenerator.forBlock['model_set_primary_part'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const part = luaGenerator.valueToCode(block, 'PART', Order.NONE) || 'nil';
        return instance + '.PrimaryPart = ' + part + '\n';
      };
      luaGenerator.forBlock['model_set_orientation'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'Vector3.new(0,0,0)';
        return instance + ':SetPrimaryPartOrientation(' + val + ')\n';
      };
      luaGenerator.forBlock['model_set_position'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'Vector3.new(0,0,0)';
        return instance + ':MoveTo(' + val + ')\n';
      };

      // Gui
      luaGenerator.forBlock['gui_get_mouse'] = function() {
        return ['game:GetService("Players").LocalPlayer:GetMouse()', Order.ATOMIC];
      };
      luaGenerator.forBlock['gui_get_player_gui'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'game:GetService("Players").LocalPlayer';
        return [`${player}:WaitForChild("PlayerGui")`, Order.ATOMIC];
      };
      luaGenerator.forBlock['gui_new_instance'] = function(block: any) {
        const className = block.getFieldValue('CLASS');
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'nil';
        return [`Instance.new("${className}", ${parent})`, Order.ATOMIC];
      };
      luaGenerator.forBlock['gui_button_clicked'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        return instance + '.MouseButton1Click:Connect(function()\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['gui_input_began'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return instance + '.InputBegan:Connect(function(' + varName + ', _processed)\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['gui_input_ended'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return instance + '.InputEnded:Connect(function(' + varName + ', _processed)\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['gui_is_left_mouse'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _mouse_input').replace('var. ', '');
        return 'if ' + input + '.UserInputType == Enum.UserInputType.MouseButton1 then\n  local ' + varName + ' = ' + input + '\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['gui_is_middle_mouse'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _mouse_input').replace('var. ', '');
        return 'if ' + input + '.UserInputType == Enum.UserInputType.MouseButton3 then\n  local ' + varName + ' = ' + input + '\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['gui_is_right_mouse'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _mouse_input').replace('var. ', '');
        return 'if ' + input + '.UserInputType == Enum.UserInputType.MouseButton2 then\n  local ' + varName + ' = ' + input + '\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['gui_is_touch'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _touch_input').replace('var. ', '');
        return 'if ' + input + '.UserInputType == Enum.UserInputType.Touch then\n  local ' + varName + ' = ' + input + '\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['gui_mouse_position'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        return [input + '.Position', Order.HIGH];
      };
      luaGenerator.forBlock['gui_set_invisible'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return instance + '.Visible = false\n';
      };
      luaGenerator.forBlock['gui_set_visible'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return instance + '.Visible = true\n';
      };
      luaGenerator.forBlock['gui_touch_position'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        return [input + '.Position', Order.HIGH];
      };

      // Player
      luaGenerator.forBlock['player_get_character'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        return [player + '.Character', Order.HIGH];
      };
      luaGenerator.forBlock['player_get_by_name'] = function(block: any) {
        const name = luaGenerator.valueToCode(block, 'NAME', Order.NONE) || '""';
        return ['game.Players:FindFirstChild(' + name + ')', Order.HIGH];
      };
      luaGenerator.forBlock['player_kick'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        const reason = luaGenerator.valueToCode(block, 'REASON', Order.NONE) || '""';
        return player + ':Kick(' + reason + ')\n';
      };
      luaGenerator.forBlock['player_get_user_id'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        return [player + '.UserId', Order.HIGH];
      };
      luaGenerator.forBlock['player_joined'] = function(block: any) {
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _player').replace('var. ', '');
        return 'game.Players.PlayerAdded:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['player_leaving'] = function(block: any) {
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _player').replace('var. ', '');
        return 'game.Players.PlayerRemoving:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['player_chat_added'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. message').replace('var. ', '');
        return player + '.Chatted:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['player_respawned'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. character').replace('var. ', '');
        return player + '.CharacterAdded:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };

      // Clickdetector
      luaGenerator.forBlock['clickdetector_add'] = function(block: any) {
        const parent = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        return 'Instance.new("ClickDetector", ' + parent + ')\n';
      };
      luaGenerator.forBlock['clickdetector_clicked'] = function(block: any) {
        const cd = luaGenerator.valueToCode(block, 'CLICK_DETECTOR', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _player').replace('var. ', '');
        return cd + '.MouseClick:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['clickdetector_hover_enter'] = function(block: any) {
        const cd = luaGenerator.valueToCode(block, 'CLICK_DETECTOR', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _player').replace('var. ', '');
        return cd + '.MouseHoverEnter:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['clickdetector_hover_leave'] = function(block: any) {
        const cd = luaGenerator.valueToCode(block, 'CLICK_DETECTOR', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _player').replace('var. ', '');
        return cd + '.MouseHoverLeave:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['clickdetector_right_clicked'] = function(block: any) {
        const cd = luaGenerator.valueToCode(block, 'CLICK_DETECTOR', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _player').replace('var. ', '');
        return cd + '.RightMouseClick:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };

      // Marketplace
      luaGenerator.forBlock['marketplace_owns_asset'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        const assetId = luaGenerator.valueToCode(block, 'ASSET_ID', Order.NONE) || '0';
        return ['game:GetService("MarketplaceService"):PlayerOwnsAsset(' + player + ', ' + assetId + ')', Order.HIGH];
      };
      luaGenerator.forBlock['marketplace_owns_gamepass'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || '0';
        const gamepassId = luaGenerator.valueToCode(block, 'GAMEPASS_ID', Order.NONE) || '0';
        return ['game:GetService("MarketplaceService"):UserOwnsGamePassAsync(' + player + ', ' + gamepassId + ')', Order.HIGH];
      };
      luaGenerator.forBlock['marketplace_product_bought'] = function(block: any) {
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varPlayer = (block.getFieldValue('VAR_LABEL_PLAYER') || 'var. _player').replace('var. ', '');
        const varProduct = (block.getFieldValue('VAR_LABEL_PRODUCT') || 'var. _productId').replace('var. ', '');
        return 'game:GetService("MarketplaceService").ProcessReceipt = function(receiptInfo)\n  local ' + varPlayer + ' = game.Players:GetPlayerByUserId(receiptInfo.PlayerId)\n  local ' + varProduct + ' = receiptInfo.ProductId\n' + branch + '\n  return Enum.ProductPurchaseDecision.PurchaseGranted\nend\n';
      };
      luaGenerator.forBlock['marketplace_prompt_asset'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        const assetId = luaGenerator.valueToCode(block, 'ASSET_ID', Order.NONE) || '0';
        return 'game:GetService("MarketplaceService"):PromptPurchase(' + player + ', ' + assetId + ')\n';
      };
      luaGenerator.forBlock['marketplace_prompt_gamepass'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        const gamepassId = luaGenerator.valueToCode(block, 'GAMEPASS_ID', Order.NONE) || '0';
        return 'game:GetService("MarketplaceService"):PromptGamePassPurchase(' + player + ', ' + gamepassId + ')\n';
      };
      luaGenerator.forBlock['marketplace_prompt_product'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        const productId = luaGenerator.valueToCode(block, 'PRODUCT_ID', Order.NONE) || '0';
        return 'game:GetService("MarketplaceService"):PromptProductPurchase(' + player + ', ' + productId + ')\n';
      };

      // Tweening
      luaGenerator.forBlock['tween_animate'] = function(block: any) {
        const prop = luaGenerator.valueToCode(block, 'PROPERTY', Order.NONE) || '""';
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
        const goal = luaGenerator.valueToCode(block, 'GOAL', Order.NONE) || '{}';
        const info = luaGenerator.valueToCode(block, 'TWEEN_INFO', Order.NONE) || 'TweenInfo.new()';
        return 'game:GetService("TweenService"):Create(' + instance + ', ' + info + ', ' + goal + '):Play()\n';
      };
      luaGenerator.forBlock['tween_info_create'] = function(block: any) {
        const time = luaGenerator.valueToCode(block, 'TIME', Order.NONE) || '1';
        const style = block.getFieldValue('STYLE') || 'Sine';
        const dir = block.getFieldValue('DIRECTION');
        return ['TweenInfo.new(' + time + ', Enum.EasingStyle.' + style + ', Enum.EasingDirection.' + dir + ')', Order.HIGH];
      };

      // Client
      luaGenerator.forBlock['client_fire_server'] = function(block: any) {
        const event = luaGenerator.valueToCode(block, 'EVENT', Order.NONE) || 'nil';
        const data = luaGenerator.valueToCode(block, 'DATA', Order.NONE) || 'nil';
        return event + ':FireServer(' + data + ')\n';
      };
      luaGenerator.forBlock['client_input_began'] = function(block: any) {
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return 'game:GetService("UserInputService").InputBegan:Connect(function(' + varName + ', _processed)\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['client_input_ended'] = function(block: any) {
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return 'game:GetService("UserInputService").InputEnded:Connect(function(' + varName + ', _processed)\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['client_is_keyboard'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _key_input').replace('var. ', '');
        return 'if ' + input + '.UserInputType == Enum.UserInputType.Keyboard then\n  local ' + varName + ' = ' + input + '.KeyCode\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['client_is_left_mouse'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _mouse_input').replace('var. ', '');
        return 'if ' + input + '.UserInputType == Enum.UserInputType.MouseButton1 then\n  local ' + varName + ' = ' + input + '\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['client_is_middle_mouse'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _mouse_input').replace('var. ', '');
        return 'if ' + input + '.UserInputType == Enum.UserInputType.MouseButton3 then\n  local ' + varName + ' = ' + input + '\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['client_is_right_mouse'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _mouse_input').replace('var. ', '');
        return 'if ' + input + '.UserInputType == Enum.UserInputType.MouseButton2 then\n  local ' + varName + ' = ' + input + '\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['client_is_touch'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _touch_input').replace('var. ', '');
        return 'if ' + input + '.UserInputType == Enum.UserInputType.Touch then\n  local ' + varName + ' = ' + input + '\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['client_key_is'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'KEY', Order.NONE) || 'nil';
        const keyName = block.getFieldValue('KEY_NAME') || 'Space';
        const branch = luaGenerator.statementToCode(block, 'DO');
        return 'if ' + input + '.KeyCode == Enum.KeyCode.' + keyName + ' then\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['client_local_player'] = function() {
        return ['game.Players.LocalPlayer', Order.ATOMIC];
      };
      luaGenerator.forBlock['client_mouse_position'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        return [input + '.Position', Order.HIGH];
      };
      luaGenerator.forBlock['client_fired_by_server'] = function(block: any) {
        const event = luaGenerator.valueToCode(block, 'EVENT', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _received_data').replace('var. ', '');
        return event + '.OnClientEvent:Connect(function(' + varName + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['client_touch_position'] = function(block: any) {
        const input = luaGenerator.valueToCode(block, 'INPUT', Order.NONE) || 'nil';
        return [input + '.Position', Order.HIGH];
      };

      // Server
      luaGenerator.forBlock['server_fired_by_client'] = function(block: any) {
        const event = luaGenerator.valueToCode(block, 'EVENT', Order.NONE) || 'nil';
        const branch = luaGenerator.statementToCode(block, 'DO');
        const varPlayer = (block.getFieldValue('VAR_LABEL_PLAYER') || 'var. _player').replace('var. ', '');
        const varData = (block.getFieldValue('VAR_LABEL_DATA') || 'var. _data').replace('var. ', '');
        return event + '.OnServerEvent:Connect(function(' + varPlayer + ', ' + varData + ')\n' + branch + 'end)\n';
      };
      luaGenerator.forBlock['server_fire_all_clients'] = function(block: any) {
        const event = luaGenerator.valueToCode(block, 'EVENT', Order.NONE) || 'nil';
        const data = luaGenerator.valueToCode(block, 'DATA', Order.NONE) || 'nil';
        return event + ':FireAllClients(' + data + ')\n';
      };
      luaGenerator.forBlock['server_fire_client'] = function(block: any) {
        const event = luaGenerator.valueToCode(block, 'EVENT', Order.NONE) || 'nil';
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        const data = luaGenerator.valueToCode(block, 'DATA', Order.NONE) || 'nil';
        return event + ':FireClient(' + player + ', ' + data + ')\n';
      };

      // Leaderstats
      luaGenerator.forBlock['leaderstats_create_number'] = function(block: any) {
        const name = block.getFieldValue('NAME');
        const def = luaGenerator.valueToCode(block, 'DEFAULT', Order.NONE) || '0';
        return 'local val = Instance.new("NumberValue")\nval.Name = "' + name + '"\nval.Value = ' + def + '\nval.Parent = leaderstats\n';
      };
      luaGenerator.forBlock['leaderstats_create_string'] = function(block: any) {
        const name = block.getFieldValue('NAME');
        const def = luaGenerator.valueToCode(block, 'DEFAULT', Order.NONE) || '""';
        return 'local val = Instance.new("StringValue")\nval.Name = "' + name + '"\nval.Value = ' + def + '\nval.Parent = leaderstats\n';
      };
      luaGenerator.forBlock['leaderstats_enable'] = function() {
        return 'game.Players.PlayerAdded:Connect(function(player)\n  local leaderstats = Instance.new("Folder")\n  leaderstats.Name = "leaderstats"\n  leaderstats.Parent = player\nend)\n';
      };
      luaGenerator.forBlock['leaderstats_get'] = function(block: any) {
        const name = block.getFieldValue('NAME');
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        return [player + '.leaderstats.' + name + '.Value', Order.HIGH];
      };
      luaGenerator.forBlock['leaderstats_set'] = function(block: any) {
        const name = block.getFieldValue('NAME');
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return player + '.leaderstats.' + name + '.Value = ' + val + '\n';
      };

      // Functions
      luaGenerator.forBlock['functions_define'] = function(block: any) {
        const name = block.getFieldValue('NAME');
        const args = block.getFieldValue('ARGS') || '';
        const branch = luaGenerator.statementToCode(block, 'STACK');
        return 'local function ' + name + '(' + args + ')\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['functions_call'] = function(block: any) {
        const name = block.getFieldValue('NAME');
        const args = block.getFieldValue('ARGS') || '';
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _result').replace('var. ', '');
        return 'local ' + varName + ' = ' + name + '(' + args + ')\n';
      };
      luaGenerator.forBlock['functions_return'] = function(block: any) {
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return 'return ' + val + '\n';
      };
      luaGenerator.forBlock['functions_define_global'] = function(block: any) {
        const name = block.getFieldValue('NAME');
        const args = block.getFieldValue('ARGS') || '';
        const branch = luaGenerator.statementToCode(block, 'STACK');
        return '_G.' + name + ' = function(' + args + ')\n' + branch + 'end\n';
      };
      luaGenerator.forBlock['functions_call_global'] = function(block: any) {
        const name = block.getFieldValue('NAME');
        const args = block.getFieldValue('ARGS') || '';
        return '_G.' + name + '(' + args + ')\n';
      };

      // Datastore
      luaGenerator.forBlock['datastore_setup'] = function() {
        return 'local DataStoreService = game:GetService("DataStoreService")\n';
      };
      luaGenerator.forBlock['datastore_instance'] = function(block: any) {
        const name = block.getFieldValue('NAME');
        return ['DataStoreService:GetDataStore("' + name + '")', Order.HIGH];
      };
      luaGenerator.forBlock['datastore_use'] = function(block: any) {
        const name = block.getFieldValue('NAME');
        return 'local ds = DataStoreService:GetDataStore("' + name + '")\n';
      };
      luaGenerator.forBlock['datastore_get'] = function(block: any) {
        const ds = luaGenerator.valueToCode(block, 'DATASTORE', Order.NONE) || 'nil';
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _value').replace('var. ', '');
        return 'local ' + varName + ' = ' + ds + ':GetAsync(' + player + '.UserId)\n';
      };
      luaGenerator.forBlock['datastore_save'] = function(block: any) {
        const ds = luaGenerator.valueToCode(block, 'DATASTORE', Order.NONE) || 'nil';
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return 'pcall(function()\n  ' + ds + ':SetAsync(' + player + '.UserId, ' + val + ')\nend)\n';
      };

      // Camera
      luaGenerator.forBlock['camera_get_current'] = function() {
        return ['workspace.CurrentCamera', Order.ATOMIC];
      };
      luaGenerator.forBlock['camera_set_type'] = function(block: any) {
        const type = block.getFieldValue('TYPE');
        return `workspace.CurrentCamera.CameraType = Enum.CameraType.${type}\n`;
      };
      luaGenerator.forBlock['camera_set_subject'] = function(block: any) {
        const subject = luaGenerator.valueToCode(block, 'SUBJECT', Order.ATOMIC) || 'nil';
        return `workspace.CurrentCamera.CameraSubject = ${subject}\n`;
      };
      luaGenerator.forBlock['camera_set_cframe'] = function(block: any) {
        const cframe = luaGenerator.valueToCode(block, 'CFRAME', Order.ATOMIC) || 'CFrame.new()';
        return `workspace.CurrentCamera.CFrame = ${cframe}\n`;
      };
      luaGenerator.forBlock['camera_get_cframe'] = function() {
        return ['workspace.CurrentCamera.CFrame', Order.ATOMIC];
      };
      luaGenerator.forBlock['camera_move'] = function(block: any) {
        const position = luaGenerator.valueToCode(block, 'POSITION', Order.ATOMIC) || 'Vector3.new(0,0,0)';
        return `workspace.CurrentCamera.CFrame = CFrame.new(${position})\n`;
      };
      luaGenerator.forBlock['camera_look_at'] = function(block: any) {
        const target = luaGenerator.valueToCode(block, 'TARGET', Order.ATOMIC) || 'Vector3.new(0,0,0)';
        return `workspace.CurrentCamera.CFrame = CFrame.new(workspace.CurrentCamera.CFrame.Position, ${target})\n`;
      };
      luaGenerator.forBlock['camera_shake'] = function(block: any) {
        const intensity = luaGenerator.valueToCode(block, 'INTENSITY', Order.ATOMIC) || '1';
        return `local cam = workspace.CurrentCamera\nlocal pos = cam.CFrame.Position\nlocal rot = cam.CFrame - pos\ncam.CFrame = CFrame.new(pos + Vector3.new(math.random(-${intensity}, ${intensity}), math.random(-${intensity}, ${intensity}), math.random(-${intensity}, ${intensity}))) * rot\n`;
      };
      luaGenerator.forBlock['camera_zoom'] = function(block: any) {
        const distance = luaGenerator.valueToCode(block, 'DISTANCE', Order.ATOMIC) || '10';
        return `workspace.CurrentCamera.FieldOfView = workspace.CurrentCamera.FieldOfView - ${distance}\n`;
      };
      luaGenerator.forBlock['camera_set_fov'] = function(block: any) {
        const fov = luaGenerator.valueToCode(block, 'FOV', Order.ATOMIC) || '70';
        return `workspace.CurrentCamera.FieldOfView = ${fov}\n`;
      };
      luaGenerator.forBlock['camera_get_fov'] = function() {
        return ['workspace.CurrentCamera.FieldOfView', Order.ATOMIC];
      };
      luaGenerator.forBlock['camera_follow_player'] = function(block: any) {
        const player = luaGenerator.valueToCode(block, 'PLAYER', Order.ATOMIC) || 'nil';
        return `workspace.CurrentCamera.CameraSubject = ${player}.Character:FindFirstChild("Humanoid")\nworkspace.CurrentCamera.CameraType = Enum.CameraType.Follow\n`;
      };
      luaGenerator.forBlock['camera_scriptable'] = function() {
        return `workspace.CurrentCamera.CameraType = Enum.CameraType.Scriptable\n`;
      };
      luaGenerator.forBlock['camera_reset'] = function() {
        return `workspace.CurrentCamera.CameraType = Enum.CameraType.Custom\nworkspace.CurrentCamera.CameraSubject = game.Players.LocalPlayer.Character:FindFirstChild("Humanoid")\n`;
      };

      // Input
      luaGenerator.forBlock['input_key_pressed'] = function(block: any) {
        const key = block.getFieldValue('KEY');
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return `game:GetService("UserInputService").InputBegan:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed and ${varName}.KeyCode == Enum.KeyCode.${key} then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_key_released'] = function(block: any) {
        const key = block.getFieldValue('KEY');
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return `game:GetService("UserInputService").InputEnded:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed and ${varName}.KeyCode == Enum.KeyCode.${key} then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_mouse_button_down'] = function(block: any) {
        const button = block.getFieldValue('BUTTON');
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return `game:GetService("UserInputService").InputBegan:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed and ${varName}.UserInputType == Enum.UserInputType.${button} then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_mouse_button_up'] = function(block: any) {
        const button = block.getFieldValue('BUTTON');
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return `game:GetService("UserInputService").InputEnded:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed and ${varName}.UserInputType == Enum.UserInputType.${button} then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_mouse_move'] = function(block: any) {
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return `game:GetService("UserInputService").InputChanged:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed and ${varName}.UserInputType == Enum.UserInputType.MouseMovement then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_mouse_position'] = function(block: any) {
        return ['game:GetService("UserInputService"):GetMouseLocation()', Order.ATOMIC];
      };

      luaGenerator.forBlock['input_is_key_down'] = function(block: any) {
        const key = block.getFieldValue('KEY');
        return [`game:GetService("UserInputService"):IsKeyDown(Enum.KeyCode.${key})`, Order.ATOMIC];
      };

      luaGenerator.forBlock['input_get_keys_pressed'] = function(block: any) {
        return ['game:GetService("UserInputService"):GetKeysPressed()', Order.ATOMIC];
      };

      luaGenerator.forBlock['input_touch_started'] = function(block: any) {
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _touch').replace('var. ', '');
        return `game:GetService("UserInputService").TouchStarted:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_touch_ended'] = function(block: any) {
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _touch').replace('var. ', '');
        return `game:GetService("UserInputService").TouchEnded:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_touch_moved'] = function(block: any) {
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _touch').replace('var. ', '');
        return `game:GetService("UserInputService").TouchMoved:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_gamepad_button_pressed'] = function(block: any) {
        const button = block.getFieldValue('BUTTON');
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return `game:GetService("UserInputService").InputBegan:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed and ${varName}.KeyCode == Enum.KeyCode.${button} then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_gamepad_button_released'] = function(block: any) {
        const button = block.getFieldValue('BUTTON');
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return `game:GetService("UserInputService").InputEnded:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed and ${varName}.KeyCode == Enum.KeyCode.${button} then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_began'] = function(block: any) {
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return `game:GetService("UserInputService").InputBegan:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_ended'] = function(block: any) {
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return `game:GetService("UserInputService").InputEnded:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_changed'] = function(block: any) {
        const doCode = luaGenerator.statementToCode(block, 'DO');
        const varName = (block.getFieldValue('VAR_LABEL') || 'var. _input').replace('var. ', '');
        return `game:GetService("UserInputService").InputChanged:Connect(function(${varName}, gameProcessed)\n  if not gameProcessed then\n${doCode}  end\nend)\n`;
      };

      luaGenerator.forBlock['input_lock_mouse'] = function(block: any) {
        return `game:GetService("UserInputService").MouseBehavior = Enum.MouseBehavior.LockCenter\n`;
      };

      luaGenerator.forBlock['input_unlock_mouse'] = function(block: any) {
        return `game:GetService("UserInputService").MouseBehavior = Enum.MouseBehavior.Default\n`;
      };

      luaGenerator.forBlock['input_set_mouse_icon'] = function(block: any) {
        const icon = luaGenerator.valueToCode(block, 'ICON', Order.ATOMIC) || '""';
        return `game:GetService("UserInputService").MouseIconEnabled = true\ngame:GetService("UserInputService").MouseIcon = ${icon}\n`;
      };

      // Effects
      luaGenerator.forBlock['effects_create_particle'] = function(block: any) {
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.ATOMIC) || 'workspace';
        return [`Instance.new("ParticleEmitter", ${parent})`, Order.ATOMIC];
      };
      luaGenerator.forBlock['effects_emit_particles'] = function(block: any) {
        const count = luaGenerator.valueToCode(block, 'COUNT', Order.ATOMIC) || '10';
        const emitter = luaGenerator.valueToCode(block, 'PARTICLE_EMITTER', Order.ATOMIC) || 'nil';
        return `${emitter}:Emit(${count})\n`;
      };
      luaGenerator.forBlock['effects_stop_particles'] = function(block: any) {
        const emitter = luaGenerator.valueToCode(block, 'PARTICLE_EMITTER', Order.ATOMIC) || 'nil';
        return `${emitter}.Enabled = false\n`;
      };
      luaGenerator.forBlock['effects_create_explosion'] = function(block: any) {
        const position = luaGenerator.valueToCode(block, 'POSITION', Order.ATOMIC) || 'Vector3.new(0,0,0)';
        return `local exp = Instance.new("Explosion")\nexp.Position = ${position}\nexp.Parent = workspace\n`;
      };
      luaGenerator.forBlock['effects_create_highlight'] = function(block: any) {
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.ATOMIC) || 'workspace';
        return [`Instance.new("Highlight", ${parent})`, Order.ATOMIC];
      };
      luaGenerator.forBlock['effects_enable_highlight'] = function(block: any) {
        const highlight = luaGenerator.valueToCode(block, 'HIGHLIGHT', Order.ATOMIC) || 'nil';
        return `${highlight}.Enabled = true\n`;
      };
      luaGenerator.forBlock['effects_disable_highlight'] = function(block: any) {
        const highlight = luaGenerator.valueToCode(block, 'HIGHLIGHT', Order.ATOMIC) || 'nil';
        return `${highlight}.Enabled = false\n`;
      };
      luaGenerator.forBlock['effects_create_beam'] = function(block: any) {
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.ATOMIC) || 'workspace';
        return [`Instance.new("Beam", ${parent})`, Order.ATOMIC];
      };
      luaGenerator.forBlock['effects_create_trail'] = function(block: any) {
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.ATOMIC) || 'workspace';
        return [`Instance.new("Trail", ${parent})`, Order.ATOMIC];
      };
      luaGenerator.forBlock['effects_play_sound'] = function(block: any) {
        const sound = luaGenerator.valueToCode(block, 'SOUND', Order.ATOMIC) || 'nil';
        return `${sound}:Play()\n`;
      };
      luaGenerator.forBlock['effects_stop_sound'] = function(block: any) {
        const sound = luaGenerator.valueToCode(block, 'SOUND', Order.ATOMIC) || 'nil';
        return `${sound}:Stop()\n`;
      };
      luaGenerator.forBlock['effects_set_sound_volume'] = function(block: any) {
        const sound = luaGenerator.valueToCode(block, 'SOUND', Order.ATOMIC) || 'nil';
        const volume = luaGenerator.valueToCode(block, 'VOLUME', Order.ATOMIC) || '0.5';
        return `${sound}.Volume = ${volume}\n`;
      };
      luaGenerator.forBlock['effects_set_sound_pitch'] = function(block: any) {
        const sound = luaGenerator.valueToCode(block, 'SOUND', Order.ATOMIC) || 'nil';
        const pitch = luaGenerator.valueToCode(block, 'PITCH', Order.ATOMIC) || '1';
        return `${sound}.PlaybackSpeed = ${pitch}\n`;
      };
      luaGenerator.forBlock['effects_create_tween'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'nil';
        const info = luaGenerator.valueToCode(block, 'INFO', Order.ATOMIC) || 'TweenInfo.new()';
        const goals = luaGenerator.valueToCode(block, 'GOALS', Order.ATOMIC) || '{}';
        return [`game:GetService("TweenService"):Create(${instance}, ${info}, ${goals})`, Order.ATOMIC];
      };
      luaGenerator.forBlock['effects_play_tween'] = function(block: any) {
        const tween = luaGenerator.valueToCode(block, 'TWEEN', Order.ATOMIC) || 'nil';
        return `${tween}:Play()\n`;
      };
      luaGenerator.forBlock['effects_stop_tween'] = function(block: any) {
        const tween = luaGenerator.valueToCode(block, 'TWEEN', Order.ATOMIC) || 'nil';
        return `${tween}:Cancel()\n`;
      };
      luaGenerator.forBlock['effects_camera_shake'] = function(block: any) {
        const intensity = luaGenerator.valueToCode(block, 'INTENSITY', Order.ATOMIC) || '1';
        return `local cam = workspace.CurrentCamera\nlocal pos = cam.CFrame.Position\nlocal rot = cam.CFrame - pos\ncam.CFrame = CFrame.new(pos + Vector3.new(math.random(-${intensity}, ${intensity}), math.random(-${intensity}, ${intensity}), math.random(-${intensity}, ${intensity}))) * rot\n`;
      };
      luaGenerator.forBlock['effects_flash_screen'] = function(block: any) {
        const color = luaGenerator.valueToCode(block, 'COLOR', Order.ATOMIC) || 'Color3.new(1,1,1)';
        return `local gui = Instance.new("ScreenGui", game.Players.LocalPlayer.PlayerGui)\nlocal frame = Instance.new("Frame", gui)\nframe.Size = UDim2.new(1,0,1,0)\nframe.BackgroundColor3 = ${color}\ngame:GetService("Debris"):AddItem(gui, 0.1)\n`;
      };
      luaGenerator.forBlock['effects_blur'] = function(block: any) {
        const size = luaGenerator.valueToCode(block, 'SIZE', Order.ATOMIC) || '10';
        return `local blur = Instance.new("BlurEffect", workspace.CurrentCamera)\nblur.Size = ${size}\n`;
      };
      luaGenerator.forBlock['effects_color_correction'] = function(block: any) {
        const saturation = luaGenerator.valueToCode(block, 'SATURATION', Order.ATOMIC) || '0';
        const contrast = luaGenerator.valueToCode(block, 'CONTRAST', Order.ATOMIC) || '0';
        return `local cc = Instance.new("ColorCorrectionEffect", workspace.CurrentCamera)\ncc.Saturation = ${saturation}\ncc.Contrast = ${contrast}\n`;
      };

      luaGenerator.forBlock['effects_emit'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'nil';
        const count = luaGenerator.valueToCode(block, 'COUNT', Order.ATOMIC) || '10';
        return `${instance}:Emit(${count})\n`;
      };
      luaGenerator.forBlock['effects_enable'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'nil';
        return `${instance}.Enabled = true\n`;
      };
      luaGenerator.forBlock['effects_disable'] = function(block: any) {
        const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'nil';
        return `${instance}.Enabled = false\n`;
      };
      luaGenerator.forBlock['effects_spawn'] = function(block: any) {
        const type = block.getFieldValue('TYPE');
        const parent = luaGenerator.valueToCode(block, 'PARENT', Order.ATOMIC) || 'workspace';
        return `Instance.new("${type}", ${parent})\n`;
      };

      // Placeholders
      luaGenerator.forBlock['placeholder_string'] = function() { return ['""', Order.ATOMIC]; };
      luaGenerator.forBlock['placeholder_number'] = function() { return ['0', Order.ATOMIC]; };
      luaGenerator.forBlock['placeholder_boolean'] = function() { return ['false', Order.ATOMIC]; };
      luaGenerator.forBlock['placeholder_color3'] = function() { return ['Color3.new(1,1,1)', Order.ATOMIC]; };
      luaGenerator.forBlock['placeholder_instance'] = function() { return ['nil', Order.ATOMIC]; };
      luaGenerator.forBlock['placeholder_index'] = function() { return ['1', Order.ATOMIC]; };
      luaGenerator.forBlock['placeholder_variable'] = function() { return ['var', Order.ATOMIC]; };
      luaGenerator.forBlock['placeholder_condition'] = function() { return ['false', Order.ATOMIC]; };
      luaGenerator.forBlock['placeholder_any'] = function() { return ['nil', Order.ATOMIC]; };
      luaGenerator.forBlock['placeholder_vector3'] = function() { return ['Vector3.new(0,0,0)', Order.ATOMIC]; };
      luaGenerator.forBlock['placeholder_humanoid'] = function() { return ['nil', Order.ATOMIC]; };
      luaGenerator.forBlock['placeholder_player'] = function() { return ['nil', Order.ATOMIC]; };
    };

    defineGenerators();

    
    const toolbox = {
      kind: 'categoryToolbox',
      contents: CATEGORIES.map((cat) => {
        let blocks: any[] = [];
        if (cat.name === 'Comment') {
          blocks = [
            { kind: 'block', type: 'comment' }
          ];
        } else if (cat.name === 'Debug') {
          blocks = [
            { 
              kind: 'block', 
              type: 'print',
              inputs: { TEXT: { shadow: { type: 'placeholder_string' } } }
            },
            { 
              kind: 'block', 
              type: 'warn',
              inputs: { TEXT: { shadow: { type: 'placeholder_string' } } }
            },
            { kind: 'block', type: 'run_lua' }
          ];
        } else if (cat.name === 'Logic') {
          blocks = [
            { 
              kind: 'block', 
              type: 'wait',
              inputs: { SECONDS: { shadow: { type: 'placeholder_number' } } }
            },
            { 
              kind: 'block', 
              type: 'lua_if',
              inputs: { CONDITION: { shadow: { type: 'placeholder_condition' } } }
            },
            { 
              kind: 'block', 
              type: 'logic_negate',
              inputs: { BOOL: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'logic_compare_eq', 
              inputs: { 
                A: { shadow: { type: 'placeholder_any' } },
                B: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'logic_compare_lt', 
              inputs: { 
                A: { shadow: { type: 'placeholder_any' } },
                B: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'logic_compare_gt', 
              inputs: { 
                A: { shadow: { type: 'placeholder_any' } },
                B: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'logic_compare_neq', 
              inputs: { 
                A: { shadow: { type: 'placeholder_any' } },
                B: { shadow: { type: 'placeholder_any' } }
              }
            },
            { kind: 'block', type: 'logic_boolean_true' },
            { kind: 'block', type: 'logic_boolean_false' },
            { 
              kind: 'block', 
              type: 'logic_operation_and', 
              inputs: { 
                A: { shadow: { type: 'placeholder_any' } },
                B: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'logic_operation_or', 
              inputs: { 
                A: { shadow: { type: 'placeholder_any' } },
                B: { shadow: { type: 'placeholder_any' } }
              }
            }
          ];
        } else if (cat.name === 'World') {
          blocks = [
            { kind: 'block', type: 'world_me' },
            { kind: 'block', type: 'world_this_script' },
            { kind: 'block', type: 'world_instance' },
            { 
              kind: 'block', 
              type: 'world_vector3',
              inputs: {
                X: { shadow: { type: 'placeholder_number' } },
                Y: { shadow: { type: 'placeholder_number' } },
                Z: { shadow: { type: 'placeholder_number' } }
              }
            },
            { kind: 'block', type: 'world_vector3_values' },
            { 
              kind: 'block', 
              type: 'world_get_instance_by_path',
              inputs: { PATH: { shadow: { type: 'placeholder_string' } } }
            },
            { 
              kind: 'block', 
              type: 'world_set_property_direct',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'world_get_property_direct',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } }
              }
            },
            { 
              kind: 'block', 
              type: 'world_find_first_child_direct',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } }
              }
            },
            { 
              kind: 'block', 
              type: 'world_color3',
              inputs: {
                R: { shadow: { type: 'placeholder_number' } },
                G: { shadow: { type: 'placeholder_number' } },
                B: { shadow: { type: 'placeholder_number' } }
              }
            },
            { kind: 'block', type: 'world_color3_values' },
            { 
              kind: 'block', 
              type: 'world_create_instance_direct',
              inputs: {
                PARENT: { shadow: { type: 'placeholder_instance' } }
              }
            },
            { 
              kind: 'block', 
              type: 'world_clone_instance',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } }
              }
            }
          ];
        } else if (cat.name === 'Instance') {
          blocks = [
            { 
              kind: 'block', 
              type: 'instance_new',
              inputs: { PARENT: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'instance_wait_for_child',
              inputs: { 
                PARENT: { shadow: { type: 'placeholder_instance' } },
                NAME: { shadow: { type: 'placeholder_string' } }
              }
            },
            { 
              kind: 'block', 
              type: 'instance_find_first_child',
              inputs: { 
                PARENT: { shadow: { type: 'placeholder_instance' } },
                NAME: { shadow: { type: 'placeholder_string' } }
              }
            },
            { 
              kind: 'block', 
              type: 'instance_get_children',
              inputs: { PARENT: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'instance_get_descendants',
              inputs: { PARENT: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'instance_clone',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'instance_child_added',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'instance_child_removed',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'instance_descendant_added',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'instance_descendant_removing',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'instance_destroy',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'instance_is_a',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'instance_set_name',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_string' } }
              }
            },
            { 
              kind: 'block', 
              type: 'instance_get_name',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'instance_set_parent',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_instance' } }
              }
            },
            { 
              kind: 'block', 
              type: 'instance_get_parent',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            }
          ];
        } else if (cat.name === 'Part') {
          blocks = [
            { 
              kind: 'block', 
              type: 'part_set_anchored',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_boolean' } }
              }
            },
            { 
              kind: 'block', 
              type: 'part_set_cancollide',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_boolean' } }
              }
            },
            { 
              kind: 'block', 
              type: 'part_set_cantouch',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_boolean' } }
              }
            },
            { 
              kind: 'block', 
              type: 'part_set_castshadow',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_boolean' } }
              }
            },
            { 
              kind: 'block', 
              type: 'part_set_color',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_color3' } }
              }
            },
            { 
              kind: 'block', 
              type: 'part_set_orientation',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_vector3' } }
              }
            },
            { 
              kind: 'block', 
              type: 'part_get_orientation',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'part_set_position',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_vector3' } }
              }
            },
            { 
              kind: 'block', 
              type: 'part_get_position',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'part_set_size',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_vector3' } }
              }
            },
            { 
              kind: 'block', 
              type: 'part_get_size',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'part_touched_by_part',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'part_touched_by_character',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'part_set_transparency',
              inputs: {
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_number' } }
              }
            }
          ];
        } else if (cat.name === 'Math') {
          blocks = [
            { kind: 'block', type: 'math_number_custom' },
            { 
              kind: 'block', 
              type: 'math_arithmetic_add',
              inputs: { 
                A: { shadow: { type: 'placeholder_number' } },
                B: { shadow: { type: 'placeholder_number' } }
              }
            },
            { 
              kind: 'block', 
              type: 'math_random_custom',
              inputs: { 
                FROM: { shadow: { type: 'placeholder_number' } },
                TO: { shadow: { type: 'placeholder_number' } }
              }
            },
            { 
              kind: 'block', 
              type: 'math_round',
              inputs: { NUM: { shadow: { type: 'placeholder_number' } } }
            },
            { 
              kind: 'block', 
              type: 'math_abs',
              inputs: { NUM: { shadow: { type: 'placeholder_number' } } }
            },
            { 
              kind: 'block', 
              type: 'math_ceil',
              inputs: { NUM: { shadow: { type: 'placeholder_number' } } }
            },
            { 
              kind: 'block', 
              type: 'math_floor',
              inputs: { NUM: { shadow: { type: 'placeholder_number' } } }
            },
            { 
              kind: 'block', 
              type: 'math_expr_1',
              inputs: { NUM: { shadow: { type: 'placeholder_number' } } }
            },
            { 
              kind: 'block', 
              type: 'math_expr_2',
              inputs: { NUM: { shadow: { type: 'placeholder_number' } } }
            }
          ];
        } else if (cat.name === 'Text') {
          blocks = [
            { kind: 'block', type: 'text_string_custom' },
            { 
              kind: 'block', 
              type: 'text_join_custom',
              inputs: { 
                A: { shadow: { type: 'placeholder_string' } },
                B: { shadow: { type: 'placeholder_string' } }
              }
            },
            { 
              kind: 'block', 
              type: 'text_length_custom',
              inputs: { TEXT: { shadow: { type: 'placeholder_string' } } }
            },
            { 
              kind: 'block', 
              type: 'text_to_upper',
              inputs: { TEXT: { shadow: { type: 'placeholder_string' } } }
            },
            { 
              kind: 'block', 
              type: 'text_to_lower',
              inputs: { TEXT: { shadow: { type: 'placeholder_string' } } }
            }
          ];
        } else if (cat.name === 'Sound') {
          blocks = [
            { kind: 'block', type: 'sound_soundid', inputs: { SOUND: { shadow: { type: 'placeholder_instance' } }, VALUE: { shadow: { type: 'placeholder_string' } } } },
            { kind: 'block', type: 'sound_volume', inputs: { SOUND: { shadow: { type: 'placeholder_instance' } }, VALUE: { shadow: { type: 'placeholder_number' } } } },
            { kind: 'block', type: 'sound_play', inputs: { SOUND: { shadow: { type: 'placeholder_instance' } } } },
            { kind: 'block', type: 'sound_stop', inputs: { SOUND: { shadow: { type: 'placeholder_instance' } } } },
            { kind: 'block', type: 'sound_pause', inputs: { SOUND: { shadow: { type: 'placeholder_instance' } } } },
            { kind: 'block', type: 'sound_looped', inputs: { SOUND: { shadow: { type: 'placeholder_instance' } }, VALUE: { shadow: { type: 'placeholder_boolean' } } } },
            { kind: 'block', type: 'sound_playing', inputs: { SOUND: { shadow: { type: 'placeholder_instance' } }, VALUE: { shadow: { type: 'placeholder_boolean' } } } },
            { kind: 'block', type: 'sound_playbackspeed', inputs: { SOUND: { shadow: { type: 'placeholder_instance' } }, VALUE: { shadow: { type: 'placeholder_number' } } } },
            { kind: 'block', type: 'sound_timeposition', inputs: { SOUND: { shadow: { type: 'placeholder_instance' } }, VALUE: { shadow: { type: 'placeholder_number' } } } },
            { kind: 'block', type: 'sound_ended', inputs: { SOUND: { shadow: { type: 'placeholder_instance' } } } }
          ];
        } else if (cat.name === 'Values') {
          blocks = [
            { 
              kind: 'block', 
              type: 'values_to_string',
              inputs: { VALUE: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'values_to_number',
              inputs: { VALUE: { shadow: { type: 'placeholder_any' } } }
            }
          ];
        } else if (cat.name === 'Variables') {
          blocks = [
            { 
              kind: 'block', 
              type: 'variables_create',
              inputs: { VALUE: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'variables_set_custom',
              inputs: { VALUE: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'variables_change_custom',
              inputs: { VALUE: { shadow: { type: 'placeholder_any' } } }
            },
            { kind: 'block', type: 'variables_get_custom' }
          ];
        } else if (cat.name === 'Lists') {
          blocks = [
            { kind: 'block', type: 'lists_empty' },
            { 
              kind: 'block', 
              type: 'lists_set_item',
              inputs: { 
                INDEX: { shadow: { type: 'placeholder_index' } },
                LIST: { shadow: { type: 'placeholder_variable' } },
                VALUE: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'lists_get_item',
              inputs: { 
                INDEX: { shadow: { type: 'placeholder_index' } },
                LIST: { shadow: { type: 'placeholder_variable' } }
              }
            },
            { 
              kind: 'block', 
              type: 'lists_insert',
              inputs: { 
                ITEM: { shadow: { type: 'placeholder_any' } },
                LIST: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'lists_remove',
              inputs: { 
                INDEX: { shadow: { type: 'placeholder_index' } },
                LIST: { shadow: { type: 'placeholder_any' } }
              }
            }
          ];
        } else if (cat.name === 'Loops') {
          blocks = [
            { 
              kind: 'block', 
              type: 'loops_while_lua',
              inputs: { CONDITION: { shadow: { type: 'placeholder_condition' } } }
            },
            { 
              kind: 'block', 
              type: 'loops_repeat_lua',
              inputs: { 
                FROM: { shadow: { type: 'placeholder_number' } },
                TO: { shadow: { type: 'placeholder_number' } }
              }
            },
            { 
              kind: 'block', 
              type: 'loops_for_children',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'loops_for_descendants',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { kind: 'block', type: 'loops_break_lua' }
          ];
        } else if (cat.name === 'Character') {
          blocks = [
            { 
              kind: 'block', 
              type: 'character_is_climbing',
              inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
            },
            { 
              kind: 'block', 
              type: 'character_damage',
              inputs: { 
                HUMANOID: { shadow: { type: 'placeholder_humanoid' } },
                NUMBER: { shadow: { type: 'placeholder_number' } }
              }
            },
            { 
              kind: 'block', 
              type: 'character_died',
              inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
            },
            { 
              kind: 'block', 
              type: 'character_equip_tool',
              inputs: { 
                HUMANOID: { shadow: { type: 'placeholder_humanoid' } },
                INSTANCE: { shadow: { type: 'placeholder_instance' } }
              }
            },
            { 
              kind: 'block', 
              type: 'character_get_humanoid',
              inputs: { MODEL: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'character_get_model_from_humanoid',
              inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
            },
            { 
              kind: 'block', 
              type: 'character_set_health',
              inputs: { 
                HUMANOID: { shadow: { type: 'placeholder_humanoid' } },
                VALUE: { shadow: { type: 'placeholder_number' } }
              }
            },
            { 
              kind: 'block', 
              type: 'character_health_changed',
              inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
            },
            { 
              kind: 'block', 
              type: 'character_jump',
              inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
            },
            { 
              kind: 'block', 
              type: 'character_set_jump_height',
              inputs: { 
                HUMANOID: { shadow: { type: 'placeholder_humanoid' } },
                VALUE: { shadow: { type: 'placeholder_number' } }
              }
            },
            { 
              kind: 'block', 
              type: 'character_set_jump_power',
              inputs: { 
                HUMANOID: { shadow: { type: 'placeholder_humanoid' } },
                VALUE: { shadow: { type: 'placeholder_number' } }
              }
            },
            { 
              kind: 'block', 
              type: 'character_kill',
              inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
            },
            { 
              kind: 'block', 
              type: 'character_set_max_health',
              inputs: { 
                HUMANOID: { shadow: { type: 'placeholder_humanoid' } },
                VALUE: { shadow: { type: 'placeholder_number' } }
              }
            },
            { 
              kind: 'block', 
              type: 'character_move_to',
              inputs: { 
                HUMANOID: { shadow: { type: 'placeholder_humanoid' } },
                POSITION: { shadow: { type: 'placeholder_vector3' } }
              }
            },
            { 
              kind: 'block', 
              type: 'character_finished_moving',
              inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
            },
            { 
              kind: 'block', 
              type: 'character_player_of',
              inputs: { CHARACTER: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'character_unequip_tool',
              inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
            },
            { 
              kind: 'block', 
              type: 'character_set_walk_speed',
              inputs: { 
                HUMANOID: { shadow: { type: 'placeholder_humanoid' } },
                VALUE: { shadow: { type: 'placeholder_number' } }
              }
            }
          ];
        } else if (cat.name === 'Model') {
          blocks = [
            { 
              kind: 'block', 
              type: 'model_break_joints',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'model_get_orientation',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'model_get_position',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'model_get_size',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'model_set_primary_part',
              inputs: { 
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                PART: { shadow: { type: 'placeholder_instance' } }
              }
            },
            { 
              kind: 'block', 
              type: 'model_set_orientation',
              inputs: { 
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_vector3' } }
              }
            },
            { 
              kind: 'block', 
              type: 'model_set_position',
              inputs: { 
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                VALUE: { shadow: { type: 'placeholder_vector3' } }
              }
            }
          ];
        } else if (cat.name === 'Raycast') {
          blocks = [
            { kind: 'block', type: 'raycast_params_create' },
            { 
              kind: 'block', 
              type: 'raycast_params_set_filter',
              inputs: {
                PARAMS: { shadow: { type: 'placeholder_any' } },
                LIST: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'raycast_params_set_type',
              inputs: {
                PARAMS: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'raycast_workspace_raycast',
              inputs: {
                ORIGIN: { shadow: { type: 'world_vector3_values' } },
                DIRECTION: { shadow: { type: 'world_vector3_values' } },
                PARAMS: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'raycast_workspace_spherecast',
              inputs: {
                ORIGIN: { shadow: { type: 'world_vector3_values' } },
                RADIUS: { shadow: { type: 'math_number', fields: { NUM: 5 } } },
                DIRECTION: { shadow: { type: 'world_vector3_values' } },
                PARAMS: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'raycast_workspace_blockcast',
              inputs: {
                CFRAME: { shadow: { type: 'placeholder_any' } },
                SIZE: { shadow: { type: 'world_vector3_values' } },
                DIRECTION: { shadow: { type: 'world_vector3_values' } },
                PARAMS: { shadow: { type: 'placeholder_any' } }
              }
            },
            {
              kind: 'block',
              type: 'raycast_get_result_property',
              inputs: {
                RESULT: { shadow: { type: 'placeholder_any' } }
              }
            }
          ];
        } else if (cat.name === 'GUI') {
          blocks = [
            { kind: 'block', type: 'gui_get_mouse' },
            { 
              kind: 'block', 
              type: 'gui_get_player_gui',
              inputs: { PLAYER: { shadow: { type: 'placeholder_player' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_new_instance',
              inputs: { PARENT: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_button_clicked',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_input_began',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_input_ended',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_is_left_mouse',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_is_middle_mouse',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_is_right_mouse',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_is_touch',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_mouse_position',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_set_invisible',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_set_visible',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'gui_touch_position',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            }
          ];
        } else if (cat.name === 'Player') {
          blocks = [
            { 
              kind: 'block', 
              type: 'player_get_character',
              inputs: { PLAYER: { shadow: { type: 'placeholder_player' } } }
            },
            { 
              kind: 'block', 
              type: 'player_get_by_name',
              inputs: { NAME: { shadow: { type: 'placeholder_string' } } }
            },
            { 
              kind: 'block', 
              type: 'player_kick',
              inputs: { 
                PLAYER: { shadow: { type: 'placeholder_player' } },
                REASON: { shadow: { type: 'placeholder_string' } }
              }
            },
            { kind: 'block', type: 'player_joined' },
            { kind: 'block', type: 'player_leaving' },
            { 
              kind: 'block', 
              type: 'player_get_user_id',
              inputs: { PLAYER: { shadow: { type: 'placeholder_player' } } }
            }
          ];
        } else if (cat.name === 'ClickDetector') {
          blocks = [
            { 
              kind: 'block', 
              type: 'clickdetector_add',
              inputs: { INSTANCE: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'clickdetector_clicked',
              inputs: { CLICK_DETECTOR: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'clickdetector_hover_enter',
              inputs: { CLICK_DETECTOR: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'clickdetector_hover_leave',
              inputs: { CLICK_DETECTOR: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'clickdetector_right_clicked',
              inputs: { CLICK_DETECTOR: { shadow: { type: 'placeholder_instance' } } }
            }
          ];
        } else if (cat.name === 'Marketplace') {
          blocks = [
            { 
              kind: 'block', 
              type: 'marketplace_owns_asset',
              inputs: { 
                PLAYER: { shadow: { type: 'placeholder_player' } },
                ASSET_ID: { shadow: { type: 'placeholder_number' } }
              }
            },
            { 
              kind: 'block', 
              type: 'marketplace_owns_gamepass',
              inputs: { 
                PLAYER: { shadow: { type: 'placeholder_player' } },
                GAMEPASS_ID: { shadow: { type: 'placeholder_number' } }
              }
            },
            { kind: 'block', type: 'marketplace_product_bought' },
            { 
              kind: 'block', 
              type: 'marketplace_prompt_asset',
              inputs: { 
                ASSET_ID: { shadow: { type: 'placeholder_number' } },
                PLAYER: { shadow: { type: 'placeholder_player' } }
              }
            },
            { 
              kind: 'block', 
              type: 'marketplace_prompt_gamepass',
              inputs: { 
                GAMEPASS_ID: { shadow: { type: 'placeholder_number' } },
                PLAYER: { shadow: { type: 'placeholder_player' } }
              }
            },
            { 
              kind: 'block', 
              type: 'marketplace_prompt_product',
              inputs: { 
                PRODUCT_ID: { shadow: { type: 'placeholder_number' } },
                PLAYER: { shadow: { type: 'placeholder_player' } }
              }
            }
          ];
        } else if (cat.name === 'Tweening') {
          blocks = [
            { 
              kind: 'block', 
              type: 'tween_animate',
              inputs: { 
                PROPERTY: { shadow: { type: 'placeholder_string' } },
                INSTANCE: { shadow: { type: 'placeholder_instance' } },
                GOAL: { shadow: { type: 'placeholder_any' } },
                TWEEN_INFO: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'tween_info_create',
              inputs: { 
                TIME: { shadow: { type: 'placeholder_number' } }
              }
            }
          ];
        } else if (cat.name === 'Client') {
          blocks = [
            { 
              kind: 'block', 
              type: 'client_fire_server',
              inputs: { 
                EVENT: { shadow: { type: 'placeholder_instance' } },
                DATA: { shadow: { type: 'placeholder_any' } }
              }
            },
            { kind: 'block', type: 'client_input_began' },
            { kind: 'block', type: 'client_input_ended' },
            { 
              kind: 'block', 
              type: 'client_is_keyboard',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'client_is_left_mouse',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'client_is_middle_mouse',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'client_is_right_mouse',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'client_is_touch',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'client_key_is',
              inputs: { KEY: { shadow: { type: 'placeholder_any' } } }
            },
            { kind: 'block', type: 'client_local_player' },
            { 
              kind: 'block', 
              type: 'client_mouse_position',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'client_fired_by_server',
              inputs: { EVENT: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'client_touch_position',
              inputs: { INPUT: { shadow: { type: 'placeholder_any' } } }
            }
          ];
        } else if (cat.name === 'Server') {
          blocks = [
            { 
              kind: 'block', 
              type: 'server_fired_by_client',
              inputs: { EVENT: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'server_fire_all_clients',
              inputs: { 
                EVENT: { shadow: { type: 'placeholder_instance' } },
                DATA: { shadow: { type: 'placeholder_any' } }
              }
            },
            { 
              kind: 'block', 
              type: 'server_fire_client',
              inputs: { 
                EVENT: { shadow: { type: 'placeholder_instance' } },
                PLAYER: { shadow: { type: 'placeholder_player' } },
                DATA: { shadow: { type: 'placeholder_any' } }
              }
            }
          ];
        } else if (cat.name === 'Leaderstats') {
          blocks = [
            { 
              kind: 'block', 
              type: 'leaderstats_create_number',
              inputs: { DEFAULT: { shadow: { type: 'placeholder_number' } } }
            },
            { 
              kind: 'block', 
              type: 'leaderstats_create_string',
              inputs: { DEFAULT: { shadow: { type: 'placeholder_string' } } }
            },
            { kind: 'block', type: 'leaderstats_enable' },
            { 
              kind: 'block', 
              type: 'leaderstats_get',
              inputs: { PLAYER: { shadow: { type: 'placeholder_player' } } }
            },
            { 
              kind: 'block', 
              type: 'leaderstats_set',
              inputs: { 
                PLAYER: { shadow: { type: 'placeholder_player' } },
                VALUE: { shadow: { type: 'placeholder_any' } }
              }
            }
          ];
        } else if (cat.name === 'Functions') {
          blocks = [
            { kind: 'block', type: 'functions_define' },
            { kind: 'block', type: 'functions_call' },
            { 
              kind: 'block', 
              type: 'functions_return',
              inputs: { VALUE: { shadow: { type: 'placeholder_any' } } }
            },
            { kind: 'block', type: 'functions_define_global' },
            { kind: 'block', type: 'functions_call_global' }
          ];
        } else if (cat.name === 'Datastore') {
          blocks = [
            { kind: 'block', type: 'datastore_setup' },
            { kind: 'block', type: 'datastore_instance' },
            { kind: 'block', type: 'datastore_use' },
            { 
              kind: 'block', 
              type: 'datastore_get',
              inputs: { 
                DATASTORE: { shadow: { type: 'placeholder_any' } },
                PLAYER: { shadow: { type: 'placeholder_player' } }
              }
            },
            { 
              kind: 'block', 
              type: 'datastore_save',
              inputs: { 
                DATASTORE: { shadow: { type: 'placeholder_any' } },
                PLAYER: { shadow: { type: 'placeholder_player' } },
                VALUE: { shadow: { type: 'placeholder_any' } }
              }
            }
          ];
        } else if (cat.name === 'Events') {
          blocks = [
            { kind: 'block', type: 'event_game_start' },
            { 
              kind: 'block', 
              type: 'event_clicked',
              inputs: { CLICK_DETECTOR: { shadow: { type: 'placeholder_instance' } } }
            },
            { 
              kind: 'block', 
              type: 'event_value_changed',
              inputs: { VALUE: { shadow: { type: 'placeholder_instance' } } }
            },
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
          ];
        } else if (cat.name === 'Animation') {
          blocks = [
            { 
              kind: 'block', 
              type: 'animation_load',
              inputs: { 
                ANIM_ID: { shadow: { type: 'placeholder_string' } },
                HUMANOID: { shadow: { type: 'placeholder_humanoid' } }
              }
            },
            { 
              kind: 'block', 
              type: 'animation_play',
              inputs: { ANIM_TRACK: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'animation_stop',
              inputs: { ANIM_TRACK: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'animation_pause',
              inputs: { ANIM_TRACK: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'animation_adjust_speed',
              inputs: { 
                ANIM_TRACK: { shadow: { type: 'placeholder_any' } },
                SPEED: { shadow: { type: 'placeholder_number' } }
              }
            },
            { 
              kind: 'block', 
              type: 'animation_adjust_weight',
              inputs: { 
                ANIM_TRACK: { shadow: { type: 'placeholder_any' } },
                WEIGHT: { shadow: { type: 'placeholder_number' } }
              }
            },
            { 
              kind: 'block', 
              type: 'animation_get_playing',
              inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
            },
            { 
              kind: 'block', 
              type: 'animation_stopped_event',
              inputs: { ANIM_TRACK: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'animation_played_event',
              inputs: { HUMANOID: { shadow: { type: 'placeholder_humanoid' } } }
            },
            { 
              kind: 'block', 
              type: 'animation_set_priority',
              inputs: { ANIM_TRACK: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'animation_get_length',
              inputs: { ANIM_TRACK: { shadow: { type: 'placeholder_any' } } }
            },
            { 
              kind: 'block', 
              type: 'animation_is_playing',
              inputs: { ANIM_TRACK: { shadow: { type: 'placeholder_any' } } }
            }
          ];
        } else if (cat.name === 'Input') {
          blocks = [
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
            { kind: 'block', type: 'input_set_mouse_icon' }
          ];
        } else if (cat.name === 'Camera') {
          blocks = [
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
            { kind: 'block', type: 'camera_reset' }
          ];
        } else if (cat.name === 'Effects') {
          blocks = [
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
            { kind: 'block', type: 'effects_color_correction' }
          ];
        } else if (serviceGroups.includes(cat.name)) {
          const serviceName = cat.name;
          blocks = [
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
        } else if (cat.name === 'Optimization') {
          blocks = [
            { 
              kind: 'block', 
              type: 'opt_task_wait',
              inputs: { SECONDS: { shadow: { type: 'placeholder_number' } } }
            },
            { kind: 'block', type: 'opt_task_spawn' },
            { kind: 'block', type: 'opt_task_defer' },
            { 
              kind: 'block', 
              type: 'opt_task_delay',
              inputs: { SECONDS: { shadow: { type: 'placeholder_number' } } }
            },
            { kind: 'block', type: 'opt_debug_profile' }
          ];
        } else {
          blocks = [
            { kind: 'label', text: 'Coming Soon...' }
          ];
        }

        return {
          kind: 'category',
          name: cat.name.length > 13 ? cat.name.substring(0, 13) + '...' : cat.name,
          colour: cat.color,
          cssConfig: {
            'row': `scratch-category-row scratch-cat-${cat.name.toLowerCase().replace(/\s/g, '-')}`,
            'icon': 'scratch-category-icon',
            'label': 'scratch-category-label'
          },
          contents: blocks,
        };
      }),
    };

    // Custom Category Icon rendering
    const originalCategoryCreateDom = (Blockly.ToolboxCategory as any).prototype.createDom;
    (Blockly.ToolboxCategory as any).prototype.createDom = function() {
      const dom = originalCategoryCreateDom.call(this);
      return dom;
    };

    // Smooth Flyout Animations
    if (!(Blockly.VerticalFlyout as any).prototype._isPatchedForAnimations) {
      
      const animateBlocks = (flyout: any) => {
        setTimeout(() => {
          const workspace = flyout.workspace_;
          if (!workspace) return;
          const blocks = workspace.getTopBlocks(false);
          blocks.forEach((block: any, index: number) => {
            const blockSvg = block.getSvgRoot();
            if (blockSvg) {
              blockSvg.style.opacity = '0';
              blockSvg.style.translate = '-15px 0';
              blockSvg.style.transition = `opacity 0.2s ease ${index * 0.03}s, translate 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.03}s`;
              
              requestAnimationFrame(() => {
                blockSvg.style.opacity = '1';
                blockSvg.style.translate = '0 0';
              });
            }
          });
        }, 10);
      };

      const originalShow = (Blockly.VerticalFlyout as any).prototype.show;
      (Blockly.VerticalFlyout as any).prototype.show = function(xmlList: any) {
        if (this._transitionTimeout) {
          clearTimeout(this._transitionTimeout);
          this._transitionTimeout = null;
        }
        
        const svgGroup = this.svgGroup_;
        
        if (this.isVisible() && svgGroup) {
          // Animate out first
          svgGroup.classList.remove('flyout-animate-in');
          svgGroup.classList.add('flyout-animate-out');
          
          this._transitionTimeout = setTimeout(() => {
            originalShow.call(this, xmlList);
            svgGroup.classList.remove('flyout-animate-out');
            void svgGroup.offsetWidth;
            svgGroup.classList.add('flyout-animate-in');
            animateBlocks(this);
            this._transitionTimeout = null;
          }, 150); // Slightly faster transition
        } else {
          originalShow.call(this, xmlList);
          if (svgGroup) {
            svgGroup.classList.remove('flyout-animate-out');
            void svgGroup.offsetWidth;
            svgGroup.classList.add('flyout-animate-in');
            animateBlocks(this);
          }
        }
      };

      const originalHide = (Blockly.VerticalFlyout as any).prototype.hide;
      (Blockly.VerticalFlyout as any).prototype.hide = function() {
        if (this._transitionTimeout) {
          clearTimeout(this._transitionTimeout);
          this._transitionTimeout = null;
        }
        
        const svgGroup = this.svgGroup_;
        if (svgGroup && this.isVisible() && !svgGroup.classList.contains('flyout-animate-out')) {
          svgGroup.classList.remove('flyout-animate-in');
          svgGroup.classList.add('flyout-animate-out');
          this._transitionTimeout = setTimeout(() => {
            originalHide.call(this);
            svgGroup.classList.remove('flyout-animate-out');
            this._transitionTimeout = null;
          }, 150);
        } else {
          originalHide.call(this);
        }
      };
      (Blockly.VerticalFlyout as any).prototype._isPatchedForAnimations = true;
    }

    // Remove unwanted context menu items safely
    const registry = Blockly.ContextMenuRegistry.registry;
    if (registry.getItem('blockInline')) registry.unregister('blockInline');
    if (registry.getItem('blockCollapseExpand')) registry.unregister('blockCollapseExpand');
    if (registry.getItem('blockDisable')) registry.unregister('blockDisable');
    if (registry.getItem('blockComment')) registry.unregister('blockComment');

    // Remove unwanted workspace context menu items
    ['workspaceCollapse', 'collapseWorkspace', 'workspaceExpand', 'expandWorkspace', 'undoWorkspace', 'redoWorkspace'].forEach(id => {
      if (registry.getItem(id)) registry.unregister(id);
    });

    // Scratch-like duplication
    if (registry.getItem('blockDuplicate')) registry.unregister('blockDuplicate');
    registry.register({
      displayText: function() {
        return currentLang === 'vi' ? 'Bản sao' : 'Duplicate';
      },
      preconditionFn: function(scope: any) {
        if (scope.block && scope.block.isDeletable() && scope.block.isMovable()) {
          return 'enabled';
        }
        return 'hidden';
      },
      callback: function(scope: any) {
        const block = scope.block;
        if (!block) return;
        
        const workspace = block.workspace;
        Blockly.Events.setGroup(true);
        try {
          const xml = Blockly.Xml.blockToDom(block) as Element;
          const newBlock = Blockly.Xml.domToBlock(xml, workspace) as any;
          
          // Position it exactly where the original is
          const xy = (block as any).getRelativeToSurfaceXY();
          newBlock.moveBy(xy.x, xy.y);
          
          // In standard Blockly, to make it follow the mouse like Scratch:
          // We need to trigger a drag. This is best done by selecting it 
          // and letting the user move it, but Scratch actually "grabs" it.
          if (newBlock.select) newBlock.select();
          
          // For a true Scratch feel, we'd need to hook into the gesture system
          // but simply selecting and placing it is the closest standard behavior.
          // We'll add a small offset so it's visible if not immediately moved.
          newBlock.moveBy(20, 20);
        } finally {
          Blockly.Events.setGroup(false);
        }
      },
      scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
      id: 'blockDuplicate',
      weight: 1,
    });

    const customTheme = Blockly.Theme.defineTheme('customTheme', {
      'name': 'customTheme',
      'base': Blockly.Themes.Zelos,
      'componentStyles': {
        'workspaceBackgroundColour': '#1e1e1e',
        'toolboxBackgroundColour': '#000000',
        'toolboxForegroundColour': '#ffffff',
        'flyoutBackgroundColour': '#252526',
        'flyoutForegroundColour': '#fff',
        'insertionMarkerColour': '#fff',
        'insertionMarkerOpacity': 0.3,
        'scrollbarColour': '#797979',
        'scrollbarOpacity': 0.4,
        'cursorColour': '#d0d0d0',
      },
    });

    blocks.defineCustomBlocks();
    defineCustomGenerators();

    toolboxRef.current = toolbox;
    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox,
      media: 'https://unpkg.com/blockly/media/',
      trashcan: false,
      zoom: {
        controls: false,
        wheel: true,
        startScale: 0.65,
        maxScale: 2,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      move: {
        scrollbars: {
          vertical: true,
          horizontal: true,
        },
        drag: true,
        wheel: true,
      },
      grid: {
        spacing: 25,
        length: 5,
        colour: '#2a2a2a',
        snap: true,
      },
      renderer: 'custom_zelos',
      theme: customTheme,
    });

    // Pre-calculate block names for search to avoid creating blocks repeatedly
    // This is a one-time heavy task, we store it in a ref or state
    const extractedBlocks: { type: string, name: string, category: string, blockDef: any }[] = [];
    
    isInitialLoading.current = true;
    try {
      // Use a hidden temporary workspace for extraction to not interfere with main rendering
      const tempWorkspace = new Blockly.Workspace();
      toolbox.contents.forEach((cat: any, index: number) => {
        if (cat.kind === 'category' && cat.contents) {
          const originalCategoryName = CATEGORIES[index]?.name || cat.name;
          cat.contents.forEach((item: any) => {
            if (item.kind === 'block') {
              let blockName = item.type.replace(/_/g, ' ');
              try {
                const tempBlock = tempWorkspace.newBlock(item.type);
                if (tempBlock) {
                  const textContent = tempBlock.toString().replace(/\?/g, '[ ]').trim();
                  blockName = textContent || blockName;
                  tempBlock.dispose(false);
                }
              } catch (e) {
                blockName = blockName.charAt(0).toUpperCase() + blockName.slice(1);
              }
              extractedBlocks.push({
                type: item.type,
                name: blockName,
                category: originalCategoryName,
                blockDef: item
              });
            }
          });
        }
      });
      tempWorkspace.dispose();
    } finally {
      setTimeout(() => { isInitialLoading.current = false; }, 100);
    }
    
    setAllBlocks(extractedBlocks);

    workspace.current.addChangeListener((e: any) => {
      // Achievement tracking
      if (e.type === Blockly.Events.BLOCK_CREATE && !isInitialLoading.current) {
        unlockAchievement('hello_world');
        const blocksCount = workspace.current!.getAllBlocks(false).length;
        if (blocksCount >= 50) {
          unlockAchievement('block_hoarder');
        }
      }

      // UI events are lightweight
      if (e.isUiEvent) return;
      
      // All heavy logic (Code gen, Variable sync, Storage) moved to debounce
      debouncedUpdateCode();
    });

    // Initial load from localStorage
    const savedXml = localStorage.getItem('blocklua_workspace');
    if (savedXml) {
      try {
        isInitialLoading.current = true;
        const xml = Blockly.utils.xml.textToDom(savedXml);
        Blockly.Xml.domToWorkspace(xml, workspace.current!);
        setTimeout(() => { isInitialLoading.current = false; }, 100);
      } catch (e) {
        isInitialLoading.current = false;
        console.error("Failed to load initial workspace XML", e);
      }
    }

    const handleBeforeUnload = () => {
      if (workspace.current) {
        const xml = Blockly.Xml.workspaceToDom(workspace.current);
        const xmlText = Blockly.Xml.domToText(xml);
        localStorage.setItem('blocklua_workspace', xmlText);
        localStorage.setItem('blocklua_explorer', JSON.stringify(explorerRef.current));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const handleResize = () => {
      if (workspace.current) {
        Blockly.svgResize(workspace.current);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (workspace.current) {
        try {
          workspace.current.dispose();
        } catch (e) {
          console.warn("Error disposing workspace:", e);
        }
        workspace.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (workspace.current && view === 'blocks') {
      // Try to scale the flyout workspace if it exists
      try {
        const toolbox = workspace.current.getToolbox();
        if (toolbox && typeof (toolbox as any).getFlyout === 'function') {
          const flyout = (toolbox as any).getFlyout();
          if (flyout && typeof flyout.getWorkspace === 'function') {
            flyout.getWorkspace().setScale(1);
          }
        }
      } catch (e) {
        console.error('Could not scale flyout:', e);
      }

      // Force Blockly to recalculate its dimensions after a short delay
      // Only do this when the view is 'blocks' to avoid resetting state while hidden
      setTimeout(() => {
        if (workspace.current && view === 'blocks') {
          Blockly.svgResize(workspace.current);
        }
      }, 50);
    }
  }, [view]);

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.lua';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearWorkspace = () => {
    setShowClearModal(true);
  };

  const confirmClear = () => {
    if (workspace.current) {
      workspace.current.clear();
      unlockAchievement('eraser');
    }
    setShowClearModal(false);
  };

  useEffect(() => {
    (window as any).sessionStartTime = Date.now();
    const hour = new Date().getHours();
    if (hour >= 0 && hour <= 4) {
      unlockAchievement('night_owl');
    }
  }, []);

  useEffect(() => {
    if (generatedCode.split('\n').length > 100) {
      unlockAchievement('code_master');
    }
  }, [generatedCode]);

  useEffect(() => {
    if (sidebarOpen) {
      const newOpens = explorerOpens + 1;
      setExplorerOpens(newOpens);
      if (newOpens >= 20) {
        unlockAchievement('stalker');
      }
    }
  }, [sidebarOpen]);

  return (
    <div 
      className={`flex flex-col h-screen w-screen bg-[#1e1e1e] overflow-hidden font-sans text-gray-200 no-select ${enableEffects ? 'effects-enabled' : ''}`}
    >
      <AnimatePresence>
        {(showMenu || showSettings) && (
          <div 
            className="fixed inset-0 z-[90]" 
            onClick={() => {
              setShowMenu(false);
              setShowSettings(false);
            }}
          />
        )}
        {selectorTarget && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-md flex items-center justify-center pointer-events-auto"
            onClick={() => {
              setSelectorTarget(null);
              setExportScriptType(null);
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-[#4c97ff] text-white px-6 py-3 rounded-2xl font-black tracking-widest shadow-2xl flex items-center gap-3 animate-bounce"
            >
              <MousePointer2 size={24} />
              {currentLang === 'vi' ? 'CHỌN ĐỐI TƯỢNG TRONG EXPLORER' : 'SELECT AN OBJECT IN EXPLORER'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-12 bg-black flex items-center px-4 justify-between z-[100] border-b border-white/5 shadow-xl shrink-0"
      >
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <LayoutDashboard size={20} />
          </button>
          <div className="relative">
            <div 
              onClick={() => {
                const newClicks = logoClicks + 1;
                setLogoClicks(newClicks);
                if (newClicks >= 10) {
                  unlockAchievement('spammer');
                }
              }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-[#4c97ff] to-[#0055ff] rounded-md flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform group-hover:rotate-12">
                <Cpu className="text-white" size={14} />
              </div>
              <div>
                <div className="text-white font-black text-lg tracking-tighter leading-none">BLOCKLUA</div>
                <div className="text-[9px] text-[#4c97ff] font-bold tracking-widest uppercase mt-0.5">PRO EDITION</div>
              </div>
              
              {/* Auto-save indicator */}
              <AnimatePresence>
                {isAutoSaving && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20"
                  >
                    <RefreshCw size={10} className="text-green-500 animate-spin" />
                    <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Auto-saving</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => { setView('blocks'); }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all flex items-center gap-2 ${view === 'blocks' ? 'bg-[#4c97ff] text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Layers size={14} />
              BLOCKS
            </button>
            <button 
              onClick={() => { setView('codes'); }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all flex items-center gap-2 ${view === 'codes' ? 'bg-[#4c97ff] text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Code2 size={14} />
              SCRIPTING
            </button>
            <button 
              onClick={() => { 
                if (user) {
                  setShowControlCenter(true); 
                } else {
                  showToast(currentLang === 'vi' ? 'Vui lòng đăng nhập để sử dụng Trung tâm Lab!' : 'Please login to use Lab Center!', 'warning');
                }
              }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all flex items-center gap-2 ${showControlCenter ? 'bg-[#4c97ff] text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <LayoutDashboard size={14} />
              {currentLang === 'vi' ? 'TRUNG TÂM LAB' : 'LAB CENTER'}
            </button>
            <button 
              onClick={() => { setShowSyncModal(true); }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all flex items-center gap-2 text-gray-500 hover:text-gray-300`}
            >
              <RefreshCw size={14} />
              {currentLang === 'vi' ? 'ĐỒNG BỘ HÓA' : 'SYNC'}
            </button>
            <button 
              onClick={() => { setShowBlockInfoModal(true); }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all flex items-center gap-2 text-gray-500 hover:text-gray-300 ml-1`}
            >
              <BookOpen size={14} />
              {currentLang === 'vi' ? 'THÔNG TIN KHỐI' : 'BLOCK INFO'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{user.displayName || (currentLang === 'vi' ? 'Người dùng' : 'User')}</span>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{currentLang === 'vi' ? 'Thành viên' : 'Member'}</span>
              </div>
              <button 
                onClick={logout}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center border border-white/10 group overflow-hidden"
                title={currentLang === 'vi' ? 'Đăng xuất' : 'Logout'}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={16} className="text-gray-400 group-hover:text-white" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setShowAuthModal(true); }}
                className="px-6 py-2 bg-[#4c97ff] hover:bg-[#3a86ff] text-white text-[11px] font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 uppercase tracking-widest active:scale-95"
              >
                <LogIn size={15} />
                {currentLang === 'vi' ? 'Đăng nhập' : 'Login'}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex-1 flex relative overflow-hidden">
        <div className="flex-1 relative overflow-hidden">
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 origin-top-left w-full h-full"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#2b2b2b] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              >
                <div className="w-16 h-16 bg-[#4c97ff]/10 rounded-2xl flex items-center justify-center mb-6">
                  <Info className="text-[#4c97ff]" size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                  {currentLang === 'vi' ? 'THÔNG TIN' : 'INFORMATION'}
                </h3>
                <div className="text-gray-400 mb-8 space-y-4">
                  <p>
                    {currentLang === 'vi' 
                      ? 'BlockLua là một công cụ lập trình trực quan mạnh mẽ cho Roblox, giúp bạn tạo ra các đoạn mã Luau một cách dễ dàng thông qua các khối lệnh.'
                      : 'BlockLua is a powerful visual programming tool for Roblox, helping you create Luau scripts easily through command blocks.'}
                  </p>
                  
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs font-bold text-[#ff4c4c] uppercase tracking-widest mb-2">
                      {currentLang === 'vi' ? 'CÁC LỖI ĐANG KHẮC PHỤC' : 'KNOWN ISSUES'}
                    </p>
                    <ul className="text-[11px] list-disc list-inside space-y-1 opacity-80">
                      <li>{currentLang === 'vi' ? 'Lỗi hiển thị màu chữ trong một số ô chọn.' : 'Text color display error in some dropdowns.'}</li>
                      <li>{currentLang === 'vi' ? 'Một số khối lệnh nâng cao chưa hỗ trợ đầy đủ Luau.' : 'Some advanced blocks lack full Luau support.'}</li>
                      <li>{currentLang === 'vi' ? 'Lỗi đồng bộ hóa Workspace khi bộ nhớ đầy.' : 'Workspace sync error when memory is full.'}</li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Version</p>
                      <p className="text-white font-mono text-xs">v1.2.0 Stable</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Developer</p>
                      <p className="text-white font-mono text-xs">BlockLua Team</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="w-full py-3 rounded-2xl bg-[#4c97ff] hover:bg-[#3d86f0] text-white font-black transition-all"
                >
                  {currentLang === 'vi' ? 'ĐÓNG' : 'CLOSE'}
                </button>
              </motion.div>
            </motion.div>
          )}

          {showBlockInfoModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center w-full h-full"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-[#111111] w-full h-full flex flex-col overflow-hidden relative"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/40 backdrop-blur-md relative z-20">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#4c97ff]/20 rounded-lg flex items-center justify-center shadow-lg shadow-[#4c97ff]/10 border border-[#4c97ff]/30">
                      <BookOpen className="text-[#4c97ff]" size={16} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white tracking-tighter flex items-center gap-2">
                        {currentLang === 'vi' ? 'THÔNG TIN KHỐI GIAO DIỆN' : 'BLOCK INTERFACE INFO'}
                        <span className="px-1.5 py-0.5 bg-[#4c97ff]/10 text-[#4c97ff] rounded-md text-[7px] font-black border border-[#4c97ff]/20 uppercase tracking-widest">v2.5</span>
                      </h3>
                      <div className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mt-0.5 flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                        {currentLang === 'vi' ? 'Tìm hiểu cách hoạt động của mọi nhóm lệnh' : 'Learn how every command group works'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {infoActiveCategory && (
                      <button 
                        onClick={() => {
                          setInfoActiveCategory(null);
                          setSelectedBlockInfo(null);
                        }}
                        className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/5"
                      >
                        <ChevronRight size={14} className="rotate-180" />
                        {currentLang === 'vi' ? 'QUAY LẠI' : 'BACK'}
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setShowBlockInfoModal(false);
                        setSelectedBlockInfo(null);
                        setInfoActiveCategory(null);
                      }}
                      className="w-10 h-10 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl flex items-center justify-center text-gray-400 transition-all group border border-white/5"
                    >
                      <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 flex overflow-hidden relative z-10">
                  {/* Category Selection View */}
                  {!infoActiveCategory ? (
                    <div className="flex-1 flex flex-col p-5 md:p-6 overflow-hidden">
                      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-base font-black text-white tracking-tight mb-0.5">
                            {currentLang === 'vi' ? 'Danh sách nhóm lệnh' : 'Command Group List'}
                          </h4>
                          <p className="text-gray-500 text-[10px] font-medium font-bold uppercase tracking-wider">
                            {currentLang === 'vi' ? 'Nhấn vào một nhóm để xem chi tiết các khối lệnh bên trong.' : 'Click on a group to see code block details within.'}
                          </p>
                        </div>
                        <div className="relative w-full md:w-56 group">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#4c97ff] transition-colors" size={14} />
                          <input 
                            type="text" 
                            value={categorySearchQuery}
                            onChange={(e) => setCategorySearchQuery(e.target.value)}
                            placeholder={currentLang === 'vi' ? "Tìm nhóm lệnh..." : "Search groups..."}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-5 text-[11px] text-white focus:outline-none focus:border-[#4c97ff]/50 focus:bg-white/10 transition-all placeholder:text-gray-600 shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6 overflow-x-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                          {CATEGORIES.filter(c => c.name.toLowerCase().includes(categorySearchQuery.toLowerCase())).map((cat) => {
                            const catColor = getCategoryColor(cat.name);
                            const blockCount = blockCountsByCategory[cat.name] || 0;
                            
                            return (
                              <motion.button
                                key={cat.name}
                                onClick={() => setInfoActiveCategory(cat.name)}
                                className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 text-left hover:border-[#4c97ff]/40 transition-[border-color,transform] duration-75 group flex flex-col h-full shadow-lg relative overflow-hidden will-change-transform hover:scale-[1.05] active:scale-[0.95]"
                              >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#4c97ff]/5 rounded-bl-full -mr-8 -mt-8 blur-xl pointer-events-none"></div>
                                
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/20 relative z-10" style={{ backgroundColor: catColor + '20' }}>
                                  <div className="w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5" style={{ backgroundColor: catColor }}></div>
                                  <span className="text-base font-black" style={{ color: catColor }}>{cat.name.charAt(0)}</span>
                                </div>
                                
                                <h5 className="text-sm font-black text-white mb-1 tracking-tight group-hover:text-[#4c97ff] transition-colors">{cat.name}</h5>
                                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-4">
                                  {blockCount} {currentLang === 'vi' ? 'Khối lệnh' : 'Blocks'}
                                </p>
                                
                                <div className="mt-auto flex items-center justify-between">
                                  <span className="text-[8px] font-black text-[#4c97ff] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    {currentLang === 'vi' ? 'Khám phá' : 'Explore'}
                                  </span>
                                  <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-[#4c97ff] group-hover:text-white transition-all">
                                    <ChevronRight size={14} />
                                  </div>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Block Selection & Details View */
                    <div className="flex-1 flex overflow-hidden">
                      {/* Sub-Panel: Blocks List */}
                      <div className="w-56 border-r border-white/5 flex flex-col bg-[#0a0a0a] relative z-20">
                        <div className="p-4 border-b border-white/5">
                          <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: getCategoryColor(infoActiveCategory) + '20' }}>
                              <span className="font-black text-[12px]" style={{ color: getCategoryColor(infoActiveCategory) }}>{infoActiveCategory.charAt(0)}</span>
                            </div>
                            <h4 className="text-[11px] font-black text-white tracking-tight uppercase">{infoActiveCategory}</h4>
                          </div>
                          <div className="relative group">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                            <input 
                              type="text" 
                              placeholder={currentLang === 'vi' ? "Tìm khối..." : "Search block..."}
                              className="w-full bg-white/5 border border-white/5 rounded-lg py-1.5 pl-8 pr-3 text-[9px] text-white focus:outline-none focus:border-[#4c97ff]/50 transition-all font-bold"
                              onChange={(e) => {
                                const val = e.target.value.toLowerCase();
                                const items = document.querySelectorAll('.sub-block-item');
                                items.forEach(item => {
                                  if (item.textContent?.toLowerCase().includes(val)) {
                                    (item as HTMLElement).style.display = 'flex';
                                  } else {
                                    (item as HTMLElement).style.display = 'none';
                                  }
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1 will-change-transform contain-content overscroll-contain">
                          {infoModalBlocks.map(block => (
                            <button
                              key={block.type}
                              onClick={() => setSelectedBlockInfo(block)}
                              className={`sub-block-item w-full text-left px-4 py-2.5 rounded-xl text-[10px] transition-all flex items-center gap-3 group border ${selectedBlockInfo?.type === block.type ? 'bg-[#4c97ff] border-[#4c97ff]/30 text-white shadow-xl shadow-[#4c97ff]/10' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-white'}`}
                            >
                              <div 
                                className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${selectedBlockInfo?.type === block.type ? 'bg-white scale-125 shadow-[0_0_8px_white]' : 'bg-white/10 group-hover:bg-white/30'}`} 
                                style={{ backgroundColor: selectedBlockInfo?.type === block.type ? undefined : getCategoryColor(infoActiveCategory) }}
                              ></div>
                              <span className="truncate font-black tracking-tight uppercase">{block.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                  
                      {/* Detail View */}
                      <div className="flex-1 bg-[#0f0f0f] overflow-y-auto custom-scrollbar relative p-6 lg:p-8 will-change-transform contain-content overscroll-contain transform translate-z-0">
                        {selectedBlockInfo ? (
                          <motion.div
                            key={selectedBlockInfo.type}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-4xl"
                          >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-gray-500 text-[7px] font-black uppercase tracking-widest">
                                  ID: {selectedBlockInfo.type}
                                </div>
                            </div>

                            <h2 className="text-xl font-black text-white mb-8 tracking-tighter leading-tight drop-shadow-2xl">
                              {selectedBlockInfo.name}
                            </h2>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                              <div className="space-y-8">
                                <section className="relative contain-paint">
                                  <div className="absolute -left-5 top-0 bottom-0 w-0.5 bg-[#4c97ff] rounded-full opacity-50"></div>
                                  <h3 className="text-[9px] font-black text-[#4c97ff] uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                                    <Info size={11} />
                                    {currentLang === 'vi' ? 'MÔ TẢ HOẠT ĐỘNG' : 'OPERATION DESCRIPTION'}
                                  </h3>
                                  <div className="text-sm text-gray-300 leading-relaxed font-medium">
                                    {getBlockDescription(selectedBlockInfo, currentLang)}
                                  </div>
                                </section>

                                <section className="bg-white/[0.01] border border-white/5 p-5 md:p-6 rounded-2xl contain-paint">
                                  <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                                    <Zap size={11} />
                                    {currentLang === 'vi' ? 'CÁCH SỬ DỤNG' : 'HOW TO USE'}
                                  </h3>
                                  <div className="space-y-5">
                                    {getBlockUsage(selectedBlockInfo, currentLang).map((step, i) => (
                                      <div key={i} className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-lg bg-[#4c97ff]/10 border border-[#4c97ff]/20 flex items-center justify-center text-[#4c97ff] text-[10px] font-black shrink-0">
                                          {i + 1}
                                        </div>
                                        <p className="text-gray-400 text-sm leading-snug">{step}</p>
                                      </div>
                                    ))}
                                  </div>
                                </section>

                                {getBlockSyntax(selectedBlockInfo) && (
                                  <section className="bg-black/40 border border-white/5 p-0 rounded-2xl relative overflow-hidden group contain-paint">
                                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                                      <h3 className="text-[9px] font-black text-[#f86d7c] uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Terminal size={11} />
                                        {currentLang === 'vi' ? 'BẢNG CÚ PHÁP CHUẨN' : 'STANDARD SYNTAX TABLE'}
                                      </h3>
                                      <Code2 size={12} className="text-gray-600" />
                                    </div>
                                    <div className="relative">
                                      <SyntaxHighlighter
                                        language="lua"
                                        style={robloxTheme}
                                        PreTag="div"
                                        customStyle={{
                                          margin: 0,
                                          padding: '24px',
                                          borderRadius: '0',
                                          fontSize: '11px',
                                          background: 'transparent',
                                          lineHeight: '1.6'
                                        }}
                                      >
                                        {getBlockSyntax(selectedBlockInfo) || ''}
                                      </SyntaxHighlighter>
                                      
                                      <div className="absolute bottom-0 right-0 p-4">
                                        <div className="px-2 py-1 bg-[#f86d7c]/10 text-[#f86d7c] text-[7px] font-black rounded-md border border-[#f86d7c]/20 uppercase tracking-widest">Luau Language</div>
                                      </div>
                                    </div>
                                  </section>
                                )}
                              </div>

                              <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Preview</h3>
                                <div className="aspect-video bg-black/60 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-inner">
                                  <div className="absolute inset-0 bg-gradient-to-br from-[#4c97ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  <BlocklyPreview blockType={selectedBlockInfo.type} />
                                  
                                  <div className="absolute bottom-4 right-4">
                                    <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-[8px] font-black text-gray-600 tracking-widest uppercase">
                                      Interactive Preview
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="p-8 bg-gradient-to-br from-[#4c97ff]/10 to-transparent border border-[#4c97ff]/20 rounded-3xl">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Sparkles className="text-[#4c97ff]" size={16} />
                                    <h4 className="text-white font-black uppercase text-[10px] tracking-widest">{currentLang === 'vi' ? 'Ghi chú thêm' : 'Additional Notes'}</h4>
                                  </div>
                                  <p className="text-gray-400 text-xs leading-relaxed italic">
                                    {currentLang === 'vi' 
                                      ? `Bạn có thể xem mã Luau tương ứng trong khung Scripting để hiểu rõ bản chất hoạt động của khối này.` 
                                      : `You can view the corresponding Luau code in the Scripting panel to understand the underlying operation of this block.`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-2xl relative">
                              <Layers className="text-gray-800" size={48} />
                              <div className="absolute -inset-2 bg-[#4c97ff]/10 rounded-full blur-xl animate-pulse"></div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">
                              {currentLang === 'vi' ? 'Hãy chọn một khối' : 'Select a Block'}
                            </h3>
                            <p className="text-gray-600 max-w-sm font-bold uppercase tracking-widest text-[10px]">
                              {currentLang === 'vi' ? 'Thông tin chi tiết sẽ hiển thị tại đây' : 'Details will be shown here'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer bar */}
                <div className="h-8 bg-black/40 border-t border-white/5 px-6 flex items-center justify-between relative z-20">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#4c97ff] shadow-[0_0_6px_#4c97ff]"></div>
                       <span className="text-[8px] font-black text-gray-500 tracking-[0.2em] uppercase">
                          {allBlocks.length} {currentLang === 'vi' ? 'Khối lệnh' : 'Blocks'}
                       </span>
                    </div>
                     <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]"></div>
                        <span className="text-[8px] font-black text-gray-500 tracking-[0.2em] uppercase">
                          {CATEGORIES.length} {currentLang === 'vi' ? 'Phân nhóm' : 'Categories'}
                        </span>
                     </div>
                  </div>
                  <div className="text-[8px] font-black text-gray-700 tracking-[0.3em] uppercase">
                    BLOCKLUA PRO DOCUMENTATION
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showClearModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 origin-top-left w-full h-full"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#2b2b2b] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Trash2 className="text-red-500" size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">CLEAR WORKSPACE?</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  This will permanently delete all blocks in your current workspace. This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowClearModal(false)}
                    className="flex-1 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={confirmClear}
                    className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black shadow-xl shadow-red-500/20 transition-all transform hover:scale-105 active:scale-95"
                  >
                    CLEAR ALL
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showSyncModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 origin-top-left w-full h-full"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1e1e1e] border border-white/10 rounded-3xl p-0 max-w-3xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-white/5 bg-gradient-to-r from-[#4c97ff]/10 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#4c97ff]/20 flex items-center justify-center">
                      <RefreshCw className="text-[#4c97ff]" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight uppercase">
                        {currentLang === 'vi' ? 'ĐỒNG BỘ VỚI ROBLOX STUDIO' : 'SYNC WITH ROBLOX STUDIO'}
                      </h3>
                      <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 mt-2">
                        <button 
                          onClick={() => setActiveSyncTab('copy')}
                          className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${activeSyncTab === 'copy' ? 'bg-[#4c97ff] text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                          {currentLang === 'vi' ? 'THỦ CÔNG' : 'MANUAL'}
                        </button>
                        <button 
                          onClick={() => setActiveSyncTab('plugin')}
                          className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${activeSyncTab === 'plugin' ? 'bg-[#4c97ff] text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                          {currentLang === 'vi' ? 'DÒNG TỆP (PLUGIN)' : 'FILE STREAM (PLUGIN)'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSyncModal(false)} 
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  {activeSyncTab === 'copy' ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <Copy className="text-orange-500" size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white mb-1 uppercase">{currentLang === 'vi' ? 'Sao chép Lua' : 'Copy Lua'}</h4>
                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                              {currentLang === 'vi' ? 'Sao chép đoạn mã đã tạo để dán thủ công vào Script trong Studio.' : 'Copy the generated code to manually paste into Studio.'}
                            </p>
                          </div>
                          <button 
                             onClick={() => {
                               navigator.clipboard.writeText(generatedCode);
                               showToast(currentLang === 'vi' ? 'Đã sao chép mã!' : 'Code copied!');
                             }}
                             className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
                          >
                            <Copy size={14} />
                            {currentLang === 'vi' ? 'SAO CHÉP MÃ' : 'COPY CODE'}
                          </button>
                        </div>

                        <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Download className="text-green-500" size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white mb-1 uppercase">{currentLang === 'vi' ? 'Tải tệp .lua' : 'Download .lua'}</h4>
                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                              {currentLang === 'vi' ? 'Tải mã xuống thành tệp vật lý để quản lý dễ dàng hơn.' : 'Download code as a physical file for easier management.'}
                            </p>
                          </div>
                          <button 
                             onClick={downloadCurrentScript}
                             className="w-full py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 text-[10px] font-black rounded-xl border border-green-500/20 transition-all flex items-center justify-center gap-2"
                          >
                            <Download size={14} />
                            {currentLang === 'vi' ? 'TẢI TỆP XUỐNG' : 'DOWNLOAD FILE'}
                          </button>
                        </div>
                      </div>

                      <div className="p-5 bg-[#4c97ff]/5 rounded-2xl border border-[#4c97ff]/10">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={14} className="text-[#4c97ff]" />
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{currentLang === 'vi' ? 'Xuất nhanh tới Explorer' : 'Quick Export to Explorer'}</h4>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-4 font-medium italic">
                          {currentLang === 'vi' ? '*Yêu cầu Plugin đang chạy trong Studio' : '*Requires Plugin running in Studio'}
                        </p>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => { handleQuickExport('Script'); setShowSyncModal(false); }}
                            className="flex-1 py-2.5 bg-[#4c97ff] hover:bg-[#3a86ff] text-white text-[10px] font-black rounded-xl shadow-lg shadow-[#4c97ff]/20 transition-all flex items-center justify-center gap-2"
                          >
                            <Server size={14} />
                            SERVER SCRIPT
                          </button>
                          <button 
                            onClick={() => { handleQuickExport('LocalScript'); setShowSyncModal(false); }}
                            className="flex-1 py-2.5 bg-[#ff4c4c] hover:bg-[#ea3c3c] text-white text-[10px] font-black rounded-xl shadow-lg shadow-[#ff4c4c]/20 transition-all flex items-center justify-center gap-2"
                          >
                            <User size={14} />
                            LOCAL SCRIPT
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <div className="p-5 bg-black/30 rounded-2xl border border-white/5">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#4c97ff]/10 flex items-center justify-center shrink-0">
                              <Zap className="text-[#4c97ff]" size={20} />
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-white mb-1 uppercase">{currentLang === 'vi' ? 'Đồng bộ tự động (File Stream)' : 'Auto-Sync (File Stream)'}</h4>
                               <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                                {currentLang === 'vi' 
                                  ? 'Sử dụng đoạn mã này để tạo một Plugin địa phương. Nó sẽ tự động nhận diện mã nguồn từ trình duyệt và đưa vào game của bạn.' 
                                  : 'Use this code to create a local Plugin. It will automatically detect source code from the browser and bring it into your game.'}
                               </p>
                            </div>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{currentLang === 'vi' ? 'Mã nguồn Plugin' : 'Plugin Source Code'}</span>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(robloxSyncPluginCode);
                                showToast(currentLang === 'vi' ? 'Đã sao chép Plugin!' : 'Plugin copied!');
                              }}
                              className="text-[9px] font-black text-[#4c97ff] hover:underline flex items-center gap-1"
                            >
                              <Copy size={10} />
                              {currentLang === 'vi' ? 'SAO CHÉP TẤT CẢ' : 'COPY ALL'}
                            </button>
                          </div>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-[#4c97ff]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                            <pre className="bg-black/50 p-5 rounded-xl text-[10px] font-mono text-gray-400 border border-white/5 max-h-48 overflow-y-auto custom-scrollbar">
                              {robloxSyncPluginCode}
                            </pre>
                          </div>
                       </div>

                       <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-xl">
                          <p className="text-[10px] text-orange-500 font-bold flex items-center gap-2">
                             <Info size={12} />
                             {currentLang === 'vi' 
                               ? 'QUAN TRỌNG: Bạn phải bật "Allow HTTP Requests" trong phần Game Settings > Security của Studio.' 
                               : 'IMPORTANT: You must enable "Allow HTTP Requests" in Studio Game Settings > Security.'}
                          </p>
                       </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between px-8">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Connect Established</span>
                  </div>
                  <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    v2.5 Sync Protocol
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}


          

          {showCanvasModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4 w-full h-full"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-[90vw] h-[85vh] shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4c97ff]/20 rounded-xl flex items-center justify-center">
                      <Monitor className="text-[#4c97ff]" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {currentLang === 'vi' ? 'CANVAS TRỰC QUAN' : 'VISUAL CANVAS'}
                      </h3>
                      <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">
                        {currentLang === 'vi' ? 'Môi trường xem trước 3D' : '3D Preview Environment'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowCanvasModal(false)}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-20" style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px)',
                    transformOrigin: 'top'
                  }}></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="w-32 h-32 bg-[#4c97ff]/10 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                      <Monitor className="text-[#4c97ff]" size={64} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">CANVAS ACTIVE</h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                      {currentLang === 'vi' 
                        ? 'Hệ thống Canvas đã được kích hoạt. Bạn có thể xem trước các thay đổi trực quan tại đây.'
                        : 'Canvas system is active. You can preview visual changes here.'}
                    </p>
                  </div>
                  
                  {/* Floating elements to make it look "active" */}
                  <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#4c97ff] rounded-full blur-xl animate-bounce"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-[#ff4c4c] rounded-full blur-xl animate-pulse"></div>
                </div>
                
                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
                  <button 
                    onClick={() => setShowCanvasModal(false)}
                    className="px-8 py-3 rounded-2xl bg-[#4c97ff] hover:bg-[#3d86f0] text-white font-black transition-all"
                  >
                    {currentLang === 'vi' ? 'QUAY LẠI' : 'BACK'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showExportModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 w-full h-full"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#2b2b2b] border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowExportModal(false)} 
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="w-16 h-16 bg-[#4c97ff]/10 rounded-2xl flex items-center justify-center mb-6">
                  <Download className="text-[#4c97ff]" size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                  {currentLang === 'vi' ? 'XUẤT MÃ LUA' : 'EXPORT LUA CODE'}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {currentLang === 'vi' 
                    ? 'Mã Lua đã được tạo sẵn sàng để sử dụng trong Roblox Studio.'
                    : 'Lua code has been generated and is ready for use in Roblox Studio.'}
                </p>
                
                <div className="relative group">
                  <pre className="bg-[#1e1e1e] p-6 rounded-xl overflow-x-auto text-sm font-mono text-gray-300 border border-white/5 shadow-inner max-h-64 custom-scrollbar">
                    {generatedCode || '-- No code generated yet'}
                  </pre>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                      setToast({ message: currentLang === 'vi' ? 'Đã sao chép mã!' : 'Code copied!', type: 'success' });
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all opacity-0 group-hover:opacity-100"
                    title="Copy Code"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                
                <div className="mt-8 flex justify-end gap-4">
                  <button 
                    onClick={() => setShowExportModal(false)}
                    className="px-8 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black transition-all"
                  >
                    {currentLang === 'vi' ? 'ĐÓNG' : 'CLOSE'}
                  </button>
                  <button 
                    onClick={() => {
                      const blob = new Blob([generatedCode], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'script.lua';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-8 py-3 rounded-2xl bg-[#4c97ff] hover:bg-[#3d86f0] text-white font-black transition-all shadow-xl shadow-[#4c97ff]/20 flex items-center gap-2"
                  >
                    <Download size={18} />
                    {currentLang === 'vi' ? 'TẢI XUỐNG' : 'DOWNLOAD'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showControlCenter && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 z-[1000] flex items-center justify-center w-full h-full transition-all duration-500 bg-black/60 backdrop-blur-sm p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1a1a1a] border border-white/10 shadow-2xl flex overflow-hidden transition-all duration-500 max-w-4xl w-full h-[80vh] rounded-3xl"
              >
                <div className="w-64 bg-black/40 border-r border-white/5 flex flex-col p-6">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-[#4c97ff] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <LayoutDashboard className="text-white" size={20} />
                    </div>
                    <h3 className="text-lg font-black text-white tracking-tight">LAB CENTER</h3>
                  </div>

                  <div className="space-y-2 flex-1">
                    <button 
                      onClick={() => setControlCenterTab('storage')}
                      className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${controlCenterTab === 'storage' ? 'bg-[#4c97ff] text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
                    >
                      <Database size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">{currentLang === 'vi' ? 'Kho lưu trữ' : 'Storages'}</span>
                    </button>
                    <button 
                      onClick={() => setControlCenterTab('achievements')}
                      className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${controlCenterTab === 'achievements' ? 'bg-[#4c97ff] text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
                    >
                      <Trophy size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">{currentLang === 'vi' ? 'Thành tựu' : 'Achievements'}</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => setShowControlCenter(false)}
                    className="mt-auto w-full py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    {currentLang === 'vi' ? 'Đóng' : 'Close'}
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
                  {controlCenterTab === 'storage' && (
                    <div className="flex-1 flex flex-col p-8 overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-black text-white tracking-tight">{currentLang === 'vi' ? 'KHO LƯU TRỮ ĐÁM MÂY' : 'CLOUD STORAGES'}</h2>
                          <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">
                            {currentLang === 'vi' ? 'Lưu và tải các dự án của bạn' : 'Save and load your projects'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Connected</span>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {storages.map((storage, index) => (
                          <div 
                            key={storage.id}
                            className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-[#4c97ff]/30 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-[#4c97ff] transition-colors">
                                <Database size={18} />
                              </div>
                              <div>
                                <input 
                                  type="text" 
                                  value={storage.name}
                                  onChange={(e) => renameStorage(index, e.target.value)}
                                  className="bg-transparent text-sm font-black text-white focus:outline-none focus:text-[#4c97ff] transition-colors w-40"
                                />
                                <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">
                                  {storage.time === '-' ? (currentLang === 'vi' ? 'Trống' : 'Empty') : storage.time}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => saveToStorage(index)}
                                className="px-4 py-2 bg-white/5 hover:bg-[#4c97ff] text-gray-400 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                              >
                                <Save size={14} />
                                {currentLang === 'vi' ? 'Lưu' : 'Save'}
                              </button>
                              <button 
                                onClick={() => loadFromStorage(index)}
                                disabled={storage.time === '-'}
                                className="px-4 py-2 bg-white/5 hover:bg-green-500 disabled:opacity-20 text-gray-400 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                              >
                                <Download size={14} />
                                {currentLang === 'vi' ? 'Tải' : 'Load'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {controlCenterTab === 'test' && (
                    <div className="flex-1 p-8 flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-white tracking-tight">{currentLang === 'vi' ? 'KIỂM TRA CODE' : 'TEST CODE'}</h2>
                        <button onClick={testCode} className="px-6 py-3 bg-[#4c97ff] rounded-xl text-white font-black text-xs uppercase tracking-widest">
                          {currentLang === 'vi' ? 'Kiểm tra' : 'Check'}
                        </button>
                      </div>
                      <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-xs font-black text-white tracking-widest uppercase">Console</h3>
                        <div className="h-64 overflow-y-auto custom-scrollbar p-4 bg-black rounded-xl font-mono text-[10px]">
                            {testResult.status === 'testing' && <div className="text-gray-500">Testing...</div>}
                            {testResult.logs.map((log, i) => (
                                <div key={i} className={log.type === 'error' ? 'text-red-500' : 'text-green-500'}>
                                    {log.type === 'error' ? `[Line ${log.line}] Error: ${log.message}` : log.message}
                                </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {controlCenterTab === 'achievements' && (
                    <div className="flex-1 flex flex-col p-8 overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-black text-white tracking-tight">{currentLang === 'vi' ? 'THÀNH TỰU VÔ TRÍ' : 'MINDLESS ACHIEVEMENTS'}</h2>
                          <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">
                            {currentLang === 'vi' ? 'Những cột mốc không ai cần nhưng bạn vẫn có' : 'Milestones nobody needs but you still have'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {user && isAutoSaving && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                              <RefreshCw size={10} className="text-green-500 animate-spin" />
                              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Auto-saving</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                            <Trophy size={12} className="text-yellow-500" />
                            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                              {achievements.length} / {achievementList.length}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-4">
                        {achievementList.map((ach) => {
                          const isUnlocked = achievements.includes(ach.id);
                          return (
                            <div 
                              key={ach.id}
                              className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${isUnlocked ? 'bg-white/5 border-white/10' : 'bg-black/20 border-white/5 opacity-40 grayscale'}`}
                            >
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isUnlocked ? 'bg-[#4c97ff]/20' : 'bg-gray-800 text-gray-600'}`}>
                                {isUnlocked ? (
                                  <img 
                                    src="/attachments/86c69f2e-131b-410c-977b-6020586e37e9.png" 
                                    alt="Badge" 
                                    className="w-10 h-10 object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/190/190411.png';
                                    }}
                                  />
                                ) : (
                                  ach.icon
                                )}
                              </div>
                              <div>
                                <h4 className={`text-sm font-black tracking-tight ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                                  {ach.title[currentLang as 'vi' | 'en']}
                                </h4>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                  {ach.desc[currentLang as 'vi' | 'en']}
                                </p>
                              </div>
                              {isUnlocked && (
                                <div className="ml-auto">
                                  <CheckCircle2 size={16} className="text-green-500" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {showTutorialModal && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTutorialModal(false)} />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative bg-[#1a1a1a] border border-[#4c97ff]/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(76,151,255,0.3)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-[#4c97ff]" size={24} />
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Tutorial Step {tutorialStep + 1}/3</span>
                  </div>
                  <button onClick={() => setShowTutorialModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{tutorials[tutorialStep].title}</h3>
                <p className="text-gray-400 leading-relaxed mb-8">{tutorials[tutorialStep].content}</p>
                <div className="flex justify-between items-center">
                  <button 
                    disabled={tutorialStep === 0}
                    onClick={() => setTutorialStep(s => s - 1)}
                    className="text-xs font-bold text-gray-500 hover:text-white disabled:opacity-0 transition-all"
                  >
                    PREVIOUS
                  </button>
                  <button 
                    onClick={() => {
                      if (tutorialStep < tutorials.length - 1) {
                        setTutorialStep(s => s + 1);
                      } else {
                        setShowTutorialModal(false);
                      }
                    }}
                    className="px-8 py-3 bg-[#4c97ff] hover:bg-[#3d86f0] text-white font-black rounded-2xl transition-all shadow-lg shadow-[#4c97ff]/20"
                  >
                    {tutorialStep === tutorials.length - 1 ? 'FINISH' : 'NEXT STEP'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

        </AnimatePresence>

        <div 
          className={`absolute inset-0 overflow-hidden transition-opacity duration-300 ${view === 'blocks' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          <div 
            ref={blocklyDiv} 
            className="absolute top-0 left-0 w-full h-full" 
            onDragOver={(e) => {
              if (e.dataTransfer.types.includes('application/blocklua-instance')) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }
            }}
            onDrop={(e) => {
              const instancePath = e.dataTransfer.getData('application/blocklua-instance');
              if (instancePath && workspace.current) {
                e.preventDefault();
                
                // Get drop coordinates relative to the workspace
                const rect = blocklyDiv.current!.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Convert to workspace coordinates
                const metrics = workspace.current.getMetrics();
                const scale = workspace.current.scale;
                
                const workspaceX = (x - metrics.absoluteLeft) / scale;
                const workspaceY = (y - metrics.absoluteTop) / scale;
                
                // Create the block
                const block = workspace.current.newBlock('world_instance');
                block.setFieldValue(instancePath, 'INSTANCE');
                block.initSvg();
                block.render();
                block.moveBy(workspaceX, workspaceY);
              }
            }}
          />
          
          <div className="absolute bottom-6 right-6 z-50 flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearWorkspace}
              className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-2xl flex items-center justify-center transition-colors group origin-bottom-right"
              title="Clear Workspace"
            >
              <Trash2 size={18} className="group-hover:animate-bounce" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {view === 'codes' && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bg-[#1e1e1e] z-40 flex flex-col origin-top-left w-full h-full"
            >
              <div className="h-12 bg-[#252525] border-b border-white/5 flex items-center px-6 justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="text-[#4c97ff]" size={18} />
                  <span className="text-xs font-black text-gray-400 tracking-widest uppercase">Generated Luau Source</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      handleQuickExport('Script');
                    }} 
                    className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest flex items-center gap-1"
                  >
                    <FileCode2 size={12} /> Script
                  </button>
                  <button 
                    onClick={() => {
                      handleQuickExport('LocalScript');
                    }} 
                    className="text-[10px] font-black text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest flex items-center gap-1"
                  >
                    <FileCode2 size={12} /> LocalScript
                  </button>
                  <div className="text-[10px] text-gray-600 font-mono">ENCODING: UTF-8</div>
                  <div className="flex gap-4">
                    <button 
                      onClick={testCode}
                      className="text-[10px] font-black text-rose-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5"
                    >
                      <CheckCircle size={12} /> {currentLang === 'vi' ? 'Kiểm tra Code' : 'Test Code'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-[#1e1e1e] custom-scrollbar flex flex-col">
                <SyntaxHighlighter 
                  language="lua" 
                  style={robloxTheme}
                  customStyle={{
                    margin: 0,
                    padding: '32px',
                    fontSize: '16px',
                    lineHeight: '1.7',
                    background: 'transparent',
                    fontFamily: 'JetBrains Mono, monospace',
                    flex: 1
                  }}
                  showLineNumbers={true}
                  lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#444', textAlign: 'right', userSelect: 'none' }}
                >
                  {generatedCode}
                </SyntaxHighlighter>
                
                {testResult.status !== 'idle' && (
                  <div className="border-t border-black/40 bg-black/50 p-4">
                      <h3 className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-2">Output</h3>
                      <div className="max-h-40 overflow-y-auto custom-scrollbar font-mono text-[11px] space-y-1">
                          {testResult.status === 'testing' && <div className="text-gray-500">Testing...</div>}
                          {testResult.logs.map((log, i) => (
                              <div key={i} className={log.type === 'error' ? 'text-red-400' : 'text-emerald-400'}>
                                  {log.type === 'error' ? `[Line ${log.line}] Error: ${log.message}` : `> ${log.message}`}
                              </div>
                          ))}
                      </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Explorer Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            style={{ width: sidebarWidth }}
            className={`relative bg-[#1a1a1a] border-l border-white/5 flex flex-col transition-shadow h-full ${selectorTarget ? 'z-[200] ring-4 ring-[#4c97ff] ring-inset shadow-[0_0_100px_rgba(76,151,255,0.4)]' : 'z-20'}`}
          >
            {/* Resize Handle */}
            <div 
              onMouseDown={startResizing}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#4c97ff]/30 transition-colors z-30 hidden lg:block"
            />

            <div className="h-10 bg-[#252525] border-b border-white/5 flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <Layers className="text-[#4c97ff]" size={16} />
                <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Explorer</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
                {selectorTarget === 'export' && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 rounded text-[9px] font-bold text-red-400 animate-pulse">
                    SELECT TARGET...
                  </div>
                )}
                {selectorTarget && selectorTarget !== 'export' && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-[#4c97ff]/20 rounded text-[9px] font-bold text-[#4c97ff] animate-pulse">
                    SELECTING...
                  </div>
                )}
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/export_tree', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tree: explorer })
                      });
                      if (res.ok) {
                        showToast(currentLang === 'vi' ? 'Đã gửi yêu cầu lưu Explorer về Roblox Studio!' : 'Sent Explorer save request to Roblox Studio!');
                      } else {
                        showToast(currentLang === 'vi' ? 'Lỗi khi gửi yêu cầu lưu!' : 'Error sending save request!');
                      }
                    } catch (e) {
                      console.error(e);
                      showToast(currentLang === 'vi' ? 'Lỗi khi gửi yêu cầu lưu!' : 'Error sending save request!');
                    }
                  }}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-[#4c97ff]"
                  title={currentLang === 'vi' ? 'Lưu Explorer về Roblox Studio' : 'Save Explorer to Roblox Studio'}
                >
                  <Save size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-1 custom-scrollbar">
              <ExplorerTree 
                instance={explorer} 
                onSelect={(instance, path) => handleInstanceSelect(path, instance.id)}
                onToggleExpand={toggleExpand}
                onAddChild={(id) => setShowInsertObjectFor(id)}
                onRename={(id, newName) => updateInstanceProperty(id, 'Name', newName)}
                onDelete={deleteInstance}
                selectedId={selectedInstancePath}
              />
            </div>

            {selectorTarget && (
              <div className={`p-3 border-t ${selectorTarget === 'export' ? 'bg-red-500/10 border-red-500/20' : 'bg-[#4c97ff]/10 border-[#4c97ff]/20'}`}>
                <p className="text-[10px] text-gray-400 mb-2">
                  {selectorTarget === 'export' 
                    ? (currentLang === 'vi' ? 'Chọn một đối tượng để tạo script.' : 'Select an instance to create the script.')
                    : (currentLang === 'vi' ? 'Chọn một đối tượng để cập nhật khối lệnh.' : 'Select an instance to update the block.')
                  }
                </p>
                <button 
                  onClick={() => {
                    setSelectorTarget(null);
                    setExportScriptType(null);
                  }}
                  className="w-full py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-bold rounded transition-colors"
                >
                  {currentLang === 'vi' ? 'HỦY BỎ' : 'CANCEL SELECTION'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insert Object Menu Modal */}
      <AnimatePresence>
        {showInsertObjectFor && (
          <InsertObjectMenu 
            getIcon={getIcon}
            onClose={() => setShowInsertObjectFor(null)}
            onAdd={(className) => {
              const initialProps: Record<string, any> = {};
              if (className === 'Script' || className === 'LocalScript') {
                initialProps.Source = generatedCode;
              }
              addInstance(showInsertObjectFor, className, className, initialProps);
              setShowInsertObjectFor(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>

      {/* Authentication Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 w-full h-full"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e1e1e] border border-white/10 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 bg-gradient-to-r from-[#4c97ff]/10 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#4c97ff]/20 flex items-center justify-center">
                    <User className="text-[#4c97ff]" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight uppercase">
                      {currentLang === 'vi' ? 'ĐĂNG NHẬP' : 'LOGIN'}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                      {currentLang === 'vi' ? 'Truy cập vào tài khoản của bạn' : 'Access your account'}
                    </p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAuthModal(false)} 
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all outline-none"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="p-8 pb-10 space-y-6">
                <div className="space-y-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={login}
                    className="w-full py-4 bg-white text-black text-[14px] font-black rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {currentLang === 'vi' ? 'ĐĂNG NHẬP VỚI GOOGLE' : 'LOGIN WITH GOOGLE'}
                  </motion.button>

                  <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-6 opacity-50 px-4">
                    {currentLang === 'vi' 
                      ? 'Sử dụng tài khoản Google để đồng bộ thành tựu và dự án của bạn lên đám mây.' 
                      : 'Use your Google account to sync your achievements and projects to the cloud.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Hide Blockly's default UI elements we don't want */
        .blocklyTrash { display: none !important; }
        .blocklyZoom { display: none !important; }
        
        /* Scale the HTML toolbox */
        .blocklyToolboxDiv {
          /* Toolbox base styles */
        }
        
        .blocklyFlyoutBackground {
          fill: #121212 !important;
          fill-opacity: 0.6 !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        /* Aggressive Toolbox Overrides */
        .blocklyToolboxDiv, 
        .blocklyToolboxDiv *,
        [class*="blocklyToolbox"],
        [id*="blocklyToolbox"] {
          background-color: #000000 !important;
          color: #ffffff !important;
          border-left: none !important;
          border-right: none !important;
        }

        .blocklyTreeRow, 
        .blocklyTreeRowContentContainer, 
        .scratch-category-row,
        [class*="blocklyTreeRow"] {
          height: 28px !important;
          padding: 0 !important;
          margin: 0 !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: flex-start !important;
          background: transparent !important;
          border-left: none !important;
          border: none !important;
          outline: none !important;
        }

        /* Hide all potential vertical bars */
        .blocklyTreeRow:before,
        .blocklyTreeRow:after,
        .blocklyTreeSeparator,
        [class*="blocklyTreeRow"]:before,
        [class*="blocklyTreeRow"]:after {
          display: none !important;
          width: 0 !important;
          border: none !important;
        }

        .blocklyTreeLabel, 
        .scratch-category-label,
        [class*="blocklyTreeLabel"],
        .blocklyTreeRow span,
        .blocklyTreeRow div {
          font-family: "Inter", sans-serif !important;
          font-size: 11px !important;
          font-weight: 600 !important; /* Reduced from 800 */
          color: #ffffff !important;
          opacity: 1 !important;
          margin-left: 10px !important;
        }

        .blocklyTreeSelected {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        .blocklyTreeSelected .blocklyTreeRow::after {
          content: "★";
          color: #fbbf24;
          margin-left: auto;
          margin-right: 12px;
          font-size: 12px;
          animation: star-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes star-pop {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }

        @keyframes flyout-animate-in {
          0% { opacity: 0; translate: -15px 0; }
          100% { opacity: 1; translate: 0 0; }
        }

        @keyframes flyout-animate-out {
          0% { opacity: 1; translate: 0 0; }
          100% { opacity: 0; translate: -15px 0; }
        }

        .flyout-animate-in {
          animation: flyout-animate-in 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
        }

        .flyout-animate-out {
          animation: flyout-animate-out 0.15s ease-in forwards !important;
        }

        .scratch-category-icon {
          width: 18px !important;
          height: 18px !important;
          border-radius: 3px !important;
          margin-left: 12px !important;
          display: block !important;
          flex-shrink: 0 !important;
          border: 1px solid rgba(0,0,0,0.1) !important;
        }
        .blocklyMainBackground {
          stroke: none !important;
          fill: #0a0a0a !important;
        }
        .blocklyScrollbarHandle {
          fill: rgba(255,255,255,0.1) !important;
        }
        .blocklyToolboxCategory {
          padding: 4px 0 !important;
          border-bottom: 1px solid rgba(0,0,0,0.05) !important;
        }

        /* Effects Enabled Styles */
        .effects-enabled .scratch-category-row {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative;
        }

        .effects-enabled .scratch-category-row:hover {
          background-color: rgba(0, 0, 0, 0.03) !important;
          transform: translateX(4px) scale(1.02);
          z-index: 10;
          box-shadow: 4px 0 15px rgba(0,0,0,0.05);
        }

        .effects-enabled .blocklyFlyout {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease !important;
        }

        /* Toolbox Flyout Animation */
        .blocklyFlyout {
          animation: flyoutIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: left top;
        }

        @keyframes flyoutIn {
          from { transform: translateX(-20px) scale(1); opacity: 0; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }

        .effects-enabled .blocklyFlyoutBackground {
          transition: fill 0.3s ease !important;
        }

        .effects-enabled .blocklyTreeSelected {
          background-color: rgba(0, 0, 0, 0.08) !important;
          transform: translateX(6px) scale(1.04);
          box-shadow: 4px 0 20px rgba(0,0,0,0.1);
        }

        /* Horizontal dividers for categories */
        .blocklyToolboxCategory:not(:last-child) {
          margin-bottom: 2px;
          position: relative;
        }

        .blocklyToolboxCategory:not(:last-child):after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 10%;
          right: 10%;
          height: 1px;
          background: rgba(0,0,0,0.03);
        }

        .effects-enabled .blocklyToolboxCategory:not(:last-child):after {
          background: linear-gradient(to right, transparent, rgba(0,0,0,0.06), transparent);
        }

        .effects-enabled .blocklyBlockCanvas {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }

        .effects-enabled .blocklySelected > .blocklyPath {
          filter: drop-shadow(0 0 8px rgba(76, 151, 255, 0.4));
        }

        .effects-enabled .scratch-category-icon {
          transition: all 0.3s ease !important;
        }

        .effects-enabled .scratch-category-row:hover .scratch-category-icon {
          box-shadow: 0 0 10px currentColor;
          transform: scale(1.1);
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .no-select {
          user-select: none !important;
          -webkit-user-select: none !important;
        }
        
        .select-text {
          user-select: text !important;
          -webkit-user-select: text !important;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }

        /* Block Styling Overrides */
        .blocklyText {
          font-family: "Inter", sans-serif !important;
          fill: #ffffff !important; /* Labels on the block stay white */
        }
        
        /* FORCE white text inside the boxes (dropdowns/inputs) */
        .blocklyEditableText .blocklyText,
        .blocklyFieldDropdown .blocklyText,
        .blocklyDropdownText,
        .blocklyFieldText,
        .blocklyEditableText text,
        .blocklyFieldDropdown text,
        .blocklyEditableText tspan,
        .blocklyFieldDropdown tspan {
          fill: #ffffff !important;
          color: #ffffff !important;
          stroke: none !important;
        }
        
        /* Category Label Styling */
        .blocklyTreeLabel {
          font-weight: 400 !important;
          font-family: "Inter", sans-serif !important;
          font-size: 14px !important;
          color: #ffffff !important;
        }
        
        /* Change the boxes to a dark transparent color for white text */
        .blocklyFieldRect,
        .blocklyEditableText rect,
        .blocklyFieldDropdown rect {
          fill: rgba(0, 0, 0, 0.3) !important; /* Dark transparent background */
          fill-opacity: 1 !important;
          rx: 4px !important;
          ry: 4px !important;
        }
        
        /* Dropdown arrow fix - white arrow on dark box */
        .blocklyDropdownIcon {
          fill: #ffffff !important;
        }

        /* Input field when editing */
        .blocklyHtmlInput {
          user-select: text !important;
          -webkit-user-select: text !important;
          color: #ffffff !important;
          background-color: #333333 !important;
          font-family: sans-serif !important;
          border: none !important;
          outline: none !important;
        }
        /* Hide scrollbars for flyout */
        .blocklyFlyoutScrollbar {
          display: none !important;
        }
        
        /* Label styling inside flyout */
        .blocklyFlyoutLabelText {
          fill: #ffffff !important;
          font-family: "Inter", sans-serif !important;
          font-size: 12px !important;
          font-weight: 600 !important;
        }

        /* Faded text for placeholder blocks */
        .faded-placeholder-text {
          fill-opacity: 0.4 !important;
          font-style: italic !important;
        }

        /* Var label styling */
        .scratch-var-label {
          fill: #ffffff !important;
          font-weight: bold !important;
          cursor: pointer !important;
          background-color: rgba(255,255,255,0.2) !important;
        }
        
        .scratch-var-label:hover {
          fill: #ffff00 !important;
        }

        /* Fix Dropdown and Menu text color */
        .blocklyDropdownText,
        .blocklyMenu,
        .blocklyMenuItem,
        .blocklyMenuItemContent,
        .goog-menu,
        .goog-menuitem,
        .goog-menuitem-content,
        .blocklyDropdownMenuText {
          color: #ffffff !important;
          fill: #ffffff !important;
          font-family: "Inter", sans-serif !important;
          font-size: 14px !important;
        }
        
        /* Ensure the dropdown background is dark */
        .blocklyWidgetDiv .goog-menu,
        .blocklyDropDownDiv {
          background-color: #252525 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.5) !important;
          color: #ffffff !important;
        }

        /* Styling for the dropdown field on the block itself */
        .blocklyFieldRect {
          fill: rgba(0, 0, 0, 0.3) !important;
          fill-opacity: 1 !important;
          rx: 4px !important;
          ry: 4px !important;
        }
        
        /* Custom Category Colors */
        ${CATEGORIES.map((cat) => `
          .scratch-cat-${cat.name.toLowerCase().replace(/\s/g, '-')} .scratch-category-icon {
            background-color: ${cat.color} !important;
          }
        `).join('\n')}
      `}</style>
      {/* Achievement Badge Notification */}
      <AnimatePresence>
        {activeAchievement && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
                restDelta: 0.001
              }
            }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed bottom-10 right-10 z-[9998] flex items-center gap-4 bg-[#1a1a1a] border-2 border-[#4c97ff] rounded-3xl p-6 shadow-[0_0_50px_rgba(76,151,255,0.3)] min-w-[320px]"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative shrink-0"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#4c97ff]/20 to-transparent rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
                <img 
                  src="/attachments/86c69f2e-131b-410c-977b-6020586e37e9.png" 
                  alt="Badge" 
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    // Fallback if attachment is not found
                    (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/190/190411.png';
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#4c97ff] rounded-full flex items-center justify-center shadow-lg">
                <Trophy size={12} className="text-white" />
              </div>
            </motion.div>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-[#4c97ff] uppercase tracking-[0.2em] mb-1">Thành tựu mới!</span>
              <h4 className="text-xl font-black text-white tracking-tight leading-none mb-1">
                {activeAchievement.title[currentLang as 'vi' | 'en']}
              </h4>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                {activeAchievement.desc[currentLang as 'vi' | 'en']}
              </p>
            </div>

            {/* Shine effect */}
            <motion.div 
              initial={{ left: '-100%' }}
              animate={{ left: '200%' }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-emerald-500/90 border-emerald-400/50 text-white' 
                : 'bg-red-500/90 border-red-400/50 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
