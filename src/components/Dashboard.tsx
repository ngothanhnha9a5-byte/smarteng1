import React from "react";
import { UserProfile, AppView } from "../types";
import { 
  Coins, 
  Flame, 
  Trophy, 
  Star, 
  ChevronRight,
  Zap,
  Target,
  Award,
  Swords,
  RefreshCcw,
  ShoppingBag,
  PenTool,
  BookOpen,
  Headphones
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  user: UserProfile;
  setView: (view: AppView) => void;
}

export default function Dashboard({ user, setView }: DashboardProps) {
  const modules = [
    { 
      id: "quiz", 
      title: "English Quiz Basic", 
      desc: "Từ vựng & Ngữ pháp cơ bản", 
      color: "bg-emerald-500", 
      icon: Target,
      difficulty: "Dễ"
    },
    { 
      id: "grammar", 
      title: "Grammar Master", 
      desc: "Thành thạo ngữ pháp THPT", 
      color: "bg-blue-500", 
      icon: Zap,
      difficulty: "Trung bình"
    },
    { 
      id: "speaking", 
      title: "Speaking Challenge", 
      desc: "Luyện nói & Phản xạ AI", 
      color: "bg-amber-500", 
      icon: Star,
      difficulty: "Trung bình - Khó"
    },
    { 
      id: "writing", 
      title: "Writing Challenge", 
      desc: "Luyện viết & Tư duy AI", 
      color: "bg-indigo-500", 
      icon: PenTool,
      difficulty: "Trung bình - Khó"
    },
    { 
      id: "reading", 
      title: "Reading Challenge", 
      desc: "Luyện đọc & Hiểu văn bản", 
      color: "bg-cyan-500", 
      icon: BookOpen,
      difficulty: "Dễ - Khó"
    },
    { 
      id: "listening", 
      title: "Listening Challenge", 
      desc: "Luyện nghe & Phản xạ AI", 
      color: "bg-purple-500", 
      icon: Headphones,
      difficulty: "Dễ - Khó"
    },
    { 
      id: "battle", 
      title: "English Battle Arena", 
      desc: "Thi đấu 1vs1 trực tuyến", 
      color: "bg-rose-500", 
      icon: Swords,
      difficulty: "Khó"
    },
    { 
      id: "review", 
      title: "Củng cố & Ôn tập", 
      desc: "Ôn lại kiến thức đã học", 
      color: "bg-cyan-500", 
      icon: RefreshCcw,
      difficulty: "Tùy biến"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Coins size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">Coins</p>
            <p className="text-xl font-bold">{user.coins}</p>
          </div>
          <button 
            onClick={() => setView("shop")}
            className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
            title="Đến cửa hàng"
          >
            <ShoppingBag size={20} />
          </button>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Streak</p>
            <p className="text-xl font-bold">{user.streak} ngày</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Rank</p>
            <p className="text-xl font-bold">{user.rank}</p>
          </div>
        </div>
      </div>

      {/* Learning Modules */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Lộ trình học tập</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((mod, idx) => (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setView(mod.id as AppView)}
              className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-6 text-left"
            >
              <div className={`w-16 h-16 rounded-2xl ${mod.color} flex items-center justify-center text-white shadow-lg`}>
                <mod.icon size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">{mod.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">
                    {mod.difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{mod.desc}</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Daily Quest Placeholder */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Nhiệm vụ hàng ngày</h2>
          <p className="text-indigo-100 mb-6">Hoàn thành để nhận thêm 50 coins!</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              <p className="text-sm font-medium">Hoàn thành 1 bài Củng cố & Ôn tập</p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              <p className="text-sm font-medium opacity-80">Thắng 1 trận Battle Arena (0/1)</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
      </div>
    </div>
  );
}
