import React, { useState, useEffect } from "react";
import { updateScore } from "../services/db";
import { shuffleArray } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, CheckCircle2, Award, ChevronRight, HelpCircle, ArrowLeft } from "lucide-react";

interface ReadingModuleProps {
  userId: string;
  onComplete: () => void;
}

interface ReadingQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface ReadingPassage {
  title: string;
  content: string;
  questions: ReadingQuestion[];
}

export default function ReadingModule({ userId, onComplete }: ReadingModuleProps) {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const PASSAGES_BY_DIFFICULTY: Record<string, ReadingPassage[]> = {
    easy: [
      {
        title: "My Family",
        content: "My name is Tom. I live in a small house with my father, mother, and sister. My father is a doctor. He works in a big hospital. My mother is a teacher. She teaches English at a primary school. My sister, Lily, is ten years old. She likes drawing and playing the piano. We often have dinner together and talk about our day. I love my family very much.",
        questions: [
          {
            question: "What is Tom's father's job?",
            options: ["Teacher", "Doctor", "Engineer", "Farmer"],
            correctAnswer: "Doctor",
            explanation: "The text states: 'My father is a doctor.'"
          },
          {
            question: "Where does Tom's mother work?",
            options: ["In a hospital", "In a library", "In a primary school", "In a supermarket"],
            correctAnswer: "In a primary school",
            explanation: "The text states: 'She teaches English at a primary school.'"
          },
          {
            question: "What does Lily like doing?",
            options: ["Cooking", "Reading", "Drawing and playing the piano", "Swimming"],
            correctAnswer: "Drawing and playing the piano",
            explanation: "The text states: 'She likes drawing and playing the piano.'"
          }
        ]
      }
    ],
    medium: [
      {
        title: "The Importance of Trees",
        content: "Trees are vital for our planet. They provide oxygen, which all living things need to survive. They also absorb carbon dioxide, helping to reduce global warming. Furthermore, trees provide habitats for many animals and birds. They offer shade on hot days and prevent soil erosion. Unfortunately, many forests are being cut down for timber and land. It is crucial that we plant more trees and protect our existing forests to ensure a healthy environment for future generations.",
        questions: [
          {
            question: "What do trees provide that all living things need?",
            options: ["Carbon dioxide", "Oxygen", "Timber", "Soil"],
            correctAnswer: "Oxygen",
            explanation: "The text states: 'They provide oxygen, which all living things need to survive.'"
          },
          {
            question: "How do trees help reduce global warming?",
            options: ["By providing shade", "By preventing erosion", "By absorbing carbon dioxide", "By providing habitats"],
            correctAnswer: "By absorbing carbon dioxide",
            explanation: "The text states: 'They also absorb carbon dioxide, helping to reduce global warming.'"
          },
          {
            question: "Why are forests being cut down?",
            options: ["To plant more trees", "To protect animals", "For timber and land", "To increase oxygen"],
            correctAnswer: "For timber and land",
            explanation: "The text states: 'Unfortunately, many forests are being cut down for timber and land.'"
          }
        ]
      }
    ],
    hard: [
      {
        title: "The Future of Artificial Intelligence",
        content: "Artificial Intelligence (AI) is rapidly transforming various sectors of society, from healthcare to transportation. While AI offers immense potential for efficiency and innovation, it also raises significant ethical concerns. One major concern is the potential for job displacement as automation becomes more prevalent. Additionally, there are questions regarding the transparency and accountability of AI algorithms. As AI continues to evolve, it is essential for policymakers and researchers to collaborate in developing frameworks that ensure AI is used responsibly and for the benefit of all humanity.",
        questions: [
          {
            question: "Which sector is NOT mentioned as being transformed by AI?",
            options: ["Healthcare", "Transportation", "Agriculture", "Society"],
            correctAnswer: "Agriculture",
            explanation: "The text mentions healthcare, transportation, and society, but not agriculture."
          },
          {
            question: "What is a major ethical concern mentioned in the text?",
            options: ["Increased efficiency", "Job displacement", "Technological innovation", "Global collaboration"],
            correctAnswer: "Job displacement",
            explanation: "The text states: 'One major concern is the potential for job displacement as automation becomes more prevalent.'"
          },
          {
            question: "What is suggested as essential for the future of AI?",
            options: ["Replacing all human jobs", "Developing AI without regulations", "Collaboration between policymakers and researchers", "Focusing only on healthcare"],
            correctAnswer: "Collaboration between policymakers and researchers",
            explanation: "The text states: 'it is essential for policymakers and researchers to collaborate in developing frameworks...'"
          }
        ]
      }
    ]
  };

  useEffect(() => {
    if (difficulty) {
      const passages = PASSAGES_BY_DIFFICULTY[difficulty];
      const randomPassage = passages[Math.floor(Math.random() * passages.length)];
      setCurrentPassage(randomPassage);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setScore(0);
      setFinished(false);
    }
  }, [difficulty]);

  const handleOptionSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setShowExplanation(true);
    if (selectedOption === currentPassage?.questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (!currentPassage) return;

    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
      const finalScore = Math.round((score / currentPassage.questions.length) * 100);
      await updateScore(userId, "reading", finalScore);
    }
  };

  if (!difficulty) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <BookOpen size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">Luyện đọc tiếng Anh</h2>
        <p className="text-slate-500 mb-12 text-lg">Đọc các đoạn văn và trả lời câu hỏi để nâng cao kỹ năng đọc hiểu.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: "easy", label: "Dễ", desc: "Đoạn văn ngắn, từ vựng cơ bản", color: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" },
            { id: "medium", label: "Trung bình", desc: "Chủ đề phổ biến, cấu trúc đa dạng", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" },
            { id: "hard", label: "Khó", desc: "Chủ đề học thuật, từ vựng nâng cao", color: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100" }
          ].map((level) => (
            <button
              key={level.id}
              onClick={() => setDifficulty(level.id as any)}
              className={`p-8 rounded-3xl border-2 transition-all text-center group ${level.color}`}
            >
              <h3 className="text-2xl font-black mb-2">{level.label}</h3>
              <p className="text-sm opacity-80 font-medium">{level.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white p-12 rounded-[40px] border border-slate-100 shadow-xl text-center"
      >
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Award size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Hoàn thành!</h2>
        <p className="text-slate-500 mb-8">Bạn đã trả lời đúng <b>{score}/{currentPassage?.questions.length}</b> câu hỏi.</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setDifficulty(null)}
            className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            Luyện tập tiếp
          </button>
          <button
            onClick={onComplete}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
          >
            Quay lại Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = currentPassage?.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => setDifficulty(null)}
          className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Thoát
        </button>
        <div className="text-center flex-1">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            {difficulty === "easy" ? "Dễ" : difficulty === "medium" ? "Trung bình" : "Khó"} • Câu {currentQuestionIndex + 1}/{currentPassage?.questions.length}
          </span>
        </div>
        <div className="w-20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Passage Section */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-fit">
          <h3 className="text-2xl font-black text-slate-900 mb-6">{currentPassage?.title}</h3>
          <div className="text-slate-600 leading-relaxed text-lg space-y-4">
            {currentPassage?.content.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Question Section */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <HelpCircle size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 leading-tight">
                {currentQuestion?.question}
              </h4>
            </div>

            <div className="space-y-3">
              {currentQuestion?.options.map((option) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const isWrong = isSelected && !isCorrect;

                let buttonClass = "w-full p-4 rounded-2xl border-2 text-left font-medium transition-all flex items-center justify-between ";
                if (showExplanation) {
                  if (isCorrect) buttonClass += "bg-emerald-50 border-emerald-500 text-emerald-700";
                  else if (isWrong) buttonClass += "bg-red-50 border-red-500 text-red-700";
                  else buttonClass += "bg-white border-slate-100 text-slate-400";
                } else {
                  if (isSelected) buttonClass += "bg-indigo-50 border-indigo-500 text-indigo-700";
                  else buttonClass += "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50";
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    disabled={showExplanation}
                    className={buttonClass}
                  >
                    <span>{option}</span>
                    {showExplanation && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              {!showExplanation ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                  Kiểm tra đáp án
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {currentQuestionIndex === (currentPassage?.questions.length || 0) - 1 ? "Hoàn thành" : "Câu tiếp theo"}
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-100"
              >
                <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <HelpCircle size={18} className="text-indigo-600" /> Giải thích
                </h5>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {currentQuestion?.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
