import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  Box, 
  FileCode, 
  Plus, 
  MousePointer2, 
  X, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Volume2, 
  Zap, 
  Lightbulb, 
  Variable, 
  Radio, 
  Hand,
  Layers,
  Sparkles
} from 'lucide-react';
import { RobloxInstance } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface ExplorerProps {
  instance: RobloxInstance;
  onSelect: (instance: RobloxInstance, path: string) => void;
  onToggleExpand: (id: string) => void;
  onAddChild: (parentId: string) => void;
  currentPath?: string;
  selectedId?: string;
}

export const getIcon = (className: string) => {
  if (!className || typeof className !== 'string') return <Box className="w-3.5 h-3.5 text-gray-400" />;
  if (className.includes('Gui') || className.includes('Frame') || className.includes('Layout') || className.includes('Constraint')) {
    if (className.includes('Constraint') && !className.includes('UI')) return <Zap className="w-3.5 h-3.5 text-red-400" />;
    return <Layout className="w-3.5 h-3.5 text-pink-400" />;
  }
  if (className.includes('Label') || className.includes('Button') || className.includes('Text')) return <Type className="w-3.5 h-3.5 text-pink-300" />;
  if (className.includes('Image')) return <ImageIcon className="w-3.5 h-3.5 text-pink-200" />;
  if (className.includes('Light') || className.includes('Effect')) {
    if (className.includes('Effect') && !className.includes('Sound')) return <Sparkles className="w-3.5 h-3.5 text-purple-300" />;
    return <Lightbulb className="w-3.5 h-3.5 text-yellow-300" />;
  }
  if (className.includes('Value')) return <Variable className="w-3.5 h-3.5 text-green-400" />;
  if (className.includes('Event') || className.includes('Function')) return <Radio className="w-3.5 h-3.5 text-orange-400" />;
  if (className.includes('Particle') || className.includes('Fire') || className.includes('Smoke') || className.includes('Sparkles') || className.includes('Beam') || className.includes('Trail')) return <Zap className="w-3.5 h-3.5 text-orange-300" />;
  if (className.includes('Sound')) return <Volume2 className="w-3.5 h-3.5 text-green-500" />;
  if (className.includes('Body') || className.includes('Force') || className.includes('Velocity')) return <Zap className="w-3.5 h-3.5 text-red-500" />;
  
  switch (className) {
    case 'Folder': return <Folder className="w-3.5 h-3.5 text-yellow-500" />;
    case 'Part': 
    case 'MeshPart':
    case 'WedgePart':
    case 'TrussPart':
    case 'CornerWedgePart':
    case 'UnionOperation':
    case 'NegateOperation': return <Box className="w-3.5 h-3.5 text-blue-400" />;
    case 'Model':
    case 'WorldModel': return <Layers className="w-3.5 h-3.5 text-purple-400" />;
    case 'Script':
    case 'LocalScript':
    case 'ModuleScript': return <FileCode className="w-3.5 h-3.5 text-blue-300" />;
    case 'ClickDetector':
    case 'ProximityPrompt': return <Hand className="w-3.5 h-3.5 text-yellow-400" />;
    case 'SpawnLocation': return <Zap className="w-3.5 h-3.5 text-green-300" />;
    case 'Humanoid':
    case 'AnimationController': return <MousePointer2 className="w-3.5 h-3.5 text-red-400" />;
    case 'Tool':
    case 'HopperBin': return <Hand className="w-3.5 h-3.5 text-gray-300" />;
    case 'Team': return <Layers className="w-3.5 h-3.5 text-white" />;
    default: return <Box className="w-3.5 h-3.5 text-gray-400" />;
  }
};

const OBJECT_CATEGORIES = [
  {
    name: 'Common',
    classes: ['Part', 'Model', 'Folder', 'Script', 'LocalScript', 'ModuleScript', 'RemoteEvent', 'BindableEvent']
  },
  {
    name: '3D Objects',
    classes: ['Part', 'MeshPart', 'UnionOperation', 'WedgePart', 'CornerWedgePart', 'TrussPart', 'Seat', 'VehicleSeat', 'SpawnLocation', 'NegateOperation']
  },
  {
    name: 'User Interface',
    classes: ['ScreenGui', 'SurfaceGui', 'BillboardGui', 'Frame', 'ScrollingFrame', 'TextLabel', 'TextButton', 'TextBox', 'ImageLabel', 'ImageButton', 'VideoFrame', 'ViewportFrame']
  },
  {
    name: 'UI Layout & Design',
    classes: ['UIListLayout', 'UIGridLayout', 'UITableLayout', 'UIPageLayout', 'UICorner', 'UIStroke', 'UIGradient', 'UIPadding', 'UIAspectRatioConstraint', 'UISizeConstraint', 'UITextSizeConstraint']
  },
  {
    name: 'Effects',
    classes: ['ParticleEmitter', 'Trail', 'Beam', 'Fire', 'Smoke', 'Sparkles', 'Explosion', 'ForceField', 'Highlight']
  },
  {
    name: 'Lighting & Post-Process',
    classes: ['PointLight', 'SpotLight', 'SurfaceLight', 'BloomEffect', 'BlurEffect', 'ColorCorrectionEffect', 'SunRaysEffect', 'DepthOfFieldEffect', 'Sky', 'Atmosphere', 'Clouds']
  },
  {
    name: 'Values',
    classes: ['StringValue', 'IntValue', 'NumberValue', 'BoolValue', 'ObjectValue', 'Vector3Value', 'Color3Value', 'CFrameValue', 'RayValue']
  },
  {
    name: 'Interaction',
    classes: ['ClickDetector', 'ProximityPrompt', 'RemoteEvent', 'RemoteFunction', 'BindableEvent', 'BindableFunction', 'Tool', 'HopperBin']
  },
  {
    name: 'Physics & Constraints',
    classes: ['HingeConstraint', 'BallSocketConstraint', 'RopeConstraint', 'RodConstraint', 'SpringConstraint', 'PrismaticConstraint', 'CylindricalConstraint', 'VectorForce', 'Torque', 'LineForce', 'AngularVelocity', 'AlignOrientation', 'AlignPosition']
  },
  {
    name: 'Legacy Body Movers',
    classes: ['BodyVelocity', 'BodyPosition', 'BodyGyro', 'BodyThrust', 'BodyForce', 'BodyAngularVelocity', 'RocketPropulsion']
  },
  {
    name: 'Sound',
    classes: ['Sound', 'SoundGroup', 'ReverbSoundEffect', 'EchoSoundEffect', 'PitchShiftSoundEffect', 'ChorusSoundEffect', 'DistortionSoundEffect', 'EqualizerSoundEffect', 'FlangeSoundEffect', 'TremoloSoundEffect', 'CompressorSoundEffect']
  },
  {
    name: 'Avatar & Character',
    classes: ['Animation', 'AnimationController', 'Humanoid', 'Accessory', 'Shirt', 'Pants', 'ShirtGraphic', 'CharacterMesh', 'BodyColors', 'HumanoidDescription']
  },
  {
    name: 'Organization',
    classes: ['Folder', 'Configuration', 'Model', 'WorldModel', 'Team', 'SpawnLocation']
  }
];

export const ExplorerTree: React.FC<ExplorerProps> = ({ 
  instance, 
  onSelect, 
  onToggleExpand, 
  onAddChild,
  currentPath = '',
  selectedId
}) => {
  const isExpanded = instance.expanded;
  const hasChildren = instance.Children.length > 0;
  const fullPath = currentPath ? `${currentPath}.${instance.Name}` : instance.Name;
  const isSelected = selectedId === instance.id;

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-0.5 px-1 cursor-pointer hover:bg-[#3f3f3f] group ${isSelected ? 'bg-[#4d4d4d]' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(instance, fullPath);
        }}
      >
        <div 
          className="w-4 h-4 flex items-center justify-center mr-0.5"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(instance.id);
          }}
        >
          {hasChildren && (
            isExpanded ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />
          )}
        </div>
        <div className="mr-1.5">
          {getIcon(instance.ClassName)}
        </div>
        <span className="text-[12px] text-gray-200 font-sans truncate flex-1">
          {instance.Name}
        </span>
        <button 
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#555] rounded"
          onClick={(e) => {
            e.stopPropagation();
            onAddChild(instance.id);
          }}
        >
          <Plus className="w-3 h-3 text-gray-400" />
        </button>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="ml-4 border-l border-[#333]">
          {instance.Children.map(child => (
            <ExplorerTree 
              key={child.id} 
              instance={child} 
              onSelect={onSelect} 
              onToggleExpand={onToggleExpand}
              onAddChild={onAddChild}
              currentPath={fullPath}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ExplorerPanel: React.FC<{
  explorer: RobloxInstance;
  onSelect: (path: string) => void;
  onClose: () => void;
  onToggleExpand: (id: string) => void;
  onAddInstance: (parentId: string, name: string, className: string) => void;
}> = ({ explorer, onSelect, onClose, onToggleExpand, onAddInstance }) => {
  const [selectedInstance, setSelectedInstance] = useState<{instance: RobloxInstance, path: string} | null>(null);
  const [showAddMenu, setShowAddMenu] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const handleSelect = (instance: RobloxInstance, path: string) => {
    setSelectedInstance({ instance, path });
  };

  const handleConfirm = () => {
    if (selectedInstance) {
      onSelect(selectedInstance.path);
      onClose();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-[700px] h-[600px] bg-[#2d2d2d] border border-[#1a1a1a] shadow-2xl rounded-lg flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#3d3d3d] px-3 py-2 flex items-center justify-between border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <MousePointer2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Instance Selector</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Explorer Tree */}
          <div className="w-[300px] border-r border-[#1a1a1a] flex flex-col bg-[#222]">
            <div className="p-2 text-[10px] font-bold text-gray-500 uppercase bg-[#2a2a2a] border-b border-[#1a1a1a]">
              Explorer
            </div>
            <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
              <ExplorerTree 
                instance={explorer} 
                onSelect={handleSelect}
                onToggleExpand={onToggleExpand}
                onAddChild={(id) => setShowAddMenu(id)}
                selectedId={selectedInstance?.instance.id}
              />
            </div>
          </div>

          {/* Right: Children & Details */}
          <div className="flex-1 flex flex-col bg-[#2d2d2d]">
            <div className="p-2 text-[10px] font-bold text-gray-500 uppercase bg-[#2a2a2a] border-b border-[#1a1a1a]">
              {selectedInstance ? `Children of ${selectedInstance.instance.Name}` : 'Select an Instance'}
            </div>
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {selectedInstance ? (
                <div className="space-y-4">
                  {/* Children List */}
                  <div className="grid grid-cols-2 gap-2">
                    {selectedInstance.instance.Children.map(child => (
                      <div 
                        key={child.id}
                        className="flex items-center gap-2 p-2 bg-[#363636] hover:bg-[#404040] rounded border border-[#1a1a1a] cursor-pointer group"
                        onClick={() => handleSelect(child, `${selectedInstance.path}.${child.Name}`)}
                      >
                        {getIcon(child.ClassName)}
                        <span className="text-[11px] text-gray-300 truncate flex-1">{child.Name}</span>
                        <span className="text-[9px] text-gray-600 group-hover:text-gray-400">{child.ClassName}</span>
                      </div>
                    ))}
                    <button 
                      className="flex items-center justify-center gap-2 p-2 bg-[#363636] hover:bg-[#404040] rounded border border-dashed border-gray-600 text-gray-400 hover:text-gray-200"
                      onClick={() => setShowAddMenu(selectedInstance.instance.id)}
                    >
                      <Plus className="w-3 h-3" />
                      <span className="text-[11px]">Add New</span>
                    </button>
                  </div>

                  {/* Properties Preview */}
                  <div className="mt-6 pt-4 border-t border-[#3d3d3d]">
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Properties</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">Name</span>
                        <span className="text-gray-300">{selectedInstance.instance.Name}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">ClassName</span>
                        <span className="text-gray-300">{selectedInstance.instance.ClassName}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">Path</span>
                        <span className="text-gray-300 truncate ml-4">{selectedInstance.path}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                  <MousePointer2 className="w-8 h-8 opacity-20" />
                  <span className="text-xs">Select an instance from the tree</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#3d3d3d] p-3 flex justify-end gap-2 border-t border-[#1a1a1a]">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-gray-300 hover:bg-[#4d4d4d] rounded transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!selectedInstance}
            onClick={handleConfirm}
            className="px-6 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-gray-400 text-white rounded transition-colors shadow-lg"
          >
            Select Instance
          </button>
        </div>
      </div>

      {/* Add Instance Modal */}
      <AnimatePresence>
        {showAddMenu && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="w-[400px] h-[500px] bg-[#2d2d2d] border border-[#1a1a1a] rounded-lg shadow-2xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-3 bg-[#3d3d3d] flex items-center justify-between border-b border-[#1a1a1a]">
                <div className="text-[10px] font-bold text-gray-200 uppercase tracking-widest">
                  Insert Object
                </div>
                <button onClick={() => setShowAddMenu(null)} className="text-gray-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2 bg-[#222]">
                <input 
                  type="text"
                  placeholder="Search objects..."
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-4">
                {OBJECT_CATEGORIES.map(category => {
                  const filteredClasses = category.classes.filter(cls => 
                    cls.toLowerCase().includes(searchFilter.toLowerCase())
                  );

                  if (filteredClasses.length === 0) return null;

                  return (
                    <div key={category.name}>
                      <div className="text-[9px] font-bold text-gray-600 uppercase mb-1 px-1">
                        {category.name}
                      </div>
                      <div className="grid grid-cols-1 gap-0.5">
                        {filteredClasses.map(cls => (
                          <button
                            key={cls}
                            className="w-full flex items-center gap-2 p-1.5 hover:bg-[#3f3f3f] rounded text-left group"
                            onClick={() => {
                              onAddInstance(showAddMenu, cls, cls);
                              setShowAddMenu(null);
                              setSearchFilter('');
                            }}
                          >
                            {getIcon(cls)}
                            <span className="text-xs text-gray-200 flex-1">{cls}</span>
                            <Plus className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
