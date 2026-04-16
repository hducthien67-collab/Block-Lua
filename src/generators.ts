import { luaGenerator, Order } from 'blockly/lua';
import path from 'path';
import { serviceGroups } from './serviceBlocks';

export const defineCustomGenerators = () => {
  luaGenerator.forBlock['lua_event_touched'] = function(block: any) {
    const part = luaGenerator.valueToCode(block, 'PART', Order.NONE) || 'script.Parent';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `${part}.Touched:Connect(function(otherPart)\n${branch}end)\n`;
  };

  luaGenerator.forBlock['instance_get_self'] = function() {
    return ['script.Parent', Order.ATOMIC];
  };

  luaGenerator.forBlock['lua_humanoid_take_damage'] = function(block: any) {
    const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
    const damage = luaGenerator.valueToCode(block, 'DAMAGE', Order.NONE) || '0';
    return `${humanoid}:TakeDamage(${damage})\n`;
  };

  luaGenerator.forBlock['instance_find_first_child_of_class'] = function(block: any) {
    const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'nil';
    const className = luaGenerator.valueToCode(block, 'CLASS', Order.NONE) || '""';
    return [`${parent}:FindFirstChildOfClass(${className})`, Order.ATOMIC];
  };

  luaGenerator.forBlock['lua_event_touch_other'] = function() {
    return ['otherPart', Order.ATOMIC];
  };

  luaGenerator.forBlock['lua_event_player_added'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `game.Players.PlayerAdded:Connect(function(player)\n${branch}end)\n`;
  };

  luaGenerator.forBlock['instance_create'] = function(block: any) {
    const className = luaGenerator.valueToCode(block, 'CLASS', Order.NONE) || '""';
    const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'nil';
    return `Instance.new(${className}, ${parent})\n`;
  };

  luaGenerator.forBlock['lua_event_player'] = function() {
    return ['player', Order.ATOMIC];
  };

  // Sound Generators
  luaGenerator.forBlock['sound_soundid'] = function(block: any) {
    const sound = luaGenerator.valueToCode(block, 'SOUND', Order.NONE) || 'nil';
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '""';
    return `${sound}.SoundId = ${value}\n`;
  };
  luaGenerator.forBlock['sound_volume'] = function(block: any) {
    const sound = luaGenerator.valueToCode(block, 'SOUND', Order.NONE) || 'nil';
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '0';
    return `${sound}.Volume = ${value}\n`;
  };
  luaGenerator.forBlock['sound_play'] = function(block: any) {
    const sound = luaGenerator.valueToCode(block, 'SOUND', Order.NONE) || 'nil';
    return `${sound}:Play()\n`;
  };
  luaGenerator.forBlock['sound_stop'] = function(block: any) {
    const sound = luaGenerator.valueToCode(block, 'SOUND', Order.NONE) || 'nil';
    return `${sound}:Stop()\n`;
  };
  luaGenerator.forBlock['sound_pause'] = function(block: any) {
    const sound = luaGenerator.valueToCode(block, 'SOUND', Order.NONE) || 'nil';
    return `${sound}:Pause()\n`;
  };
  luaGenerator.forBlock['sound_looped'] = function(block: any) {
    const sound = luaGenerator.valueToCode(block, 'SOUND', Order.NONE) || 'nil';
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'false';
    return `${sound}.Looped = ${value}\n`;
  };
  luaGenerator.forBlock['sound_playing'] = function(block: any) {
    const sound = luaGenerator.valueToCode(block, 'SOUND', Order.NONE) || 'nil';
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'false';
    return `${sound}.Playing = ${value}\n`;
  };
  luaGenerator.forBlock['sound_playbackspeed'] = function(block: any) {
    const sound = luaGenerator.valueToCode(block, 'SOUND', Order.NONE) || 'nil';
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '1';
    return `${sound}.PlaybackSpeed = ${value}\n`;
  };
  luaGenerator.forBlock['sound_timeposition'] = function(block: any) {
    const sound = luaGenerator.valueToCode(block, 'SOUND', Order.NONE) || 'nil';
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '0';
    return `${sound}.TimePosition = ${value}\n`;
  };
  luaGenerator.forBlock['sound_ended'] = function(block: any) {
    const sound = luaGenerator.valueToCode(block, 'SOUND', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `${sound}.Ended:Connect(function()\n${branch}end)\n`;
  };

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

  luaGenerator.forBlock['client_key_is'] = function(block: any) {
    const key = luaGenerator.valueToCode(block, 'KEY', Order.NONE) || 'nil';
    const keyName = block.getFieldValue('KEY_NAME');
    const branch = luaGenerator.statementToCode(block, 'DO');
    return 'if ' + key + '.KeyCode == Enum.KeyCode.' + keyName + ' then\n' + branch + 'end\n';
  };
  luaGenerator.forBlock['instance_selector'] = function(block: any) {
    const instance = block.getFieldValue('INSTANCE');
    return [instance, Order.ATOMIC];
  };

  luaGenerator.forBlock['world_workspace'] = function() {
    return ['game:GetService("Workspace")', Order.ATOMIC];
  };

  // Service Generators
  luaGenerator.forBlock['get_service'] = function(block: any) {
    const service = luaGenerator.valueToCode(block, 'SERVICE', Order.NONE) || '"Workspace"';
    // Remove quotes if they exist
    const serviceName = service.replace(/['"]/g, '');
    return [`game:GetService("${serviceName}")`, Order.ATOMIC];
  };

  // Workspace Generators
  luaGenerator.forBlock['workspace_raycast'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'result';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const origin = luaGenerator.valueToCode(block, 'ORIGIN', Order.ATOMIC) || 'Vector3.new(0,0,0)';
    const direction = luaGenerator.valueToCode(block, 'DIRECTION', Order.ATOMIC) || 'Vector3.new(0,0,0)';
    const params = luaGenerator.valueToCode(block, 'PARAMS', Order.ATOMIC) || 'nil';
    return `local ${varName} = ${instance}:Raycast(${origin}, ${direction}, ${params})\n`;
  };

  luaGenerator.forBlock['workspace_getpartboundsinradius'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'result';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const position = luaGenerator.valueToCode(block, 'POSITION', Order.ATOMIC) || 'Vector3.new(0,0,0)';
    const radius = luaGenerator.valueToCode(block, 'RADIUS', Order.ATOMIC) || '10';
    const params = luaGenerator.valueToCode(block, 'PARAMS', Order.ATOMIC) || 'nil';
    return `local ${varName} = ${instance}:GetPartBoundsInRadius(${position}, ${radius}, ${params})\n`;
  };

  luaGenerator.forBlock['workspace_findfirstchild'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'child';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const name = luaGenerator.valueToCode(block, 'NAME', Order.ATOMIC) || '""';
    return `local ${varName} = ${instance}:FindFirstChild(${name})\n`;
  };

  luaGenerator.forBlock['workspace_bulkmoveto'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const partList = luaGenerator.valueToCode(block, 'PARTLIST', Order.ATOMIC) || '{}';
    const cframeList = luaGenerator.valueToCode(block, 'CFRAMELIST', Order.ATOMIC) || '{}';
    return `${instance}:BulkMoveTo(${partList}, ${cframeList})\n`;
  };

  luaGenerator.forBlock['workspace_breakjoints'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'workspace';
    return `${instance}:BreakJoints()\n`;
  };

  luaGenerator.forBlock['workspace_makejoints'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'workspace';
    return `${instance}:MakeJoints()\n`;
  };

  luaGenerator.forBlock['workspace_unjoinall'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'workspace';
    return `${instance}:UnjoinAll()\n`;
  };

  luaGenerator.forBlock['workspace_allowsleep'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'workspace';
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'true';
    return `${instance}.AllowSleep = ${value}\n`;
  };

  luaGenerator.forBlock['workspace_distributedgametime'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'time';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.DistributedGameTime\n`;
  };

  luaGenerator.forBlock['workspace_globalwind'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'wind';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || 'Vector3.new(0,0,0)';
    return `local ${varName} = ${instance}.GlobalWind\n${instance}.GlobalWind = ${value}\n`;
  };

  luaGenerator.forBlock['workspace_terrain_prop'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'terrain';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.Terrain\n`;
  };

  luaGenerator.forBlock['workspace_findpartonray'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'result';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const ray = luaGenerator.valueToCode(block, 'RAY', Order.ATOMIC) || 'Ray.new(Vector3.new(0,0,0), Vector3.new(0,0,0))';
    return `local ${varName} = ${instance}:FindPartOnRay(${ray})\n`;
  };
  luaGenerator.forBlock['workspace_getpartsinpart'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'parts';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const part = luaGenerator.valueToCode(block, 'PART', Order.ATOMIC) || 'nil';
    const params = luaGenerator.valueToCode(block, 'PARAMS', Order.ATOMIC) || 'nil';
    return `local ${varName} = ${instance}:GetPartsInPart(${part}, ${params})\n`;
  };
  luaGenerator.forBlock['workspace_getpartboundsinbox'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'parts';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const cframe = luaGenerator.valueToCode(block, 'CFRAME', Order.ATOMIC) || 'CFrame.new()';
    const size = luaGenerator.valueToCode(block, 'SIZE', Order.ATOMIC) || 'Vector3.new(1,1,1)';
    const params = luaGenerator.valueToCode(block, 'PARAMS', Order.ATOMIC) || 'nil';
    return `local ${varName} = ${instance}:GetPartBoundsInBox(${cframe}, ${size}, ${params})\n`;
  };
  luaGenerator.forBlock['workspace_getdescendants'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'descendants';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}:GetDescendants()\n`;
  };
  luaGenerator.forBlock['workspace_getchildren'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'children';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}:GetChildren()\n`;
  };
  luaGenerator.forBlock['workspace_waitforchild'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'child';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const name = luaGenerator.valueToCode(block, 'NAME', Order.ATOMIC) || '""';
    return `local ${varName} = ${instance}:WaitForChild(${name})\n`;
  };

  // Workspace Properties
  luaGenerator.forBlock['workspace_gravity'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'gravity';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.Gravity\n`;
  };
  luaGenerator.forBlock['workspace_currentcamera'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'camera';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.CurrentCamera\n`;
  };
  luaGenerator.forBlock['workspace_fallenpartsdestroyheight'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'height';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.FallenPartsDestroyHeight\n`;
  };
  luaGenerator.forBlock['workspace_streamingenabled'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'streaming';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.StreamingEnabled\n`;
  };

  // Workspace Events
  luaGenerator.forBlock['workspace_descendantadded'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const doCode = luaGenerator.statementToCode(block, 'DO');
    return `${instance}.DescendantAdded:Connect(function(descendant)\n${doCode}end)\n`;
  };
  luaGenerator.forBlock['workspace_descendantremoving'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const doCode = luaGenerator.statementToCode(block, 'DO');
    return `${instance}.DescendantRemoving:Connect(function(descendant)\n${doCode}end)\n`;
  };
  luaGenerator.forBlock['workspace_childadded'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const doCode = luaGenerator.statementToCode(block, 'DO');
    return `${instance}.ChildAdded:Connect(function(child)\n${doCode}end)\n`;
  };
  luaGenerator.forBlock['workspace_childremoved'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const doCode = luaGenerator.statementToCode(block, 'DO');
    return `${instance}.ChildRemoved:Connect(function(child)\n${doCode}end)\n`;
  };

  luaGenerator.forBlock['workspace_changed'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    const arg1 = block.getFieldValue('ARG1') || 'property';
    const doCode = luaGenerator.statementToCode(block, 'DO');
    return `${instance}.Changed:Connect(function(${arg1})\n${doCode}end)\n`;
  };

  // Workspace Child Objects
  luaGenerator.forBlock['workspace_terrain'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'terrain';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.Terrain\n`;
  };
  luaGenerator.forBlock['workspace_camera'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'camera';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.Camera\n`;
  };
  luaGenerator.forBlock['workspace_worldmodel'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'worldModel';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.WorldModel\n`;
  };

  luaGenerator.forBlock['workspace_model'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'model';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.Model\n`;
  };

  luaGenerator.forBlock['workspace_part'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'part';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.Part\n`;
  };

  luaGenerator.forBlock['workspace_folder'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'folder';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.ATOMIC) || 'workspace';
    return `local ${varName} = ${instance}.Folder\n`;
  };

  // Players Service Generators
  luaGenerator.forBlock['players_localplayer'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'player';
    return `local ${varName} = game:GetService("Players").LocalPlayer\n`;
  };

  luaGenerator.forBlock['players_getplayers'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'list';
    return `local ${varName} = game:GetService("Players"):GetPlayers()\n`;
  };

  luaGenerator.forBlock['players_playeradded'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `game:GetService("Players").PlayerAdded:Connect(function(player)\n${branch}end)\n`;
  };

  // Lighting Service Generators
  luaGenerator.forBlock['lighting_clocktime'] = function(block: any) {
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '12';
    return `game:GetService("Lighting").ClockTime = ${value}\n`;
  };

  luaGenerator.forBlock['lighting_brightness'] = function(block: any) {
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '2';
    return `game:GetService("Lighting").Brightness = ${value}\n`;
  };

  // TweenService Generators
  luaGenerator.forBlock['tweenservice_create'] = function(block: any) {
    const varName = block.getFieldValue('VAR') || 'tween';
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
    const info = luaGenerator.valueToCode(block, 'INFO', Order.NONE) || 'TweenInfo.new()';
    const goals = luaGenerator.valueToCode(block, 'GOALS', Order.NONE) || '{}';
    return `local ${varName} = game:GetService("TweenService"):Create(${instance}, ${info}, ${goals})\n`;
  };

  // HttpService Generators
  luaGenerator.forBlock['httpservice_getasync'] = function(block: any) {
    const url = luaGenerator.valueToCode(block, 'URL', Order.NONE) || '""';
    return [`game:GetService("HttpService"):GetAsync(${url})`, Order.ATOMIC];
  };
  luaGenerator.forBlock['httpservice_postasync'] = function(block: any) {
    const url = luaGenerator.valueToCode(block, 'URL', Order.NONE) || '""';
    const data = luaGenerator.valueToCode(block, 'DATA', Order.NONE) || '""';
    return [`game:GetService("HttpService"):PostAsync(${url}, ${data})`, Order.ATOMIC];
  };
  luaGenerator.forBlock['httpservice_jsonencode'] = function(block: any) {
    const data = luaGenerator.valueToCode(block, 'DATA', Order.NONE) || '{}';
    return [`game:GetService("HttpService"):JSONEncode(${data})`, Order.ATOMIC];
  };
  luaGenerator.forBlock['httpservice_jsondecode'] = function(block: any) {
    const json = luaGenerator.valueToCode(block, 'JSON', Order.NONE) || '""';
    return [`game:GetService("HttpService"):JSONDecode(${json})`, Order.ATOMIC];
  };

  // DataStoreService Generators
  luaGenerator.forBlock['datastoreservice_getdatastore'] = function(block: any) {
    const name = luaGenerator.valueToCode(block, 'NAME', Order.NONE) || '""';
    return [`game:GetService("DataStoreService"):GetDataStore(${name})`, Order.ATOMIC];
  };
  luaGenerator.forBlock['datastore_getasync'] = function(block: any) {
    const datastore = luaGenerator.valueToCode(block, 'DATASTORE', Order.NONE) || 'nil';
    const key = luaGenerator.valueToCode(block, 'KEY', Order.NONE) || '""';
    return [`${datastore}:GetAsync(${key})`, Order.ATOMIC];
  };
  luaGenerator.forBlock['datastore_setasync'] = function(block: any) {
    const datastore = luaGenerator.valueToCode(block, 'DATASTORE', Order.NONE) || 'nil';
    const key = luaGenerator.valueToCode(block, 'KEY', Order.NONE) || '""';
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
    return `${datastore}:SetAsync(${key}, ${value})\n`;
  };

  // RunService Generators
  luaGenerator.forBlock['runservice_heartbeat'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `game:GetService("RunService").Heartbeat:Connect(function()\n${branch}end)\n`;
  };
  luaGenerator.forBlock['runservice_renderstepped'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `game:GetService("RunService").RenderStepped:Connect(function()\n${branch}end)\n`;
  };

  // Debris Generators
  luaGenerator.forBlock['debris_additem'] = function(block: any) {
    const item = luaGenerator.valueToCode(block, 'ITEM', Order.NONE) || 'nil';
    const lifetime = luaGenerator.valueToCode(block, 'LIFETIME', Order.NONE) || '0';
    return `game:GetService("Debris"):AddItem(${item}, ${lifetime})\n`;
  };

  // MarketplaceService Generators
  luaGenerator.forBlock['marketplaceservice_promptgamepasspurchase'] = function(block: any) {
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    const id = luaGenerator.valueToCode(block, 'ID', Order.NONE) || '0';
    return `game:GetService("MarketplaceService"):PromptGamePassPurchase(${player}, ${id})\n`;
  };

  // TeleportService Generators
  luaGenerator.forBlock['teleportservice_teleport'] = function(block: any) {
    const placeId = luaGenerator.valueToCode(block, 'PLACEID', Order.NONE) || '0';
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    return `game:GetService("TeleportService"):Teleport(${placeId}, ${player})\n`;
  };

  // Logic Compare
  const defineCompareGenerator = (type: string, op: string) => {
    luaGenerator.forBlock[`logic_compare_${type}`] = function(block: any) {
      const a = luaGenerator.valueToCode(block, 'A', Order.RELATIONAL) || 'nil';
      const b = luaGenerator.valueToCode(block, 'B', Order.RELATIONAL) || 'nil';
      const code = `${a} ${op} ${b}`;
      return [code, Order.RELATIONAL];
    };
  };

  defineCompareGenerator('eq', '==');
  defineCompareGenerator('lt', '<');
  defineCompareGenerator('gt', '>');
  defineCompareGenerator('neq', '~=');

  // Logic Boolean
  luaGenerator.forBlock['logic_boolean_true'] = function() {
    return ['true', Order.ATOMIC];
  };
  luaGenerator.forBlock['logic_boolean_false'] = function() {
    return ['false', Order.ATOMIC];
  };

  // Logic Negate
  luaGenerator.forBlock['logic_negate'] = function(block: any) {
    const bool = luaGenerator.valueToCode(block, 'BOOL', Order.UNARY) || 'false';
    return ['not ' + bool, Order.UNARY];
  };

  // Logic Operation
  const defineOpGenerator = (type: string, op: string) => {
    luaGenerator.forBlock[`logic_operation_${type}`] = function(block: any) {
      const a = luaGenerator.valueToCode(block, 'A', Order.AND) || 'false';
      const b = luaGenerator.valueToCode(block, 'B', Order.AND) || 'false';
      const code = `${a} ${op} ${b}`;
      return [code, type === 'and' ? Order.AND : Order.OR];
    };
  };

  defineOpGenerator('and', 'and');
  defineOpGenerator('or', 'or');

  // Loops
  luaGenerator.forBlock['loops_while_lua'] = function(block: any) {
    const condition = luaGenerator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `while ${condition} do\n${branch}end\n`;
  };

  luaGenerator.forBlock['loops_repeat_lua'] = function(block: any) {
    const from = luaGenerator.valueToCode(block, 'FROM', Order.NONE) || '1';
    const to = luaGenerator.valueToCode(block, 'TO', Order.NONE) || '10';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. _count').replace('var. ', '');
    return `for ${varName} = ${from}, ${to} do\n${branch}end\n`;
  };

  luaGenerator.forBlock['loops_for_children'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. _child').replace('var. ', '');
    return `for _, ${varName} in ipairs(${instance}:GetChildren()) do\n${branch}end\n`;
  };

  luaGenerator.forBlock['loops_for_descendants'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. _descendant').replace('var. ', '');
    return `for _, ${varName} in ipairs(${instance}:GetDescendants()) do\n${branch}end\n`;
  };

  luaGenerator.forBlock['loops_break_lua'] = function() {
    return 'break\n';
  };

  // Player Generators
  luaGenerator.forBlock['player_get_by_name'] = function(block: any) {
    const name = luaGenerator.valueToCode(block, 'NAME', Order.NONE) || '""';
    return ['game.Players:FindFirstChild(' + name + ')', Order.HIGH];
  };

  luaGenerator.forBlock['player_kick'] = function(block: any) {
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    const reason = luaGenerator.valueToCode(block, 'REASON', Order.NONE) || '""';
    return player + ':Kick(' + reason + ')\n';
  };

  luaGenerator.forBlock['player_joined'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    return 'game.Players.PlayerAdded:Connect(function(_player)\n' + branch + 'end)\n';
  };

  luaGenerator.forBlock['player_leaving'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    return 'game.Players.PlayerRemoving:Connect(function(_player)\n' + branch + 'end)\n';
  };

  luaGenerator.forBlock['player_get_user_id'] = function(block: any) {
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    return [player + '.UserId', Order.HIGH];
  };

  luaGenerator.forBlock['player_chat_added'] = function(block: any) {
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return player + '.Chatted:Connect(function(message)\n' + branch + 'end)\n';
  };

  luaGenerator.forBlock['player_respawned'] = function(block: any) {
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return player + '.CharacterAdded:Connect(function(character)\n' + branch + 'end)\n';
  };

  // Shadow Block Generators
  luaGenerator.forBlock['world_vector3_values'] = function() {
    return ['Vector3.new(0, 0, 0)', Order.ATOMIC];
  };

  luaGenerator.forBlock['world_number_value'] = function() {
    return ['0', Order.ATOMIC];
  };

  luaGenerator.forBlock['world_text_value'] = function() {
    return ['""', Order.ATOMIC];
  };

  luaGenerator.forBlock['world_instance_shadow'] = function() {
    return ['nil', Order.ATOMIC];
  };

  luaGenerator.forBlock['event_game_start'] = function(block: any) {
    const statements = luaGenerator.statementToCode(block, 'DO');
    return `task.spawn(function()\n${statements}end)\n`;
  };
  luaGenerator.forBlock['event_clicked'] = function(block: any) {
    const clickDetector = luaGenerator.valueToCode(block, 'CLICK_DETECTOR', Order.ATOMIC) || 'script.Parent:FindFirstChild("ClickDetector")';
    const statements = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. player').replace('var. ', '');
    return `${clickDetector}.MouseClick:Connect(function(${varName})\n${statements}end)\n`;
  };
  luaGenerator.forBlock['event_value_changed'] = function(block: any) {
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || 'script.Parent:FindFirstChild("Value")';
    const statements = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. value').replace('var. ', '');
    return `${value}.Changed:Connect(function(${varName})\n${statements}end)\n`;
  };
  luaGenerator.forBlock['event_game_loaded'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    return 'game.Loaded:Connect(function()\n' + branch + 'end)\n';
  };
  luaGenerator.forBlock['event_player_joined'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. player').replace('var. ', '');
    return `game.Players.PlayerAdded:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_player_left'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. player').replace('var. ', '');
    return `game.Players.PlayerRemoving:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_character_added'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. character').replace('var. ', '');
    return `game.Players.LocalPlayer.CharacterAdded:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_character_removing'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. character').replace('var. ', '');
    return `game.Players.LocalPlayer.CharacterRemoving:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_touched'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'script.Parent';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. otherPart').replace('var. ', '');
    return `${instance}.Touched:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_touch_ended'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'script.Parent';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. otherPart').replace('var. ', '');
    return `${instance}.TouchEnded:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_child_added'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'script.Parent';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. child').replace('var. ', '');
    return `${instance}.ChildAdded:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_child_removed'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'script.Parent';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. child').replace('var. ', '');
    return `${instance}.ChildRemoved:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_property_changed'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'script.Parent';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. property').replace('var. ', '');
    return `${instance}.Changed:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_proximity_prompt_triggered'] = function(block: any) {
    const prompt = luaGenerator.valueToCode(block, 'PROMPT', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. player').replace('var. ', '');
    return `${prompt}.Triggered:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_tool_equipped'] = function(block: any) {
    const tool = luaGenerator.valueToCode(block, 'TOOL', Order.NONE) || 'script.Parent';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `${tool}.Equipped:Connect(function()\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_tool_unequipped'] = function(block: any) {
    const tool = luaGenerator.valueToCode(block, 'TOOL', Order.NONE) || 'script.Parent';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `${tool}.Unequipped:Connect(function()\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_humanoid_died'] = function(block: any) {
    const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `${humanoid}.Died:Connect(function()\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_humanoid_jumping'] = function(block: any) {
    const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. active').replace('var. ', '');
    return `${humanoid}.Jumping:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_humanoid_running'] = function(block: any) {
    const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. speed').replace('var. ', '');
    return `${humanoid}.Running:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_heartbeat'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. deltaTime').replace('var. ', '');
    return `game:GetService("RunService").Heartbeat:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_render_stepped'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. deltaTime').replace('var. ', '');
    return `game:GetService("RunService").RenderStepped:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_stepped'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    const timeVar = (block.getFieldValue('VAR_LABEL_TIME') || 'var. time').replace('var. ', '');
    const dtVar = (block.getFieldValue('VAR_LABEL_DT') || 'var. deltaTime').replace('var. ', '');
    return `game:GetService("RunService").Stepped:Connect(function(${timeVar}, ${dtVar})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_chat_message_received'] = function(block: any) {
    const branch = luaGenerator.statementToCode(block, 'DO');
    const playerVar = (block.getFieldValue('VAR_LABEL_PLAYER') || 'var. player').replace('var. ', '');
    const messageVar = (block.getFieldValue('VAR_LABEL_MESSAGE') || 'var. message').replace('var. ', '');
    return `game:GetService("Players").LocalPlayer.Chatted:Connect(function(${messageVar})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['event_attribute_changed'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'script.Parent';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. attributeName').replace('var. ', '');
    return `${instance}.AttributeChanged:Connect(function(${varName})\n${branch}end)\n`;
  };

  // --- Camera Generators ---
  luaGenerator.forBlock['camera_get_current'] = function() {
    return ["workspace.CurrentCamera", Order.ATOMIC];
  };
  luaGenerator.forBlock['camera_set_type'] = function(block: any) {
    const type = block.getFieldValue('TYPE');
    return `workspace.CurrentCamera.CameraType = ${type}\n`;
  };
  luaGenerator.forBlock['camera_set_subject'] = function(block: any) {
    const subject = luaGenerator.valueToCode(block, 'SUBJECT', Order.NONE) || 'nil';
    return `workspace.CurrentCamera.CameraSubject = ${subject}\n`;
  };
  luaGenerator.forBlock['camera_set_cframe'] = function(block: any) {
    const cframe = luaGenerator.valueToCode(block, 'CFRAME', Order.NONE) || 'CFrame.new()';
    return `workspace.CurrentCamera.CFrame = ${cframe}\n`;
  };
  luaGenerator.forBlock['camera_get_cframe'] = function() {
    return ["workspace.CurrentCamera.CFrame", Order.ATOMIC];
  };
  luaGenerator.forBlock['camera_move'] = function(block: any) {
    const pos = luaGenerator.valueToCode(block, 'POSITION', Order.NONE) || 'Vector3.new()';
    return `workspace.CurrentCamera.CFrame = CFrame.new(${pos})\n`;
  };
  luaGenerator.forBlock['camera_look_at'] = function(block: any) {
    const target = luaGenerator.valueToCode(block, 'TARGET', Order.NONE) || 'Vector3.new()';
    return `workspace.CurrentCamera.CFrame = CFrame.lookAt(workspace.CurrentCamera.CFrame.Position, ${target})\n`;
  };
  luaGenerator.forBlock['camera_shake'] = function(block: any) {
    const intensity = luaGenerator.valueToCode(block, 'INTENSITY', Order.NONE) || '1';
    const duration = luaGenerator.valueToCode(block, 'DURATION', Order.NONE) || '1';
    return `-- Camera shake logic\nlocal startTime = os.clock()\nwhile os.clock() - startTime < ${duration} do\n\tworkspace.CurrentCamera.CFrame = workspace.CurrentCamera.CFrame * CFrame.new(math.random(-${intensity}, ${intensity}), math.random(-${intensity}, ${intensity}), 0)\n\ttask.wait()\nend\n`;
  };
  luaGenerator.forBlock['camera_zoom'] = function(block: any) {
    const distance = luaGenerator.valueToCode(block, 'DISTANCE', Order.NONE) || '10';
    return `workspace.CurrentCamera.FieldOfView = ${distance}\n`; // Simplified zoom
  };
  luaGenerator.forBlock['camera_set_fov'] = function(block: any) {
    const fov = luaGenerator.valueToCode(block, 'FOV', Order.NONE) || '70';
    return `workspace.CurrentCamera.FieldOfView = ${fov}\n`;
  };
  luaGenerator.forBlock['camera_get_fov'] = function() {
    return ["workspace.CurrentCamera.FieldOfView", Order.ATOMIC];
  };
  luaGenerator.forBlock['camera_follow_player'] = function(block: any) {
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    return `if ${player} and ${player}.Character then workspace.CurrentCamera.CameraSubject = ${player}.Character.Humanoid end\n`;
  };
  luaGenerator.forBlock['camera_scriptable'] = function() {
    return `workspace.CurrentCamera.CameraType = Enum.CameraType.Scriptable\n`;
  };
  luaGenerator.forBlock['camera_reset'] = function() {
    return `workspace.CurrentCamera.CameraType = Enum.CameraType.Custom\nworkspace.CurrentCamera.CameraSubject = game.Players.LocalPlayer.Character.Humanoid\n`;
  };

  // --- Animation Generators ---
  luaGenerator.forBlock['animation_load'] = function(block: any) {
    const id = luaGenerator.valueToCode(block, 'ANIM_ID', Order.NONE) || '""';
    const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
    const code = `(function()\n\tlocal anim = Instance.new("Animation")\n\tanim.AnimationId = ${id}\n\treturn ${humanoid}:LoadAnimation(anim)\nend)()`;
    return [code, Order.ATOMIC];
  };
  luaGenerator.forBlock['animation_play'] = function(block: any) {
    const track = luaGenerator.valueToCode(block, 'ANIM_TRACK', Order.NONE) || 'nil';
    return `${track}:Play()\n`;
  };
  luaGenerator.forBlock['animation_stop'] = function(block: any) {
    const track = luaGenerator.valueToCode(block, 'ANIM_TRACK', Order.NONE) || 'nil';
    return `${track}:Stop()\n`;
  };
  luaGenerator.forBlock['animation_pause'] = function(block: any) {
    const track = luaGenerator.valueToCode(block, 'ANIM_TRACK', Order.NONE) || 'nil';
    return `${track}:AdjustSpeed(0)\n`;
  };
  luaGenerator.forBlock['animation_adjust_speed'] = function(block: any) {
    const track = luaGenerator.valueToCode(block, 'ANIM_TRACK', Order.NONE) || 'nil';
    const speed = luaGenerator.valueToCode(block, 'SPEED', Order.NONE) || '1';
    return `${track}:AdjustSpeed(${speed})\n`;
  };
  luaGenerator.forBlock['animation_adjust_weight'] = function(block: any) {
    const track = luaGenerator.valueToCode(block, 'ANIM_TRACK', Order.NONE) || 'nil';
    const weight = luaGenerator.valueToCode(block, 'WEIGHT', Order.NONE) || '1';
    return `${track}:AdjustWeight(${weight})\n`;
  };
  luaGenerator.forBlock['animation_get_playing'] = function(block: any) {
    const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
    return [`${humanoid}:GetPlayingAnimationTracks()`, Order.ATOMIC];
  };
  luaGenerator.forBlock['animation_stopped_event'] = function(block: any) {
    const track = luaGenerator.valueToCode(block, 'ANIM_TRACK', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `${track}.Stopped:Connect(function()\n${branch}end)\n`;
  };
  luaGenerator.forBlock['animation_played_event'] = function(block: any) {
    const humanoid = luaGenerator.valueToCode(block, 'HUMANOID', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. _animTrack').replace('var. ', '');
    return `${humanoid}.AnimationPlayed:Connect(function(${varName})\n${branch}end)\n`;
  };
  luaGenerator.forBlock['animation_set_priority'] = function(block: any) {
    const track = luaGenerator.valueToCode(block, 'ANIM_TRACK', Order.NONE) || 'nil';
    const priority = block.getFieldValue('PRIORITY') || 'Enum.AnimationPriority.Action';
    return `${track}.Priority = ${priority}\n`;
  };
  luaGenerator.forBlock['animation_get_length'] = function(block: any) {
    const track = luaGenerator.valueToCode(block, 'ANIM_TRACK', Order.NONE) || 'nil';
    return [`${track}.Length`, Order.ATOMIC];
  };
  luaGenerator.forBlock['animation_is_playing'] = function(block: any) {
    const track = luaGenerator.valueToCode(block, 'ANIM_TRACK', Order.NONE) || 'nil';
    return [`${track}.IsPlaying`, Order.ATOMIC];
  };

  // --- Effects Generators ---
  luaGenerator.forBlock['effects_create_particle'] = function(block: any) {
    const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'nil';
    const code = `(function()\n\tlocal pe = Instance.new("ParticleEmitter")\n\tpe.Parent = ${parent}\n\treturn pe\nend)()`;
    return [code, Order.ATOMIC];
  };
  luaGenerator.forBlock['effects_emit_particles'] = function(block: any) {
    const count = luaGenerator.valueToCode(block, 'COUNT', Order.NONE) || '10';
    const emitter = luaGenerator.valueToCode(block, 'PARTICLE_EMITTER', Order.NONE) || 'nil';
    return `${emitter}:Emit(${count})\n`;
  };
  luaGenerator.forBlock['effects_stop_particles'] = function(block: any) {
    const emitter = luaGenerator.valueToCode(block, 'PARTICLE_EMITTER', Order.NONE) || 'nil';
    return `${emitter}.Enabled = false\n`;
  };
  luaGenerator.forBlock['effects_create_explosion'] = function(block: any) {
    const pos = luaGenerator.valueToCode(block, 'POSITION', Order.NONE) || 'Vector3.new()';
    return `(function()\n\tlocal ex = Instance.new("Explosion")\n\tex.Position = ${pos}\n\tex.Parent = workspace\n\treturn ex\nend)()\n`;
  };
  luaGenerator.forBlock['effects_create_highlight'] = function(block: any) {
    const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'nil';
    const code = `(function()\n\tlocal hl = Instance.new("Highlight")\n\thl.Parent = ${parent}\n\treturn hl\nend)()`;
    return [code, Order.ATOMIC];
  };
  luaGenerator.forBlock['effects_enable_highlight'] = function(block: any) {
    const hl = luaGenerator.valueToCode(block, 'HIGHLIGHT', Order.NONE) || 'nil';
    return `${hl}.Enabled = true\n`;
  };
  luaGenerator.forBlock['effects_disable_highlight'] = function(block: any) {
    const hl = luaGenerator.valueToCode(block, 'HIGHLIGHT', Order.NONE) || 'nil';
    return `${hl}.Enabled = false\n`;
  };
  luaGenerator.forBlock['effects_create_beam'] = function(block: any) {
    const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'nil';
    const code = `(function()\n\tlocal beam = Instance.new("Beam")\n\tbeam.Parent = ${parent}\n\treturn beam\nend)()`;
    return [code, Order.ATOMIC];
  };
  luaGenerator.forBlock['effects_create_trail'] = function(block: any) {
    const parent = luaGenerator.valueToCode(block, 'PARENT', Order.NONE) || 'nil';
    const code = `(function()\n\tlocal trail = Instance.new("Trail")\n\ttrail.Parent = ${parent}\n\treturn trail\nend)()`;
    return [code, Order.ATOMIC];
  };

  // Missing Logic generators
  luaGenerator.forBlock['logic_compare_eq'] = function(block: any) {
    const a = luaGenerator.valueToCode(block, 'A', Order.RELATIONAL) || 'nil';
    const b = luaGenerator.valueToCode(block, 'B', Order.RELATIONAL) || 'nil';
    return [`${a} == ${b}`, Order.RELATIONAL];
  };

  luaGenerator.forBlock['logic_compare_lt'] = function(block: any) {
    const a = luaGenerator.valueToCode(block, 'A', Order.RELATIONAL) || 'nil';
    const b = luaGenerator.valueToCode(block, 'B', Order.RELATIONAL) || 'nil';
    return [`${a} < ${b}`, Order.RELATIONAL];
  };

  luaGenerator.forBlock['logic_compare_gt'] = function(block: any) {
    const a = luaGenerator.valueToCode(block, 'A', Order.RELATIONAL) || 'nil';
    const b = luaGenerator.valueToCode(block, 'B', Order.RELATIONAL) || 'nil';
    return [`${a} > ${b}`, Order.RELATIONAL];
  };

  luaGenerator.forBlock['logic_compare_neq'] = function(block: any) {
    const a = luaGenerator.valueToCode(block, 'A', Order.RELATIONAL) || 'nil';
    const b = luaGenerator.valueToCode(block, 'B', Order.RELATIONAL) || 'nil';
    return [`${a} ~= ${b}`, Order.RELATIONAL];
  };

  luaGenerator.forBlock['logic_operation_and'] = function(block: any) {
    const a = luaGenerator.valueToCode(block, 'A', Order.AND) || 'false';
    const b = luaGenerator.valueToCode(block, 'B', Order.AND) || 'false';
    return [`${a} and ${b}`, Order.AND];
  };

  luaGenerator.forBlock['logic_operation_or'] = function(block: any) {
    const a = luaGenerator.valueToCode(block, 'A', Order.OR) || 'false';
    const b = luaGenerator.valueToCode(block, 'B', Order.OR) || 'false';
    return [`${a} or ${b}`, Order.OR];
  };

  // Server Generators
  luaGenerator.forBlock['server_fired_by_client'] = function(block: any) {
    const playerVar = (block.getFieldValue('PLAYER_LABEL') || 'var. player').replace('var. ', '');
    const dataVar = (block.getFieldValue('DATA_LABEL') || 'var. data').replace('var. ', '');
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `game:GetService("ReplicatedStorage").RemoteEvent.OnServerEvent:Connect(function(${playerVar}, ${dataVar})\n${branch}end)\n`;
  };

  luaGenerator.forBlock['server_fire_all_clients'] = function(block: any) {
    const data = luaGenerator.valueToCode(block, 'DATA', Order.NONE) || 'nil';
    return `game:GetService("ReplicatedStorage").RemoteEvent:FireAllClients(${data})\n`;
  };

  luaGenerator.forBlock['server_fire_client'] = function(block: any) {
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    const data = luaGenerator.valueToCode(block, 'DATA', Order.NONE) || 'nil';
    return `game:GetService("ReplicatedStorage").RemoteEvent:FireClient(${player}, ${data})\n`;
  };

  // Leaderstats Generators
  luaGenerator.forBlock['leaderstats_create_number'] = function(block: any) {
    const name = luaGenerator.valueToCode(block, 'NAME', Order.NONE) || '""';
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    return `(function()\n\tlocal ls = ${player}:FindFirstChild("leaderstats")\n\tif ls then\n\t\tlocal val = Instance.new("NumberValue")\n\t\tval.Name = ${name}\n\t\tval.Parent = ls\n\tend\nend)()\n`;
  };

  luaGenerator.forBlock['leaderstats_create_string'] = function(block: any) {
    const name = luaGenerator.valueToCode(block, 'NAME', Order.NONE) || '""';
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    return `(function()\n\tlocal ls = ${player}:FindFirstChild("leaderstats")\n\tif ls then\n\t\tlocal val = Instance.new("StringValue")\n\t\tval.Name = ${name}\n\t\tval.Parent = ls\n\tend\nend)()\n`;
  };

  luaGenerator.forBlock['leaderstats_enable'] = function(block: any) {
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    return `(function()\n\tif not ${player}:FindFirstChild("leaderstats") then\n\t\tlocal ls = Instance.new("Folder")\n\t\tls.Name = "leaderstats"\n\t\tls.Parent = ${player}\n\tend\nend)()\n`;
  };

  luaGenerator.forBlock['leaderstats_get'] = function(block: any) {
    const name = luaGenerator.valueToCode(block, 'NAME', Order.NONE) || '""';
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    return [`${player}.leaderstats[${name}].Value`, Order.ATOMIC];
  };

  luaGenerator.forBlock['leaderstats_set'] = function(block: any) {
    const name = luaGenerator.valueToCode(block, 'NAME', Order.NONE) || '""';
    const player = luaGenerator.valueToCode(block, 'PLAYER', Order.NONE) || 'nil';
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
    return `${player}.leaderstats[${name}].Value = ${value}\n`;
  };

  // Functions Generators
  luaGenerator.forBlock['functions_define'] = function(block: any) {
    const name = block.getFieldValue('NAME');
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `local function ${name}()\n${branch}end\n`;
  };

  luaGenerator.forBlock['functions_call'] = function(block: any) {
    const name = block.getFieldValue('NAME');
    return `${name}()\n`;
  };

  luaGenerator.forBlock['functions_return'] = function(block: any) {
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || '';
    return `return ${value}\n`;
  };

  luaGenerator.forBlock['functions_define_global'] = function(block: any) {
    const name = block.getFieldValue('NAME');
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `_G.${name} = function()\n${branch}end\n`;
  };

  luaGenerator.forBlock['functions_call_global'] = function(block: any) {
    const name = block.getFieldValue('NAME');
    return [`_G.${name}()`, Order.ATOMIC];
  };

  // Datastore Generators
  luaGenerator.forBlock['datastore_setup'] = function(block: any) {
    const name = block.getFieldValue('NAME');
    return `local DataStoreService = game:GetService("DataStoreService")\nlocal myDataStore = DataStoreService:GetDataStore("${name}")\n`;
  };

  luaGenerator.forBlock['datastore_instance'] = function(block: any) {
    const name = block.getFieldValue('NAME');
    return [`game:GetService("DataStoreService"):GetDataStore("${name}")`, Order.ATOMIC];
  };

  luaGenerator.forBlock['datastore_use'] = function(block: any) {
    const datastore = luaGenerator.valueToCode(block, 'DATASTORE', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `(function(ds)\n${branch}end)(${datastore})\n`;
  };

  luaGenerator.forBlock['datastore_get'] = function(block: any) {
    const key = luaGenerator.valueToCode(block, 'KEY', Order.NONE) || '""';
    const varName = (block.getFieldValue('VAR_LABEL') || 'var. data').replace('var. ', '');
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `local success, ${varName} = pcall(function()\n\treturn myDataStore:GetAsync(${key})\nend)\nif success then\n${branch}end\n`;
  };

  luaGenerator.forBlock['datastore_save'] = function(block: any) {
    const value = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
    const key = luaGenerator.valueToCode(block, 'KEY', Order.NONE) || '""';
    return `pcall(function()\n\tmyDataStore:SetAsync(${key}, ${value})\nend)\n`;
  };

  luaGenerator.forBlock['camera_move'] = function(block: any) {
    const position = luaGenerator.valueToCode(block, 'POSITION', Order.NONE) || 'Vector3.new(0, 0, 0)';
    return `workspace.CurrentCamera.CFrame = CFrame.new(${position})\n`;
  };

  luaGenerator.forBlock['client_touch_position'] = function(block: any) {
    const touch = luaGenerator.valueToCode(block, 'TOUCH', Order.NONE) || 'nil';
    return [`${touch}.Position`, Order.ATOMIC];
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
