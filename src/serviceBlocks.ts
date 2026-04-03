import * as Blockly from 'blockly';
import { luaGenerator, Order } from 'blockly/lua';
import { getCategoryColor } from './colors';

export const serviceGroups = [
  'AdService', 'AnalyticsService', 'AnimationClipProvider', 'AssetService', 'AvatarEditorService',
  'BadgeService', 'BrowserService', 'ChangeHistoryService', 'Chat', 'CollectionService',
  'ContentProvider', 'ContextActionService', 'ControllerService', 'CoreGui', 'CorePackages',
  'CSGDictionaryService', 'DataStoreService', 'Debris', 'DebuggerManager', 'DeviceService',
  'FriendService', 'GamepadService', 'Geometry', 'GroupService', 'GuiService', 'HapticService',
  'HttpService', 'InsertService', 'JointsService', 'KeyframeSequenceProvider', 'LanguageService',
  'Lighting', 'LocalizationService', 'LogService', 'LuaSettings', 'MarketplaceService',
  'MaterialService', 'MemoryStoreService', 'MessagingService', 'NetworkClient', 'NetworkServer',
  'NotificationService', 'PathfindingService', 'PhysicsService', 'Players', 'PluginDebugService',
  'PluginGuiService', 'PointsService', 'PolicyService', 'ProximityPromptService', 'ReplicatedFirst',
  'ReplicatedStorage', 'RunService', 'ScriptContext', 'Selection', 'ServerScriptService',
  'ServerStorage', 'SoundService', 'StarterGui', 'StarterPack', 'StarterPlayer', 'Stats',
  'StudioData', 'Teams', 'TeleportService', 'TestService', 'TextChatService', 'TextService',
  'TweenService', 'UserGameSettings', 'UserInputService', 'VRService', 'Workspace'
];

export const defineServiceBlocks = () => {
  serviceGroups.forEach(serviceName => {
    const color = getCategoryColor(serviceName) || getCategoryColor('Roblox Services');
    const serviceVar = serviceName === 'Workspace' ? 'workspace' : `game:GetService("${serviceName}")`;

    // Methods
    const methods = [
      { name: 'GetService', lua: `game:GetService("${serviceName}")`, isOutput: true },
      { name: 'FindFirstChild', lua: `${serviceVar}:FindFirstChild(%1)`, args: ['NAME'], isOutput: true },
      { name: 'WaitForChild', lua: `${serviceVar}:WaitForChild(%1)`, args: ['NAME'], isOutput: true },
      { name: 'GetChildren', lua: `${serviceVar}:GetChildren()`, isOutput: true },
      { name: 'GetDescendants', lua: `${serviceVar}:GetDescendants()`, isOutput: true },
      { name: 'Clone', lua: `${serviceVar}:Clone()`, isOutput: true },
      { name: 'Destroy', lua: `${serviceVar}:Destroy()`, isOutput: false },
      { name: 'SetAttribute', lua: `${serviceVar}:SetAttribute(%1, %2)`, args: ['NAME', 'VALUE'], isOutput: false },
      { name: 'GetAttribute', lua: `${serviceVar}:GetAttribute(%1)`, args: ['NAME'], isOutput: true }
    ];

    methods.forEach(method => {
      const blockType = `rbx_${serviceName.toLowerCase()}_method_${method.name.toLowerCase()}`;
      Blockly.Blocks[blockType] = {
        init: function() {
          this.appendDummyInput().appendField(`${serviceName}:${method.name}`);
          if (method.args) {
            method.args.forEach(arg => {
              this.appendValueInput(arg).setCheck(null);
            });
          }
          // Set to Output shape (rounded)
          this.setOutput(true, null);
          this.setColour(color);
          this.setTooltip(`${method.name} method of ${serviceName}`);
          this.setInputsInline(true);
        }
      };
      luaGenerator.forBlock[blockType] = function(block: Blockly.Block) {
        let code = method.lua;
        if (method.args) {
          method.args.forEach((arg, i) => {
            const val = luaGenerator.valueToCode(block, arg, Order.NONE) || 'nil';
            code = code.replace(`%${i + 1}`, val);
          });
        }
        return [code, Order.NONE];
      };
    });

    // Properties
    const properties = ['Name', 'Parent', 'ClassName', 'Archivable'];
    properties.forEach(prop => {
      // Get
      const getBlockType = `rbx_${serviceName.toLowerCase()}_property_get_${prop.toLowerCase()}`;
      Blockly.Blocks[getBlockType] = {
        init: function() {
          this.appendDummyInput().appendField(`Get ${serviceName}.${prop}`);
          // Set to Output shape (rounded)
          this.setOutput(true, null);
          this.setColour(color);
          this.setInputsInline(true);
        }
      };
      luaGenerator.forBlock[getBlockType] = function() {
        return [`${serviceVar}.${prop}`, Order.NONE];
      };

      // Set
      const setBlockType = `rbx_${serviceName.toLowerCase()}_property_set_${prop.toLowerCase()}`;
      Blockly.Blocks[setBlockType] = {
        init: function() {
          this.appendValueInput('VALUE').appendField(`Set ${serviceName}.${prop} to`);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(color);
          this.setInputsInline(true);
        }
      };
      luaGenerator.forBlock[setBlockType] = function(block: Blockly.Block) {
        const val = luaGenerator.valueToCode(block, 'VALUE', Order.NONE) || 'nil';
        return `${serviceVar}.${prop} = ${val}\n`;
      };
    });

    // Events
    const events = ['ChildAdded', 'ChildRemoved', 'DescendantAdded', 'DescendantRemoving', 'Changed'];
    events.forEach(event => {
      const blockType = `rbx_${serviceName.toLowerCase()}_event_${event.toLowerCase()}`;
      Blockly.Blocks[blockType] = {
        init: function() {
          this.appendDummyInput()
              .appendField(`When ${serviceName}.${event}`)
              .appendField('do');
          this.appendStatementInput('DO');
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(color);
          this.setInputsInline(true);
        }
      };
      luaGenerator.forBlock[blockType] = function(block: Blockly.Block) {
        const branch = luaGenerator.statementToCode(block, 'DO');
        return `${serviceVar}.${event}:Connect(function()\n${branch}end)\n`;
      };
    });

    // Child Objects
    const childObjects = [
      { name: 'Create Instance', lua: `Instance.new(%1, ${serviceVar})`, args: ['CLASS'] },
      { name: 'Parent Object To Service', lua: `%1.Parent = ${serviceVar}`, args: ['INSTANCE'] }
    ];
    childObjects.forEach(obj => {
      const blockType = `rbx_${serviceName.toLowerCase()}_child_${obj.name.toLowerCase().replace(/ /g, '_')}`;
      Blockly.Blocks[blockType] = {
        init: function() {
          this.appendValueInput(obj.args[0]).appendField(obj.name);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(color);
          this.setInputsInline(true);
        }
      };
      luaGenerator.forBlock[blockType] = function(block: Blockly.Block) {
        const val = luaGenerator.valueToCode(block, obj.args[0], Order.NONE) || 'nil';
        let code = obj.lua.replace('%1', val);
        return code + '\n';
      };
    });
  });
};
