import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDoc,
  query,
  where,
  limit,
  getDocs,
  serverTimestamp,
  arrayUnion
} from "firebase/firestore";
import { UserProfile, Question } from "../types";
import { incrementBattleWin } from "../services/db";
import { motion, AnimatePresence } from "motion/react";
import { Swords, Timer, User, Zap, Trophy, Loader2, Mic, Square, Play, RefreshCw, Volume2, PenTool } from "lucide-react";
import { analyzeSpeaking, analyzeWriting } from "../services/gemini";
import { shuffleArray } from "../lib/utils";

const BATTLE_QUESTIONS: Question[] = [
  {
    id: "b1",
    module: "battle",
    difficulty: "hard",
    category: "Vocabulary",
    question: "Which word is an antonym of 'Meticulous'?",
    options: ["Careful", "Careless", "Detailed", "Precise"],
    correctAnswer: "Careless",
    explanation: ""
  },
  {
    id: "b2",
    module: "battle",
    difficulty: "hard",
    category: "Grammar",
    question: "Hardly ___ the door when the phone rang.",
    options: ["I had opened", "had I opened", "did I open", "I opened"],
    correctAnswer: "had I opened",
    explanation: ""
  },
  {
    id: "b3",
    module: "battle",
    difficulty: "hard",
    category: "Vocabulary",
    question: "What is the meaning of 'Ubiquitous'?",
    options: ["Rare", "Found everywhere", "Hidden", "Expensive"],
    correctAnswer: "Found everywhere",
    explanation: ""
  },
  {
    id: "b4",
    module: "battle",
    difficulty: "hard",
    category: "Grammar",
    question: "It's high time you ___ your room.",
    options: ["clean", "cleaned", "cleaning", "to clean"],
    correctAnswer: "cleaned",
    explanation: ""
  },
  {
    id: "b5",
    module: "battle",
    difficulty: "hard",
    category: "Vocabulary",
    question: "Which word means 'to make something better'?",
    options: ["Ameliorate", "Deteriorate", "Exacerbate", "Stagnate"],
    correctAnswer: "Ameliorate",
    explanation: ""
  },
  {
    id: "b6",
    module: "battle",
    difficulty: "hard",
    category: "Grammar",
    question: "___ you need any help, please let me know.",
    options: ["Should", "If", "Were", "Had"],
    correctAnswer: "Should",
    explanation: ""
  },
  {
    id: "b7",
    module: "battle",
    difficulty: "hard",
    category: "Vocabulary",
    question: "What is a 'Pinnacle'?",
    options: ["Valley", "The highest point", "Beginning", "Mistake"],
    correctAnswer: "The highest point",
    explanation: ""
  },
  {
    id: "b8",
    module: "battle",
    difficulty: "hard",
    category: "Grammar",
    question: "Not only ___ the exam, but he also got a scholarship.",
    options: ["he passed", "did he pass", "passed he", "he did pass"],
    correctAnswer: "did he pass",
    explanation: ""
  },
  {
    id: "b9",
    module: "battle",
    difficulty: "hard",
    category: "Vocabulary",
    question: "What is the synonym of 'Ephemeral'?",
    options: ["Eternal", "Short-lived", "Strong", "Ancient"],
    correctAnswer: "Short-lived",
    explanation: ""
  },
  {
    id: "b10",
    module: "battle",
    difficulty: "hard",
    category: "Grammar",
    question: "I'd rather you ___ tell her the truth.",
    options: ["don't", "didn't", "not", "won't"],
    correctAnswer: "didn't",
    explanation: ""
  }
];

interface BattleModuleProps {
  user: UserProfile;
  onComplete: () => void;
}

const SPEAKING_BATTLE_TASKS = [
  "Education is the most powerful weapon which you can use to change the world.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Your time is limited, so don't waste it living someone else's life.",
  "Stay hungry, stay foolish.",
  "Innovation distinguishes between a leader and a follower.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop."
];

const WRITING_BATTLE_PROMPTS = [
  "Describe your favorite hobby and why you enjoy it.",
  "What are the benefits of learning a second language?",
  "How has technology changed the way we communicate?",
  "Describe a place you would like to visit in the future.",
  "What is the importance of protecting the environment?",
  "Talk about a person who has influenced your life significantly.",
  "What are the advantages and disadvantages of social media?",
  "Describe a traditional festival in your country.",
  "How do you usually spend your weekends?",
  "What are your goals for the next five years?"
];

export default function BattleModule({ user, onComplete }: BattleModuleProps) {
  const [mode, setMode] = useState<"pvp" | "ai" | null>(null);
  const [battleType, setBattleType] = useState<"quiz" | "speaking" | "writing" | null>(null);
  const [aiDifficulty, setAiDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [status, setStatus] = useState<"idle" | "searching" | "battle" | "finished">("idle");
  const [battleId, setBattleId] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<UserProfile | any>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [speakingTasks, setSpeakingTasks] = useState<string[]>([]);
  const [writingPrompts, setWritingPrompts] = useState<string[]>([]);
  
  // Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Writing state
  const [userWriting, setUserWriting] = useState("");

  // AI Simulation Logic
  useEffect(() => {
    let aiInterval: any;
    if (mode === "ai" && status === "battle" && aiDifficulty && battleType === "quiz") {
      const config = {
        easy: { speed: 5000, accuracy: 0.4 },
        medium: { speed: 4000, accuracy: 0.7 },
        hard: { speed: 3000, accuracy: 0.9 }
      }[aiDifficulty];

      aiInterval = setInterval(() => {
        if (Math.random() < config.accuracy) {
          setOppScore(prev => prev + 20);
        }
      }, config.speed);
    }
    return () => clearInterval(aiInterval);
  }, [mode, status, aiDifficulty, battleType]);

  useEffect(() => {
    if (status === "searching" && mode === "pvp") {
      findMatch();
    } else if (status === "searching" && mode === "ai") {
      startAiBattle();
    }
  }, [status, mode]);

  const startAiBattle = () => {
    if (battleType === "quiz") {
      const shuffled = [...BATTLE_QUESTIONS].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    } else if (battleType === "speaking") {
      const shuffled = shuffleArray([...SPEAKING_BATTLE_TASKS]).slice(0, 3);
      setSpeakingTasks(shuffled);
      
      // Simulate AI score for speaking (one-time or per task)
      const aiBaseScore = { easy: 60, medium: 75, hard: 90 }[aiDifficulty!];
      setOppScore(aiBaseScore);
    } else if (battleType === "writing") {
      const shuffled = shuffleArray([...WRITING_BATTLE_PROMPTS]).slice(0, 1);
      setWritingPrompts(shuffled);
      setTimeLeft(120); // Give more time for writing
      
      // Simulate AI score for writing
      const aiBaseScore = { easy: 55, medium: 70, hard: 85 }[aiDifficulty!];
      setOppScore(aiBaseScore);
    }
    
    setOpponent({
      displayName: `SmartEng AI (${aiDifficulty === "easy" ? "Dễ" : aiDifficulty === "medium" ? "Trung bình" : "Khó"})`,
      uid: "ai-bot",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=ai"
    });
    setStatus("battle");
  };

  useEffect(() => {
    if (battleId && mode === "pvp") {
      const unsub = onSnapshot(doc(db, "battles", battleId), async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const oppId = data.players.find((id: string) => id !== user.uid);
          
          if (oppId && (!opponent || opponent.uid !== oppId)) {
            const oppDoc = await getDoc(doc(db, "users", oppId));
            if (oppDoc.exists()) {
              setOpponent(oppDoc.data() as UserProfile);
            }
          }

          setOppScore(data.scores[oppId] || 0);
          setMyScore(data.scores[user.uid] || 0);
          
          if (data.status === "active" && status === "searching") {
            setQuestions(data.questions);
            setStatus("battle");
          }

          if (data.status === "finished" && status === "battle") {
            setStatus("finished");
          }
        }
      });
      return () => unsub();
    }
  }, [battleId, status, opponent, mode]);

  useEffect(() => {
    let timer: any;
    if (status === "battle" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && status === "battle") {
      finishBattle();
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const findMatch = async () => {
    try {
      const q = query(
        collection(db, "battles"), 
        where("status", "==", "waiting"), 
        limit(1)
      );
      
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const battleDoc = snap.docs[0];
        const battleData = battleDoc.data();
        
        if (battleData.players.includes(user.uid)) {
          setBattleId(battleDoc.id);
          return;
        }
        
        await joinBattle(battleDoc.id);
      } else {
        await createBattle();
      }
    } catch (error) {
      console.error("Matchmaking error:", error);
      setStatus("idle");
    }
  };

  const createBattle = async () => {
    const shuffled = [...BATTLE_QUESTIONS].sort(() => Math.random() - 0.5);
    
    const docRef = await addDoc(collection(db, "battles"), {
      players: [user.uid],
      scores: { [user.uid]: 0 },
      status: "waiting",
      questions: shuffled,
      createdAt: serverTimestamp()
    });
    setBattleId(docRef.id);
  };

  const joinBattle = async (id: string) => {
    const battleRef = doc(db, "battles", id);
    
    await updateDoc(battleRef, {
      players: arrayUnion(user.uid),
      status: "active",
      [`scores.${user.uid}`]: 0
    });
    
    setBattleId(id);
  };

  const handleAnswer = async (option: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (option === currentQuestion?.correctAnswer) {
      const newScore = myScore + 20;
      setMyScore(newScore);
      if (battleId && mode === "pvp") {
        await updateDoc(doc(db, "battles", battleId), {
          [`scores.${user.uid}`]: newScore
        });
      }
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishBattle();
    }
  };

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
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAnalyzeSpeaking = async () => {
    if (!audioBlob) return;
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(",")[1];
        const targetText = speakingTasks[currentQuestionIndex];
        const result = await analyzeSpeaking(base64Audio, targetText);
        
        const taskScore = Math.floor((result.pronunciationScore + result.fluencyScore) / 2);
        setMyScore(prev => prev + taskScore);
        
        if (currentQuestionIndex < speakingTasks.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setAudioBlob(null);
        } else {
          finishBattle();
        }
        setLoading(false);
      };
    } catch (err) {
      console.error("Analysis failed:", err);
      setLoading(false);
    }
  };

  const handleAnalyzeWriting = async () => {
    if (!userWriting.trim()) return;
    setLoading(true);
    try {
      const prompt = writingPrompts[0];
      const result = await analyzeWriting(prompt, userWriting);
      const finalScore = Math.floor((result.grammarScore + result.coherenceScore) / 2);
      setMyScore(finalScore);
      finishBattle();
    } catch (err) {
      console.error("Writing analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const speakTarget = () => {
    const utterance = new SpeechSynthesisUtterance(speakingTasks[currentQuestionIndex]);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const finishBattle = async () => {
    setStatus("finished");
    if (battleId && mode === "pvp") {
      await updateDoc(doc(db, "battles", battleId), { status: "finished" });
      if (myScore > oppScore) {
        await incrementBattleWin(user.uid);
      }
    } else if (mode === "ai") {
      if (myScore > oppScore) {
        await incrementBattleWin(user.uid);
      }
    }
  };

  if (!mode) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Swords size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Đấu trường tiếng Anh</h2>
        <p className="text-slate-500 mb-8 text-center max-w-md">Chọn chế độ thi đấu để bắt đầu!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button 
            onClick={() => {
              setMode("ai");
              setBattleType(null);
            }}
            className="p-8 bg-white border-2 border-slate-100 rounded-[32px] hover:border-rose-200 hover:bg-rose-50 transition-all group"
          >
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Đấu với máy</h3>
            <p className="text-sm text-slate-500">Luyện tập kỹ năng với AI</p>
          </button>

          <button 
            onClick={() => {
              setMode("pvp");
              setBattleType("quiz");
            }}
            className="p-8 bg-white border-2 border-slate-100 rounded-[32px] hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
          >
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <User size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Đấu với người</h3>
            <p className="text-sm text-slate-500">Thách đấu người chơi khác</p>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "ai" && !battleType) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <button onClick={() => setMode(null)} className="mb-8 text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2">← Quay lại</button>
        <h2 className="text-3xl font-black text-slate-900 mb-8">Chọn nội dung đấu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <button 
            onClick={() => setBattleType("quiz")}
            className="p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-rose-200 hover:bg-rose-50 transition-all"
          >
            <Zap className="mx-auto mb-4 text-rose-600" size={40} />
            <h3 className="text-xl font-bold">Trắc nghiệm</h3>
            <p className="text-sm text-slate-500">Ai nhanh tay lẹ mắt hơn?</p>
          </button>
          <button 
            onClick={() => setBattleType("speaking")}
            className="p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-200 hover:bg-indigo-50 transition-all"
          >
            <Mic className="mx-auto mb-4 text-indigo-600" size={40} />
            <h3 className="text-xl font-bold">Luyện nói</h3>
            <p className="text-sm text-slate-500">Ai phát âm chuẩn hơn?</p>
          </button>
          <button 
            onClick={() => setBattleType("writing")}
            className="p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-amber-200 hover:bg-amber-50 transition-all"
          >
            <PenTool className="mx-auto mb-4 text-amber-600" size={40} />
            <h3 className="text-xl font-bold">Thi viết</h3>
            <p className="text-sm text-slate-500">Ai viết hay và đúng hơn?</p>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "ai" && !aiDifficulty) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <button onClick={() => setBattleType(null)} className="mb-8 text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2">← Quay lại</button>
        <h2 className="text-3xl font-black text-slate-900 mb-8">Chọn cấp độ AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          {[
            { id: "easy", label: "Dễ", color: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" },
            { id: "medium", label: "Trung bình", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" },
            { id: "hard", label: "Khó", color: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100" }
          ].map(level => (
            <button
              key={level.id}
              onClick={() => {
                setAiDifficulty(level.id as any);
                setStatus("searching");
              }}
              className={`p-6 rounded-2xl border-2 font-bold text-lg transition-all ${level.color}`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <button onClick={() => setMode(null)} className="mb-8 text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2">← Quay lại</button>
        <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Swords size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Sẵn sàng chưa?</h2>
        <p className="text-slate-500 mb-8 text-center max-w-md">Trận đấu sẽ bắt đầu ngay khi tìm thấy đối thủ.</p>
        <button 
          onClick={() => setStatus("searching")}
          className="px-12 py-4 bg-rose-600 text-white rounded-2xl font-bold text-lg hover:bg-rose-700 transition-all shadow-xl shadow-rose-200"
        >
          Bắt đầu tìm trận
        </button>
      </div>
    );
  }

  if (status === "searching") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-rose-600">
            <Swords size={40} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-8">Đang tìm đối thủ...</h2>
        <p className="text-slate-500 mt-2">Vui lòng chờ trong giây lát</p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-8 text-slate-400 font-bold hover:text-slate-600"
        >
          Hủy tìm kiếm
        </button>
      </div>
    );
  }

  if (status === "finished") {
    const won = myScore > oppScore;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white p-12 rounded-[40px] border border-slate-100 shadow-2xl text-center"
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl ${won ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"}`}>
          <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2">{won ? "Victory!" : "Defeat"}</h2>
        <p className="text-slate-500 mb-8">{won ? "Bạn đã chiến thắng đối thủ!" : "Cố gắng hơn ở trận sau nhé!"}</p>
        
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bạn</p>
            <p className="text-3xl font-black text-indigo-600">{myScore}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Đối thủ</p>
            <p className="text-3xl font-black text-rose-600">{oppScore}</p>
          </div>
        </div>

        <button 
          onClick={onComplete}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          Quay lại sảnh chờ
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} className="w-16 h-16 rounded-2xl shadow-md" />
          <div>
            <p className="text-sm font-bold text-slate-900">{user.displayName}</p>
            <p className="text-2xl font-black text-indigo-600">{myScore}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-200 mb-2">
            <Timer size={32} />
          </div>
          <p className="text-2xl font-black text-rose-600">{timeLeft}s</p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="text-sm font-bold text-slate-900">{opponent?.displayName || "Đang chờ..."}</p>
            <p className="text-2xl font-black text-rose-600">{oppScore}</p>
          </div>
          <img 
            src={opponent?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${opponent?.uid || 'opp'}`} 
            className="w-16 h-16 rounded-2xl shadow-md bg-slate-100" 
          />
        </div>
      </div>

      <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 30, ease: "linear" }}
            className="h-full bg-rose-600"
          />
        </div>

        {battleType === "quiz" ? (
          <>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-4 py-1.5 rounded-full mb-6 inline-block">
              {questions[currentQuestionIndex]?.category}
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-12 leading-relaxed">
              {questions[currentQuestionIndex]?.question}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestionIndex]?.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="py-6 px-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-xl font-bold text-slate-700 hover:border-rose-200 hover:bg-rose-50 transition-all active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : battleType === "speaking" ? (
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full mb-6 inline-block">
              Speaking Task {currentQuestionIndex + 1}/{speakingTasks.length}
            </span>
            
            <div className="flex justify-center mb-6">
              <button 
                onClick={speakTarget}
                className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Nghe mẫu"
              >
                <Volume2 size={32} />
              </button>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-12 leading-relaxed italic">
              "{speakingTasks[currentQuestionIndex]}"
            </h2>

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
                    onClick={handleAnalyzeSpeaking}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
                    {loading ? "Đang chấm điểm..." : "Nộp bài nói"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-4 py-1.5 rounded-full mb-6 inline-block">
              Writing Challenge
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
              {writingPrompts[0]}
            </h2>
            
            <textarea
              value={userWriting}
              onChange={(e) => setUserWriting(e.target.value)}
              placeholder="Viết câu trả lời của bạn tại đây (bằng tiếng Anh)..."
              className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-lg focus:border-amber-200 focus:bg-white outline-none transition-all resize-none mb-8"
            />

            <button 
              onClick={handleAnalyzeWriting}
              disabled={loading || !userWriting.trim()}
              className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold text-lg hover:bg-amber-700 transition-all shadow-xl shadow-amber-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw size={20} className="animate-spin" /> : <PenTool size={20} />}
              {loading ? "Đang chấm điểm..." : "Nộp bài viết"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
