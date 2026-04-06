import React, { useState, useEffect } from "react";
import { Question } from "../types";
import { getQuestions, updateScore } from "../services/db";
import { shuffleArray } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw, Lightbulb } from "lucide-react";

interface GrammarModuleProps {
  userId: string;
  onComplete: () => void;
}

export default function GrammarModule({ userId, onComplete }: GrammarModuleProps) {
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
    const data = await getQuestions("grammar", "medium");
    if (data.length > 0) {
      setQuestions(shuffleArray(data).slice(0, 10));
    } else {
      const mockQuestions: Question[] = [
        {
          id: "g1",
          module: "grammar",
          difficulty: "medium",
          category: "Conditionals",
          question: "If I ___ you, I would take that job offer.",
          options: ["am", "was", "were", "be"],
          correctAnswer: "were",
          explanation: "In second conditional sentences, 'were' is used for all persons after 'if'."
        },
        {
          id: "g2",
          module: "grammar",
          difficulty: "medium",
          category: "Passive Voice",
          question: "The bridge ___ built in 1990.",
          options: ["is", "was", "has been", "were"],
          correctAnswer: "was",
          explanation: "Passive voice in past simple: was/were + past participle."
        },
        {
          id: "g3",
          module: "grammar",
          difficulty: "medium",
          category: "Relative Clauses",
          question: "The man ___ is talking to my teacher is my father.",
          options: ["who", "whom", "whose", "which"],
          correctAnswer: "who",
          explanation: "'Who' is used as a subject relative pronoun for people."
        },
        {
          id: "g4",
          module: "grammar",
          difficulty: "medium",
          category: "Reported Speech",
          question: "He said that he ___ to the party the next day.",
          options: ["will go", "would go", "goes", "is going"],
          correctAnswer: "would go",
          explanation: "In reported speech, 'will' changes to 'would'."
        },
        {
          id: "g5",
          module: "grammar",
          difficulty: "medium",
          category: "Modals",
          question: "You ___ smoke in the hospital. It's forbidden.",
          options: ["mustn't", "don't have to", "shouldn't", "can't"],
          correctAnswer: "mustn't",
          explanation: "'Mustn't' is used to express prohibition."
        },
        {
          id: "g6",
          module: "grammar",
          difficulty: "medium",
          category: "Gerunds & Infinitives",
          question: "I enjoy ___ books in my free time.",
          options: ["read", "to read", "reading", "reads"],
          correctAnswer: "reading",
          explanation: "The verb 'enjoy' is followed by a gerund (V-ing)."
        },
        {
          id: "g7",
          module: "grammar",
          difficulty: "medium",
          category: "Comparatives",
          question: "This car is ___ than that one.",
          options: ["more expensive", "expensiver", "most expensive", "as expensive"],
          correctAnswer: "more expensive",
          explanation: "For long adjectives, we use 'more + adjective + than' for comparison."
        },
        {
          id: "g8",
          module: "grammar",
          difficulty: "medium",
          category: "Perfect Tenses",
          question: "I ___ my homework already.",
          options: ["finish", "finished", "have finished", "am finishing"],
          correctAnswer: "have finished",
          explanation: "Present perfect is used with 'already' to show a completed action."
        },
        {
          id: "g9",
          module: "grammar",
          difficulty: "medium",
          category: "Conjunctions",
          question: "___ it rained heavily, they went out for a walk.",
          options: ["Because", "Although", "Despite", "In spite of"],
          correctAnswer: "Although",
          explanation: "'Although' is followed by a clause to show contrast."
        },
        {
          id: "g10",
          module: "grammar",
          difficulty: "medium",
          category: "Wish Clauses",
          question: "I wish I ___ more time to travel.",
          options: ["have", "had", "will have", "am having"],
          correctAnswer: "had",
          explanation: "Wish about the present uses past simple."
        },
        {
          id: "g11",
          module: "grammar",
          difficulty: "medium",
          category: "Articles",
          question: "He is ___ honest man.",
          options: ["a", "an", "the", "no article"],
          correctAnswer: "an",
          explanation: "We use 'an' before 'honest' because it starts with a vowel sound (silent 'h')."
        },
        {
          id: "g12",
          module: "grammar",
          difficulty: "medium",
          category: "Prepositions",
          question: "I'm interested ___ learning new languages.",
          options: ["on", "at", "in", "with"],
          correctAnswer: "in",
          explanation: "The adjective 'interested' is followed by the preposition 'in'."
        },
        {
          id: "g13",
          module: "grammar",
          difficulty: "medium",
          category: "Question Tags",
          question: "You're coming to the party, ___?",
          options: ["are you", "aren't you", "don't you", "won't you"],
          correctAnswer: "aren't you",
          explanation: "Positive statement takes a negative tag."
        },
        {
          id: "g14",
          module: "grammar",
          difficulty: "medium",
          category: "Tenses",
          question: "By the time I arrived, they ___.",
          options: ["left", "have left", "had left", "are leaving"],
          correctAnswer: "had left",
          explanation: "Past perfect is used for an action that happened before another action in the past."
        },
        {
          id: "g15",
          module: "grammar",
          difficulty: "medium",
          category: "Modals",
          question: "You ___ carry your passport when traveling abroad.",
          options: ["should", "must", "can", "may"],
          correctAnswer: "must",
          explanation: "'Must' expresses a strong obligation or necessity."
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
      setScore(score + 15); // Higher points for grammar
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
    await updateScore(userId, "grammar", score);
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  if (finished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl text-center max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Grammar Master!</h2>
        <p className="text-slate-500 mb-8">Bạn đã đạt được {score} điểm ngữ pháp.</p>
        <button 
          onClick={onComplete}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Quay lại trang chủ <ArrowRight size={18} />
        </button>
      </motion.div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            {currentQ?.category}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Câu hỏi {currentIndex + 1}/{questions.length}</h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Điểm số</p>
          <p className="text-2xl font-black text-blue-600">{score}</p>
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
            
            let btnClass = "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 font-medium flex items-center justify-between ";
            if (!isAnswered) {
              btnClass += "border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-slate-700";
            } else {
              if (isCorrect) btnClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
              else if (isSelected) btnClass += "border-red-500 bg-red-50 text-red-700";
              else btnClass += "border-slate-100 text-slate-400 opacity-50";
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={btnClass}
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
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={16} className="text-blue-600" />
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Giải thích chi tiết</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{currentQ?.explanation}</p>
              </div>
              <button
                onClick={nextQuestion}
                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
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
