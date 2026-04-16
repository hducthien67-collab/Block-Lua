import * as Blockly from 'blockly';

export const registerCustomContextMenu = (currentLang: string) => {
  const registry = Blockly.ContextMenuRegistry.registry;

  // Unregister default items to make it more Scratch-like
  if (registry.getItem('blockInline')) registry.unregister('blockInline');
  if (registry.getItem('blockCollapseExpand')) registry.unregister('blockCollapseExpand');
  if (registry.getItem('blockDisable')) registry.unregister('blockDisable');
  if (registry.getItem('blockComment')) registry.unregister('blockComment');

  // Remove unwanted workspace context menu items
  ['workspaceCollapse', 'collapseWorkspace', 'workspaceExpand', 'expandWorkspace', 'undoWorkspace', 'redoWorkspace'].forEach(id => {
    if (registry.getItem(id)) registry.unregister(id);
  });

  // Scratch-like duplication
  if (registry.getItem('blockDuplicate')) registry.unregister('blockDuplicate');
  registry.register({
    displayText: function() {
      return currentLang === 'vi' ? 'Bản sao' : 'Duplicate';
    },
    preconditionFn: function(scope: any) {
      if (scope.block && scope.block.isDeletable() && scope.block.isMovable()) {
        return 'enabled';
      }
      return 'hidden';
    },
    callback: function(scope: any) {
      const block = scope.block;
      if (!block) return;
      
      const workspace = block.workspace;
      Blockly.Events.setGroup(true);
      try {
        const xml = Blockly.Xml.blockToDom(block) as Element;
        const newBlock = Blockly.Xml.domToBlock(xml, workspace) as any;
        
        // Position it exactly where the original is
        const xy = (block as any).getRelativeToSurfaceXY();
        newBlock.moveBy(xy.x, xy.y);
        
        if (newBlock.select) newBlock.select();
        
        // We'll add a small offset so it's visible if not immediately moved.
        newBlock.moveBy(20, 20);
      } finally {
        Blockly.Events.setGroup(false);
      }
    },
    scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    id: 'blockDuplicate',
    weight: 1,
  });
};
