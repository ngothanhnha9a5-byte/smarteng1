import React, { useState, useRef, useEffect } from "react";
import { analyzeSpeaking } from "../services/gemini";
import { updateScore } from "../services/db";
import { shuffleArray } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Square, Play, RefreshCw, CheckCircle2, Award, Volume2 } from "lucide-react";

interface SpeakingModuleProps {
  userId: string;
  onComplete: () => void;
}

export default function SpeakingModule({ userId, onComplete }: SpeakingModuleProps) {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [speakingTasks, setSpeakingTasks] = useState<string[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const TASKS_BY_DIFFICULTY = {
    easy: [
      "How are you today?",
      "I like learning English.",
      "The weather is nice.",
      "Where is the library?",
      "Have a great day.",
      "My name is John.",
      "I live in a city.",
      "She is my friend.",
      "It is time to go.",
      "Can you help me?"
    ],
    medium: [
      "I have been studying English for three years now.",
      "Could you please tell me how to get to the station?",
      "It is important to exercise regularly for good health.",
      "The movie we watched last night was very interesting.",
      "I am looking forward to meeting you next week.",
      "She decided to travel around the world after graduation.",
      "Learning a new language opens up many opportunities.",
      "The book I am reading is about ancient history.",
      "We should protect the environment for future generations.",
      "He is one of the most talented musicians I know."
    ],
    hard: [
      "Education is the most powerful weapon which you can use to change the world.",
      "The beautiful thing about learning is that no one can take it away from you.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "Innovation distinguishes between a leader and a follower in any field of work.",
      "Don't let what you cannot do interfere with what you can do in your life.",
      "The only way to do great work is to love what you do every single day.",
      "Your time is limited, so don't waste it living someone else's life instead of your own.",
      "It does not matter how slowly you go as long as you do not stop moving forward.",
      "The more that you read, the more things you will know; the more that you learn, the more places you'll go."
    ]
  };

  useEffect(() => {
    if (difficulty) {
      setSpeakingTasks(shuffleArray(TASKS_BY_DIFFICULTY[difficulty]).slice(0, 10));
      setCurrentIndex(0);
      setAudioBlob(null);
      setAnalysis(null);
      setFinished(false);
    }
  }, [difficulty]);

  const targetText = speakingTasks[currentIndex];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAnalysis(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Vui lòng cấp quyền truy cập micro để luyện nói.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAnalyze = async () => {
    if (!audioBlob) return;
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(",")[1];
        const result = await analyzeSpeaking(base64Audio, targetText);
        setAnalysis(result);
        await updateScore(userId, "speaking", Math.floor((result.pronunciationScore + result.fluencyScore) / 2));
        setLoading(false);
      };
    } catch (err) {
      console.error("Analysis failed:", err);
      setLoading(false);
    }
  };

  const nextTask = () => {
    if (currentIndex < speakingTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAudioBlob(null);
      setAnalysis(null);
    } else {
      setFinished(true);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
    }
  };

  const speakTarget = () => {
    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  if (!difficulty) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <Mic size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">Luyện nói tiếng Anh</h2>
        <p className="text-slate-500 mb-12 text-lg">Chọn cấp độ phù hợp để bắt đầu luyện tập phát âm cùng AI.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: "easy", label: "Dễ", desc: "Câu ngắn, từ vựng cơ bản", color: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" },
            { id: "medium", label: "Trung bình", desc: "Câu dài hơn, cấu trúc phổ biến", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" },
            { id: "hard", label: "Khó", desc: "Câu phức tạp, danh ngôn nổi tiếng", color: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100" }
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
        <p className="text-slate-500 mb-8">Bạn đã hoàn thành 10 câu luyện nói cấp độ <b>{difficulty === "easy" ? "Dễ" : difficulty === "medium" ? "Trung bình" : "Khó"}</b>.</p>
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => setDifficulty(null)}
          className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2"
        >
          ← Thoát
        </button>
        <div className="text-center flex-1">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
            {difficulty === "easy" ? "Dễ" : difficulty === "medium" ? "Trung bình" : "Khó"} • {currentIndex + 1}/10
          </span>
        </div>
        <div className="w-16"></div> {/* Spacer for alignment */}
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Luyện phát âm AI</h2>
        <p className="text-slate-500 mt-2">Đọc to câu dưới đây để AI chấm điểm nhé!</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8">
        <div className="flex justify-end mb-4">
          <button 
            onClick={speakTarget}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="Nghe mẫu"
          >
            <Volume2 size={24} />
          </button>
        </div>
        <p className="text-2xl font-medium text-slate-800 text-center leading-relaxed italic">
          "{targetText}"
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <AnimatePresence>
            {isRecording && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-0 bg-red-100 rounded-full blur-xl -z-10"
              />
            )}
          </AnimatePresence>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
              isRecording ? "bg-red-500 text-white animate-pulse" : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={32} />}
          </button>
        </div>

        {audioBlob && !isRecording && (
          <div className="flex gap-4">
            <button 
              onClick={playAudio}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              <Play size={18} /> Nghe lại
            </button>
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {loading ? "Đang chấm điểm..." : "Chấm điểm AI"}
            </button>
          </div>
        )}

        <AnimatePresence>
          {analysis && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl"
            >
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Phát âm</p>
                  <p className="text-4xl font-black text-emerald-700">{analysis.pronunciationScore}</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Độ trôi chảy</p>
                  <p className="text-4xl font-black text-blue-700">{analysis.fluencyScore}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Award size={20} className="text-indigo-600" />
                  <h3 className="font-bold text-slate-900">Nhận xét từ AI</h3>
                </div>
                <p className="text-slate-600 leading-relaxed italic">
                  {analysis.feedback}
                </p>
              </div>

              <button 
                onClick={nextTask}
                className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                {currentIndex === speakingTasks.length - 1 ? "Hoàn thành bài tập" : "Câu tiếp theo"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
