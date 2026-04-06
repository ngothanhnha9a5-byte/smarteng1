import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { onSnapshot, doc } from "firebase/firestore";
import { UserProfile, AppView } from "./types";
import { getUserProfile, createUserProfile, checkStreakOnLogin, handleFirestoreError, OperationType } from "./services/db";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import QuizModule from "./components/QuizModule";
import SpeakingModule from "./components/SpeakingModule";
import WritingModule from "./components/WritingModule";
import ReadingModule from "./components/ReadingModule";
import ListeningModule from "./components/ListeningModule";
import GrammarModule from "./components/GrammarModule";
import BattleModule from "./components/BattleModule";
import ReviewModule from "./components/ReviewModule";
import Shop from "./components/Shop";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";
import AIChatBot from "./components/AIChatBot";
import KnowledgeSystem from "./components/KnowledgeSystem";
import { motion, AnimatePresence } from "motion/react";
import { LogIn, GraduationCap } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [view, setView] = useState<AppView>("dashboard");

  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Redirect sign-in successful");
        }
      } catch (error: any) {
        console.error("Redirect check failed:", error);
        setAuthError("Đăng nhập bằng chuyển hướng thất bại. Vui lòng kiểm tra cấu hình Firebase.");
      }
    };
    checkRedirect();

    let profileUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          profile = await createUserProfile(firebaseUser);
        } else {
          await checkStreakOnLogin(firebaseUser.uid);
        }
        
        // Real-time listener for user profile
        profileUnsubscribe = onSnapshot(doc(db, "users", firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as UserProfile);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        });
      } else {
        setUser(null);
        if (profileUnsubscribe) profileUnsubscribe();
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/popup-blocked') {
        setAuthError("Trình duyệt đã chặn cửa sổ đăng nhập. Vui lòng cho phép hiện cửa sổ bật lên (popup) và thử lại, hoặc sử dụng phương thức chuyển hướng.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        setAuthError("Yêu cầu đăng nhập đã bị hủy (có thể do bạn đã đóng cửa sổ hoặc nhấn nhiều lần). Vui lòng thử lại hoặc sử dụng phương thức chuyển hướng.");
      } else {
        setAuthError("Đăng nhập thất bại. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLoginWithRedirect = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error("Redirect login failed:", error);
      setAuthError("Đăng nhập bằng chuyển hướng thất bại. Vui lòng kiểm tra cấu hình Firebase.");
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Đang tải SmartEng...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl shadow-indigo-100 text-center"
        >
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-indigo-200">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">SmartEng</h1>
          <p className="text-slate-500 mb-10 text-lg leading-relaxed">
            Hành trình chinh phục tiếng Anh THPT bắt đầu từ đây.
          </p>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoggingIn ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <LogIn size={24} />
            )}
            {isLoggingIn ? "Đang xử lý..." : "Đăng nhập với Google"}
          </button>
          
          {authError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
              <p className="mb-2">{authError}</p>
              <button 
                onClick={handleLoginWithRedirect}
                className="text-indigo-600 font-bold hover:underline"
              >
                Thử đăng nhập bằng chuyển hướng (Redirect)
              </button>
            </div>
          )}
          
          <p className="mt-8 text-xs text-slate-400 font-medium uppercase tracking-widest">
            Dành riêng cho học sinh THPT
          </p>
        </motion.div>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard user={user} setView={setView} />;
      case "quiz":
        return <QuizModule userId={user.uid} onComplete={() => setView("dashboard")} />;
      case "grammar":
        return <GrammarModule userId={user.uid} onComplete={() => setView("dashboard")} />;
      case "speaking":
        return <SpeakingModule userId={user.uid} onComplete={() => setView("dashboard")} />;
      case "writing":
        return <WritingModule userId={user.uid} onComplete={() => setView("dashboard")} />;
      case "reading":
        return <ReadingModule userId={user.uid} onComplete={() => setView("dashboard")} />;
      case "listening":
        return <ListeningModule userId={user.uid} onComplete={() => setView("dashboard")} />;
      case "battle":
        return <BattleModule user={user} onComplete={() => setView("dashboard")} />;
      case "review":
        return <ReviewModule userId={user.uid} onComplete={() => setView("dashboard")} />;
      case "shop":
        return <Shop user={user} />;
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile user={user} />;
      case "chat":
        return <AIChatBot />;
      case "knowledge":
        return <KnowledgeSystem setView={setView} user={user!} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <p className="text-xl font-medium">Tính năng đang được phát triển</p>
            <button 
              onClick={() => setView("dashboard")}
              className="mt-4 text-indigo-600 font-bold hover:underline"
            >
              Quay lại trang chủ
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar currentView={view} setView={setView} onLogout={handleLogout} />
      
      <main className="ml-64 p-10 max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] mb-1">
              Chào mừng trở lại,
            </h2>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {user.displayName} 👋
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.rank} Rank</p>
              <p className="text-xs text-slate-500">Hạng của bạn</p>
            </div>
            <img 
              src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
              alt="Avatar" 
              className="w-14 h-14 rounded-2xl border-2 border-white shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
