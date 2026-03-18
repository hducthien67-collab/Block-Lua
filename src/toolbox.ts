export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Comment',
      colour: '#999999',
      contents: [{ kind: 'block', type: 'comment' }]
    },
    {
      kind: 'category',
      name: 'Debug',
      colour: '#ff8c1a',
      contents: [
        { kind: 'block', type: 'print' },
        { kind: 'block', type: 'warn' },
        { kind: 'block', type: 'run_lua' }
      ]
    },
    {
      kind: 'category',
      name: 'Sound',
      colour: '#59c059',
      contents: [
        { kind: 'block', type: 'sound_play' },
        { kind: 'block', type: 'sound_stop' }
      ]
    },
    {
      kind: 'category',
      name: 'RemoteEvent',
      colour: '#ffab19',
      contents: [
        { kind: 'block', type: 'remote_fire_server' },
        { kind: 'block', type: 'remote_on_server_event' }
      ]
    },
    {
      kind: 'category',
      name: 'Instance',
      colour: '#6600ff',
      contents: [
        { kind: 'block', type: 'instance_selector' }
      ]
    },
    {
      kind: 'category',
      name: 'Logic',
      colour: '#4c97ff',
      contents: [
        { kind: 'block', type: 'lua_if' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_compare_eq' },
        { kind: 'block', type: 'logic_compare_lt' },
        { kind: 'block', type: 'logic_compare_gt' },
        { kind: 'block', type: 'logic_compare_neq' },
        { kind: 'block', type: 'logic_boolean_true' },
        { kind: 'block', type: 'logic_boolean_false' },
        { kind: 'block', type: 'logic_operation_and' },
        { kind: 'block', type: 'logic_operation_or' }
      ]
    },
    {
      kind: 'category',
      name: 'Loops',
      colour: '#48a868',
      contents: [
        { kind: 'block', type: 'wait' },
        { kind: 'block', type: 'loops_while_lua' },
        { kind: 'block', type: 'loops_repeat_lua' },
        { kind: 'block', type: 'loops_for_children' },
        { kind: 'block', type: 'loops_for_descendants' },
        { kind: 'block', type: 'loops_break_lua' }
      ]
    }
  ]
};
