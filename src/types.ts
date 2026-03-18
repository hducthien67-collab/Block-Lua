export interface RobloxInstance {
  id: string;
  Name: string;
  ClassName: string;
  Children: RobloxInstance[];
  ParentId?: string;
  expanded?: boolean;
  Properties?: Record<string, any>;
}

export type ClassType = 'Part' | 'Model' | 'Folder' | 'Script' | 'LocalScript' | 'ModuleScript' | 'Camera' | 'Terrain' | 'Workspace' | 'ReplicatedStorage' | 'ServerScriptService' | 'StarterGui' | 'StarterPlayer' | 'Lighting' | 'SoundService';
