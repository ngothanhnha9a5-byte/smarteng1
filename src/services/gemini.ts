import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeSpeaking(audioBase64: string, targetText: string) {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: `Analyze the pronunciation and fluency of the user's speech for the text: "${targetText}". Provide a score from 0-100 for pronunciation and fluency, and give brief feedback in Vietnamese.` },
          { inlineData: { data: audioBase64, mimeType: "audio/wav" } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pronunciationScore: { type: Type.NUMBER },
          fluencyScore: { type: Type.NUMBER },
          feedback: { type: Type.STRING }
        },
        required: ["pronunciationScore", "fluencyScore", "feedback"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function analyzeWriting(prompt: string, userText: string) {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: `Analyze the following English writing based on the prompt: "${prompt}".
          User's writing: "${userText}"
          
          Provide:
          1. A score from 0-100 for Grammar & Vocabulary.
          2. A score from 0-100 for Coherence & Task Response.
          3. Brief feedback in Vietnamese.
          
          Return the result in JSON format.` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          grammarScore: { type: Type.NUMBER },
          coherenceScore: { type: Type.NUMBER },
          feedback: { type: Type.STRING }
        },
        required: ["grammarScore", "coherenceScore", "feedback"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function chatWithAI(message: string, history: { role: string, parts: { text: string }[] }[] = []) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are SmartEng AI Assistant, a helpful and friendly tutor for high school students learning English.
  The app "SmartEng" has these features:
  - Dashboard: Overview of progress, streak, and coins.
  - Quiz: Practice vocabulary with multiple choice questions.
  - Grammar: Practice grammar rules with detailed explanations.
  - Speaking: AI-powered pronunciation and fluency analysis.
  - Battle: Compete with other students in real-time (simulated).
  - Review: Re-practice questions from previous sessions.
  - Shop: Buy profile items with coins earned from learning.
  - Leaderboard: See top students by score or streak.
  
  Your goal is to:
  1. Answer questions about how to use the SmartEng app.
  2. Explain English grammar, vocabulary, and pronunciation concepts.
  3. Encourage students to maintain their streak and keep learning.
  4. Always respond in Vietnamese as the primary language, but use English for examples.
  5. Be encouraging and supportive.`;

  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction,
    },
    history: history,
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}

export async function generateCurriculumUnit(grade: number, unit: number) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Generate comprehensive English curriculum data for Grade ${grade}, Unit ${unit} based on the latest Vietnamese high school textbook (Global Success).
  Include:
  1. Unit Title
  2. Vocabulary list (at least 8 words) with word, Vietnamese meaning, and English example sentence.
  3. Grammar points (at least 1) with title, clear Vietnamese explanation, formula, and at least 3 English examples.
  
  Ensure the content is accurate, easy to understand for students, and follows the official curriculum.
  Clean the data, remove duplicates, and ensure high quality.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          unit: { type: Type.NUMBER },
          title: { type: Type.STRING },
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                meaning: { type: Type.STRING },
                example: { type: Type.STRING }
              },
              required: ["word", "meaning", "example"]
            }
          },
          grammar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                explanation: { type: Type.STRING },
                formula: { type: Type.STRING },
                examples: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "explanation", "formula", "examples"]
            }
          }
        },
        required: ["unit", "title", "vocabulary", "grammar"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateQuestionsFromUnit(unitData: any) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Based on the following English curriculum data for Unit ${unitData.unit}: "${unitData.title}", generate 10 multiple-choice questions.
  
  Curriculum Data:
  Vocabulary: ${JSON.stringify(unitData.vocabulary)}
  Grammar: ${JSON.stringify(unitData.grammar)}
  
  Requirements:
  - 5 questions for vocabulary (testing meaning or usage in context). Set module to "quiz".
  - 5 questions for grammar (testing the specific grammar points). Set module to "grammar".
  - Each question must have 4 options and 1 correct answer.
  - Include a clear explanation in Vietnamese for each question.
  - Difficulty: mixed (easy, medium, hard).
  
  Format the output as a JSON array of questions.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            module: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            category: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["module", "difficulty", "category", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}
