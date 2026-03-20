import { useState, useCallback } from 'react';
import { RobloxInstance } from './types';
import { ROBLOX_CLASSES } from './lib/roblox-metadata';

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
  },
  Script: {
    Source: '',
    Enabled: true,
    RunContext: 'Legacy',
  },
  LocalScript: {
    Source: '',
    Enabled: true,
  }
};

const INITIAL_STRUCTURE: RobloxInstance = {
  id: 'game',
  Name: 'game',
  ClassName: 'DataModel',
  expanded: true,
  Properties: {},
  Children: [
    { id: 'workspace', Name: 'Workspace', ClassName: 'Workspace', expanded: true, Properties: { ...DEFAULT_PROPERTIES.Workspace }, Children: [
        { id: 'camera', Name: 'Camera', ClassName: 'Camera', Children: [], Properties: {} },
        { id: 'terrain', Name: 'Terrain', ClassName: 'Terrain', Children: [], Properties: {} },
        { id: 'part-1', Name: 'Part', ClassName: 'Part', Children: [], Properties: { ...DEFAULT_PROPERTIES.Part } },
    ] },
    { id: 'players', Name: 'Players', ClassName: 'Players', Children: [], Properties: {} },
    { id: 'lighting', Name: 'Lighting', ClassName: 'Lighting', Children: [
        { id: 'sky', Name: 'Sky', ClassName: 'Sky', Children: [], Properties: {} },
        { id: 'atmosphere', Name: 'Atmosphere', ClassName: 'Atmosphere', Children: [], Properties: {} },
    ], Properties: { ...DEFAULT_PROPERTIES.Lighting } },
    { id: 'materialservice', Name: 'MaterialService', ClassName: 'MaterialService', Children: [], Properties: {} },
    { id: 'networkclient', Name: 'NetworkClient', ClassName: 'NetworkClient', Children: [
        { id: 'clientreplicator', Name: 'ClientReplicator', ClassName: 'ClientReplicator', Children: [], Properties: {} },
    ], Properties: {} },
    { id: 'replicatedfirst', Name: 'ReplicatedFirst', ClassName: 'ReplicatedFirst', Children: [], Properties: {} },
    { id: 'replicatedstorage', Name: 'ReplicatedStorage', ClassName: 'ReplicatedStorage', Children: [
        { id: 'lastbloxupdate', Name: 'lastBloxUpdate', ClassName: 'StringValue', Children: [], Properties: {} },
        { id: 'folder-1', Name: 'Folder', ClassName: 'Folder', Children: [], Properties: {} },
        { id: 'script-1', Name: 'Script', ClassName: 'Script', Children: [], Properties: { ...DEFAULT_PROPERTIES.Script } },
    ], Properties: {} },
    { id: 'serverscriptservice', Name: 'ServerScriptService', ClassName: 'ServerScriptService', Children: [], Properties: {} },
    { id: 'serverstorage', Name: 'ServerStorage', ClassName: 'ServerStorage', Children: [], Properties: {} },
    { id: 'startergui', Name: 'StarterGui', ClassName: 'StarterGui', Children: [], Properties: {} },
    { id: 'starterpack', Name: 'StarterPack', ClassName: 'StarterPack', Children: [], Properties: {} },
    { id: 'starterplayer', Name: 'StarterPlayer', ClassName: 'StarterPlayer', Children: [
        { id: 'startercharacterscripts', Name: 'StarterCharacterScripts', ClassName: 'StarterCharacterScripts', Children: [], Properties: {} },
        { id: 'starterplayerscripts', Name: 'StarterPlayerScripts', ClassName: 'StarterPlayerScripts', Children: [], Properties: {} },
    ], Properties: {} },
    { id: 'teams', Name: 'Teams', ClassName: 'Teams', Children: [], Properties: {} },
    { id: 'soundservice', Name: 'SoundService', ClassName: 'SoundService', Children: [], Properties: {} },
    { id: 'textchatservice', Name: 'TextChatService', ClassName: 'TextChatService', Children: [
        { id: 'chatwindowconfiguration', Name: 'ChatWindowConfiguration', ClassName: 'ChatWindowConfiguration', Children: [], Properties: {} },
        { id: 'chatinputbarconfiguration', Name: 'ChatInputBarConfiguration', ClassName: 'ChatInputBarConfiguration', Children: [], Properties: {} },
        { id: 'channeltabsconfiguration', Name: 'ChannelTabsConfiguration', ClassName: 'ChannelTabsConfiguration', Children: [], Properties: {} },
        { id: 'bubblechatconfiguration', Name: 'BubbleChatConfiguration', ClassName: 'BubbleChatConfiguration', Children: [], Properties: {} },
    ], Properties: {} },
    { id: 'localizationservice', Name: 'LocalizationService', ClassName: 'LocalizationService', Children: [
        { id: 'localizationtable', Name: 'LocalizationTable', ClassName: 'LocalizationTable', Children: [], Properties: {} },
    ], Properties: {} },
    { id: 'testservice', Name: 'TestService', ClassName: 'TestService', Children: [], Properties: {} },
    { id: 'physicsservice', Name: 'PhysicsService', ClassName: 'PhysicsService', Children: [], Properties: {} },
    { id: 'collectionservice', Name: 'CollectionService', ClassName: 'CollectionService', Children: [], Properties: {} },
    { id: 'runservice', Name: 'RunService', ClassName: 'RunService', Children: [], Properties: {} },
    { id: 'httpservice', Name: 'HttpService', ClassName: 'HttpService', Children: [], Properties: {} },
    { id: 'tweenservice', Name: 'TweenService', ClassName: 'TweenService', Children: [], Properties: {} },
  ],
};

export const useExplorer = () => {
  const [explorer, setExplorer] = useState<RobloxInstance>(INITIAL_STRUCTURE);

  const addInstance = useCallback((parentId: string, name: string, className: string, initialProps: Record<string, any> = {}) => {
    const newInstance: RobloxInstance = {
      id: `${className}-${Math.random().toString(36).substr(2, 9)}`,
      Name: name,
      ClassName: className,
      Children: [],
      Properties: { ...(DEFAULT_PROPERTIES[className] || {}), ...initialProps },
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

  const deleteInstance = useCallback((id: string) => {
    const removeFromChildren = (node: RobloxInstance): RobloxInstance => {
      return {
        ...node,
        Children: (node.Children || [])
          .filter(child => {
            if (child.id === id) {
              const metadata = ROBLOX_CLASSES.find(c => c.name === child.ClassName);
              if (metadata && metadata.category === 'Services') return false;
              if (['game', 'workspace', 'players', 'lighting', 'materialservice', 'networkclient', 'replicatedfirst', 'replicatedstorage', 'serverscriptservice', 'serverstorage', 'startergui', 'starterpack', 'starterplayer', 'teams', 'soundservice', 'textchatservice', 'chatwindowconfiguration', 'chatinputbarconfiguration', 'channeltabsconfiguration', 'bubblechatconfiguration', 'startercharacterscripts', 'starterplayerscripts', 'localizationservice', 'localizationtable', 'testservice', 'physicsservice', 'collectionservice', 'runservice', 'httpservice', 'tweenservice'].includes(child.id.toLowerCase())) return false;
            }
            return true;
          })
          .map(removeFromChildren)
      };
    };

    setExplorer(prev => removeFromChildren(prev));
  }, []);

  return { explorer, setExplorer, addInstance, toggleExpand, updateInstanceProperty, deleteInstance };
};
