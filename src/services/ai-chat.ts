import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import * as Blockly from 'blockly';

export const sendChatMessage = async (
  messageText: string,
  currentLang: 'vi' | 'en',
  generatedCode: string,
  explorerData: any,
  workspace: React.MutableRefObject<Blockly.WorkspaceSvg | null>,
  toolboxData: any,
  chatSessions: any[],
  currentSessionId: string,
  setAiMessages: (updater: (prev: any[]) => any[]) => void,
  setIsCheckingCode: (val: boolean) => void,
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void
) => {
  if (!messageText.trim()) return;

  setIsCheckingCode(true);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    
    // Get current session history
    const session = chatSessions.find(s => s.id === currentSessionId);
    const history = (session?.messages || [])
      .filter(m => m.content && m.content.trim() !== '')
      .map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    const systemInstruction = `
      You are an expert AI assistant for "BlockLua", a block-based Roblox coding environment.
      Your goal is to help users build Roblox games using blocks.
      
      Capabilities:
      - You can explain Roblox Luau concepts.
      - You can directly manipulate the user's workspace using tools.
      - You can help debug code.
      
      Tools:
      - addBlock(blockType, x, y): Adds a new block to the workspace.
      - updateBlock(blockId, fieldName, value): Updates a field in an existing block.
      - connectBlocks(parentBlockId, childBlockId, connectionType, inputName?): Connects two blocks.
      - clearWorkspace(): Clears all blocks.
      
      Guidelines:
      - When the user asks to "create", "add", or "build" something, use the tools to place blocks.
      - Always explain what you are doing in the chat.
      - Use ONLY the block types provided in the 'Toolbox' context.
    `;

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: history,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        tools: [
          {
            functionDeclarations: [
              {
                name: "addBlock",
                description: "Adds a new block to the workspace",
                parameters: {
                  type: "object",
                  properties: {
                    blockType: { type: "string", description: "The type of block to add" },
                    x: { type: "number", description: "X coordinate" },
                    y: { type: "number", description: "Y coordinate" }
                  },
                  required: ["blockType", "x", "y"]
                }
              },
              {
                name: "updateBlock",
                description: "Updates a field in an existing block",
                parameters: {
                  type: "object",
                  properties: {
                    blockId: { type: "string", description: "The ID of the block to update" },
                    fieldName: { type: "string", description: "The name of the field to update" },
                    value: { type: "string", description: "The new value" }
                  },
                  required: ["blockId", "fieldName", "value"]
                }
              },
              {
                name: "connectBlocks",
                description: "Connects two blocks",
                parameters: {
                  type: "object",
                  properties: {
                    parentBlockId: { type: "string", description: "The ID of the parent block" },
                    childBlockId: { type: "string", description: "The ID of the child block" },
                    connectionType: { type: "string", enum: ["next", "input"], description: "Type of connection" },
                    inputName: { type: "string", description: "The name of the input (if connectionType is 'input')" }
                  },
                  required: ["parentBlockId", "childBlockId", "connectionType"]
                }
              },
              {
                name: "clearWorkspace",
                description: "Clears all blocks from the workspace",
                parameters: { type: "object", properties: {} }
              }
            ]
          }
        ] as any
      },
    });

    const workspaceData = workspace.current ? Blockly.serialization.workspaces.save(workspace.current) : {};

    const contextPrompt = `
      Environment Context:
      - Roblox Luau Code: ${generatedCode}
      - Explorer (Object Tree): ${JSON.stringify(explorerData)}
      - Workspace (Blocks): ${JSON.stringify(workspaceData)}
      - Toolbox (Available Blocks): ${JSON.stringify(toolboxData)}

      User Message: ${messageText}
    `;

    let result = await chat.sendMessageStream({ message: contextPrompt });
    
    setAiMessages(prev => [...prev, { role: 'ai', content: "" }]);
    
    let fullText = "";
    let aggregatedFunctionCalls: any[] = [];
    try {
      for await (const chunk of result) {
        if (chunk.functionCalls) {
          aggregatedFunctionCalls.push(...chunk.functionCalls);
        }
        const chunkText = chunk.text || "";
        fullText += chunkText;
        setAiMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.role === 'ai') {
            return [...prev.slice(0, -1), { role: 'ai', content: fullText }];
          }
          return prev;
        });
      }
    } catch (streamError) {
      console.error("Streaming error:", streamError);
    }

    let rounds = 0;
    while (aggregatedFunctionCalls.length > 0 && rounds < 10) {
      rounds++;
      const currentCalls = [...aggregatedFunctionCalls];
      aggregatedFunctionCalls = []; // reset for the next round
      
      const toolResults = [];
      for (const call of currentCalls) {
        if (call.name === 'addBlock') {
          const { blockType, x, y } = call.args as any;
          if (workspace.current) {
            try {
              const block = workspace.current.newBlock(blockType);
              block.initSvg();
              block.render();
              block.moveBy(x, y);

              block.inputList.forEach(input => {
                if (input.connection && input.connection.type === 1 && !input.connection.targetBlock()) {
                  let placeholderType = 'placeholder_any';
                  if (input.name === 'CONDITION' || input.name === 'BOOL') placeholderType = 'placeholder_condition';
                  else if (input.name === 'NUM' || input.name === 'SECONDS' || input.name === 'A' || input.name === 'B') placeholderType = 'placeholder_number';
                  else if (input.name === 'TEXT' || input.name === 'NAME') placeholderType = 'placeholder_string';
                  else if (input.name === 'INSTANCE' || input.name === 'PARENT') placeholderType = 'placeholder_instance';

                  try {
                    const placeholder = workspace.current!.newBlock(placeholderType);
                    placeholder.initSvg();
                    placeholder.render();
                    input.connection?.connect(placeholder.outputConnection!);
                  } catch (e) {
                    console.warn("Failed to add placeholder:", e);
                  }
                }
              });
              
              toolResults.push({ name: call.name, result: `Successfully added block ${blockType} with ID ${block.id}` });
            } catch (e) {
              toolResults.push({ name: call.name, error: `Failed to add block ${blockType}: ${e}` });
            }
          }
        } else if (call.name === 'connectBlocks') {
          const { parentBlockId, childBlockId, connectionType, inputName } = call.args as any;
          if (workspace.current) {
            const parent = workspace.current.getBlockById(parentBlockId);
            const child = workspace.current.getBlockById(childBlockId);
            if (parent && child) {
              try {
                if (connectionType === 'next') {
                  parent.nextConnection?.connect(child.previousConnection!);
                } else if (connectionType === 'input' && inputName) {
                  const input = parent.getInput(inputName);
                  if (input) {
                    input.connection?.connect(child.outputConnection! || child.previousConnection!);
                  }
                }
                toolResults.push({ name: call.name, result: `Successfully connected ${childBlockId} to ${parentBlockId}` });
              } catch (e) {
                toolResults.push({ name: call.name, error: `Failed to connect blocks: ${e}` });
              }
            } else {
              toolResults.push({ name: call.name, error: `One or both blocks not found: ${parentBlockId}, ${childBlockId}` });
            }
          }
        } else if (call.name === 'updateBlock') {
          const { blockId, fieldName, value } = call.args as any;
          if (workspace.current) {
            const block = workspace.current.getBlockById(blockId);
            if (block) {
              try {
                block.setFieldValue(value, fieldName);
                toolResults.push({ name: call.name, result: `Successfully updated block ${blockId}` });
              } catch (e) {
                toolResults.push({ name: call.name, error: `Failed to update block ${blockId}: ${e}` });
              }
            } else {
              toolResults.push({ name: call.name, error: `Block ${blockId} not found` });
            }
          }
        } else if (call.name === 'clearWorkspace') {
          if (workspace.current) {
            workspace.current.clear();
            toolResults.push({ name: call.name, result: `Successfully cleared workspace` });
          }
        }
      }
      
      const toolResponseParts = toolResults.map((tr: any) => ({
        functionResponse: {
          name: tr.name,
          response: { 
            result: tr.result || "none", 
            error: tr.error || "none" 
          }
        }
      }));

      const toolResultStream = await chat.sendMessageStream({
        message: toolResponseParts
      });

      if (fullText.trim()) {
        fullText += "\n\n";
      }
      let toolFollowUpText = "";
      for await (const chunk of toolResultStream) {
        if (chunk.functionCalls) {
          aggregatedFunctionCalls.push(...chunk.functionCalls);
        }
        const chunkText = chunk.text || "";
        toolFollowUpText += chunkText;
        setAiMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.role === 'ai') {
            return [...prev.slice(0, -1), { role: 'ai', content: fullText + toolFollowUpText }];
          }
          return prev;
        });
      }
      fullText += toolFollowUpText;
    }

    if (!fullText.trim()) {
      setAiMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'ai') {
          const finalContent = rounds > 0 
            ? (currentLang === 'vi' ? 'Đã thực hiện xong các thao tác.' : 'Finished executing actions.')
            : (currentLang === 'vi' ? 'AI không có phản hồi.' : 'AI provided no response.');
          return [...prev.slice(0, -1), { role: 'ai', content: finalContent }];
        }
        return prev;
      });
    }
  } catch (error) {
    console.error("AI Chat Error:", error);
    showToast(currentLang === 'vi' ? 'Lỗi kết nối AI!' : 'AI Connection Error!', 'error');
  } finally {
    setIsCheckingCode(false);
  }
};
