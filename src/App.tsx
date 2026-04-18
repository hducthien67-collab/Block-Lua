/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly';
import { luaGenerator, Order } from 'blockly/lua';

class CustomZelosConstantProvider extends Blockly.zelos.ConstantProvider {
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
  Terminal
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
  { name: 'Gui' },
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

const BlocklyPreview = ({ blockType }: { blockType: string }) => {
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
};

const getBlockDescription = (block: any, lang: string) => {
  const type = block.type.toLowerCase();
  const name = block.name;
  
  // Events
  if (type.includes('event')) {
    if (type.includes('touched')) {
      return lang === 'vi'
        ? `Sự kiện này kích hoạt khi một đối tượng khác chạm vào đối tượng này. Nó trả về đối tượng đã chạm vào (OtherPart). Rất hữu ích để tạo bẫy, cửa tự động hoặc vùng hồi máu.`
        : `This event triggers when another object touches this object. It returns the object that touched it (OtherPart). Useful for creating traps, automatic doors, or healing zones.`;
    }
    if (type.includes('click')) {
      return lang === 'vi'
        ? `Sự kiện này kích hoạt khi người chơi click chuột vào đối tượng (phải có ClickDetector). Cho phép bạn tạo các nút bấm, công tắc hoặc vật phẩm có thể tương tác.`
        : `This event triggers when a player clicks on the object (requires a ClickDetector). Allows you to create buttons, switches, or interactive items.`;
    }
    return lang === 'vi' 
      ? `Sự kiện "${name}" sẽ tự động chạy đoạn mã bên trong khi điều kiện tương ứng xảy ra trong trò chơi. Đây là điểm bắt đầu của hầu hết các kịch bản.`
      : `The "${name}" event will automatically run the code inside when the corresponding condition occurs in the game. This is the starting point for most scripts.`;
  }
  
  // Properties (Set/Get)
  if (type.includes('set_')) {
    const prop = name.replace('set ', '').replace('đặt ', '');
    return lang === 'vi'
      ? `Khối lệnh này cho phép bạn thay đổi giá trị của thuộc tính "${prop}". Ví dụ: đổi màu sắc, độ trong suốt, hoặc vị trí của một khối Part.`
      : `This block allows you to change the value of the "${prop}" property. For example: changing the color, transparency, or position of a Part.`;
  }
  if (type.includes('get_')) {
    const prop = name.replace('get ', '').replace('lấy ', '');
    return lang === 'vi'
      ? `Khối lệnh này đọc giá trị hiện tại của thuộc tính "${prop}" để bạn có thể sử dụng nó trong các phép tính hoặc điều kiện khác.`
      : `This block reads the current value of the "${prop}" property so you can use it in other calculations or conditions.`;
  }
  
  // Logic
  if (type === 'lua_if') {
    return lang === 'vi'
      ? `Cấu trúc điều kiện cơ bản nhất. Nếu [điều kiện] là đúng (true), thì các lệnh bên trong sẽ được thực hiện. Nếu sai, chúng sẽ bị bỏ qua.`
      : `The most basic conditional structure. If the [condition] is true, the blocks inside will be executed. If false, they will be skipped.`;
  }
  
  // Instance creation
  if (type.includes('instance_new')) {
    return lang === 'vi'
      ? `Tạo ra một đối tượng mới hoàn toàn (như Part, Script, Sound) trong trò chơi. Bạn cần đặt Parent cho nó để nó xuất hiện trong thế giới.`
      : `Creates a brand new object (like a Part, Script, Sound) in the game. You need to set its Parent for it to appear in the world.`;
  }

  // Default fallback
  return lang === 'vi' 
    ? `Khối lệnh "${name}" thuộc nhóm ${block.category}. Nó cung cấp các chức năng chuyên sâu để điều khiển ${name.toLowerCase()} trong môi trường Roblox.`
    : `The "${name}" block belongs to the ${block.category} category. It provides specialized functions to control ${name.toLowerCase()} within the Roblox environment.`;
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
  const [showBlockInfoModal, setShowBlockInfoModal] = useState<boolean>(false);
  const [selectedBlockInfo, setSelectedBlockInfo] = useState<any>(null);
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
  const [controlCenterTab, setControlCenterTab] = useState<'storage' | 'achievements'>('storage');
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

  const unlockAchievement = async (id: string) => {
    if (!achievementsLoaded) return;
    if (achievementsRef.current.includes(id)) return;
    
    const achievement = achievementList.find(a => a.id === id);
    if (!achievement) return;

    const newAchievements = [...achievementsRef.current, id];
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
      } finally {
        setTimeout(() => setIsAutoSaving(false), 1000);
      }
    } else {
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
        // Ensure user document exists
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        let currentAchievements: string[] = [];

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            hasSeenTutorial: false,
            achievements: [],
            createdAt: Timestamp.now()
          });
          setShowTutorialModal(false);
        } else {
          // Sync tutorial state from cloud
          const userData = userSnap.data();
          if (userData.hasSeenTutorial) {
            setShowTutorialModal(false);
          } else {
            setShowTutorialModal(false);
          }
          currentAchievements = userData.achievements || [];
        }
        
        // Update state and ref synchronously to prevent race conditions
        setAchievements(currentAchievements);
        achievementsRef.current = currentAchievements;
        setAchievementsLoaded(true);

        // Now unlock rich_kid if not already unlocked
        if (!currentAchievements.includes('rich_kid')) {
          unlockAchievement('rich_kid');
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
    try {
      await signInWithPopup(auth, googleProvider);
      showToast(currentLang === 'vi' ? 'Đăng nhập thành công!' : 'Logged in successfully!', 'success');
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
  const [baseUrl, setBaseUrl] = useState(
    (window.location.origin && window.location.origin !== 'null' ? window.location.origin : window.location.href.split('/').slice(0, 3).join('/')).replace('ais-dev-', 'ais-pre-')
  );

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
                if (!container.contains(e.target as Node) && e.target !== htmlInput) {
                  (Blockly as any).WidgetDiv.hide();
                }
              };
              window.addEventListener('mousedown', clickOutsideHandler, true);
              window.addEventListener('touchstart', clickOutsideHandler, true);
              window.addEventListener('wheel', clickOutsideHandler, true);

              const windowBlurHandler = () => {
                (Blockly as any).WidgetDiv.hide();
              };
              window.addEventListener('blur', windowBlurHandler);

              // Cleanup on hide
              const oldHide = (Blockly as any).WidgetDiv.hide;
              (Blockly as any).WidgetDiv.hide = function() {
                htmlInput.removeEventListener('input', inputHandler);
                window.removeEventListener('mousedown', clickOutsideHandler, true);
                window.removeEventListener('touchstart', clickOutsideHandler, true);
                window.removeEventListener('wheel', clickOutsideHandler, true);
                window.removeEventListener('blur', windowBlurHandler);
                
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
        } else if (cat.name === 'Gui') {
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
            { kind: 'label', text: 'Coming Soon...' }
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

    // Code generation logic
    const updateCode = () => {
      if (workspace.current) {
        const code = luaGenerator.workspaceToCode(workspace.current);
        
        if (code.trim()) {
          const header = `-- Generated by BlockLua\n`;
          setGeneratedCode(header + code);
        } else {
          setGeneratedCode('');
        }
      }
    };

    // Debounced updateCode
    let updateTimeout: any;
    const debouncedUpdateCode = () => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(updateCode, 200);
    };

    // Extract all blocks for search - Optimized
    const extractedBlocks: { type: string, name: string, category: string, blockDef: any }[] = [];
    
    // Only extract if we haven't already
    isInitialLoading.current = true;
    try {
      toolbox.contents.forEach((cat: any) => {
        if (cat.kind === 'category' && cat.contents) {
          cat.contents.forEach((item: any) => {
            if (item.kind === 'block') {
              let blockName = item.type.replace(/_/g, ' ');
              try {
                if (workspace.current) {
                  const tempBlock = workspace.current.newBlock(item.type);
                  if (tempBlock) {
                    let text = '';
                    tempBlock.inputList.forEach((input: any) => {
                      input.fieldRow.forEach((field: any) => {
                        const fieldText = field.getText();
                        if (fieldText) text += fieldText + ' ';
                      });
                      if (input.type === 1 /* Blockly.INPUT_VALUE */) {
                        text += '[' + (input.name || ' ') + '] ';
                      }
                    });
                    text = text.trim();
                    
                    if (text.length > 0) {
                      blockName = text;
                    } else {
                      const fallbackText = tempBlock.toString();
                      if (fallbackText && fallbackText.trim().length > 0) {
                        blockName = fallbackText.replace(/\?/g, '[ ]').trim();
                      }
                    }
                    try {
                      tempBlock.dispose(false);
                    } catch (e) {
                      console.warn("Error disposing temp block:", e);
                    }
                  }
                }
              } catch (e) {
                // Fallback to capitalized type name
                blockName = blockName.charAt(0).toUpperCase() + blockName.slice(1);
              }

              extractedBlocks.push({
                type: item.type,
                name: blockName,
                category: cat.name,
                blockDef: item
              });
            }
          });
        }
      });
    } finally {
      setTimeout(() => { isInitialLoading.current = false; }, 100);
    }
    
    setAllBlocks(extractedBlocks);

    workspace.current.addChangeListener((e: any) => {
      if (e.type === Blockly.Events.BLOCK_CREATE && !isInitialLoading.current) {
        unlockAchievement('hello_world');
        const blocks = workspace.current!.getAllBlocks(false);
        if (blocks.length >= 50) {
          unlockAchievement('block_hoarder');
        }
      }

      // Auto-save trigger
      if (e.type === Blockly.Events.BLOCK_MOVE || 
          e.type === Blockly.Events.BLOCK_CHANGE || 
          e.type === Blockly.Events.BLOCK_CREATE || 
          e.type === Blockly.Events.BLOCK_DELETE) {
        
        // Immediate save to localStorage for reliability
        if (workspace.current) {
          const xml = Blockly.Xml.workspaceToDom(workspace.current);
          const xmlText = Blockly.Xml.domToText(xml);
          localStorage.setItem('blocklua_workspace', xmlText);
          localStorage.setItem('blocklua_explorer', JSON.stringify(explorerRef.current));
        }
        
        triggerAutoSave();
      }

      // Update defined variables
      if (e.type === Blockly.Events.BLOCK_CREATE || 
          e.type === Blockly.Events.BLOCK_DELETE || 
          e.type === Blockly.Events.BLOCK_CHANGE) {
        const blocks = workspace.current!.getAllBlocks(false);
        const vars = blocks
          .filter(b => b.type === 'variables_create')
          .map(b => b.getFieldValue('VAR'))
          .filter((v, i, a) => v && a.indexOf(v) === i);
        setDefinedVariables(vars);
      }

      if (e.isUiEvent) return;
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
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 mr-4 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
            <div className={`w-2 h-2 bg-[#4c97ff] rounded-full ${enableEffects ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-bold text-[#4c97ff] uppercase tracking-widest">System Active</span>
          </div>
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
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-[#111111] w-full h-full flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/40">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-[#4c97ff]/20 rounded-2xl flex items-center justify-center shadow-lg shadow-[#4c97ff]/5 border border-[#4c97ff]/20">
                      <Info className="text-[#4c97ff]" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        {currentLang === 'vi' ? 'THƯ VIỆN KHỐI LỆNH' : 'BLOCK LIBRARY'}
                        <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-500 font-mono border border-white/5 uppercase tracking-widest">v2.0</span>
                      </h3>
                      <div className="text-sm text-gray-400 font-bold tracking-widest uppercase mt-1 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        {currentLang === 'vi' ? 'Tài liệu hướng dẫn chi tiết cho mọi khối lệnh' : 'Detailed documentation for every block'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setShowBlockInfoModal(false);
                      setSelectedBlockInfo(null);
                    }}
                    className="w-12 h-12 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-2xl flex items-center justify-center text-gray-400 transition-all group"
                  >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                  {/* Sidebar */}
                  <div className="w-80 border-r border-white/5 flex flex-col bg-[#0a0a0a]">
                    <div className="p-6">
                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#4c97ff] transition-colors" size={18} />
                        <input 
                          type="text" 
                          placeholder={currentLang === 'vi' ? "Tìm kiếm khối..." : "Search blocks..."}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#4c97ff]/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                          onChange={(e) => {
                            const val = e.target.value.toLowerCase();
                            const buttons = document.querySelectorAll('.block-info-btn');
                            buttons.forEach(btn => {
                              const text = btn.textContent?.toLowerCase() || '';
                              if (text.includes(val)) {
                                (btn as HTMLElement).style.display = 'flex';
                              } else {
                                (btn as HTMLElement).style.display = 'none';
                              }
                            });
                            
                            const categories = document.querySelectorAll('.block-info-category');
                            categories.forEach(cat => {
                              const visibleButtons = cat.querySelectorAll('.block-info-btn[style="display: flex;"], .block-info-btn:not([style*="display: none"])');
                              if (visibleButtons.length === 0) {
                                (cat as HTMLElement).style.display = 'none';
                              } else {
                                (cat as HTMLElement).style.display = 'block';
                              }
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8">
                      {CATEGORIES.map(cat => {
                        const catBlocks = allBlocks.filter(b => b.category === cat.name);
                        if (catBlocks.length === 0) return null;
                        const catColor = getCategoryColor(cat.name);
                        
                        return (
                          <div key={cat.name} className="mb-8 block-info-category">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-4 mb-4 flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: catColor }}></div>
                              {cat.name}
                            </h4>
                            <div className="space-y-1.5">
                              {catBlocks.map(block => (
                                <button
                                  key={block.type}
                                  onClick={() => setSelectedBlockInfo(block)}
                                  className={`block-info-btn w-full text-left px-4 py-3 rounded-2xl text-sm transition-all flex items-center gap-4 group ${selectedBlockInfo?.type === block.type ? 'bg-[#4c97ff] text-white shadow-lg shadow-[#4c97ff]/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'}`}
                                >
                                  <div 
                                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125 ${selectedBlockInfo?.type === block.type ? 'bg-white' : ''}`} 
                                    style={{ backgroundColor: selectedBlockInfo?.type === block.type ? undefined : catColor }}
                                  ></div>
                                  <span className="truncate font-bold tracking-tight">{block.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-[#0f0f0f] overflow-y-auto custom-scrollbar relative">
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ 
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '48px 48px'
                    }}></div>

                    {selectedBlockInfo ? (
                      <div className="max-w-4xl mx-auto py-16 px-8 relative z-10">
                        <motion.div
                          key={selectedBlockInfo.type}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="flex items-center gap-4 mb-8">
                            <div 
                              className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl"
                              style={{ backgroundColor: getCategoryColor(selectedBlockInfo.category) }}
                            >
                              {selectedBlockInfo.category}
                            </div>
                            <div className="text-gray-600 text-xs font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{selectedBlockInfo.type}</div>
                          </div>
                          
                          <h2 className="text-5xl font-black text-white mb-12 tracking-tight leading-tight">{selectedBlockInfo.name}</h2>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-12">
                              <section>
                                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
                                  <div className="w-8 h-8 bg-[#4c97ff]/10 rounded-lg flex items-center justify-center">
                                    <Info className="text-[#4c97ff]" size={18} />
                                  </div>
                                  {currentLang === 'vi' ? 'Chức năng' : 'Function'}
                                </h3>
                                <div className="text-lg text-gray-300 leading-relaxed bg-white/5 p-8 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-sm">
                                  {getBlockDescription(selectedBlockInfo, currentLang)}
                                </div>
                              </section>
                              
                              <section>
                                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
                                  <div className="w-8 h-8 bg-[#4c97ff]/10 rounded-lg flex items-center justify-center">
                                    <Code2 className="text-[#4c97ff]" size={18} />
                                  </div>
                                  {currentLang === 'vi' ? 'Cách sử dụng' : 'How to use'}
                                </h3>
                                <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                                  <ul className="space-y-6">
                                    {[
                                      currentLang === 'vi' 
                                        ? `Tìm khối này trong nhóm ${selectedBlockInfo.category} ở thanh công cụ.`
                                        : `Find this block in the ${selectedBlockInfo.category} category in the toolbox.`,
                                      currentLang === 'vi'
                                        ? `Kéo và thả nó vào vùng làm việc chính.`
                                        : `Drag and drop it into the main workspace.`,
                                      currentLang === 'vi'
                                        ? `Kết nối các đầu vào/đầu ra với các khối lệnh tương ứng.`
                                        : `Connect inputs/outputs with corresponding blocks.`,
                                      currentLang === 'vi'
                                        ? `Kiểm tra mã Lua được tạo ra ở tab CODE để hiểu rõ hơn.`
                                        : `Check the generated Lua code in the CODE tab for better understanding.`
                                    ].map((step, i) => (
                                      <li key={i} className="flex gap-4 text-gray-400 items-start">
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-[#4c97ff] flex-shrink-0 mt-1 border border-white/10">
                                          {i + 1}
                                        </div>
                                        <span className="text-base leading-relaxed">{step}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </section>
                            </div>

                            <div className="space-y-8">
                              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
                                <div className="w-8 h-8 bg-[#4c97ff]/10 rounded-lg flex items-center justify-center">
                                  <Layers className="text-[#4c97ff]" size={18} />
                                </div>
                                {currentLang === 'vi' ? 'Xem trước' : 'Preview'}
                              </h3>
                              <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-12 flex items-center justify-center min-h-[300px] shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[#4c97ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10 w-full transform group-hover:scale-105 transition-transform duration-500">
                                  <BlocklyPreview blockType={selectedBlockInfo.type} />
                                </div>
                              </div>
                              
                              <div className="bg-gradient-to-br from-[#4c97ff]/10 to-transparent p-8 rounded-[2rem] border border-[#4c97ff]/10">
                                <h4 className="text-sm font-black text-[#4c97ff] uppercase tracking-widest mb-4">Mẹo nhỏ</h4>
                                <p className="text-sm text-gray-400 leading-relaxed italic">
                                  {currentLang === 'vi' 
                                    ? "Bạn có thể chuột phải vào khối lệnh trong Workspace và chọn 'Help' để mở nhanh trang thông tin này."
                                    : "You can right-click the block in the Workspace and select 'Help' to quickly open this information page."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-12">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative"
                        >
                          <div className="w-40 h-40 bg-white/5 rounded-[3rem] flex items-center justify-center mb-10 shadow-2xl border border-white/5 relative z-10">
                            <Layers className="text-gray-700" size={80} />
                          </div>
                          <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#4c97ff]/20 rounded-2xl blur-xl animate-pulse"></div>
                          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#ff4c4c]/10 rounded-full blur-2xl animate-bounce"></div>
                        </motion.div>
                        <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                          {currentLang === 'vi' ? 'KHÁM PHÁ THƯ VIỆN' : 'EXPLORE THE LIBRARY'}
                        </h3>
                        <p className="text-gray-500 max-w-md text-lg leading-relaxed">
                          {currentLang === 'vi' 
                            ? 'Chọn một khối lệnh từ danh sách bên trái để khám phá sức mạnh và cách sử dụng nó trong dự án của bạn.'
                            : 'Select a block from the list on the left to discover its power and how to use it in your project.'}
                        </p>
                      </div>
                    )}
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
                className="bg-[#2b2b2b] border border-white/10 rounded-3xl p-8 max-w-3xl w-full shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowSyncModal(false)} 
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="w-16 h-16 bg-[#4c97ff]/10 rounded-2xl flex items-center justify-center mb-6">
                  <RefreshCw className="text-[#4c97ff]" size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                  {currentLang === 'vi' ? 'ĐỒNG BỘ VỚI ROBLOX STUDIO' : 'SYNC WITH ROBLOX STUDIO'}
                </h3>
                <div className="text-gray-400 mb-6 leading-relaxed space-y-2 text-sm">
                  {currentLang === 'vi' ? (
                    <>
                      <p>Để đồng bộ liên tục mà không cần dùng Command Bar, hãy tạo một <strong>Plugin</strong>:</p>
                      <ol className="list-decimal pl-5 space-y-1 text-gray-300">
                        <li>Tạo một <strong>Script</strong> (ở đâu cũng được, ví dụ ServerStorage).</li>
                        <li>Dán đoạn code bên dưới vào Script đó.</li>
                        <li>Chuột phải vào Script, chọn <strong>Save as Local Plugin...</strong></li>
                        <li>Vào tab <strong>Plugins</strong> trên Roblox Studio, bạn sẽ thấy nút <strong>Sync Explorer</strong> để nhấn đồng bộ bất cứ lúc nào!</li>
                      </ol>
                    </>
                  ) : (
                    <>
                      <p>To sync easily without the Command Bar, create a <strong>Local Plugin</strong>:</p>
                      <ol className="list-decimal pl-5 space-y-1 text-gray-300">
                        <li>Create a <strong>Script</strong> (e.g., in ServerStorage).</li>
                        <li>Paste the code below into it.</li>
                        <li>Right-click the Script, choose <strong>Save as Local Plugin...</strong></li>
                        <li>Go to the <strong>Plugins</strong> tab in Roblox Studio, you'll see a <strong>Sync Explorer</strong> button!</li>
                      </ol>
                    </>
                  )}
                </div>
                <div className="mb-4">
                  <label className="text-gray-400 text-sm block mb-1">Base URL:</label>
                  <input 
                    type="text" 
                    value={baseUrl} 
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg p-2 text-white text-sm font-mono"
                  />
                </div>
                <div className="relative group">
                  <pre className="bg-[#1e1e1e] p-6 rounded-xl overflow-x-auto text-sm font-mono text-gray-300 border border-white/5 shadow-inner max-h-64 custom-scrollbar">
{`local HttpService = game:GetService("HttpService")
local BASE_URL = "${baseUrl}"
local URL = BASE_URL .. "/api/sync"
local EXPORT_URL = BASE_URL .. "/api/export"
local EXPORT_TREE_URL = BASE_URL .. "/api/export_tree"

local toolbar = plugin:CreateToolbar("BlockLua")
local syncButton = toolbar:CreateButton("Sync Explorer", "Sync your Roblox Studio Explorer to BlockLua", "rbxassetid://6031280882")

local function serializeInstance(instance, path)
    local currentPath = path == "" and instance.Name or (path .. "." .. instance.Name)
    local data = {
        id = path == "game" and instance.Name:lower() or currentPath,
        Name = instance.Name,
        ClassName = instance.ClassName,
        expanded = false,
        Properties = {},
        Children = {}
    }
    if instance:IsA("Script") or instance:IsA("LocalScript") or instance:IsA("ModuleScript") then
        data.Properties.Source = instance.Source
    end
    for _, child in ipairs(instance:GetChildren()) do
        table.insert(data.Children, serializeInstance(child, data.id))
    end
    return data
end

local function sync()
    local root = {
        id = "game",
        Name = "game",
        ClassName = "DataModel",
        expanded = true,
        Properties = {},
        Children = {}
    }

    local services = {"Workspace", "ReplicatedStorage", "ServerScriptService", "ServerStorage", "StarterGui", "StarterPlayer", "Lighting", "SoundService", "Players", "Teams", "Chat", "LocalizationService", "TextChatService", "TestService"}
    for _, serviceName in ipairs(services) do
        local success, service = pcall(function() return game:GetService(serviceName) end)
        if success and service then
            table.insert(root.Children, serializeInstance(service, "game"))
        end
    end

    pcall(function()
        HttpService:PostAsync(URL, HttpService:JSONEncode({tree = root}), Enum.HttpContentType.ApplicationJson)
    end)
end

local function pollScripts()
    local success, response = pcall(function()
        return HttpService:GetAsync(EXPORT_URL)
    end)

    if success then
        local data = HttpService:JSONDecode(response)
        if data and data.script then
            local scriptData = data.script
            
            local parent = game
            local parts = string.split(scriptData.path, ".")
            for i, part in ipairs(parts) do
                if i > 1 then
                    local nextParent = parent:FindFirstChild(part)
                    if nextParent then
                        parent = nextParent
                    else
                        break
                    end
                end
            end
            
            local newScript = Instance.new(scriptData.type)
            newScript.Name = scriptData.type
            newScript.Source = scriptData.code
            newScript.Parent = parent
        end
    end
end

local function applyNode(webNode, parentInstance)
    local instance
    
    if webNode.id and not string.find(webNode.id, "-") then
        local parts = string.split(webNode.id, ".")
        local current = game
        local found = true
        for i, part in ipairs(parts) do
            if i > 1 then
                local nextChild = current:FindFirstChild(part)
                if nextChild then
                    current = nextChild
                else
                    found = false
                    break
                end
            end
        end
        if found and current ~= game then
            instance = current
        end
    end
    
    if not instance and parentInstance then
        for _, child in ipairs(parentInstance:GetChildren()) do
            if child.Name == webNode.Name and child.ClassName == webNode.ClassName then
                instance = child
                break
            end
        end
    end
    
    if not instance and parentInstance then
        local success, newInst = pcall(function() return Instance.new(webNode.ClassName) end)
        if success and newInst then
            instance = newInst
            instance.Name = webNode.Name
            instance.Parent = parentInstance
        end
    end
    
    if instance then
        if instance.Name ~= webNode.Name then
            pcall(function() instance.Name = webNode.Name end)
        end
        
        if parentInstance and instance.Parent ~= parentInstance then
            pcall(function() instance.Parent = parentInstance end)
        end
        
        if webNode.Properties and webNode.Properties.Source then
            pcall(function() instance.Source = webNode.Properties.Source end)
        end
        
        if webNode.Children then
            for _, childNode in ipairs(webNode.Children) do
                applyNode(childNode, instance)
            end
        end
    end
end

local function pollTree()
    local success, response = pcall(function()
        return HttpService:GetAsync(EXPORT_TREE_URL)
    end)
    
    if success then
        local data = HttpService:JSONDecode(response)
        if data and data.tree then
            local webTree = data.tree
            if webTree.Children then
                for _, childNode in ipairs(webTree.Children) do
                    local success, service = pcall(function() return game:GetService(childNode.ClassName) end)
                    if success and service then
                        if childNode.Children then
                            for _, grandChild in ipairs(childNode.Children) do
                                applyNode(grandChild, service)
                            end
                        end
                    end
                end
            end
        end
    end
end

syncButton.Click:Connect(function()
    sync()
end)

task.spawn(function()
    while true do
        task.wait(2)
        pollScripts()
        pollTree()
    end
end)

sync() -- Initial sync on load`}
                  </pre>
                  <button 
                    onClick={() => {
                      const code = `local HttpService = game:GetService("HttpService")
local BASE_URL = "${baseUrl}"
local URL = BASE_URL .. "/api/sync"
local EXPORT_URL = BASE_URL .. "/api/export"
local EXPORT_TREE_URL = BASE_URL .. "/api/export_tree"

local toolbar = plugin:CreateToolbar("BlockLua")
local syncButton = toolbar:CreateButton("Sync Explorer", "Sync your Roblox Studio Explorer to BlockLua", "rbxassetid://6031280882")

local function serializeInstance(instance, path)
    local currentPath = path == "" and instance.Name or (path .. "." .. instance.Name)
    local data = {
        id = path == "game" and instance.Name:lower() or currentPath,
        Name = instance.Name,
        ClassName = instance.ClassName,
        expanded = false,
        Properties = {},
        Children = {}
    }
    if instance:IsA("Script") or instance:IsA("LocalScript") or instance:IsA("ModuleScript") then
        data.Properties.Source = instance.Source
    end
    for _, child in ipairs(instance:GetChildren()) do
        table.insert(data.Children, serializeInstance(child, data.id))
    end
    return data
end

local function sync()
    local root = {
        id = "game",
        Name = "game",
        ClassName = "DataModel",
        expanded = true,
        Properties = {},
        Children = {}
    }

    local services = {"Workspace", "ReplicatedStorage", "ServerScriptService", "ServerStorage", "StarterGui", "StarterPlayer", "Lighting", "SoundService", "Players", "Teams", "Chat", "LocalizationService", "TextChatService", "TestService"}
    for _, serviceName in ipairs(services) do
        local success, service = pcall(function() return game:GetService(serviceName) end)
        if success and service then
            table.insert(root.Children, serializeInstance(service, "game"))
        end
    end

    pcall(function()
        HttpService:PostAsync(URL, HttpService:JSONEncode({tree = root}), Enum.HttpContentType.ApplicationJson)
    end)
end

local function pollScripts()
    local success, response = pcall(function()
        return HttpService:GetAsync(EXPORT_URL)
    end)

    if success then
        local data = HttpService:JSONDecode(response)
        if data and data.script then
            local scriptData = data.script
            
            local parent = game
            local parts = string.split(scriptData.path, ".")
            for i, part in ipairs(parts) do
                if i > 1 then
                    local nextParent = parent:FindFirstChild(part)
                    if nextParent then
                        parent = nextParent
                    else
                        break
                    end
                end
            end
            
            local newScript = Instance.new(scriptData.type)
            newScript.Name = scriptData.type
            newScript.Source = scriptData.code
            newScript.Parent = parent
        end
    end
end

local function applyNode(webNode, parentInstance)
    local instance
    
    if webNode.id and not string.find(webNode.id, "-") then
        local parts = string.split(webNode.id, ".")
        local current = game
        local found = true
        for i, part in ipairs(parts) do
            if i > 1 then
                local nextChild = current:FindFirstChild(part)
                if nextChild then
                    current = nextChild
                else
                    found = false
                    break
                end
            end
        end
        if found and current ~= game then
            instance = current
        end
    end
    
    if not instance and parentInstance then
        for _, child in ipairs(parentInstance:GetChildren()) do
            if child.Name == webNode.Name and child.ClassName == webNode.ClassName then
                instance = child
                break
            end
        end
    end
    
    if not instance and parentInstance then
        local success, newInst = pcall(function() return Instance.new(webNode.ClassName) end)
        if success and newInst then
            instance = newInst
            instance.Name = webNode.Name
            instance.Parent = parentInstance
        end
    end
    
    if instance then
        if instance.Name ~= webNode.Name then
            pcall(function() instance.Name = webNode.Name end)
        end
        
        if parentInstance and instance.Parent ~= parentInstance then
            pcall(function() instance.Parent = parentInstance end)
        end
        
        if webNode.Properties and webNode.Properties.Source then
            pcall(function() instance.Source = webNode.Properties.Source end)
        end
        
        if webNode.Children then
            for _, childNode in ipairs(webNode.Children) do
                applyNode(childNode, instance)
            end
        end
    end
end

local function pollTree()
    local success, response = pcall(function()
        return HttpService:GetAsync(EXPORT_TREE_URL)
    end)
    
    if success then
        local data = HttpService:JSONDecode(response)
        if data and data.tree then
            local webTree = data.tree
            if webTree.Children then
                for _, childNode in ipairs(webTree.Children) do
                    local success, service = pcall(function() return game:GetService(childNode.ClassName) end)
                    if success and service then
                        if childNode.Children then
                            for _, grandChild in ipairs(childNode.Children) do
                                applyNode(grandChild, service)
                            end
                        end
                    end
                end
            end
        end
    end
end

syncButton.Click:Connect(function()
    sync()
end)

task.spawn(function()
    while true do
        task.wait(2)
        pollScripts()
        pollTree()
    end
end)

sync() -- Initial sync on load`;
                      navigator.clipboard.writeText(code);
                      alert(currentLang === 'vi' ? 'Đã sao chép!' : 'Copied!');
                    }}
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"
                    title="Copy Code"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 italic">
                  * {currentLang === 'vi' ? 'Lưu ý: Bạn cần bật HTTP Requests trong Game Settings > Security.' : 'Note: You must enable HTTP Requests in Game Settings > Security.'}
                </p>
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
              className={`fixed top-0 left-0 z-[1000] flex items-center justify-center w-full h-full transition-all duration-500 ${controlCenterTab === 'ai' ? 'bg-black p-0' : 'bg-black/60 backdrop-blur-sm p-4'}`}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`bg-[#1a1a1a] border border-white/10 shadow-2xl flex overflow-hidden transition-all duration-500 ${controlCenterTab === 'ai' ? 'w-full h-full rounded-none border-none' : 'max-w-4xl w-full h-[80vh] rounded-3xl'}`}
              >
                {/* Sidebar - Hidden in AI mode */}
                {controlCenterTab !== 'ai' && (
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
                )}

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
                    padding: '24px',
                    fontSize: '14px',
                    lineHeight: '1.6',
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

            {/* User Profile / Login */}
            <div className="px-4 py-4 border-t border-white/5 bg-[#1a1a1a]">
              {user ? (
                <div className="flex items-center gap-3">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                    className="w-8 h-8 rounded-full border border-white/10" 
                    alt="Avatar" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-white truncate">{user.displayName}</p>
                    <button 
                      onClick={logout} 
                      className="text-[9px] text-gray-500 hover:text-red-400 transition-colors uppercase font-black tracking-widest"
                    >
                      {currentLang === 'vi' ? 'ĐĂNG XUẤT' : 'LOGOUT'}
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="w-full py-2 bg-[#4c97ff] hover:bg-[#3b82f6] text-white text-[10px] font-black rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <User size={14} />
                  {currentLang === 'vi' ? 'ĐĂNG NHẬP GOOGLE' : 'GOOGLE LOGIN'}
                </button>
              )}
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
            className="fixed bottom-10 right-10 z-[3000] flex items-center gap-4 bg-[#1a1a1a] border-2 border-[#4c97ff] rounded-3xl p-6 shadow-[0_0_50px_rgba(76,151,255,0.3)] min-w-[320px]"
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
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
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
