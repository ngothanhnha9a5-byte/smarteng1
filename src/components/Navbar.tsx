import React from "react";
import { 
  Home, 
  BookOpen, 
  Mic2, 
  Swords, 
  RefreshCcw,
  GraduationCap, 
  Trophy, 
  User,
  LogOut,
  ShoppingBag,
  MessageCircle,
  BookMarked,
  PenTool,
  Headphones
} from "lucide-react";
import { cn } from "../lib/utils";
import { AppView } from "../types";

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

export default function Navbar({ currentView, setView, onLogout }: NavbarProps) {
  const navItems = [
    { id: "dashboard", label: "Trang chủ", icon: Home },
    { id: "knowledge", label: "Kiến thức SGK", icon: BookMarked },
    { id: "quiz", label: "Quiz Cơ bản", icon: BookOpen },
    { id: "grammar", label: "Ngữ pháp", icon: GraduationCap },
    { id: "speaking", label: "Luyện nói", icon: Mic2 },
    { id: "writing", label: "Luyện viết", icon: PenTool },
    { id: "reading", label: "Luyện đọc", icon: BookOpen },
    { id: "listening", label: "Luyện nghe", icon: Headphones },
    { id: "battle", label: "Đấu trường", icon: Swords },
    { id: "review", label: "Củng cố & Ôn tập", icon: RefreshCcw },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "shop", label: "Cửa hàng", icon: ShoppingBag },
    { id: "leaderboard", label: "Xếp hạng", icon: Trophy },
    { id: "profile", label: "Trang cá nhân", icon: User },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 p-4 flex flex-col z-50">
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-bold text-indigo-600 leading-tight">SmartEng</h1>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">THPT Edition</p>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as AppView)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              currentView === item.id 
                ? "bg-indigo-50 text-indigo-600" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </div>

      <button 
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
      >
        <LogOut size={20} />
        Đăng xuất
      </button>
    </nav>
  );
}
