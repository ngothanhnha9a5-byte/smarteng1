import React, { useState, useEffect } from "react";
import { Question } from "../types";
import { getQuestions, updateScore } from "../services/db";
import { shuffleArray } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw } from "lucide-react";

interface QuizModuleProps {
  userId: string;
  onComplete: () => void;
}

export default function QuizModule({ userId, onComplete }: QuizModuleProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    // In a real app, we'd have actual questions in DB. 
    // For demo, we'll use mock data if DB is empty.
    const data = await getQuestions("quiz", "easy");
    if (data.length > 0) {
      setQuestions(shuffleArray(data).slice(0, 10));
    } else {
      // Mock data - 20 questions to pick 10 random
      const mockQuestions: Question[] = [
        {
          id: "1",
          module: "quiz",
          difficulty: "easy",
          category: "Vocabulary",
          question: "What is the synonym of 'Happy'?",
          options: ["Sad", "Joyful", "Angry", "Bored"],
          correctAnswer: "Joyful",
          explanation: "'Joyful' means feeling, expressing, or causing great pleasure and happiness."
        },
        {
          id: "2",
          module: "quiz",
          difficulty: "easy",
          category: "Grammar",
          question: "She ___ to school every day.",
          options: ["go", "goes", "going", "gone"],
          correctAnswer: "goes",
          explanation: "Third person singular (She) takes 'goes' in present simple."
        },
        {
          id: "3",
          module: "quiz",
          difficulty: "easy",
          category: "Vocabulary",
          question: "Which word is an antonym of 'Fast'?",
          options: ["Quick", "Rapid", "Slow", "Swift"],
          correctAnswer: "Slow",
          explanation: "'Slow' is the opposite of 'Fast'."
        },
        {
          id: "4",
          module: "quiz",
          difficulty: "easy",
          category: "Grammar",
          question: "I ___ a student.",
          options: ["am", "is", "are", "be"],
          correctAnswer: "am",
          explanation: "'I' always goes with 'am' in the present tense of 'to be'."
        },
        {
          id: "5",
          module: "quiz",
          difficulty: "easy",
          category: "Vocabulary",
          question: "What is a 'Large' animal?",
          options: ["Ant", "Mouse", "Elephant", "Bee"],
          correctAnswer: "Elephant",
          explanation: "Elephants are known for their large size."
        },
        {
          id: "6",
          module: "quiz",
          difficulty: "easy",
          category: "Grammar",
          question: "They ___ playing football now.",
          options: ["is", "am", "are", "was"],
          correctAnswer: "are",
          explanation: "Present continuous with 'They' uses 'are'."
        },
        {
          id: "7",
          module: "quiz",
          difficulty: "easy",
          category: "Vocabulary",
          question: "Which fruit is yellow and long?",
          options: ["Apple", "Banana", "Grape", "Orange"],
          correctAnswer: "Banana",
          explanation: "Bananas are yellow and curved/long."
        },
        {
          id: "8",
          module: "quiz",
          difficulty: "easy",
          category: "Grammar",
          question: "We ___ to the cinema last night.",
          options: ["go", "goes", "went", "going"],
          correctAnswer: "went",
          explanation: "Past simple of 'go' is 'went'."
        },
        {
          id: "9",
          module: "quiz",
          difficulty: "easy",
          category: "Vocabulary",
          question: "What do you use to write on a blackboard?",
          options: ["Pen", "Pencil", "Chalk", "Marker"],
          correctAnswer: "Chalk",
          explanation: "Chalk is traditionally used for blackboards."
        },
        {
          id: "10",
          module: "quiz",
          difficulty: "easy",
          category: "Grammar",
          question: "How ___ sugar do you want?",
          options: ["many", "much", "few", "long"],
          correctAnswer: "much",
          explanation: "Sugar is uncountable, so we use 'much'."
        },
        {
          id: "11",
          module: "quiz",
          difficulty: "easy",
          category: "Vocabulary",
          question: "What is the opposite of 'Hot'?",
          options: ["Warm", "Cold", "Boiling", "Spicy"],
          correctAnswer: "Cold",
          explanation: "'Cold' is the direct opposite of 'Hot'."
        },
        {
          id: "12",
          module: "quiz",
          difficulty: "easy",
          category: "Grammar",
          question: "___ you like coffee?",
          options: ["Do", "Does", "Is", "Are"],
          correctAnswer: "Do",
          explanation: "We use 'Do' for questions with 'you' in present simple."
        },
        {
          id: "13",
          module: "quiz",
          difficulty: "easy",
          category: "Vocabulary",
          question: "Which animal says 'Meow'?",
          options: ["Dog", "Cat", "Cow", "Bird"],
          correctAnswer: "Cat",
          explanation: "Cats are known for the 'meow' sound."
        },
        {
          id: "14",
          module: "quiz",
          difficulty: "easy",
          category: "Grammar",
          question: "I have ___ apple.",
          options: ["a", "an", "the", "some"],
          correctAnswer: "an",
          explanation: "We use 'an' before words starting with a vowel sound."
        },
        {
          id: "15",
          module: "quiz",
          difficulty: "easy",
          category: "Vocabulary",
          question: "What color is the sky on a clear day?",
          options: ["Green", "Red", "Blue", "Yellow"],
          correctAnswer: "Blue",
          explanation: "The sky appears blue due to Rayleigh scattering."
        },
        {
          id: "16",
          module: "quiz",
          difficulty: "easy",
          category: "Grammar",
          question: "He ___ a new car last week.",
          options: ["buy", "buys", "bought", "buying"],
          correctAnswer: "bought",
          explanation: "Past simple of 'buy' is 'bought'."
        },
        {
          id: "17",
          module: "quiz",
          difficulty: "easy",
          category: "Vocabulary",
          question: "Which of these is a vegetable?",
          options: ["Apple", "Carrot", "Grape", "Peach"],
          correctAnswer: "Carrot",
          explanation: "Carrot is a root vegetable."
        },
        {
          id: "18",
          module: "quiz",
          difficulty: "easy",
          category: "Grammar",
          question: "We ___ watching a movie now.",
          options: ["is", "am", "are", "be"],
          correctAnswer: "are",
          explanation: "Present continuous with 'We' uses 'are'."
        },
        {
          id: "19",
          module: "quiz",
          difficulty: "easy",
          category: "Vocabulary",
          question: "How many days are in a week?",
          options: ["5", "6", "7", "8"],
          correctAnswer: "7",
          explanation: "There are 7 days in a standard week."
        },
        {
          id: "20",
          module: "quiz",
          difficulty: "easy",
          category: "Grammar",
          question: "This is ___ book.",
          options: ["my", "me", "I", "mine"],
          correctAnswer: "my",
          explanation: "'My' is a possessive adjective used before a noun."
        }
      ];
      setQuestions(shuffleArray(mockQuestions).slice(0, 10));
    }
    setLoading(false);
  };

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === questions[currentIndex].correctAnswer) {
      setScore(score + 10);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setFinished(true);
    await updateScore(userId, "quiz", score);
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading questions...</div>;

  if (finished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl text-center max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Hoàn thành!</h2>
        <p className="text-slate-500 mb-8">Bạn đã đạt được {score} điểm và nhận được {Math.floor(score/10)} coins.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => {
              setFinished(false);
              setCurrentIndex(0);
              setScore(0);
              setSelectedOption(null);
              setIsAnswered(false);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            <RotateCcw size={18} /> Thử lại
          </button>
          <button 
            onClick={onComplete}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Tiếp tục <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            {currentQ?.category}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Câu hỏi {currentIndex + 1}/{questions.length}</h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Điểm số</p>
          <p className="text-2xl font-black text-indigo-600">{score}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-6">
        <p className="text-xl text-slate-800 font-medium mb-8 leading-relaxed">
          {currentQ?.question}
        </p>

        <div className="grid grid-cols-1 gap-3">
          {currentQ?.options?.map((option) => {
            const isCorrect = option === currentQ?.correctAnswer;
            const isSelected = option === selectedOption;
            
            let buttonClass = "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 font-medium flex items-center justify-between ";
            if (!isAnswered) {
              buttonClass += "border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-700";
            } else {
              if (isCorrect) {
                buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
              } else if (isSelected) {
                buttonClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                buttonClass += "border-slate-100 text-slate-400 opacity-50";
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={buttonClass}
              >
                {option}
                {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-8 pt-6 border-t border-slate-100"
            >
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Giải thích</p>
                <p className="text-sm text-slate-600 leading-relaxed">{currentQ?.explanation}</p>
              </div>
              <button
                onClick={nextQuestion}
                className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                {currentIndex === questions.length - 1 ? "Hoàn thành" : "Câu tiếp theo"}
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
