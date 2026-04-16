import { GoogleGenAI, Type } from "@google/genai";

export const checkCodeWithAI = async (
  generatedCode: string,
  currentLang: 'vi' | 'en',
  setIsCheckingCode: (val: boolean) => void,
  setAiResult: (val: any) => void,
  showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void,
  setShowControlCenter: (val: boolean) => void
) => {
  if (!generatedCode.trim()) {
    showToast(currentLang === 'vi' ? 'Vui lòng thêm khối lệnh trước!' : 'Please add some blocks first!', 'error');
    return;
  }

  setIsCheckingCode(true);
  setAiResult(null);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    
    const prompt = `
      You are an expert Roblox Lua (Luau) developer and debugger.
      Analyze the following code for syntax errors, logical bugs, or common mistakes.
      
      CODE:
      ${generatedCode}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: "The status of the check: 'success', 'warning', or 'error'",
              enum: ["success", "warning", "error"]
            },
            message: {
              type: Type.STRING,
              description: "A brief message explaining the result"
            },
            details: {
              type: Type.STRING,
              description: "Detailed explanation if there are issues"
            },
            line: {
              type: Type.NUMBER,
              description: "The line number where the issue occurs, or null"
            }
          },
          required: ["status", "message", "details"]
        }
      }
    });

    const resultText = response.text;
    if (resultText) {
      const result = JSON.parse(resultText);
      setAiResult(result);
      
      if (result.status === 'error' || result.status === 'warning') {
        setShowControlCenter(false);
        showToast(result.message, result.status);
      } else {
        showToast(currentLang === 'vi' ? 'Mã chạy tốt!' : 'Code looks good!', 'success');
      }
    } else {
      showToast(currentLang === 'vi' ? 'Lỗi khi nhận phản hồi từ AI!' : 'Error receiving AI response!', 'error');
    }
  } catch (error) {
    console.error("AI Check Error:", error);
    showToast(currentLang === 'vi' ? 'Lỗi kết nối AI!' : 'AI connection error!', 'error');
  } finally {
    setIsCheckingCode(false);
  }
};
