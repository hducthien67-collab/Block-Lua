import React, { useState } from 'react';
import { MousePointer2, ChevronDown } from 'lucide-react';
import { ExplorerPanel } from './Explorer';
import { useExplorer } from '../../explorer';
import { AnimatePresence } from 'motion/react';

interface InstancePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const InstancePicker: React.FC<InstancePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { explorer, toggleExpand, addInstance, updateInstanceProperty, deleteInstance } = useExplorer();

  return (
    <div className="relative inline-block w-full max-w-md">
      <div 
        className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] border border-[#333] rounded-md cursor-pointer hover:border-blue-500 transition-all group"
        onClick={() => setIsOpen(true)}
      >
        <div className="p-1 bg-blue-500/10 rounded">
          <MousePointer2 className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Instance</div>
          <div className="text-sm text-gray-200 truncate font-mono">
            {value || "Select an instance..."}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <ExplorerPanel 
            explorer={explorer}
            onSelect={(path) => {
              const displayPath = path;
              onChange(displayPath);
              setIsOpen(false);
            }}
            onClose={() => setIsOpen(false)}
            onToggleExpand={toggleExpand}
            onAddInstance={addInstance}
            onRename={(id, newName) => updateInstanceProperty(id, 'Name', newName)}
            onDelete={deleteInstance}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
