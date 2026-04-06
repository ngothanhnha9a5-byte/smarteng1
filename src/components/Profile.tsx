import React from "react";
import { UserProfile } from "../types";
import { motion } from "motion/react";
import { User, Trophy, Star, Zap, Calendar, Mail, ShieldCheck, Flame, Coins } from "lucide-react";

interface ProfileProps {
  user: UserProfile;
}

export default function Profile({ user }: ProfileProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden sticky top-8 p-8">
            <div className="mb-8 text-center">
              <div className="relative inline-block mb-6">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  alt={user.displayName}
                  className="w-32 h-32 rounded-[40px] object-cover border-4 border-white shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
                  <ShieldCheck size={20} />
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="px-3 py-1 bg-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                  {user.rank} Rank
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900">{user.displayName}</h2>
              <p className="text-slate-500 text-sm font-medium">Học viên xuất sắc</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                    <Star fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Tổng điểm</p>
                    <p className="text-xl font-black text-slate-900">{user.totalScore.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Zap fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Chuỗi ngày</p>
                    <p className="text-xl font-black text-slate-900">{user.streak} ngày</p>
                  </div>
                </div>
              </div>

              {user.streak > 0 ? (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3">
                  <Flame className="text-orange-500 animate-pulse" size={20} />
                  <p className="text-sm text-orange-700 font-bold">Bạn đang có chuỗi {user.streak} ngày học tập!</p>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <Zap className="text-slate-400" size={20} />
                  <p className="text-sm text-slate-500 font-medium">Hãy bắt đầu bài học hôm nay để tạo chuỗi!</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={18} />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar size={18} />
                  <span className="text-sm">Tham gia: {new Date(user.lastActive).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <ShieldCheck size={18} />
                  <span className="text-sm">Tài khoản đã xác thực</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Stats & Achievements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Trophy className="text-amber-500" /> Thành tích học tập
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">Trắc nghiệm (Quiz)</span>
                    <span className="text-slate-900 font-bold">{user.stats.quizScore}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, user.stats.quizScore / 10)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">Ngữ pháp (Grammar)</span>
                    <span className="text-slate-900 font-bold">{user.stats.grammarScore}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, user.stats.grammarScore / 10)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">Luyện nói (Speaking)</span>
                    <span className="text-slate-900 font-bold">{user.stats.speakingScore}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, user.stats.speakingScore / 10)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">Luyện viết (Writing)</span>
                    <span className="text-slate-900 font-bold">{user.stats.writingScore}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, user.stats.writingScore / 10)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">Luyện đọc (Reading)</span>
                    <span className="text-slate-900 font-bold">{user.stats.readingScore}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: `${Math.min(100, user.stats.readingScore / 10)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">Luyện nghe (Listening)</span>
                    <span className="text-slate-900 font-bold">{user.stats.listeningScore}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, user.stats.listeningScore / 10)}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Zap className="text-indigo-500" /> Kỹ năng đặc biệt
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">Trận thắng (Battle)</span>
                    <span className="text-slate-900 font-bold">{user.stats.battleWins}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, user.stats.battleWins * 5)}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Inventory / Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Kho vật phẩm ({user.inventory.length})</h3>
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                <Coins size={18} />
                <span className="font-black">{user.coins.toLocaleString()}</span>
              </div>
            </div>

            {user.inventory.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {user.inventory.map((item) => (
                  <div key={item} className="p-4 bg-slate-50 rounded-3xl border border-slate-100 text-center group hover:bg-white hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm mx-auto mb-3 flex items-center justify-center text-indigo-600 overflow-hidden">
                      <Star size={24} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{item.replace("_", " ")}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                <p className="text-slate-400">Bạn chưa sở hữu vật phẩm nào.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
