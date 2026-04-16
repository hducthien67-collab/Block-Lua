import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';

interface BlocklyPreviewProps {
  blockType: string;
}

export const BlocklyPreview: React.FC<BlocklyPreviewProps> = ({ blockType }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!previewRef.current) return;

    // Clean up previous workspace
    if (workspaceRef.current) {
      try {
        workspaceRef.current.dispose();
      } catch (e) {
        console.warn("Error disposing workspace:", e);
      }
      workspaceRef.current = null;
    }

    // Inject new read-only workspace
    workspaceRef.current = Blockly.inject(previewRef.current, {
      readOnly: true,
      sounds: false,
      scrollbars: false,
      trashcan: false,
      renderer: 'custom_zelos',
      move: {
        scrollbars: false,
        drag: false,
        wheel: false
      },
      theme: Blockly.Theme.defineTheme('previewTheme', {
        name: 'previewTheme',
        base: Blockly.Themes.Classic,
        componentStyles: {
          workspaceBackgroundColour: 'transparent',
          toolboxBackgroundColour: 'transparent',
          toolboxForegroundColour: '#fff',
          flyoutBackgroundColour: '#252526',
          flyoutForegroundColour: '#ccc',
          flyoutOpacity: 1,
          scrollbarColour: '#797979',
          insertionMarkerColour: '#fff',
          insertionMarkerOpacity: 0.3,
          scrollbarOpacity: 0.4,
          cursorColour: '#d0d0d0'
        }
      })
    });

    // Create the block
    try {
      const block = workspaceRef.current.newBlock(blockType);
      block.initSvg();
      block.render();

      // Center the block
      const metrics = workspaceRef.current.getMetrics();
      const blockMetrics = block.getBoundingRectangle();
      
      const width = blockMetrics.right - blockMetrics.left;
      const height = blockMetrics.bottom - blockMetrics.top;
      
      const x = (metrics.viewWidth - width) / 2;
      const y = (metrics.viewHeight - height) / 2;
      
      block.moveBy(x, y);
    } catch (e) {
      console.error("Failed to render preview block:", e);
    }

    return () => {
      if (workspaceRef.current) {
        try {
          workspaceRef.current.dispose();
        } catch (e) {
          console.warn("Error disposing workspace:", e);
        }
        workspaceRef.current = null;
      }
    };
  }, [blockType]);

  return <div ref={previewRef} className="w-full h-full" />;
};
