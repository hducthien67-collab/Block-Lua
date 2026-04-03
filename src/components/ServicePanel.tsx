import React from 'react';
import { X } from 'lucide-react';

interface ServicePanelProps {
  serviceName: string;
  onClose: () => void;
  addBlock: (blockDef: any, sourceBlockId?: string) => void;
  sourceBlockId?: string;
}

const BlockPreview: React.FC<{ name: string; type: string; category: string }> = ({ name, type, category }) => {
  let bgColor = '#4C97FF'; // Default blue
  let borderColor = '#3373CC';
  
  if (category === 'Properties') {
    bgColor = '#59C059'; // Green
    borderColor = '#389438';
  } else if (category === 'Events') {
    bgColor = '#FFBF00'; // Yellow/Orange
    borderColor = '#CC9900';
  } else if (category === 'Child Objects') {
    bgColor = '#9966FF'; // Purple
    borderColor = '#774DCB';
  }

  const isEvent = category === 'Events';
  const isProperty = category === 'Properties';

  return (
    <div className="relative w-full group">
      {/* The main block body */}
      <div 
        className="relative rounded-sm p-2.5 min-h-[40px] flex items-center gap-2 shadow-lg overflow-hidden transition-all group-hover:brightness-110 group-active:scale-[0.98]"
        style={{ 
          backgroundColor: bgColor, 
          borderBottom: `4px solid ${borderColor}`,
          borderRadius: isEvent ? '16px 16px 4px 4px' : '4px'
        }}
      >
        {/* Top notch (puzzle piece) */}
        {!isEvent && !isProperty && (
          <div 
            className="absolute top-0 left-6 w-5 h-1.5 rounded-b-md"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          />
        )}
        
        {/* Hat shape for events */}
        {isEvent && (
          <div 
            className="absolute -top-1.5 left-0 right-0 h-3 rounded-t-full"
            style={{ backgroundColor: bgColor }}
          />
        )}

        <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold text-white whitespace-nowrap z-10 drop-shadow-sm">
          {isEvent && <span className="opacity-80 font-medium">on</span>}
          <span>{name}</span>
          {isEvent && <span className="opacity-80 font-medium">of</span>}
          
          {/* Placeholder representation */}
          {type.includes('raycast') || type.includes('findpart') || type.includes('getparts') || type.includes('getbounds') || type.includes('getdescendants') || type.includes('getchildren') ? (
            <div className="flex items-center gap-1.5">
              <span className="opacity-70 font-normal italic">as</span>
              <div className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20 shadow-inner">result</div>
            </div>
          ) : type.includes('waitforchild') ? (
            <div className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20 shadow-inner">ChildName</div>
          ) : type.includes('string') ? (
            <div className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20 shadow-inner">string</div>
          ) : type.includes('number') ? (
            <div className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20 shadow-inner">number</div>
          ) : type.includes('instance') ? (
            <div className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20 shadow-inner">Instance</div>
          ) : type.includes('ray') ? (
            <div className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20 shadow-inner">Ray</div>
          ) : type.includes('part') ? (
            <div className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20 shadow-inner">Part</div>
          ) : type.includes('array') ? (
            <div className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20 shadow-inner">Array</div>
          ) : type.includes('camera') ? (
            <div className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20 shadow-inner">Camera</div>
          ) : type.includes('humanoid') ? (
            <div className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20 shadow-inner">Humanoid</div>
          ) : type.includes('any') ? (
            <div className="bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/20 shadow-inner">any</div>
          ) : null}
        </div>

        {/* Bottom notch (puzzle piece) */}
        {!isProperty && (
          <div 
            className="absolute bottom-[-4px] left-6 w-5 h-1.5 rounded-b-md"
            style={{ backgroundColor: bgColor, borderBottom: `4px solid ${borderColor}` }}
          />
        )}
        
        {/* C-shape "mouth" for events */}
        {isEvent && (
          <div className="absolute bottom-0 left-10 right-0 h-1.5 bg-black/20" />
        )}
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-sm" />
    </div>
  );
};

export const ServicePanel: React.FC<ServicePanelProps> = ({ serviceName, onClose, addBlock, sourceBlockId }) => {
  const workspaceItems = {
    Methods: [
      { name: 'Raycast', type: 'workspace_raycast' },
      { name: 'FindPartOnRay', type: 'workspace_findpartonray' },
      { name: 'GetPartsInPart', type: 'workspace_getpartsinpart' },
      { name: 'GetPartBoundsInBox', type: 'workspace_getpartboundsinbox' },
      { name: 'GetDescendants', type: 'workspace_getdescendants' },
      { name: 'GetChildren', type: 'workspace_getchildren' },
      { name: 'WaitForChild', type: 'workspace_waitforchild' }
    ],
    Properties: [
      { name: 'Gravity', type: 'workspace_gravity' },
      { name: 'CurrentCamera', type: 'workspace_currentcamera' },
      { name: 'FallenPartsDestroyHeight', type: 'workspace_fallenpartsdestroyheight' },
      { name: 'StreamingEnabled', type: 'workspace_streamingenabled' }
    ],
    Events: [
      { name: 'DescendantAdded', type: 'workspace_descendantadded' },
      { name: 'DescendantRemoving', type: 'workspace_descendantremoving' },
      { name: 'ChildAdded', type: 'workspace_childadded' },
      { name: 'ChildRemoved', type: 'workspace_childremoved' }
    ],
    'Child Objects': [
      { name: 'Terrain', type: 'workspace_terrain' },
      { name: 'Camera', type: 'workspace_camera' },
      { name: 'WorldModel', type: 'workspace_worldmodel' }
    ]
  };

  const items = serviceName.toLowerCase() === 'workspace' ? workspaceItems : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg w-[450px] max-h-[80vh] flex flex-col shadow-2xl">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#252525] rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <h2 className="text-white font-bold tracking-tight">{serviceName}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto text-gray-300 custom-scrollbar">
          {items ? (
            <div className="space-y-6">
              {Object.entries(items).map(([category, blockList]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{category}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {blockList.map((item) => (
                      <button
                        key={item.type}
                        onClick={() => addBlock({ kind: 'block', type: item.type }, sourceBlockId)}
                        className="w-full text-left transition-transform active:scale-[0.98]"
                      >
                        <BlockPreview name={item.name} type={item.type} category={category} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-2">
              <X size={40} className="opacity-20" />
              <div className="text-sm italic">No blocks defined for {serviceName}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
