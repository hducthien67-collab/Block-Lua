import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface TableEditorModalProps {
  initialData: string[];
  onSave: (data: string[]) => void;
  onClose: () => void;
}

export const TableEditorModal: React.FC<TableEditorModalProps> = ({ initialData, onSave, onClose }) => {
  const [data, setData] = useState<string[]>(initialData);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="w-[400px] bg-[#2d2d2d] border border-[#1a1a1a] rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 bg-[#3d3d3d] flex items-center justify-between border-b border-[#1a1a1a]">
          <div className="text-[10px] font-bold text-gray-200 uppercase tracking-widest">
            Edit List
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={e => {
                  const newData = [...data];
                  newData[index] = e.target.value;
                  setData(newData);
                }}
                className="flex-1 bg-[#222] border border-[#1a1a1a] rounded p-1 text-xs text-gray-200"
              />
              <button 
                onClick={() => setData(data.filter((_, i) => i !== index))}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button 
            onClick={() => setData([...data, ''])}
            className="w-full flex items-center justify-center gap-2 p-2 bg-[#3d3d3d] hover:bg-[#4d4d4d] rounded text-xs text-gray-200"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        <div className="p-3 bg-[#3d3d3d] flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-[#222] hover:bg-[#333] rounded text-xs text-gray-200">Cancel</button>
          <button onClick={() => onSave(data)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white">Save</button>
        </div>
      </motion.div>
    </div>
  );
};
