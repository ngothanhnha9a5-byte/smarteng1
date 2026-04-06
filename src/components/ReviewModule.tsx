import React, { useState, useEffect } from "react";
import { Question } from "../types";
import { getQuestions, updateScore } from "../services/db";
import { shuffleArray } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw, Trophy, BookOpen } from "lucide-react";

interface ReviewModuleProps {
  userId: string;
  onComplete: () => void;
}

export default function ReviewModule({ userId, onComplete }: ReviewModuleProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchReviewQuestions = async () => {
      setLoading(true);
      try {
        // Fetch questions from different modules to "review"
        const quizQuestions = await getQuestions("quiz", "medium");
        const grammarQuestions = await getQuestions("grammar", "medium");
        
        // Shuffle and take 10
        let combined = [...quizQuestions, ...grammarQuestions];
        
        if (combined.length === 0) {
          // Mock data fallback for review
          combined = [
            {
              id: "m1",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "Which of the following is a correct sentence?",
              options: ["She don't like apples.", "She doesn't likes apples.", "She doesn't like apples.", "She not like apples."],
              correctAnswer: "She doesn't like apples.",
              explanation: "In present simple negative, we use 'doesn't' + base form of the verb for third person singular."
            },
            {
              id: "m2",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "What is the past participle of 'Break'?",
              options: ["Broke", "Breaked", "Broken", "Breaking"],
              correctAnswer: "Broken",
              explanation: "The principal parts of 'break' are: break (present), broke (past), broken (past participle)."
            },
            {
              id: "m3",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "If it ___ tomorrow, we will cancel the picnic.",
              options: ["rain", "rains", "raining", "will rain"],
              correctAnswer: "rains",
              explanation: "In the first conditional, we use present simple in the 'if' clause."
            },
            {
              id: "m4",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "I have been living here ___ 2010.",
              options: ["for", "since", "during", "ago"],
              correctAnswer: "since",
              explanation: "'Since' is used with a specific point in time."
            },
            {
              id: "m5",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "The book ___ by a famous author.",
              options: ["wrote", "was written", "was writing", "has written"],
              correctAnswer: "was written",
              explanation: "This is a passive voice sentence in the past simple."
            },
            {
              id: "m6",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "He is the person ___ helped me yesterday.",
              options: ["who", "which", "whose", "whom"],
              correctAnswer: "who",
              explanation: "'Who' is used for people in relative clauses."
            },
            {
              id: "m7",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "I'm looking forward to ___ you soon.",
              options: ["see", "seeing", "seen", "saw"],
              correctAnswer: "seeing",
              explanation: "'Look forward to' is followed by a gerund (V-ing)."
            },
            {
              id: "m8",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "You ___ better see a doctor about that cough.",
              options: ["should", "would", "had", "did"],
              correctAnswer: "had",
              explanation: "'Had better' is used to give strong advice."
            },
            {
              id: "m9",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "I wish I ___ play the piano.",
              options: ["can", "could", "will", "am able to"],
              correctAnswer: "could",
              explanation: "'Wish' about an ability in the present uses 'could'."
            },
            {
              id: "m10",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "By the time we arrived, the movie ___.",
              options: ["starts", "has started", "had started", "was starting"],
              correctAnswer: "had started",
              explanation: "Past perfect is used for an action completed before another action in the past."
            },
            {
              id: "m11",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "Which word means 'very small'?",
              options: ["Huge", "Tiny", "Large", "Giant"],
              correctAnswer: "Tiny",
              explanation: "'Tiny' is a synonym for very small."
            },
            {
              id: "m12",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "She is ___ at English than her brother.",
              options: ["good", "better", "best", "well"],
              correctAnswer: "better",
              explanation: "The comparative form of 'good' is 'better'."
            },
            {
              id: "m13",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "I ___ my keys. Have you seen them?",
              options: ["lose", "lost", "have lost", "am losing"],
              correctAnswer: "have lost",
              explanation: "Present perfect is used for an action with a result in the present."
            },
            {
              id: "m14",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "He ___ to the gym every morning.",
              options: ["go", "goes", "going", "gone"],
              correctAnswer: "goes",
              explanation: "Third person singular present simple."
            },
            {
              id: "m15",
              module: "quiz",
              difficulty: "medium",
              category: "Review",
              question: "The weather is ___ today than it was yesterday.",
              options: ["hot", "hotter", "hottest", "more hot"],
              correctAnswer: "hotter",
              explanation: "Comparative form of 'hot' is 'hotter'."
            }
          ];
        }

        setQuestions(shuffleArray(combined).slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch review questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewQuestions();
  }, []);

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
      // Review gives 15 points per correct answer
      await updateScore(userId, "quiz", score * 15); 
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Đang chuẩn bị bài ôn tập...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <p className="text-slate-500 font-medium mb-4">Không tìm thấy câu hỏi ôn tập nào.</p>
        <button
          onClick={onComplete}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold"
        >
          Quay lại Dashboard
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white p-10 rounded-[40px] shadow-xl text-center border border-slate-100"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Hoàn thành Ôn tập!</h2>
        <p className="text-slate-500 mb-8">Bạn đã củng cố kiến thức rất tốt.</p>
        
        <div className="bg-slate-50 p-6 rounded-3xl mb-8">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Kết quả</p>
          <p className="text-4xl font-black text-indigo-600">{score}/{questions.length}</p>
          <p className="text-sm text-emerald-600 font-bold mt-2">+{score * 15} Coins & Points</p>
        </div>

        <button
          onClick={onComplete}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Quay lại Dashboard
        </button>
      </motion.div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <RefreshCcw size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Củng cố & Ôn tập</h2>
        </div>
        <div className="text-sm font-bold text-slate-400">
          Câu {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider">
            {currentQ?.category}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-10 leading-relaxed">
          {currentQ?.question}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {currentQ?.options?.map((option) => {
            const isCorrect = option === currentQ?.correctAnswer;
            const isSelected = option === selectedOption;
            
            let btnClass = "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100";
            if (isAnswered) {
              if (isCorrect) btnClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
              else if (isSelected) btnClass = "bg-rose-50 text-rose-700 border-rose-200";
              else btnClass = "bg-slate-50 text-slate-300 border-slate-50 opacity-50";
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`w-full p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between ${btnClass}`}
              >
                {option}
                {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-rose-500" />}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-3xl flex items-center justify-between ${
              selectedOption === currentQ?.correctAnswer ? "bg-emerald-50 border border-emerald-100" : "bg-rose-50 border border-rose-100"
            }`}
          >
            <div className="flex-1">
              <p className={`font-bold ${selectedOption === currentQ?.correctAnswer ? "text-emerald-700" : "text-rose-700"}`}>
                {selectedOption === currentQ?.correctAnswer ? "Chính xác!" : "Chưa đúng rồi!"}
              </p>
              <p className="text-sm text-slate-600 mt-1">{currentQ?.explanation}</p>
            </div>
            <button
              onClick={nextQuestion}
              className="ml-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-900"
            >
              <ArrowRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
