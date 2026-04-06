import React, { useState, useEffect } from "react";
import { CURRICULUM, UnitContent } from "../constants/curriculum";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, GraduationCap, ChevronRight, BookMarked, BrainCircuit, Sparkles, ArrowLeft, Info, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { AppView, UserProfile } from "../types";
import { getCurriculum, saveCurriculumUnit, saveQuestions } from "../services/db";
import { generateCurriculumUnit, generateQuestionsFromUnit } from "../services/gemini";

interface KnowledgeSystemProps {
  setView: (view: AppView) => void;
  user: UserProfile;
}

export default function KnowledgeSystem({ setView, user }: KnowledgeSystemProps) {
  const [selectedGrade, setSelectedGrade] = useState<number>(10);
  const [selectedUnit, setSelectedUnit] = useState<UnitContent | null>(null);
  const [units, setUnits] = useState<UnitContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const isAdmin = user.role === 'admin' || user.email === 'ngothanhnha9a5@gmail.com';

  useEffect(() => {
    fetchCurriculum();
  }, [selectedGrade]);

  const fetchCurriculum = async () => {
    setLoading(true);
    const data = await getCurriculum(selectedGrade);
    if (data && data.length > 0) {
      setUnits(data as UnitContent[]);
    } else {
      // Fallback to static curriculum if Firestore is empty
      const fallback = CURRICULUM.find(g => g.grade === selectedGrade)?.units || [];
      setUnits(fallback);
    }
    setLoading(false);
  };

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    setSyncStatus(null);
    try {
      // Sync first 3 units for the selected grade as a demo (reduced from 5 to avoid long wait)
      const unitsToSync = [1, 2, 3];
      for (const unitNum of unitsToSync) {
        const data = await generateCurriculumUnit(selectedGrade, unitNum);
        await saveCurriculumUnit(selectedGrade, data);
        
        // Bonus: Generate questions from the unit
        const questions = await generateQuestionsFromUnit(data);
        await saveQuestions(questions);
      }
      setSyncStatus({ type: 'success', message: `Đã đồng bộ thành công 3 Unit lớp ${selectedGrade} và tạo ngân hàng câu hỏi!` });
      await fetchCurriculum();
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus({ type: 'error', message: "Đồng bộ thất bại. Vui lòng thử lại sau." });
    } finally {
      setSyncing(false);
    }
  };

  const handleUnitClick = (unit: UnitContent) => {
    setSelectedUnit(unit);
  };

  const handleBackToUnits = () => {
    setSelectedUnit(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {!selectedUnit ? (
          <motion.div
            key="unit-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3">
                <BookMarked size={40} className="text-indigo-600" />
                Hệ Thống Kiến Thức
              </h2>
              <p className="text-slate-500 text-lg">Học từ vựng và ngữ pháp theo từng Unit sách giáo khoa mới.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                {[10, 11, 12].map(grade => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-8 py-3 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                      selectedGrade === grade
                        ? "bg-indigo-600 text-white shadow-indigo-200"
                        : "bg-white text-slate-500 hover:bg-slate-50 shadow-slate-100"
                    }`}
                  >
                    Tiếng Anh {grade}
                  </button>
                ))}
              </div>

              {isAdmin && (
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-lg shadow-emerald-100"
                  >
                    <RefreshCw size={20} className={syncing ? "animate-spin" : ""} />
                    {syncing ? "Đang đồng bộ..." : "Đồng bộ AI (Admin)"}
                  </button>
                  {syncStatus && (
                    <div className={`flex items-center gap-2 text-sm font-bold ${syncStatus.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {syncStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      {syncStatus.message}
                    </div>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium">Đang tải dữ liệu kiến thức...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {units.map((unit, idx) => (
                  <motion.button
                    key={unit.unit}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleUnitClick(unit)}
                    className="group bg-white p-6 rounded-[32px] border-2 border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[64px] -mr-8 -mt-8 group-hover:bg-indigo-100 transition-colors" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-100">
                        <span className="font-black text-xl">{unit.unit}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {unit.title}
                      </h3>
                      <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                        <span className="flex items-center gap-1">
                          <BookOpen size={14} /> {unit.vocabulary.length} từ
                        </span>
                        <span className="flex items-center gap-1">
                          <BrainCircuit size={14} /> {unit.grammar.length} điểm ngữ pháp
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="absolute bottom-6 right-6 text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="unit-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={handleBackToUnits}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft size={20} />
                Quay lại danh sách
              </button>
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full font-bold text-sm uppercase tracking-wider">
                  Unit {selectedUnit.unit}
                </span>
                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full font-bold text-sm uppercase tracking-wider">
                  Lớp {selectedGrade}
                </span>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-indigo-50 border border-slate-100">
              <h1 className="text-4xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <Sparkles className="text-amber-400" />
                {selectedUnit.title}
              </h1>

              <div className="space-y-12">
                {selectedUnit.vocabulary.length === 0 && selectedUnit.grammar.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-100">
                    <BookMarked className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Chưa có dữ liệu chi tiết</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Nội dung cho Unit này đang được chuẩn bị. Bạn có thể nhấn nút đồng bộ để tải dữ liệu từ AI.</p>
                    {isAdmin && (
                      <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-xl shadow-indigo-100"
                      >
                        <RefreshCw className={`w-6 h-6 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Đang đồng bộ...' : 'Đồng bộ AI ngay'}
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Vocabulary Section */}
                    <section>
                      <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                          <BookOpen size={24} />
                        </div>
                        📘 Từ vựng quan trọng
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedUnit.vocabulary.map((item, idx) => (
                          <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-lg font-black text-indigo-600">{item.word}</h4>
                            </div>
                            <p className="text-slate-700 font-medium mb-3 italic">{item.meaning}</p>
                            <div className="flex gap-2 text-slate-500 text-sm bg-white/50 p-3 rounded-xl border border-slate-100">
                              <Info size={16} className="shrink-0 mt-0.5" />
                              <p>{item.example}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Grammar Section */}
                    <section>
                      <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                          <BrainCircuit size={24} />
                        </div>
                        📗 Ngữ pháp trọng tâm
                      </h2>
                      <div className="space-y-6">
                        {selectedUnit.grammar.map((item, idx) => (
                          <div key={idx} className="p-8 bg-indigo-50/30 rounded-[32px] border border-indigo-100">
                            <h4 className="text-xl font-black text-slate-900 mb-4">{item.title}</h4>
                            <p className="text-slate-600 mb-6 leading-relaxed">{item.explanation}</p>
                            
                            <div className="mb-6">
                              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Công thức</p>
                              <div className="p-4 bg-white rounded-2xl border border-indigo-100 font-mono text-indigo-600 font-bold">
                                {item.formula}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Ví dụ minh họa</p>
                              <ul className="space-y-2">
                                {item.examples.map((ex, i) => (
                                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                    {ex}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </div>

              <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setView("quiz")}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  <Sparkles size={20} />
                  Làm Quiz nhanh
                </button>
                <button
                  onClick={() => setView("grammar")}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-indigo-600 border-2 border-indigo-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all"
                >
                  Luyện tập thêm
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
