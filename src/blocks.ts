import { getCategoryColor } from './colors';
import * as Blockly from 'blockly';
import { defineServiceBlocks } from './serviceBlocks';

// Custom field for clickable variable labels
class FieldClickableVarLabel extends Blockly.FieldLabel {
  constructor(value: string, classNames?: string) {
    super(value, classNames);
    this.EDITABLE = true;
    this.SERIALIZABLE = true;
  }
  init() {
    super.init();
    if (this.textElement_) {
      this.textElement_.style.pointerEvents = 'auto';
      this.textElement_.style.cursor = 'pointer';
    }
  }
  isClickable() {
    return true;
  }
  showEditor_() {
    let workspace = this.getSourceBlock()?.workspace;
    if (!workspace) return;
    
    if ((workspace as any).isFlyout) {
      workspace = (workspace as any).targetWorkspace;
      if (!workspace) return;
    }
    
    const text = this.getText();
    const cleanText = text.replace('var. ', '').trim();
    
    let blockType = 'var_' + cleanText.replace(/^_/, '');
    if (!Blockly.Blocks[blockType]) {
      blockType = 'var_reporter';
    }
    
    Blockly.Events.setGroup(true);
    try {
      const newBlock = workspace.newBlock(blockType);
      if (newBlock) {
        newBlock.setFieldValue(cleanText, 'NAME');
        // Set color based on the text
        if (text.includes('_count') || text.includes('_child') || text.includes('_descendant')) {
          newBlock.setColour('#ff66cc');
        }
        (newBlock as any).initSvg();
        (newBlock as any).render();
        
        // Position it near the source block
        const sourceBlock = this.getSourceBlock();
        const xy = (sourceBlock as any).getRelativeToSurfaceXY();
        newBlock.moveBy(xy.x + 150, xy.y);
        (newBlock as any).select();
      }
    } finally {
      Blockly.Events.setGroup(false);
    }
  }
}
// Set it as editable so it responds to clicks
FieldClickableVarLabel.prototype.EDITABLE = true;

const createVarLabel = (name: string, _color: string) => {
  return new FieldClickableVarLabel(name, "scratch-var-label");
};

// Helper for variable autocomplete
export const addAutocomplete = (block: Blockly.Block, fieldName: string, suggestions: string[]) => {
  const varField = block.getField(fieldName);
  if (varField) {
    (varField as any).showEditor_ = function(this: any, e?: Event) {
      const workspace = this.getSourceBlock()?.workspace;
      if (!workspace) return;
      
      // Capture mouse position
      let mouseX: number | undefined;
      let mouseY: number | undefined;
      if (e instanceof MouseEvent) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
      
      // Standard editor
      (Blockly.FieldTextInput.prototype as any).showEditor_.call(this, e);
      
      // Custom dropdown overlay
      const htmlInput = (Blockly as any).FieldTextInput.htmlInput_ || 
                        document.querySelector('.blocklyHtmlInput') as HTMLInputElement;
      
      if (htmlInput) {
        // Ensure only one dropdown exists
        const existingDropdown = document.getElementById('autocomplete-dropdown');
        if (existingDropdown) {
          existingDropdown.remove();
        }

        const container = document.createElement('div');
        container.id = 'autocomplete-dropdown';
        container.style.position = 'fixed';
        container.style.zIndex = '20000';
        container.style.background = '#252525';
        container.style.backdropFilter = 'blur(10px)';
        (container.style as any).webkitBackdropFilter = 'blur(10px)';
        container.style.border = '1px solid rgba(255,255,255,0.1)';
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
        container.style.minWidth = '200px';
        container.style.padding = '8px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '6px';
        container.style.opacity = '0';
        container.style.transform = 'translateY(5px)';
        container.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
        container.style.fontFamily = 'Inter, sans-serif';
        
        // Search Header
        const searchWrapper = document.createElement('div');
        searchWrapper.style.padding = '4px';
        searchWrapper.style.position = 'sticky';
        searchWrapper.style.top = '0';
        searchWrapper.style.background = 'transparent';
        searchWrapper.style.zIndex = '1';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search...';
        searchInput.style.width = '100%';
        searchInput.style.padding = '8px 12px';
        searchInput.style.fontSize = '12px';
        searchInput.style.border = '1px solid rgba(255,255,255,0.05)';
        searchInput.style.borderRadius = '8px';
        searchInput.style.outline = 'none';
        searchInput.style.background = 'rgba(255,255,255,0.05)';
        searchInput.style.color = 'white';
        searchInput.style.transition = 'all 0.2s';
        
        searchInput.onfocus = () => {
          searchInput.style.borderColor = '#4c97ff';
          searchInput.style.background = 'rgba(255,255,255,0.08)';
          searchInput.style.boxShadow = '0 0 0 2px rgba(76, 151, 255, 0.2)';
        };
        searchInput.onblur = () => {
          searchInput.style.borderColor = 'rgba(255,255,255,0.05)';
          searchInput.style.background = 'rgba(255,255,255,0.05)';
          searchInput.style.boxShadow = 'none';
        };
        
        searchWrapper.appendChild(searchInput);
        container.appendChild(searchWrapper);

        const listContainer = document.createElement('div');
        listContainer.style.overflowY = 'auto';
        listContainer.style.maxHeight = '120px';
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'column';
        listContainer.style.gap = '2px';
        listContainer.style.padding = '2px';
        listContainer.style.scrollbarWidth = 'thin';
        listContainer.style.scrollbarColor = 'rgba(255,255,255,0.1) transparent';
        container.appendChild(listContainer);
        
        let selectedIndex = -1;
        const updateDropdown = (filter = '') => {
          listContainer.innerHTML = '';
          selectedIndex = -1;
          const searchTerm = filter.toLowerCase();
          
          const filtered = suggestions
            .filter(v => v.toLowerCase().includes(searchTerm))
            .sort((a, b) => {
              const aLow = a.toLowerCase();
              const bLow = b.toLowerCase();
              const aStarts = aLow.startsWith(searchTerm);
              const bStarts = bLow.startsWith(searchTerm);
              if (aStarts && !bStarts) return -1;
              if (!aStarts && bStarts) return 1;
              return aLow.localeCompare(bLow);
            });
          
          if (filtered.length === 0) {
            const item = document.createElement('div');
            item.textContent = filter === '' ? 'No matches found' : 'No matches found';
            item.style.padding = '16px';
            item.style.fontSize = '12px';
            item.style.color = '#666';
            item.style.fontStyle = 'italic';
            item.style.textAlign = 'center';
            listContainer.appendChild(item);
            return;
          }
          
          filtered.forEach((v, idx) => {
            const item = document.createElement('div');
            item.id = `autocomplete-item-${idx}`;
            
            // Highlight match
            if (searchTerm && v.toLowerCase().includes(searchTerm)) {
              const index = v.toLowerCase().indexOf(searchTerm);
              const before = v.substring(0, index);
              const match = v.substring(index, index + searchTerm.length);
              const after = v.substring(index + searchTerm.length);
              item.innerHTML = `${before}<span style="color: #4c97ff; font-weight: 700;">${match}</span>${after}`;
            } else {
              item.textContent = v;
            }
            
            // Dim 'workspace'
            if (v.toLowerCase() === 'workspace') {
              item.className = 'faded-placeholder-text';
            }
            
            item.style.padding = '10px 14px';
            item.style.cursor = 'pointer';
            item.style.fontSize = '13px';
            item.style.color = '#ccc';
            item.style.borderRadius = '8px';
            item.style.transition = 'all 0.2s';
            item.style.marginBottom = '1px';
            item.style.fontWeight = '500';
            
            const selectItem = () => {
              this.setValue(v);
              this.render_();
              (Blockly as any).WidgetDiv.hide();
            };

            item.onmouseover = () => {
              selectedIndex = idx;
              updateSelection();
            };
            item.onmouseout = () => {
              selectedIndex = -1;
              updateSelection();
            };
            item.onmousedown = (e) => {
              e.preventDefault();
              e.stopPropagation();
              selectItem();
            };
            listContainer.appendChild(item);
          });

          const updateSelection = () => {
            const items = listContainer.querySelectorAll('div[id^="autocomplete-item-"]');
            items.forEach((item: any, idx) => {
              if (idx === selectedIndex) {
                item.style.background = '#4c97ff';
                item.style.color = 'white';
                item.style.transform = 'translateX(4px)';
                item.scrollIntoView({ block: 'nearest' });
              } else {
                item.style.background = 'transparent';
                item.style.color = '#ccc';
                item.style.transform = 'translateX(0)';
              }
            });
          };

          (container as any).handleKey = (key: string) => {
            const items = listContainer.querySelectorAll('div[id^="autocomplete-item-"]');
            if (key === 'ArrowDown') {
              selectedIndex = (selectedIndex + 1) % items.length;
              updateSelection();
            } else if (key === 'ArrowUp') {
              selectedIndex = (selectedIndex - 1 + items.length) % items.length;
              updateSelection();
            } else if (key === 'Enter') {
              if (selectedIndex >= 0 && selectedIndex < filtered.length) {
                const v = filtered[selectedIndex];
                this.setValue(v);
                this.render_();
                (Blockly as any).WidgetDiv.hide();
              } else if (filtered.length > 0) {
                const v = filtered[0];
                this.setValue(v);
                this.render_();
                (Blockly as any).WidgetDiv.hide();
              } else {
                const v = searchInput.value;
                if (v) {
                  this.setValue(v);
                  this.render_();
                }
                (Blockly as any).WidgetDiv.hide();
              }
            }
          };
        };

        const positionDropdown = () => {
          const rect = htmlInput.getBoundingClientRect();
          container.style.minWidth = Math.max(220, rect.width) + 'px';
          
          let targetX = mouseX !== undefined ? mouseX : rect.left;
          let targetY = mouseY !== undefined ? mouseY + 10 : rect.bottom + 4;

          container.style.left = targetX + 'px';
          container.style.top = targetY + 'px';
          document.body.appendChild(container);
          
          const dropdownRect = container.getBoundingClientRect();
          
          if (targetX + dropdownRect.width > window.innerWidth) {
            container.style.left = (window.innerWidth - dropdownRect.width - 16) + 'px';
          }
          if (targetY + dropdownRect.height > window.innerHeight) {
            container.style.top = (targetY - dropdownRect.height - 20) + 'px';
          }

          requestAnimationFrame(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
          });
        };

        updateDropdown('');
        positionDropdown();
        
        setTimeout(() => searchInput.focus(), 50);

        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            (Blockly as any).WidgetDiv.hide();
          } else if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
            if ((container as any).handleKey) {
              e.preventDefault();
              (container as any).handleKey(e.key);
            }
          }
        });

        searchInput.addEventListener('input', (e: any) => {
          updateDropdown(e.target.value);
        });

        const inputHandler = (e: any) => {
          searchInput.value = e.target.value;
          updateDropdown(e.target.value);
        };
        htmlInput.addEventListener('input', inputHandler);

        const clickOutsideHandler = (e: Event) => {
          if (!container.contains(e.target as Node) && e.target !== htmlInput) {
            (Blockly as any).WidgetDiv.hide();
          }
        };
        window.addEventListener('mousedown', clickOutsideHandler, true);
        window.addEventListener('touchstart', clickOutsideHandler, true);
        window.addEventListener('wheel', clickOutsideHandler, true);

        const windowBlurHandler = () => {
          (Blockly as any).WidgetDiv.hide();
        };
        window.addEventListener('blur', windowBlurHandler);

        const oldHide = (Blockly as any).WidgetDiv.hide;
        (Blockly as any).WidgetDiv.hide = function() {
          htmlInput.removeEventListener('input', inputHandler);
          window.removeEventListener('mousedown', clickOutsideHandler, true);
          window.removeEventListener('touchstart', clickOutsideHandler, true);
          window.removeEventListener('wheel', clickOutsideHandler, true);
          window.removeEventListener('blur', windowBlurHandler);
          
          if (container.parentNode) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(10px)';
            setTimeout(() => {
              if (container.parentNode) container.parentNode.removeChild(container);
            }, 200);
          }
          
          (Blockly as any).WidgetDiv.hide = oldHide;
          oldHide.call(Blockly.WidgetDiv);
        };
      }
    };
  }
};

export const addVariableAutocomplete = (block: Blockly.Block, fieldName: string) => {
  const workspace = block.workspace;
  const vars = workspace.getAllBlocks(false)
    .filter(b => b.type === 'variables_create')
    .map(b => b.getFieldValue('VAR'))
    .filter((v, i, a) => v && a.indexOf(v) === i);
  addAutocomplete(block, fieldName, vars);
};

export const defineCustomBlocks = () => {
  // --- World Blocks ---
  Blockly.Blocks['world_game'] = {
    init: function() {
      this.appendDummyInput().appendField("game");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
    }
  };
  Blockly.Blocks['world_workspace'] = {
    init: function() {
      this.appendDummyInput().appendField("workspace");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
    }
  };
  Blockly.Blocks['world_me'] = {
    init: function() {
      this.appendDummyInput().appendField(new Blockly.FieldLabel("me", "faded-placeholder-text"));
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
    }
  };

  Blockly.Blocks['world_this_script'] = {
    init: function() {
      this.appendDummyInput().appendField("this script");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
    }
  };

  Blockly.Blocks['world_instance'] = {
    init: function() {
      const field = new Blockly.FieldTextInput("Instance", function(newValue: string) {
        const val = newValue === '' ? 'Instance' : newValue;
        if ((this as any).textElement_) {
          if (val === 'Instance') {
            (this as any).textElement_.style.fillOpacity = '0.5';
            (this as any).textElement_.style.fontStyle = 'italic';
          } else {
            (this as any).textElement_.style.fillOpacity = '1';
            (this as any).textElement_.style.fontStyle = 'normal';
          }
        }
        return val;
      });
      
      const originalInit = field.init;
      field.init = function() {
        originalInit.call(this);
        if ((this as any).textElement_) {
          if (this.getValue() === 'Instance') {
            (this as any).textElement_.style.fillOpacity = '0.5';
            (this as any).textElement_.style.fontStyle = 'italic';
          } else {
            (this as any).textElement_.style.fillOpacity = '1';
            (this as any).textElement_.style.fontStyle = 'normal';
          }
        }
      };
      
      // Custom click handler for the field
      (field as any).showEditor_ = function(e: Event) {
        if ((window as any).openInstanceSelector) {
          (window as any).openInstanceSelector(this.getSourceBlock()?.id);
        }
      };

      this.appendDummyInput()
          .appendField("Instance")
          .appendField(field, "INSTANCE");
      this.setOutput(true, "Instance");
      this.setColour(getCategoryColor('World'));
    }
  };

  Blockly.Blocks['world_set_property_direct'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("set")
          .appendField(new Blockly.FieldTextInput("Transparency"), "PROPERTY")
          .appendField("of");
      this.appendValueInput("INSTANCE")
          .setCheck(null);
      this.appendDummyInput().appendField("to");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_get_property_direct'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldTextInput("Name"), "PROPERTY")
          .appendField("of");
      this.appendValueInput("INSTANCE")
          .setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_find_first_child_direct'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("find")
          .appendField(new Blockly.FieldTextInput("Child"), "NAME")
          .appendField("in");
      this.appendValueInput("INSTANCE")
          .setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_vector3'] = {
    init: function() {
      this.appendDummyInput().appendField("vector3");
      this.appendValueInput("X").setCheck("Number").appendField("x");
      this.appendValueInput("Y").setCheck("Number").appendField("y");
      this.appendValueInput("Z").setCheck("Number").appendField("z");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_vector3_values'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("vector3")
          .appendField(new Blockly.FieldTextInput("0"), "X")
          .appendField(new Blockly.FieldTextInput("0"), "Y")
          .appendField(new Blockly.FieldTextInput("0"), "Z");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_get_instance_by_path'] = {
    init: function() {
      this.appendDummyInput().appendField("get instance by path");
      this.appendValueInput("PATH").setCheck("String");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_set_property'] = {
    init: function() {
      this.appendDummyInput().appendField("set");
      this.appendValueInput("PROPERTY").setCheck("String");
      this.appendDummyInput().appendField("of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField("to");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_get_property'] = {
    init: function() {
      this.appendDummyInput().appendField("get property");
      this.appendValueInput("PROPERTY").setCheck("String");
      this.appendDummyInput().appendField("of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_find_first_child'] = {
    init: function() {
      this.appendDummyInput().appendField("find");
      this.appendValueInput("NAME").setCheck("String");
      this.appendDummyInput().appendField("in");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_color3'] = {
    init: function() {
      this.appendDummyInput().appendField("color 3");
      this.appendValueInput("R").setCheck("Number").appendField("r (number)");
      this.appendValueInput("G").setCheck("Number").appendField("g (number)");
      this.appendValueInput("B").setCheck("Number").appendField("b (number)");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_color3_values'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("color 3")
          .appendField(new Blockly.FieldTextInput("0"), "R")
          .appendField(new Blockly.FieldTextInput("0"), "G")
          .appendField(new Blockly.FieldTextInput("0"), "B");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_create_instance_direct'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("create")
          .appendField(new Blockly.FieldTextInput("Part"), "CLASS")
          .appendField("in");
      this.appendValueInput("PARENT").setCheck(null);
      this.appendDummyInput().appendField(createVarLabel("var. _instance", getCategoryColor('World')), "VAR_LABEL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['world_clone_instance'] = {
    init: function() {
      this.appendDummyInput().appendField("clone");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(createVarLabel("var. _clone", getCategoryColor('World')), "VAR_LABEL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('World'));
      this.setInputsInline(true);
    }
  };

  defineServiceBlocks();
  // Sound Blocks
  // --- Part Blocks ---
  Blockly.Blocks['part_set_anchored'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(".Anchored =");
      this.appendValueInput("VALUE").setCheck("Boolean");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_set_cancollide'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(".CanCollide =");
      this.appendValueInput("VALUE").setCheck("Boolean");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_set_cantouch'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(".CanTouch =");
      this.appendValueInput("VALUE").setCheck("Boolean");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_set_castshadow'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(".CastShadow =");
      this.appendValueInput("VALUE").setCheck("Boolean");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_set_color'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(".Color =");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_set_orientation'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(".Orientation =");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_get_orientation'] = {
    init: function() {
      this.appendDummyInput().appendField("orientation of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_set_position'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(".Position =");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_get_position'] = {
    init: function() {
      this.appendDummyInput().appendField("position of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_set_size'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(".Size =");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_get_size'] = {
    init: function() {
      this.appendDummyInput().appendField("size of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_touched_by_part'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput()
          .appendField("touched by part")
          .appendField(createVarLabel("var. _touched_part", getCategoryColor('Part')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_touched_by_character'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput()
          .appendField("touched by character")
          .appendField(createVarLabel("var. _touched_part", getCategoryColor('Part')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['part_set_transparency'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(".Transparency =");
      this.appendValueInput("VALUE").setCheck("Number");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Part'));
      this.setInputsInline(true);
    }
  };

  // --- Math Blocks ---
  Blockly.Blocks['math_number_custom'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("number")
          .appendField(new Blockly.FieldTextInput("0"), "NUM");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Math'));
    }
  };

  Blockly.Blocks['math_arithmetic_add'] = {
    init: function() {
      this.appendValueInput("A").setCheck("Number");
      this.appendDummyInput().appendField("+");
      this.appendValueInput("B").setCheck("Number");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Math'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['math_random_custom'] = {
    init: function() {
      this.appendDummyInput().appendField("random from");
      this.appendValueInput("FROM").setCheck("Number");
      this.appendDummyInput().appendField("to");
      this.appendValueInput("TO").setCheck("Number");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Math'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['math_round'] = {
    init: function() {
      this.appendDummyInput().appendField("round");
      this.appendValueInput("NUM").setCheck("Number");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Math'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['math_abs'] = {
    init: function() {
      this.appendDummyInput().appendField("abs");
      this.appendValueInput("NUM").setCheck("Number");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Math'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['math_ceil'] = {
    init: function() {
      this.appendDummyInput().appendField("ceil");
      this.appendValueInput("NUM").setCheck("Number");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Math'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['math_floor'] = {
    init: function() {
      this.appendDummyInput().appendField("floor");
      this.appendValueInput("NUM").setCheck("Number");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Math'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['math_expr_1'] = {
    init: function() {
      this.appendValueInput("NUM").setCheck("Number");
      this.appendDummyInput().appendField(new Blockly.FieldTextInput("* 2 + 1"), "EXPR");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Math'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['math_expr_2'] = {
    init: function() {
      this.appendDummyInput().appendField(new Blockly.FieldTextInput("1 + 2 *"), "EXPR");
      this.appendValueInput("NUM").setCheck("Number");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Math'));
      this.setInputsInline(true);
    }
  };

  // --- Text Blocks ---
  Blockly.Blocks['text_string_custom'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("string")
          .appendField(new Blockly.FieldTextInput(""), "TEXT");
      this.setOutput(true, "String");
      this.setColour(getCategoryColor('Text'));
    }
  };

  Blockly.Blocks['text_join_custom'] = {
    init: function() {
      this.appendDummyInput().appendField("join");
      this.appendValueInput("A").setCheck("String");
      this.appendDummyInput().appendField("with");
      this.appendValueInput("B").setCheck("String");
      this.setOutput(true, "String");
      this.setColour(getCategoryColor('Text'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['text_length_custom'] = {
    init: function() {
      this.appendDummyInput().appendField("length of");
      this.appendValueInput("TEXT").setCheck("String");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Text'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['text_to_upper'] = {
    init: function() {
      this.appendDummyInput().appendField("to upper case");
      this.appendValueInput("TEXT").setCheck("String");
      this.setOutput(true, "String");
      this.setColour(getCategoryColor('Text'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['text_to_lower'] = {
    init: function() {
      this.appendDummyInput().appendField("to lower case");
      this.appendValueInput("TEXT").setCheck("String");
      this.setOutput(true, "String");
      this.setColour(getCategoryColor('Text'));
      this.setInputsInline(true);
    }
  };

  // --- Values Blocks ---
  Blockly.Blocks['values_to_string'] = {
    init: function() {
      this.appendValueInput("VALUE").setCheck(null);
      this.appendDummyInput().appendField("to string");
      this.setOutput(true, "String");
      this.setColour(getCategoryColor('Values'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['values_to_number'] = {
    init: function() {
      this.appendValueInput("VALUE").setCheck(null);
      this.appendDummyInput().appendField("to number");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Values'));
      this.setInputsInline(true);
    }
  };

  // --- Variables Blocks ---
  Blockly.Blocks['variables_create'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("variable create")
          .appendField(new Blockly.FieldTextInput("x"), "VAR")
          .appendField("with value");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Variables'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['variables_set_custom'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("variable set")
          .appendField(new Blockly.FieldTextInput("x"), "VAR")
          .appendField("to");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Variables'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['variables_change_custom'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("variable change")
          .appendField(new Blockly.FieldTextInput("x"), "VAR")
          .appendField("by");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Variables'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['variables_get_custom'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("variable")
          .appendField(new Blockly.FieldTextInput("x"), "VAR");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Variables'));
    }
  };

  // --- Lists Blocks ---
  Blockly.Blocks['lists_empty'] = {
    init: function() {
      this.appendDummyInput().appendField("empty list");
      this.setOutput(true, "Array");
      this.setColour(getCategoryColor('Lists'));
    }
  };

  Blockly.Blocks['lists_set_item'] = {
    init: function() {
      this.appendDummyInput().appendField("set item");
      this.appendValueInput("INDEX").setCheck("Number");
      this.appendDummyInput().appendField("of");
      this.appendValueInput("LIST").setCheck(null);
      this.appendDummyInput().appendField("to");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Lists'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['lists_get_item'] = {
    init: function() {
      this.appendDummyInput().appendField("item");
      this.appendValueInput("INDEX").setCheck("Number");
      this.appendDummyInput().appendField("of");
      this.appendValueInput("LIST").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Lists'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['lists_insert'] = {
    init: function() {
      this.appendDummyInput().appendField("insert");
      this.appendValueInput("ITEM").setCheck(null);
      this.appendDummyInput().appendField("to");
      this.appendValueInput("LIST").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Lists'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['lists_remove'] = {
    init: function() {
      this.appendDummyInput().appendField("remove item");
      this.appendValueInput("INDEX").setCheck("Number");
      this.appendDummyInput().appendField("from");
      this.appendValueInput("LIST").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Lists'));
      this.setInputsInline(true);
    }
  };

  // --- Loops Blocks ---
  Blockly.Blocks['loops_while_lua'] = {
    init: function() {
      this.appendValueInput("CONDITION")
          .setCheck(null)
          .appendField("while")
          .appendField("do");
      this.appendStatementInput("DO");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Loops'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['loops_repeat_lua'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("repeat")
          .appendField(createVarLabel("var. _count", getCategoryColor('Loops')), "VAR_LABEL");
      this.appendDummyInput().appendField("from");
      this.appendValueInput("FROM").setCheck("Number");
      this.appendDummyInput().appendField("to");
      this.appendValueInput("TO").setCheck("Number")
          .appendField("do");
      this.appendStatementInput("DO");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Loops'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['loops_for_children'] = {
    init: function() {
      this.appendDummyInput().appendField("loop through children of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(createVarLabel("var. _child", getCategoryColor('Loops')), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Loops'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['loops_for_descendants'] = {
    init: function() {
      this.appendDummyInput().appendField("loop through descendants of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(createVarLabel("var. _descendant", getCategoryColor('Loops')), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Loops'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['loops_break_lua'] = {
    init: function() {
      this.appendDummyInput().appendField("break this loop");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Loops'));
    }
  };

  // Special reporter blocks for the "var." labels
  Blockly.Blocks['var_reporter'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("var.")
          .appendField(new Blockly.FieldTextInput("name"), "NAME");
      this.setOutput(true, null);
      this.setColour("#ff66cc"); // Pink color
    }
  };

  // Placeholder blocks for inputs (Shadows)
  Blockly.Blocks['placeholder_string'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("string", "faded-placeholder-text"));
      this.setOutput(true, "String");
      this.setColour("#3d99b8");
    },
    saveExtraState: function() {
      return { 'color': this.getColour() };
    },
    loadExtraState: function(state: any) {
      if (state && state['color']) {
        this.setColour(state['color']);
      }
    }
  };
  Blockly.Blocks['placeholder_number'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("number", "faded-placeholder-text"));
      this.setOutput(true, "Number");
      this.setColour("#666666");
    },
    saveExtraState: function() {
      return { 'color': this.getColour() };
    },
    loadExtraState: function(state: any) {
      if (state && state['color']) {
        this.setColour(state['color']);
      }
    }
  };
  Blockly.Blocks['placeholder_boolean'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("true/false", "faded-placeholder-text"));
      this.setOutput(true, "Boolean");
      this.setColour("#4c97ff");
    },
    saveExtraState: function() {
      return { 'color': this.getColour() };
    },
    loadExtraState: function(state: any) {
      if (state && state['color']) {
        this.setColour(state['color']);
      }
    }
  };
  Blockly.Blocks['placeholder_color3'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("color3", "faded-placeholder-text"));
      this.setOutput(true, null);
      this.setColour("#666666");
    },
    saveExtraState: function() {
      return { 'color': this.getColour() };
    },
    loadExtraState: function(state: any) {
      if (state && state['color']) {
        this.setColour(state['color']);
      }
    }
  };
  Blockly.Blocks['placeholder_vector3'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("vector3", "faded-placeholder-text"));
      this.setOutput(true, null);
      this.setColour("#666666");
    },
    saveExtraState: function() {
      return { 'color': this.getColour() };
    },
    loadExtraState: function(state: any) {
      if (state && state['color']) {
        this.setColour(state['color']);
      }
    }
  };
  Blockly.Blocks['placeholder_instance'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("Instance", "faded-placeholder-text"));
      this.setOutput(true, null);
      this.setColour("#3d79cc");
    },
    saveExtraState: function() {
      return { 'color': this.getColour() };
    },
    loadExtraState: function(state: any) {
      if (state && state['color']) {
        this.setColour(state['color']);
      }
    }
  };
  Blockly.Blocks['placeholder_index'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("index", "faded-placeholder-text"));
      this.setOutput(true, "Number");
      this.setColour("#a61022");
    },
    saveExtraState: function() {
      return { 'color': this.getColour() };
    },
    loadExtraState: function(state: any) {
      if (state && state['color']) {
        this.setColour(state['color']);
      }
    }
  };
  Blockly.Blocks['placeholder_variable'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("variable", "faded-placeholder-text"));
      this.setOutput(true, null);
      this.setColour("#cc5214");
    },
    saveExtraState: function() {
      return { 'color': this.getColour() };
    },
    loadExtraState: function(state: any) {
      if (state && state['color']) {
        this.setColour(state['color']);
      }
    }
  };
  Blockly.Blocks['placeholder_any'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("any", "faded-placeholder-text"));
      this.setOutput(true, null);
      this.setColour("#3d99b8");
    },
    saveExtraState: function() {
      return { 'color': this.getColour() };
    },
    loadExtraState: function(state: any) {
      if (state && state['color']) {
        this.setColour(state['color']);
      }
    }
  };
  Blockly.Blocks['placeholder_condition'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("condition", "faded-placeholder-text"));
      this.setOutput(true, null);
      this.setColour("#3d79cc");
    },
    saveExtraState: function() {
      return { 'color': this.getColour() };
    },
    loadExtraState: function(state: any) {
      if (state && state['color']) {
        this.setColour(state['color']);
      }
    }
  };

  // --- Character Blocks ---
  Blockly.Blocks['character_is_climbing'] = {
    init: function() {
      this.appendValueInput("HUMANOID")
          .setCheck(null)
          .appendField("is climbing")
          .appendField(createVarLabel("var. _climb_speed", getCategoryColor('Character')), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_damage'] = {
    init: function() {
      this.appendDummyInput().appendField("damage");
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField("by");
      this.appendValueInput("NUMBER").setCheck("Number");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_died'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField("died");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_equip_tool'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField("equip tool:");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_get_humanoid'] = {
    init: function() {
      this.appendDummyInput().appendField("get humanoid from model");
      this.appendValueInput("MODEL").setCheck(null);
      this.appendDummyInput().appendField(createVarLabel("var. _humanoid", getCategoryColor('Character')), "VAR_LABEL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_get_model_from_humanoid'] = {
    init: function() {
      this.appendDummyInput().appendField("get model from humanoid");
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField(createVarLabel("var. _character_model", getCategoryColor('Character')), "VAR_LABEL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_set_health'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField(".Health =");
      this.appendValueInput("VALUE").setCheck("Number");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_health_changed'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField("Health changed");
      this.appendDummyInput().appendField(createVarLabel("var. _new_health", getCategoryColor('Character')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_jump'] = {
    init: function() {
      this.appendDummyInput().appendField("jump");
      this.appendValueInput("HUMANOID").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_set_jump_height'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField(".JumpHeight =");
      this.appendValueInput("VALUE").setCheck("Number");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_set_jump_power'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField(".JumpPower =");
      this.appendValueInput("VALUE").setCheck("Number");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_kill'] = {
    init: function() {
      this.appendDummyInput().appendField("kill");
      this.appendValueInput("HUMANOID").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_set_max_health'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField(".MaxHealth =");
      this.appendValueInput("VALUE").setCheck("Number");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_move_to'] = {
    init: function() {
      this.appendDummyInput().appendField("move");
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField("to");
      this.appendValueInput("POSITION").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_finished_moving'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField("finished moving");
      this.appendDummyInput().appendField(createVarLabel("var. _reached_goal", getCategoryColor('Character')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_player_of'] = {
    init: function() {
      this.appendDummyInput().appendField("player of");
      this.appendValueInput("CHARACTER").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_unequip_tool'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField("unequip tool");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['character_set_walk_speed'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck(null);
      this.appendDummyInput().appendField(".WalkSpeed =");
      this.appendValueInput("VALUE").setCheck("Number");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Character'));
      this.setInputsInline(true);
    }
  };

  // --- Model Blocks ---
  Blockly.Blocks['model_break_joints'] = {
    init: function() {
      this.appendDummyInput().appendField("break joints of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Model'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['model_get_orientation'] = {
    init: function() {
      this.appendDummyInput().appendField("orientation of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Model'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['model_get_position'] = {
    init: function() {
      this.appendDummyInput().appendField("position of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Model'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['model_get_size'] = {
    init: function() {
      this.appendDummyInput().appendField("size of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Model'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['model_set_primary_part'] = {
    init: function() {
      this.appendDummyInput().appendField("set primary part of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField("to");
      this.appendValueInput("PART").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Model'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['model_set_orientation'] = {
    init: function() {
      this.appendDummyInput().appendField("set orientation of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField("to");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Model'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['model_set_position'] = {
    init: function() {
      this.appendDummyInput().appendField("set position of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField("to");
      this.appendValueInput("VALUE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Model'));
      this.setInputsInline(true);
    }
  };

  // --- Gui Blocks ---
  Blockly.Blocks['gui_get_mouse'] = {
    init: function() {
      this.appendDummyInput().appendField("get mouse");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Gui'));
    }
  };
  Blockly.Blocks['gui_get_player_gui'] = {
    init: function() {
      this.appendDummyInput().appendField("get PlayerGui of");
      this.appendValueInput("PLAYER").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_new_instance'] = {
    init: function() {
      this.appendDummyInput().appendField("new Gui Instance")
          .appendField(new Blockly.FieldTextInput("ScreenGui"), "CLASS");
      this.appendValueInput("PARENT").setCheck(null).appendField("parented to");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_button_clicked'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField("(gui button) clicked");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_input_began'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField("input began");
      this.appendDummyInput().appendField(createVarLabel("var. _input", getCategoryColor('Gui')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_input_ended'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField("input ended");
      this.appendDummyInput().appendField(createVarLabel("var. _input", getCategoryColor('Gui')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_is_left_mouse'] = {
    init: function() {
      this.appendDummyInput().appendField("if");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("is left mouse button");
      this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Gui')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_is_middle_mouse'] = {
    init: function() {
      this.appendDummyInput().appendField("if");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("is middle mouse button");
      this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Gui')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_is_right_mouse'] = {
    init: function() {
      this.appendDummyInput().appendField("if");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("is right mouse button");
      this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Gui')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_is_touch'] = {
    init: function() {
      this.appendDummyInput().appendField("if");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("is touch");
      this.appendDummyInput().appendField(createVarLabel("var. _touch_input", getCategoryColor('Gui')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_mouse_position'] = {
    init: function() {
      this.appendDummyInput().appendField("mouse input");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("position");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_set_invisible'] = {
    init: function() {
      this.appendDummyInput().appendField("invisible");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_set_visible'] = {
    init: function() {
      this.appendDummyInput().appendField("visible");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['gui_touch_position'] = {
    init: function() {
      this.appendDummyInput().appendField("touch input");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("position");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Gui'));
      this.setInputsInline(true);
    }
  };

  // --- Player Blocks ---
  Blockly.Blocks['player_get_character'] = {
    init: function() {
      this.appendDummyInput().appendField("character of");
      this.appendValueInput("PLAYER").setCheck(null);
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Player'));
      this.setInputsInline(true);
    }
  };
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
      this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Player')), "VAR_LABEL");
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
      this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Player')), "VAR_LABEL");
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
      this.appendDummyInput().appendField(createVarLabel("var. message", getCategoryColor('Player')), "VAR_LABEL");
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
      this.appendDummyInput().appendField(createVarLabel("var. character", getCategoryColor('Player')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Player'));
      this.setInputsInline(true);
    }
  };

  // --- Clickdetector Blocks ---
  Blockly.Blocks['clickdetector_add'] = {
    init: function() {
      this.appendDummyInput().appendField("add click detector to");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(createVarLabel("var. _click_detector", getCategoryColor('Clickdetector')), "VAR_LABEL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Clickdetector'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['clickdetector_clicked'] = {
    init: function() {
      this.appendValueInput("CLICK_DETECTOR").setCheck(null);
      this.appendDummyInput().appendField("clicked");
      this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Clickdetector')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Clickdetector'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['clickdetector_hover_enter'] = {
    init: function() {
      this.appendValueInput("CLICK_DETECTOR").setCheck(null);
      this.appendDummyInput().appendField("hover enter");
      this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Clickdetector')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Clickdetector'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['clickdetector_hover_leave'] = {
    init: function() {
      this.appendValueInput("CLICK_DETECTOR").setCheck(null);
      this.appendDummyInput().appendField("hover leave");
      this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Clickdetector')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Clickdetector'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['clickdetector_right_clicked'] = {
    init: function() {
      this.appendValueInput("CLICK_DETECTOR").setCheck(null);
      this.appendDummyInput().appendField("right clicked");
      this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Clickdetector')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Clickdetector'));
      this.setInputsInline(true);
    }
  };

  // --- Marketplace Blocks ---
  Blockly.Blocks['marketplace_owns_asset'] = {
    init: function() {
      this.appendDummyInput().appendField("does");
      this.appendValueInput("PLAYER").setCheck(null);
      this.appendDummyInput().appendField("owns asset");
      this.appendValueInput("ASSET_ID").setCheck(null);
      this.appendDummyInput().appendField("?");
      this.setOutput(true, "Boolean");
      this.setColour(getCategoryColor('Marketplace'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['marketplace_owns_gamepass'] = {
    init: function() {
      this.appendDummyInput().appendField("does");
      this.appendValueInput("PLAYER").setCheck(null);
      this.appendDummyInput().appendField("owns gamepass");
      this.appendValueInput("GAMEPASS_ID").setCheck(null);
      this.appendDummyInput().appendField("?");
      this.setOutput(true, "Boolean");
      this.setColour(getCategoryColor('Marketplace'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['marketplace_product_bought'] = {
    init: function() {
      this.appendDummyInput().appendField("product bought");
      this.appendDummyInput().appendField(createVarLabel("var. _player", getCategoryColor('Marketplace')), "VAR_LABEL_PLAYER");
      this.appendDummyInput().appendField(createVarLabel("var. _productId", getCategoryColor('Marketplace')), "VAR_LABEL_PRODUCT");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Marketplace'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['marketplace_prompt_asset'] = {
    init: function() {
      this.appendDummyInput().appendField("prompt asset");
      this.appendValueInput("ASSET_ID").setCheck(null);
      this.appendDummyInput().appendField("purchase to");
      this.appendValueInput("PLAYER").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Marketplace'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['marketplace_prompt_gamepass'] = {
    init: function() {
      this.appendDummyInput().appendField("prompt game pass");
      this.appendValueInput("GAMEPASS_ID").setCheck(null);
      this.appendDummyInput().appendField("purchase to");
      this.appendValueInput("PLAYER").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Marketplace'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['marketplace_prompt_product'] = {
    init: function() {
      this.appendDummyInput().appendField("prompt product");
      this.appendValueInput("PRODUCT_ID").setCheck(null);
      this.appendDummyInput().appendField("purchase to");
      this.appendValueInput("PLAYER").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Marketplace'));
      this.setInputsInline(true);
    }
  };

  // --- Tweening Blocks ---
  Blockly.Blocks['tween_animate'] = {
    init: function() {
      this.appendDummyInput().appendField("tween");
      this.appendValueInput("PROPERTY").setCheck("String");
      this.appendDummyInput().appendField("of");
      this.appendValueInput("INSTANCE").setCheck(null);
      this.appendDummyInput().appendField(":");
      this.appendValueInput("GOAL").setCheck(null);
      this.appendValueInput("TWEEN_INFO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Tweening'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['tween_info_create'] = {
    init: function() {
      const styleField = new Blockly.FieldDropdown([
        ["Linear", "Linear"],
        ["Sine", "Sine"],
        ["Back", "Back"],
        ["Quad", "Quad"],
        ["Quart", "Quart"],
        ["Quint", "Quint"],
        ["Bounce", "Bounce"],
        ["Elastic", "Elastic"],
        ["Exponential", "Exponential"],
        ["Circular", "Circular"],
        ["Cubic", "Cubic"]
      ]);

      const directionField = new Blockly.FieldDropdown([
        ["In", "In"],
        ["Out", "Out"],
        ["InOut", "InOut"]
      ]);

      this.appendDummyInput().appendField("tween info: time");
      this.appendValueInput("TIME").setCheck("Number");
      this.appendDummyInput()
          .appendField("easing style")
          .appendField(styleField, "STYLE");
      this.appendDummyInput()
          .appendField("easing direction")
          .appendField(directionField, "DIRECTION");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Tweening'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['placeholder_humanoid'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("humanoid", "faded-placeholder-text"));
      this.setOutput(true, null);
      this.setColour("#ff3355");
    }
  };
  Blockly.Blocks['placeholder_player'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabel("player", "faded-placeholder-text"));
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Player'));
    }
  };

  // --- Client Blocks ---
  Blockly.Blocks['client_fire_server'] = {
    init: function() {
      this.appendDummyInput().appendField("fire server");
      this.appendValueInput("EVENT").setCheck(null).appendField("remote event");
      this.appendValueInput("DATA").setCheck(null).appendField("data to send");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Client'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['client_input_began'] = {
    init: function() {
      this.appendDummyInput().appendField("user input began");
      this.appendDummyInput().appendField(createVarLabel("var. _input", getCategoryColor('Client')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Client'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['client_input_ended'] = {
    init: function() {
      this.appendDummyInput().appendField("user input ended");
      this.appendDummyInput().appendField(createVarLabel("var. _input", getCategoryColor('Client')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Client'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['client_is_keyboard'] = {
    init: function() {
      this.appendDummyInput().appendField("if");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("is keyboard");
      this.appendDummyInput().appendField(createVarLabel("var. _key_input", getCategoryColor('Client')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Client'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['client_is_left_mouse'] = {
    init: function() {
      this.appendDummyInput().appendField("if");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("is left mouse button");
      this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Client')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Client'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['client_is_middle_mouse'] = {
    init: function() {
      this.appendDummyInput().appendField("if");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("is middle mouse button");
      this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Client')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Client'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['client_is_right_mouse'] = {
    init: function() {
      this.appendDummyInput().appendField("if");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("is right mouse button");
      this.appendDummyInput().appendField(createVarLabel("var. _mouse_input", getCategoryColor('Client')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Client'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['client_is_touch'] = {
    init: function() {
      this.appendDummyInput().appendField("if");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("is touch");
      this.appendDummyInput().appendField(createVarLabel("var. _touch_input", getCategoryColor('Client')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Client'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['client_key_is'] = {
    init: function() {
      const keyField = new Blockly.FieldDropdown([
        ["Space", "Space"], ["W", "W"], ["A", "A"], ["S", "S"], ["D", "D"],
        ["Q", "Q"], ["E", "E"], ["R", "R"], ["T", "T"], ["Y", "Y"],
        ["U", "U"], ["I", "I"], ["O", "O"], ["P", "P"], ["F", "F"],
        ["G", "G"], ["H", "H"], ["J", "J"], ["K", "K"], ["L", "L"],
        ["Z", "Z"], ["X", "X"], ["C", "C"], ["V", "V"], ["B", "B"],
        ["N", "N"], ["M", "M"], ["Up", "Up"], ["Down", "Down"],
        ["Left", "Left"], ["Right", "Right"], ["Return", "Return"],
        ["Escape", "Escape"], ["Tab", "Tab"], ["LeftShift", "LeftShift"],
        ["RightShift", "RightShift"], ["LeftControl", "LeftControl"],
        ["RightControl", "RightControl"], ["LeftAlt", "LeftAlt"],
        ["RightAlt", "RightAlt"]
      ]);

      this.appendDummyInput().appendField("if key");
      this.appendValueInput("KEY").setCheck(null);
      this.appendDummyInput()
          .appendField("is")
          .appendField(keyField, "KEY_NAME");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Client'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['client_local_player'] = {
    init: function() {
      this.appendDummyInput().appendField("local player");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Client'));
    }
  };
  Blockly.Blocks['client_mouse_position'] = {
    init: function() {
      this.appendDummyInput().appendField("mouse input");
      this.appendValueInput("INPUT").setCheck(null);
      this.appendDummyInput().appendField("position");
      this.setOutput(true, null);
      this.setColour(getCategoryColor('Client'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['client_fired_by_server'] = {
    init: function() {
      this.appendDummyInput().appendField("fired by server");
      this.appendValueInput("EVENT").setCheck(null).appendField("remote event");
      this.appendDummyInput().appendField(createVarLabel("var. _received_data", getCategoryColor('Client')), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Client'));
      this.setInputsInline(true);
    }
  };

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
      this.appendValueInput("SOUND")
          .setCheck("Instance")
          .appendField("on sound ended")
          .appendField("do");
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

  // Logic
  Blockly.Blocks['lua_if'] = {
    init: function() {
      this.appendValueInput("CONDITION")
          .setCheck("Boolean")
          .appendField("if")
          .appendField("then");
      this.appendStatementInput("DO");
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
      this.appendDummyInput().appendField(createVarLabel("var. _player", ""), "VAR_LABEL");
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
      this.appendDummyInput().appendField(createVarLabel("var. _player", ""), "VAR_LABEL");
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
      this.appendDummyInput().appendField(createVarLabel("var. message", ""), "VAR_LABEL");
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
      this.appendDummyInput().appendField(createVarLabel("var. character", ""), "VAR_LABEL");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Player'));
      this.setInputsInline(true);
    }
  };

  Blockly.Blocks['event_game_start'] = {
    init: function() {
      this.appendDummyInput().appendField("when game start").appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
    }
  };
  Blockly.Blocks['event_clicked'] = {
    init: function() {
      this.appendDummyInput().appendField("when");
      this.appendValueInput("CLICK_DETECTOR").setCheck(null);
      this.appendDummyInput()
          .appendField("is clicked")
          .appendField(createVarLabel("var. player", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_value_changed'] = {
    init: function() {
      this.appendDummyInput().appendField("when value of");
      this.appendValueInput("VALUE").setCheck(null);
      this.appendDummyInput()
          .appendField("changed")
          .appendField(createVarLabel("var. value", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_game_loaded'] = {
    init: function() {
      this.appendDummyInput().appendField("on game loaded").appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_player_joined'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("on player joined")
          .appendField(createVarLabel("var. player", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_player_left'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("on player left")
          .appendField(createVarLabel("var. player", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_character_added'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("on character added")
          .appendField(createVarLabel("var. character", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_character_removing'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("on character removing")
          .appendField(createVarLabel("var. character", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_touched'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck("Instance").appendField("on");
      this.appendDummyInput()
          .appendField("touched")
          .appendField(createVarLabel("var. otherPart", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_touch_ended'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck("Instance").appendField("on");
      this.appendDummyInput()
          .appendField("touch ended")
          .appendField(createVarLabel("var. otherPart", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_child_added'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck("Instance").appendField("on child added to");
      this.appendDummyInput()
          .appendField(createVarLabel("var. child", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_child_removed'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck("Instance").appendField("on child removed from");
      this.appendDummyInput()
          .appendField(createVarLabel("var. child", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_property_changed'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck("Instance").appendField("on property changed of");
      this.appendDummyInput()
          .appendField(createVarLabel("var. property", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_remote_event_fired'] = {
    init: function() {
      this.appendValueInput("REMOTE").setCheck("Instance").appendField("on remote event fired");
      this.appendDummyInput()
          .appendField(createVarLabel("var. player", ""), "VAR_LABEL_PLAYER")
          .appendField(createVarLabel("var. data", ""), "VAR_LABEL_DATA")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_remote_function_called'] = {
    init: function() {
      this.appendValueInput("REMOTE").setCheck("Instance").appendField("on remote function called");
      this.appendDummyInput()
          .appendField(createVarLabel("var. player", ""), "VAR_LABEL_PLAYER")
          .appendField(createVarLabel("var. data", ""), "VAR_LABEL_DATA")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_proximity_prompt_triggered'] = {
    init: function() {
      this.appendValueInput("PROMPT").setCheck("Instance").appendField("on proximity prompt triggered");
      this.appendDummyInput()
          .appendField(createVarLabel("var. player", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_tool_equipped'] = {
    init: function() {
      this.appendValueInput("TOOL").setCheck("Instance").appendField("on tool equipped");
      this.appendDummyInput()
          .appendField(createVarLabel("var. character", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_tool_unequipped'] = {
    init: function() {
      this.appendValueInput("TOOL").setCheck("Instance").appendField("on tool unequipped");
      this.appendDummyInput()
          .appendField(createVarLabel("var. character", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_humanoid_died'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck("Instance").appendField("on humanoid died");
      this.appendDummyInput()
          .appendField(createVarLabel("var. humanoid", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_humanoid_jumping'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck("Instance").appendField("on humanoid jumping");
      this.appendDummyInput()
          .appendField(createVarLabel("var. active", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_humanoid_running'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck("Instance").appendField("on humanoid running");
      this.appendDummyInput()
          .appendField(createVarLabel("var. speed", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_heartbeat'] = {
    init: function() {
      this.appendDummyInput().appendField("on heartbeat").appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_render_stepped'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("on render stepped")
          .appendField(createVarLabel("var. deltaTime", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_stepped'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("on stepped")
          .appendField(createVarLabel("var. time", ""), "VAR_LABEL_TIME")
          .appendField(createVarLabel("var. deltaTime", ""), "VAR_LABEL_DT")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_chat_message_received'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("on chat message received")
          .appendField(createVarLabel("var. player", ""), "VAR_LABEL_PLAYER")
          .appendField(createVarLabel("var. message", ""), "VAR_LABEL_MESSAGE")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['event_attribute_changed'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck("Instance").appendField("on attribute changed of");
      this.appendDummyInput()
          .appendField(createVarLabel("var. attributeName", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Events'));
      this.setInputsInline(true);
    }
  };

  // --- Camera Blocks ---
  Blockly.Blocks['camera_get_current'] = {
    init: function() {
      this.appendDummyInput().appendField("get current camera");
      this.setOutput(true, "Instance");
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_set_type'] = {
    init: function() {
      this.appendDummyInput().appendField("set camera type to")
          .appendField(new Blockly.FieldDropdown([
            ["Fixed", "Fixed"],
            ["Watch", "Watch"],
            ["Attach", "Attach"],
            ["Track", "Track"],
            ["Follow", "Follow"],
            ["Custom", "Custom"],
            ["Scriptable", "Scriptable"]
          ]), "TYPE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_set_subject'] = {
    init: function() {
      this.appendValueInput("SUBJECT").setCheck("Instance").appendField("set camera subject to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_set_cframe'] = {
    init: function() {
      this.appendValueInput("CFRAME").setCheck("CFrame").appendField("set camera CFrame to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_get_cframe'] = {
    init: function() {
      this.appendDummyInput().appendField("get camera CFrame");
      this.setOutput(true, "CFrame");
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_move_to'] = {
    init: function() {
      this.appendValueInput("POSITION").setCheck("Vector3").appendField("move camera to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_look_at'] = {
    init: function() {
      this.appendValueInput("TARGET").setCheck("Vector3").appendField("camera look at");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_shake'] = {
    init: function() {
      this.appendDummyInput().appendField("shake camera");
      this.appendValueInput("INTENSITY").setCheck("Number").appendField("intensity");
      this.appendValueInput("DURATION").setCheck("Number").appendField("duration");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Camera'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['camera_zoom'] = {
    init: function() {
      this.appendValueInput("DISTANCE").setCheck("Number").appendField("zoom camera to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_set_fov'] = {
    init: function() {
      this.appendValueInput("FOV").setCheck("Number").appendField("set field of view to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_get_fov'] = {
    init: function() {
      this.appendDummyInput().appendField("get field of view");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_follow_player'] = {
    init: function() {
      this.appendValueInput("PLAYER").setCheck("Instance").appendField("camera follow player");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_scriptable'] = {
    init: function() {
      this.appendDummyInput().appendField("set camera to scriptable mode");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Camera'));
    }
  };
  Blockly.Blocks['camera_reset'] = {
    init: function() {
      this.appendDummyInput().appendField("reset camera");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Camera'));
    }
  };

  // --- Animation Blocks ---
  Blockly.Blocks['animation_load'] = {
    init: function() {
      this.appendValueInput("ANIM_ID").setCheck("String").appendField("load animation");
      this.appendValueInput("HUMANOID").setCheck("Instance").appendField("on");
      this.setOutput(true, "Instance");
      this.setColour(getCategoryColor('Animation'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['animation_play'] = {
    init: function() {
      this.appendValueInput("ANIM_TRACK").setCheck("Instance").appendField("play animation");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Animation'));
    }
  };
  Blockly.Blocks['animation_stop'] = {
    init: function() {
      this.appendValueInput("ANIM_TRACK").setCheck("Instance").appendField("stop animation");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Animation'));
    }
  };
  Blockly.Blocks['animation_pause'] = {
    init: function() {
      this.appendValueInput("ANIM_TRACK").setCheck("Instance").appendField("pause animation");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Animation'));
    }
  };
  Blockly.Blocks['animation_adjust_speed'] = {
    init: function() {
      this.appendValueInput("ANIM_TRACK").setCheck("Instance").appendField("adjust animation");
      this.appendValueInput("SPEED").setCheck("Number").appendField("speed to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Animation'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['animation_adjust_weight'] = {
    init: function() {
      this.appendValueInput("ANIM_TRACK").setCheck("Instance").appendField("adjust animation");
      this.appendValueInput("WEIGHT").setCheck("Number").appendField("weight to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Animation'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['animation_get_playing'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck("Instance").appendField("get playing animations on");
      this.setOutput(true, "Array");
      this.setColour(getCategoryColor('Animation'));
    }
  };
  Blockly.Blocks['animation_stopped_event'] = {
    init: function() {
      this.appendValueInput("ANIM_TRACK")
          .setCheck("Instance")
          .appendField("on animation stopped")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Animation'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['animation_played_event'] = {
    init: function() {
      this.appendValueInput("HUMANOID").setCheck("Instance").appendField("on animation played on");
      this.appendDummyInput()
          .appendField(createVarLabel("var. animTrack", ""), "VAR_LABEL")
          .appendField("do");
      this.appendStatementInput("DO").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Animation'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['animation_set_priority'] = {
    init: function() {
      this.appendValueInput("ANIM_TRACK").setCheck("Instance").appendField("set animation");
      this.appendDummyInput().appendField("priority to")
          .appendField(new Blockly.FieldDropdown([
            ["Core", "Enum.AnimationPriority.Core"],
            ["Idle", "Enum.AnimationPriority.Idle"],
            ["Movement", "Enum.AnimationPriority.Movement"],
            ["Action", "Enum.AnimationPriority.Action"],
            ["Action2", "Enum.AnimationPriority.Action2"],
            ["Action3", "Enum.AnimationPriority.Action3"],
            ["Action4", "Enum.AnimationPriority.Action4"]
          ]), "PRIORITY");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Animation'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['animation_get_length'] = {
    init: function() {
      this.appendValueInput("ANIM_TRACK").setCheck("Instance").appendField("get animation length");
      this.setOutput(true, "Number");
      this.setColour(getCategoryColor('Animation'));
    }
  };
  Blockly.Blocks['animation_is_playing'] = {
    init: function() {
      this.appendValueInput("ANIM_TRACK").setCheck("Instance").appendField("is animation playing?");
      this.setOutput(true, "Boolean");
      this.setColour(getCategoryColor('Animation'));
    }
  };

  // --- Effects Blocks ---
  Blockly.Blocks['effects_create_particle'] = {
    init: function() {
      this.appendValueInput("PARENT").setCheck("Instance").appendField("create particle emitter on");
      this.setOutput(true, "Instance");
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_emit_particles'] = {
    init: function() {
      this.appendValueInput("COUNT").setCheck("Number").appendField("emit");
      this.appendValueInput("PARTICLE").setCheck("Instance").appendField("particles from");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['effects_stop_particles'] = {
    init: function() {
      this.appendValueInput("PARTICLE").setCheck("Instance").appendField("stop particles on");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_create_explosion'] = {
    init: function() {
      this.appendValueInput("POSITION").setCheck("Vector3").appendField("create explosion at");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_create_highlight'] = {
    init: function() {
      this.appendValueInput("PARENT").setCheck("Instance").appendField("create highlight on");
      this.setOutput(true, "Instance");
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_enable_highlight'] = {
    init: function() {
      this.appendValueInput("HIGHLIGHT").setCheck("Instance").appendField("enable highlight");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_disable_highlight'] = {
    init: function() {
      this.appendValueInput("HIGHLIGHT").setCheck("Instance").appendField("disable highlight");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_create_beam'] = {
    init: function() {
      this.appendValueInput("PART1").setCheck("Instance").appendField("create beam from");
      this.appendValueInput("PART2").setCheck("Instance").appendField("to");
      this.setOutput(true, "Instance");
      this.setColour(getCategoryColor('Effects'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['effects_create_trail'] = {
    init: function() {
      this.appendValueInput("PARENT").setCheck("Instance").appendField("create trail on");
      this.setOutput(true, "Instance");
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_play_sound'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("play sound");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_stop_sound'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("stop sound");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_set_sound_volume'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("set sound");
      this.appendValueInput("VOLUME").setCheck("Number").appendField("volume to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['effects_set_sound_pitch'] = {
    init: function() {
      this.appendValueInput("SOUND").setCheck("Instance").appendField("set sound");
      this.appendValueInput("PITCH").setCheck("Number").appendField("pitch to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['effects_create_tween'] = {
    init: function() {
      this.appendValueInput("INSTANCE").setCheck("Instance").appendField("create tween on");
      this.appendValueInput("INFO").setCheck("Instance").appendField("with info");
      this.appendValueInput("GOALS").setCheck("Array").appendField("goals");
      this.setOutput(true, "Instance");
      this.setColour(getCategoryColor('Effects'));
      this.setInputsInline(true);
    }
  };
  Blockly.Blocks['effects_play_tween'] = {
    init: function() {
      this.appendValueInput("TWEEN").setCheck("Instance").appendField("play tween");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_stop_tween'] = {
    init: function() {
      this.appendValueInput("TWEEN").setCheck("Instance").appendField("stop tween");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_camera_shake'] = {
    init: function() {
      this.appendValueInput("INTENSITY").setCheck("Number").appendField("camera shake effect intensity");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_flash_screen'] = {
    init: function() {
      this.appendValueInput("COLOR").setCheck("Color3").appendField("flash screen with color");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_blur'] = {
    init: function() {
      this.appendValueInput("SIZE").setCheck("Number").appendField("set blur size to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
    }
  };
  Blockly.Blocks['effects_color_correction'] = {
    init: function() {
      this.appendValueInput("SATURATION").setCheck("Number").appendField("set color correction saturation");
      this.appendValueInput("CONTRAST").setCheck("Number").appendField("contrast");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(getCategoryColor('Effects'));
      this.setInputsInline(true);
    }
  };
};
