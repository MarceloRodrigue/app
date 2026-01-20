
import { GoogleGenAI, Type } from "@google/genai";
import { ExplanationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const simplifyText = async (text: string): Promise<ExplanationResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Simplifique o seguinte texto complexo para que uma criança de 10 anos consiga entender perfeitamente. 
    O texto pode ser um contrato, termo jurídico, médico ou acadêmico.
    
    Texto Original: "${text}"
    
    Por favor, retorne a resposta estritamente no formato JSON com a seguinte estrutura:
    {
      "explanation": "Uma explicação narrativa simples e amigável",
      "summary": ["ponto importante 1", "ponto importante 2"],
      "simplifiedTerms": [
        { "original": "termo complexo", "simplified": "significado simples" }
      ]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          summary: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          simplifiedTerms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                simplified: { type: Type.STRING }
              },
              required: ["original", "simplified"]
            }
          }
        },
        required: ["explanation", "summary", "simplifiedTerms"]
      }
    },
  });

  const jsonStr = response.text.trim();
  try {
    return JSON.parse(jsonStr) as ExplanationResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Não foi possível processar a explicação. Tente novamente.");
  }
};
