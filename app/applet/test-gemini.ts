import { GoogleGenAI } from "@google/genai";

async function test() {
  const ai = new GoogleGenAI();
  const chat = ai.chats.create({ model: "gemini-3.1-pro-preview" });
  try {
    const stream = await chat.sendMessageStream({
      message: [
        {
          functionResponse: {
            name: "addBlock",
            response: { result: "success" } // Object
          }
        }
      ]
    });
    console.log("Success message passed");
  } catch (e: any) {
    console.error("Error passed:", e.message);
  }
}
test();
