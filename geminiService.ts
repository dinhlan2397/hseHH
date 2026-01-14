
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, HSESource } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tạo 5 câu hỏi trắc nghiệm về an toàn lao động chủ đề: ${topic}. Trả lời bằng tiếng Việt.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeRiskAI = async (scenario: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Dưới vai trò chuyên gia HSE 30 năm kinh nghiệm, hãy phân tích rủi ro và đưa ra biện pháp phòng ngừa cho kịch bản sau: ${scenario}. Định dạng kết quả bằng Markdown.`,
  });
  return response.text;
};

export const queryHSENotebook = async (query: string, sources: HSESource[]): Promise<{ text: string, links?: any[] }> => {
  const activeSources = sources.filter(s => s.isActive);
  
  const contextDescription = activeSources.map(s => {
    if (s.type === 'url') {
      return `[Nguồn Nội Bộ: ${s.name} - Link: ${s.path}]`;
    }
    return `[Nguồn File: ${s.name} - Nội dung: ${s.content}]`;
  }).join('\n\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Bạn là chuyên gia HSE cấp cao. 
               CÂU HỎI NHÂN VIÊN: ${query}
               
               NGỮ CẢNH NỘI BỘ HOÀNG HÀ:
               ${contextDescription || "Chưa có dữ liệu nội bộ được cấu hình."}
               
               YÊU CẦU:
               1. Ưu tiên trả lời dựa trên NGỮ CẢNH NỘI BỘ phía trên.
               2. Nếu thông tin nội bộ không đủ, hãy SỬ DỤNG GOOGLE SEARCH để tìm kiếm các quy chuẩn an toàn lao động quốc tế (OSHA, ISO, TCVN) liên quan để bổ sung.
               3. Trình bày rõ ràng, chuyên nghiệp. Nếu dùng thông tin từ internet hãy ghi rõ "Tham khảo tiêu chuẩn chung".`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text || "Hệ thống đang bận, vui lòng thử lại.",
    links: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};
