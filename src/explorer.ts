import { useState, useCallback } from 'react';
import { RobloxInstance } from './types';

const DEFAULT_PROPERTIES: Record<string, any> = {
  Part: {
    Color: '#A3A3A3',
    Transparency: 0,
    Reflectance: 0,
    CanCollide: true,
    CanTouch: true,
    CanQuery: true,
    Anchored: false,
    CastShadow: true,
    Size: { x: 4, y: 1, z: 2 },
    Position: { x: 0, y: 0.5, z: 0 },
    Orientation: { x: 0, y: 0, z: 0 },
    Shape: 'Block',
    Material: 'Plastic',
  },
  Workspace: {
    Gravity: 196.2,
    FallenPartsDestroyHeight: -500,
  },
  Lighting: {
    Ambient: '#808080',
    Brightness: 2,
    ClockTime: 14,
    GeographicLatitude: 41.733,
  }
};

const INITIAL_STRUCTURE: RobloxInstance = {
  id: 'game',
  Name: 'game',
  ClassName: 'DataModel',
  expanded: true,
  Properties: {},
  Children: [
    { 
      id: 'workspace', 
      Name: 'Workspace', 
      ClassName: 'Workspace', 
      expanded: true, 
      Properties: { ...DEFAULT_PROPERTIES.Workspace },
      Children: [
        {
          id: 'baseplate',
          Name: 'Baseplate',
          ClassName: 'Part',
          Children: [],
          Properties: {
            ...DEFAULT_PROPERTIES.Part,
            Size: { x: 200, y: 1, z: 200 },
            Position: { x: 0, y: -0.5, z: 0 },
            Anchored: true,
            Color: '#3a3a3a',
            Material: 'SmoothPlastic'
          }
        },
        {
          id: 'spawn_part',
          Name: 'SpawnPart',
          ClassName: 'Part',
          Children: [],
          Properties: {
            ...DEFAULT_PROPERTIES.Part,
            Size: { x: 10, y: 1, z: 10 },
            Position: { x: 0, y: 0.5, z: 0 },
            Anchored: true,
            Color: '#4c97ff',
            Material: 'Neon'
          }
        }
      ]
    },
    { id: 'replicatedstorage', Name: 'ReplicatedStorage', ClassName: 'ReplicatedStorage', Children: [], Properties: {} },
    { id: 'serverscriptservice', Name: 'ServerScriptService', ClassName: 'ServerScriptService', Children: [], Properties: {} },
    { id: 'startergui', Name: 'StarterGui', ClassName: 'StarterGui', Children: [], Properties: {} },
    { id: 'starterplayer', Name: 'StarterPlayer', ClassName: 'StarterPlayer', Children: [], Properties: {} },
    { id: 'lighting', Name: 'Lighting', ClassName: 'Lighting', Children: [], Properties: { ...DEFAULT_PROPERTIES.Lighting } },
    { id: 'soundservice', Name: 'SoundService', ClassName: 'SoundService', Children: [], Properties: {} },
  ],
};

export const useExplorer = () => {
  const [explorer, setExplorer] = useState<RobloxInstance>(INITIAL_STRUCTURE);

  const addInstance = useCallback((parentId: string, name: string, className: string) => {
    const newInstance: RobloxInstance = {
      id: Math.random().toString(36).substr(2, 9),
      Name: name,
      ClassName: className,
      Children: [],
      Properties: { ...(DEFAULT_PROPERTIES[className] || {}) },
    };

    const updateChildren = (node: RobloxInstance): RobloxInstance => {
      if (node.id === parentId) {
        return { ...node, Children: [...(node.Children || []), newInstance] };
      }
      return { ...node, Children: (node.Children || []).map(updateChildren) };
    };

    setExplorer(prev => updateChildren(prev));
  }, []);

  const toggleExpand = useCallback((id: string) => {
    const updateExpand = (node: RobloxInstance): RobloxInstance => {
      if (node.id === id) {
        return { ...node, expanded: !node.expanded };
      }
      return { ...node, Children: (node.Children || []).map(updateExpand) };
    };
    setExplorer(prev => updateExpand(prev));
  }, []);

  const updateInstanceProperty = useCallback((id: string, propertyName: string, value: any) => {
    const updateProp = (node: RobloxInstance): RobloxInstance => {
      if (node.id === id) {
        if (propertyName === 'Name') {
          return { ...node, Name: value };
        }
        return { 
          ...node, 
          Properties: { 
            ...(node.Properties || {}), 
            [propertyName]: value 
          } 
        };
      }
      return { ...node, Children: (node.Children || []).map(updateProp) };
    };
    setExplorer(prev => updateProp(prev));
  }, []);

  return { explorer, setExplorer, addInstance, toggleExpand, updateInstanceProperty };
};
