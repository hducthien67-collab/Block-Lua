import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface EffectSelectorModalProps {
  onSelect: (effect: string) => void;
  onClose: () => void;
}

const EFFECTS = ["Explosion", "Fire", "Smoke", "Sparkles"];

export const EffectSelectorModal: React.FC<EffectSelectorModalProps> = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-[300px] bg-[#222] border border-[#333] rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#333] flex justify-between items-center">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Select Effect</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-2">
          {EFFECTS.map(effect => (
            <button
              key={effect}
              onClick={() => { onSelect(effect); onClose(); }}
              className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-[#333] rounded-lg transition-colors"
            >
              {effect}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
