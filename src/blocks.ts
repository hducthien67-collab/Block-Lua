import { getCategoryColor } from './colors';
import * as Blockly from 'blockly';

export const defineCustomBlocks = () => {
  // Sound Blocks
  Blockly.Blocks['sound_soundid'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("SoundId of");
      this.appendValueInput("VALUE").setCheck("String").appendField("to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Sound'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['sound_volume'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("Volume of");
      this.appendValueInput("VALUE").setCheck("Number").appendField("to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Sound'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['sound_play'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("Play sound");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Sound'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['sound_stop'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("Stop sound");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Sound'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['sound_pause'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("Pause sound");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Sound'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['sound_looped'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("Looped of");
      this.appendValueInput("VALUE").setCheck("Boolean").appendField("to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Sound'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['sound_playing'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("Playing of");
      this.appendValueInput("VALUE").setCheck("Boolean").appendField("to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Sound'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['sound_playbackspeed'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("PlaybackSpeed of");
      this.appendValueInput("VALUE").setCheck("Number").appendField("to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Sound'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['sound_timeposition'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("TimePosition of");
      this.appendValueInput("VALUE").setCheck("Number").appendField("to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Sound'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['sound_ended'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("on sound ended");
      this.appendDummyInput().appendField("do");
      this.appendStatementInput("DO");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Sound'));
    }
  };

  // Instance Blocks
  Blockly.Blocks['instance_selector'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Instance")
          .appendField(new Blockly.FieldDropdown([["game.Workspace", "game.Workspace"], ["game.ReplicatedStorage", "game.ReplicatedStorage"]]), "INSTANCE");
      this.setOutput(true, "Instance");
      this.setColour(getCategoryColor('Instance'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['remote_on_server_event'] = {
    init: function() {
      this.appendValueInput("REMOTE").setCheck("Instance").appendField("on server event");
      this.appendStatementInput("DO").appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('RemoteEvent'));
      this.setInputsInline(true);
    }
  };

  // Comment
  Blockly.Blocks['comment'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("--")
          .appendField(new Blockly.FieldTextInput("comment"), "TEXT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Comment'));
      this.setInputsInline(true);
    }
  };

  // Debug
  Blockly.Blocks['print'] = {
    init: function() {
      this.appendValueInput("TEXT")
          .setCheck(null)
          .appendField("print");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Debug'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['warn'] = {
    init: function() {
      this.appendValueInput("TEXT")
          .setCheck(null)
          .appendField("warn");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Debug'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['run_lua'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("run lua")
          .appendField(new Blockly.FieldTextInput("print('hello')"), "CODE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Debug'));
      this.setInputsInline(true);
    }
  };

  // RemoteEvent
  Blockly.Blocks['remote_fire_server'] = {
    init: function() {
      this.appendValueInput("REMOTE").setCheck("Instance").appendField("fire server");
      this.appendValueInput("DATA").setCheck(null).appendField("with data");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('RemoteEvent'));
      this.setInputsInline(true);
    }
  };

  // Logic
  Blockly.Blocks['lua_if'] = {
    init: function() {
      this.appendValueInput("CONDITION").setCheck("Boolean").appendField("if");
      this.appendStatementInput("DO").appendField("then");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Logic'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['logic_negate'] = {
    init: function() {
      this.appendValueInput("BOOL").setCheck("Boolean").appendField("not");
      this.setOutput(true, "Boolean");
      this.setColour(getCategoryColor('Logic'));
      this.setInputsInline(true);
    }
  };

  const defineCompare = (type: string, label: string) => {
    Blockly.Blocks[`logic_compare_${type}`] = {
      init: function() {
        this.appendValueInput("A").setCheck(null);
        this.appendValueInput("B").setCheck(null).appendField(label);
        this.setOutput(true, "Boolean");
        this.setColour(getCategoryColor('Logic'));
        this.setInputsInline(true);
      }
    };
  };

  defineCompare('eq', '==');
  defineCompare('lt', '<');
  defineCompare('gt', '>');
  defineCompare('neq', '~=');

  Blockly.Blocks['logic_boolean_true'] = {
    init: function() {
      this.appendDummyInput().appendField("true");
      this.setOutput(true, "Boolean");
      this.setColour(getCategoryColor('Logic'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['logic_boolean_false'] = {
    init: function() {
      this.appendDummyInput().appendField("false");
      this.setOutput(true, "Boolean");
      this.setColour(getCategoryColor('Logic'));
      this.setInputsInline(true);
    }
  };

  const defineOp = (type: string, label: string) => {
    Blockly.Blocks[`logic_operation_${type}`] = {
      init: function() {
        this.appendValueInput("A").setCheck("Boolean");
        this.appendValueInput("B").setCheck("Boolean").appendField(label);
        this.setOutput(true, "Boolean");
        this.setColour(getCategoryColor('Logic'));
        this.setInputsInline(true);
      }
    };
  };

  defineOp('and', 'and');
  defineOp('or', 'or');

  // Loops
  Blockly.Blocks['wait'] = {
    init: function() {
      this.appendValueInput("SECONDS").setCheck("Number").appendField("wait");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Loops'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['loops_while_lua'] = {
    init: function() {
      this.appendValueInput("CONDITION").setCheck("Boolean").appendField("while");
      this.appendStatementInput("DO").appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Loops'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['loops_repeat_lua'] = {
    init: function() {
      this.appendStatementInput("DO").appendField("repeat");
      this.appendValueInput("CONDITION").setCheck("Boolean").appendField("until");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Loops'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['loops_for_children'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck("Instance").appendField("for each child of");
      this.appendStatementInput("DO").appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Loops'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['loops_for_descendants'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck("Instance").appendField("for each descendant of");
      this.appendStatementInput("DO").appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Loops'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['loops_break_lua'] = {
    init: function() {
      this.appendDummyInput().appendField("break");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Loops'));
      this.setInputsInline(true);
    }
  };

  // Player Blocks
  Blockly.Blocks['player_get_by_name'] = {
    init: function() {
      this.appendDummyInput().appendField("get player by name");
      this.appendValueInput("NAME").setCheck("String");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Player'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['player_kick'] = {
    init: function() {
      this.appendDummyInput().appendField("kick");
      this.appendValueInput("PLAYER").setCheck(null);
      this.appendDummyInput().appendField("reason:");
      this.appendValueInput("REASON").setCheck("String");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Player'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['player_joined'] = {
    init: function() {
      this.appendDummyInput().appendField("player joined");
      this.appendDummyInput().appendField(new Blockly.FieldLabel("var. _player", "scratch-var-label"), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Player'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['player_leaving'] = {
    init: function() {
      this.appendDummyInput().appendField("player leaving");
      this.appendDummyInput().appendField(new Blockly.FieldLabel("var. _player", "scratch-var-label"), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Player'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['player_get_user_id'] = {
    init: function() {
      this.appendDummyInput().appendField("user id of");
      this.appendValueInput("PLAYER").setCheck(null);
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Player'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['player_chat_added'] = {
    init: function() {
      this.appendDummyInput().appendField("on player chat");
      this.appendValueInput("PLAYER").setCheck(null);
      this.appendDummyInput().appendField(new Blockly.FieldLabel("var. message", "scratch-var-label"), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Player'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['player_respawned'] = {
    init: function() {
      this.appendDummyInput().appendField("on player respawned");
      this.appendValueInput("PLAYER").setCheck(null);
      this.appendDummyInput().appendField(new Blockly.FieldLabel("var. character", "scratch-var-label"), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Player'));
      this.setInputsInline(true);
    }
  };
};
