import { GoogleGenAI } from "@google/genai";

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "foo" });
  const chat = ai.chats.create({ 
    model: "gemini-3.1-pro-preview",
    config: {
      tools: [{
        functionDeclarations: [{
          name: "addBlock",
          description: "adds a block",
          parameters: { type: "object", properties: { type: { type: "string"} } }
        }]
      }]
    }
  });

  try {
    const stream = await chat.sendMessageStream({ message: "Add a block" });
    for await (const chunk of stream) {
      console.log("Chunk:", JSON.stringify(chunk, null, 2));
      console.log("Chunk function calls:", chunk.functionCalls);
    }
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}
test();
