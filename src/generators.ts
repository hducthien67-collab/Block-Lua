import { luaGenerator, Order } from 'blockly/lua';

export const defineCustomGenerators = () => {
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

  // RemoteEvent Generators
  luaGenerator.forBlock['remote_fire_server'] = function(block: any) {
    const remote = luaGenerator.valueToCode(block, 'REMOTE', Order.NONE) || 'nil';
    const data = luaGenerator.valueToCode(block, 'DATA', Order.NONE) || 'nil';
    return `${remote}:FireServer(${data})\n`;
  };

  luaGenerator.forBlock['remote_on_server_event'] = function(block: any) {
    const remote = luaGenerator.valueToCode(block, 'REMOTE', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `${remote}.OnServerEvent:Connect(function(player, ...)\n${branch}end)\n`;
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
    const branch = luaGenerator.statementToCode(block, 'DO');
    const condition = luaGenerator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
    return `repeat\n${branch}until ${condition}\n`;
  };

  luaGenerator.forBlock['loops_for_children'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `for _, child in ipairs(${instance}:GetChildren()) do\n${branch}end\n`;
  };

  luaGenerator.forBlock['loops_for_descendants'] = function(block: any) {
    const instance = luaGenerator.valueToCode(block, 'INSTANCE', Order.NONE) || 'nil';
    const branch = luaGenerator.statementToCode(block, 'DO');
    return `for _, descendant in ipairs(${instance}:GetDescendants()) do\n${branch}end\n`;
  };

  luaGenerator.forBlock['loops_break_lua'] = function() {
    return 'break\n';
  };
};
