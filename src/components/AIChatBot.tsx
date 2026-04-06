import React, { useState, useRef, useEffect } from "react";
import { chatWithAI } from "../services/gemini";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Sparkles, Loader2, X } from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function AIChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Chào bạn! Mình là SmartEng AI. Mình có thể giúp gì cho bạn trong việc học tiếng Anh hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      // Format history for Gemini API
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await chatWithAI(userMessage, history);
      setMessages(prev => [...prev, { role: "model", text: response || "Xin lỗi, mình gặp chút trục trặc. Bạn thử lại nhé!" }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "model", text: "Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">SmartEng AI Assistant</h2>
            <p className="text-xs text-indigo-100 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Đang trực tuyến
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-amber-300 animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-400 shadow-sm border border-slate-100"
                }`}>
                  {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-100" 
                    : "bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-100"
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-white text-slate-400 shadow-sm border border-slate-100 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="p-4 bg-white rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                <Loader2 size={18} className="animate-spin text-indigo-600" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Hỏi mình về bài tập hoặc kiến thức tiếng Anh..."
            className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-lg shadow-indigo-100"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest font-bold">
          Powered by Gemini AI • SmartEng Tutor
        </p>
      </div>
    </div>
  );
}
