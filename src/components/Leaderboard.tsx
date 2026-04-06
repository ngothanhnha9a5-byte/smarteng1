import React, { useState, useEffect } from "react";
import { PublicProfile } from "../types";
import { subscribeToTopUsers } from "../services/db";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Star, Swords, BookOpen, Mic2, BrainCircuit, LayoutGrid, PenTool, Headphones } from "lucide-react";

type ScoreType = "total" | "quiz" | "grammar" | "speaking" | "writing" | "reading" | "listening" | "battleWins";

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<ScoreType>("total");

  useEffect(() => {
    setLoading(true);
    let field = "";
    if (sortBy === "total") field = "totalScore";
    else if (sortBy === "battleWins") field = "stats.battleWins";
    else field = `stats.${sortBy}Score`;

    const unsubscribe = subscribeToTopUsers(field, 10, (users) => {
      setTopUsers(users);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [sortBy]);

  const tabs = [
    { id: "total", label: "Tổng", icon: <LayoutGrid size={16} /> },
    { id: "quiz", label: "Quiz", icon: <BrainCircuit size={16} /> },
    { id: "grammar", label: "Ngữ pháp", icon: <BookOpen size={16} /> },
    { id: "speaking", label: "Nói", icon: <Mic2 size={16} /> },
    { id: "writing", label: "Viết", icon: <PenTool size={16} /> },
    { id: "reading", label: "Đọc", icon: <BookOpen size={16} /> },
    { id: "listening", label: "Nghe", icon: <Headphones size={16} /> },
    { id: "battleWins", label: "Đấu trường", icon: <Swords size={16} /> },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Bảng Xếp Hạng</h2>
        <p className="text-slate-500">Những ngôi sao sáng nhất tuần này!</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSortBy(tab.id as ScoreType)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              sortBy === tab.id 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Đang tải bảng xếp hạng...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {topUsers.map((user, idx) => {
              const isTop3 = idx < 3;
              const medals = ["🥇", "🥈", "🥉"];
              const colors = ["bg-amber-50 border-amber-200", "bg-slate-50 border-slate-200", "bg-orange-50 border-orange-200"];
              
              let score: number | string = 0;
              if (sortBy === "total") score = user.totalScore || 0;
              else if (sortBy === "battleWins") score = user.stats.battleWins || 0;
              else score = (user.stats[`${sortBy}Score` as keyof typeof user.stats] as number) || 0;

              return (
                <motion.div
                  key={user.uid}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`flex items-center gap-6 p-6 rounded-3xl border-2 ${isTop3 ? colors[idx] : "bg-white border-slate-100"} shadow-sm`}
                >
                  <div className="w-12 text-center font-black text-2xl text-slate-400">
                    {isTop3 ? medals[idx] : idx + 1}
                  </div>
                  
                  <img 
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                    alt={user.displayName}
                    className="w-16 h-16 rounded-2xl border-2 border-white shadow-md"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{user.displayName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 uppercase tracking-wider">
                        {user.rank}
                      </span>
                      {idx < 5 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 uppercase tracking-wider">
                          <Star size={10} /> {idx < 3 ? "Champion" : "Rising Star"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
                      {tabs.find(t => t.id === sortBy)?.label}
                    </p>
                    <p className="text-2xl font-black text-indigo-600">
                      {score}
                      <span className="text-sm ml-1 opacity-60">
                        {sortBy === "battleWins" ? " Wins" : " Pts"}
                      </span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {topUsers.length === 0 && (
            <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 text-slate-400">
              Chưa có dữ liệu xếp hạng cho mục này.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
