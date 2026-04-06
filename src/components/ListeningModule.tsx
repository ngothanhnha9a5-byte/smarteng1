import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { updateScore } from "../services/db";
import { motion, AnimatePresence } from "motion/react";
import { 
  Headphones, 
  Play, 
  Pause, 
  CheckCircle2, 
  Award, 
  ChevronRight, 
  HelpCircle, 
  ArrowLeft,
  Volume2,
  Loader2
} from "lucide-react";

interface ListeningModuleProps {
  userId: string;
  onComplete: () => void;
}

interface ListeningQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface ListeningTask {
  title: string;
  script: string;
  questions: ListeningQuestion[];
}

export default function ListeningModule({ userId, onComplete }: ListeningModuleProps) {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [currentTask, setCurrentTask] = useState<ListeningTask | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateTask = async (level: string) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // 1. Generate Conversation and Questions
      const prompt = `Generate an English listening practice task for level: ${level}.
      The task should be a dialogue or conversation between two people.
      Return a JSON object with:
      - title: A short title.
      - script: The full dialogue text.
      - questions: An array of 3 multiple-choice questions based on the dialogue. Each question should have:
        - question: The question text.
        - options: An array of 4 options.
        - correctAnswer: The correct option.
        - explanation: Why this is correct.
      
      Level guidelines:
      - easy: Simple daily topics, slow pace, basic vocabulary.
      - medium: Work, travel, or school topics, natural pace, intermediate vocabulary.
      - hard: Complex social, scientific, or abstract topics, fast pace, advanced vocabulary.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              script: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ["question", "options", "correctAnswer", "explanation"],
                },
              },
            },
            required: ["title", "script", "questions"],
          },
        }
      });

      let jsonStr = response.text.trim();
      // Handle potential markdown code blocks
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const task: ListeningTask = JSON.parse(jsonStr);
      setCurrentTask(task);

      // 2. Generate Audio (TTS)
      const ttsResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `TTS the following conversation: ${task.script}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binary = atob(base64Audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes.buffer], { type: 'audio/pcm;rate=24000' });
        
        // Convert PCM to WAV for browser playback
        const wavBlob = createWavBlob(bytes, 24000);
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);
      }

    } catch (error) {
      console.error("Error generating listening task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to create WAV from PCM
  const createWavBlob = (pcmData: Uint8Array, sampleRate: number) => {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    
    // RIFF identifier
    view.setUint32(0, 0x52494646, false);
    // file length
    view.setUint32(4, 36 + pcmData.length, true);
    // RIFF type
    view.setUint32(8, 0x57415645, false);
    // format chunk identifier
    view.setUint32(12, 0x666d7420, false);
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // channel count
    view.setUint16(22, 1, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    view.setUint32(36, 0x64617461, false);
    // data chunk length
    view.setUint32(40, pcmData.length, true);

    return new Blob([header, pcmData], { type: 'audio/wav' });
  };

  useEffect(() => {
    if (difficulty) {
      generateTask(difficulty);
    }
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [difficulty]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setShowExplanation(true);
    if (selectedOption === currentTask?.questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (!currentTask) return;

    if (currentQuestionIndex < currentTask.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
      const finalScore = Math.round((score / currentTask.questions.length) * 100);
      await updateScore(userId, "listening", finalScore);
    }
  };

  if (!difficulty) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <Headphones size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">Luyện nghe tiếng Anh</h2>
        <p className="text-slate-500 mb-12 text-lg">Nghe các đoạn hội thoại và trả lời câu hỏi để nâng cao kỹ năng nghe hiểu.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: "easy", label: "Dễ", desc: "Hội thoại ngắn, tốc độ chậm", color: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" },
            { id: "medium", label: "Trung bình", desc: "Chủ đề công việc, du lịch", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" },
            { id: "hard", label: "Khó", desc: "Chủ đề học thuật, tốc độ nhanh", color: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100" }
          ].map((level) => (
            <button
              key={level.id}
              onClick={() => setDifficulty(level.id as any)}
              className={`p-8 rounded-3xl border-2 transition-all text-center group ${level.color}`}
            >
              <h3 className="text-2xl font-black mb-2">{level.label}</h3>
              <p className="text-sm opacity-80 font-medium">{level.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-100 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <Headphones className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={32} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Đang tạo bài nghe AI...</h3>
          <p className="text-slate-500">Gemini đang biên soạn nội dung và giọng đọc cho bạn.</p>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white p-12 rounded-[40px] border border-slate-100 shadow-xl text-center"
      >
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Award size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Hoàn thành!</h2>
        <p className="text-slate-500 mb-8">Bạn đã trả lời đúng <b>{score}/{currentTask?.questions.length}</b> câu hỏi.</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setDifficulty(null)}
            className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            Luyện tập tiếp
          </button>
          <button
            onClick={onComplete}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
          >
            Quay lại Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = currentTask?.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => setDifficulty(null)}
          className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Thoát
        </button>
        <div className="text-center flex-1">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            {difficulty === "easy" ? "Dễ" : difficulty === "medium" ? "Trung bình" : "Khó"} • Câu {currentQuestionIndex + 1}/{currentTask?.questions.length}
          </span>
        </div>
        <div className="w-20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Audio Section */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-fit">
          <h3 className="text-2xl font-black text-slate-900 mb-6">{currentTask?.title}</h3>
          
          <div className="bg-slate-50 rounded-3xl p-8 flex flex-col items-center gap-6 border border-slate-100">
            <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-indigo-600 relative">
              {isPlaying && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-indigo-100 rounded-full"
                />
              )}
              <Volume2 size={32} className="relative z-10" />
            </div>

            <div className="w-full space-y-4">
              <button
                onClick={togglePlay}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                {isPlaying ? "Đang phát..." : "Nghe hội thoại"}
              </button>
              <button
                onClick={() => setShowScript(!showScript)}
                className="w-full flex items-center justify-center gap-2 text-indigo-600 font-bold py-2 hover:bg-indigo-50 rounded-xl transition-all"
              >
                {showScript ? "Ẩn văn bản" : "Xem văn bản (Transcript)"}
              </button>
              <p className="text-center text-xs text-slate-400 font-medium">Bạn có thể nghe lại nhiều lần nếu cần.</p>
            </div>

            <AnimatePresence>
              {showScript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full overflow-hidden"
                >
                  <div className="mt-4 p-6 bg-white rounded-2xl border border-slate-200 text-slate-700 text-sm leading-relaxed italic">
                    {currentTask?.script.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {audioUrl && (
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            )}
          </div>

          <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
            <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <HelpCircle size={16} /> Mẹo luyện nghe
            </h4>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Hãy nghe toàn bộ đoạn hội thoại một lần để nắm bắt ý chính trước khi trả lời câu hỏi. Chú ý đến ngữ điệu và từ khóa quan trọng.
            </p>
          </div>
        </div>

        {/* Question Section */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <HelpCircle size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 leading-tight">
                {currentQuestion?.question}
              </h4>
            </div>

            <div className="space-y-3">
              {currentQuestion?.options.map((option) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const isWrong = isSelected && !isCorrect;

                let buttonClass = "w-full p-4 rounded-2xl border-2 text-left font-medium transition-all flex items-center justify-between ";
                if (showExplanation) {
                  if (isCorrect) buttonClass += "bg-emerald-50 border-emerald-500 text-emerald-700";
                  else if (isWrong) buttonClass += "bg-red-50 border-red-500 text-red-700";
                  else buttonClass += "bg-white border-slate-100 text-slate-400";
                } else {
                  if (isSelected) buttonClass += "bg-indigo-50 border-indigo-500 text-indigo-700";
                  else buttonClass += "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50";
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    disabled={showExplanation}
                    className={buttonClass}
                  >
                    <span>{option}</span>
                    {showExplanation && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              {!showExplanation ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                  Kiểm tra đáp án
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {currentQuestionIndex === (currentTask?.questions.length || 0) - 1 ? "Hoàn thành" : "Câu tiếp theo"}
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-100"
              >
                <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <HelpCircle size={18} className="text-indigo-600" /> Giải thích
                </h5>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {currentQuestion?.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
