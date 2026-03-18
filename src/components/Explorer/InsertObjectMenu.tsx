import React, { useState } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Re-using categories from Explorer.tsx
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

interface InsertObjectMenuProps {
  onAdd: (className: string) => void;
  onClose: () => void;
  getIcon: (className: string) => React.ReactNode;
}

export const InsertObjectMenu: React.FC<InsertObjectMenuProps> = ({ onAdd, onClose, getIcon }) => {
  const [searchFilter, setSearchFilter] = useState('');

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={onClose}>
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
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-2 bg-[#222] flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-gray-500" />
          <input 
            type="text"
            placeholder="Search objects..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-gray-200"
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
                      onClick={() => onAdd(cls)}
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
  );
};
