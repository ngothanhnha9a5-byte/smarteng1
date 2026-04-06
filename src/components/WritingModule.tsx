import React, { useState, useEffect } from "react";
import { analyzeWriting } from "../services/gemini";
import { updateScore } from "../services/db";
import { shuffleArray } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { PenTool, CheckCircle2, Award, RefreshCw, BookOpen } from "lucide-react";

interface WritingModuleProps {
  userId: string;
  onComplete: () => void;
}

export default function WritingModule({ userId, onComplete }: WritingModuleProps) {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userText, setUserText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [writingTasks, setWritingTasks] = useState<string[]>([]);

  const TASKS_BY_DIFFICULTY = {
    easy: [
      "Describe your favorite food and why you like it.",
      "Write about your best friend. What do you usually do together?",
      "What is your favorite season of the year? Why?",
      "Describe your daily routine from morning to night.",
      "Write about a pet you have or would like to have.",
      "What is your favorite subject at school? Why?",
      "Describe your house or your bedroom.",
      "Write about a movie you recently watched.",
      "What do you want to be when you grow up?",
      "Describe a typical weekend in your life."
    ],
    medium: [
      "What are the benefits of learning a second language like English?",
      "How has technology changed the way students learn today?",
      "Describe a place you would like to visit in the future and why.",
      "What is the importance of protecting the environment in your opinion?",
      "Talk about a person who has influenced your life significantly.",
      "What are the advantages and disadvantages of using social media?",
      "Describe a traditional festival in your country and how it is celebrated.",
      "How do you usually spend your summer holidays?",
      "What are your goals for the next five years?",
      "Why is it important to exercise regularly for good health?"
    ],
    hard: [
      "Discuss the impact of artificial intelligence on the future job market.",
      "Should students be required to wear uniforms at school? Provide reasons for your answer.",
      "Analyze the role of education in reducing poverty in developing countries.",
      "Is it better to live in a big city or a small town? Compare and contrast.",
      "What are the most effective ways to combat climate change on a global scale?",
      "Discuss the importance of mental health awareness in modern society.",
      "How does globalization affect local cultures around the world?",
      "Analyze the pros and cons of remote working versus office-based working.",
      "What is the significance of space exploration for the future of humanity?",
      "Discuss the ethical implications of genetic engineering in medicine."
    ]
  };

  useEffect(() => {
    if (difficulty) {
      setWritingTasks(shuffleArray(TASKS_BY_DIFFICULTY[difficulty]).slice(0, 5));
      setCurrentIndex(0);
      setUserText("");
      setAnalysis(null);
      setFinished(false);
    }
  }, [difficulty]);

  const targetPrompt = writingTasks[currentIndex];

  const handleAnalyze = async () => {
    if (!userText.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeWriting(targetPrompt, userText);
      setAnalysis(result);
      await updateScore(userId, "writing", Math.floor((result.grammarScore + result.coherenceScore) / 2));
      setLoading(false);
    } catch (err) {
      console.error("Writing analysis failed:", err);
      setLoading(false);
    }
  };

  const nextTask = () => {
    if (currentIndex < writingTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserText("");
      setAnalysis(null);
    } else {
      setFinished(true);
    }
  };

  if (!difficulty) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <PenTool size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">Luyện viết tiếng Anh</h2>
        <p className="text-slate-500 mb-12 text-lg">Chọn cấp độ phù hợp để bắt đầu luyện tập kỹ năng viết cùng AI.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: "easy", label: "Dễ", desc: "Chủ đề đơn giản, đời thường", color: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" },
            { id: "medium", label: "Trung bình", desc: "Chủ đề xã hội, quan điểm", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" },
            { id: "hard", label: "Khó", desc: "Chủ đề học thuật, phân tích", color: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100" }
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

  if (finished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white p-12 rounded-[40px] border border-slate-100 shadow-xl text-center"
      >
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Award size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Tuyệt vời!</h2>
        <p className="text-slate-500 mb-8">Bạn đã hoàn thành 5 bài luyện viết cấp độ <b>{difficulty === "easy" ? "Dễ" : difficulty === "medium" ? "Trung bình" : "Khó"}</b>.</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setDifficulty(null)}
            className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            Chọn cấp độ khác
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => setDifficulty(null)}
          className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2"
        >
          ← Thoát
        </button>
        <div className="text-center flex-1">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
            {difficulty === "easy" ? "Dễ" : difficulty === "medium" ? "Trung bình" : "Khó"} • {currentIndex + 1}/5
          </span>
        </div>
        <div className="w-16"></div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Luyện viết cùng AI</h2>
        <p className="text-slate-500 mt-2">Viết đoạn văn trả lời chủ đề dưới đây để AI chấm điểm nhé!</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-4 text-indigo-600">
          <BookOpen size={24} />
          <h3 className="font-bold uppercase tracking-widest text-sm">Chủ đề bài viết</h3>
        </div>
        <p className="text-xl font-bold text-slate-800 leading-relaxed">
          {targetPrompt}
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <textarea
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder="Viết câu trả lời của bạn tại đây (bằng tiếng Anh)..."
          className="w-full h-64 p-8 bg-white border-2 border-slate-100 rounded-[32px] text-lg focus:border-indigo-200 focus:bg-indigo-50/30 outline-none transition-all resize-none shadow-sm"
          disabled={loading || analysis}
        />

        <div className="flex justify-center">
          {!analysis ? (
            <button 
              onClick={handleAnalyze}
              disabled={loading || !userText.trim()}
              className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 flex items-center gap-3"
            >
              {loading ? <RefreshCw size={24} className="animate-spin" /> : <CheckCircle2 size={24} />}
              {loading ? "Đang chấm điểm..." : "Chấm điểm AI"}
            </button>
          ) : (
            <button 
              onClick={nextTask}
              className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl"
            >
              {currentIndex === writingTasks.length - 1 ? "Hoàn thành bài tập" : "Bài tiếp theo"}
            </button>
          )}
        </div>

        <AnimatePresence>
          {analysis && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl"
            >
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Ngữ pháp & Từ vựng</p>
                  <p className="text-4xl font-black text-emerald-700">{analysis.grammarScore}</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Mạch lạc & Đáp ứng</p>
                  <p className="text-4xl font-black text-blue-700">{analysis.coherenceScore}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={24} className="text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-lg">Nhận xét chi tiết từ AI</h3>
                </div>
                <p className="text-slate-600 leading-relaxed italic">
                  {analysis.feedback}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
