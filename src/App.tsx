/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { lessonsData } from "./lessonsData";
import { Lesson } from "./types";
import LogisimSimulator from "./components/LogisimSimulator";
import LogicGames from "./components/LogicGames";
import InteractiveLessonAnimation from "./components/InteractiveLessonAnimation";
import TitulPage from "./components/TitulPage";
import { 
  BookOpen, Play, Gamepad2, Award, ChevronRight, CheckCircle, 
  Cpu, ArrowLeft, ArrowRight, Bookmark, CircleDot, RefreshCw, 
  Sparkles, CheckSquare, Printer, Info, User, School
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"titul" | "darslik" | "logisim" | "oyinlar" | "xulosa">("titul");
  const [currentLessonId, setCurrentLessonId] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [studentName, setStudentName] = useState<string>("Turdimuhammadiyev Dilmuhammad");

  const currentLesson = lessonsData.find((l) => l.id === currentLessonId) || lessonsData[0];

  const handleCompleteLesson = (id: number) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons((prev) => [...prev, id]);
    }
    // Auto advance to next lesson if available
    if (id < 20) {
      setCurrentLessonId(id + 1);
    } else {
      setActiveTab("oyinlar");
    }
  };

  const toggleLessonStatus = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedLessons.includes(id)) {
      setCompletedLessons((prev) => prev.filter((i) => i !== id));
    } else {
      setCompletedLessons((prev) => [...prev, id]);
    }
  };

  // Progress percentage calculaion
  const progressPercent = Math.round((completedLessons.length / 20) * 100);

  // Group lessons by categories for easy navigation inside the sidebar
  const categories = Array.from(new Set(lessonsData.map((l) => l.category)));

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] font-sans antialiased selection:bg-[#4F46E5]/30 selection:text-[#818CF8]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0F1115]/95 backdrop-blur-md border-b border-[#2A2D35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#4F46E5]/10 border border-[#4F46E5]/30 rounded">
              <Cpu className="w-4 h-4 text-[#818CF8] rotate-45" />
            </div>
            <div>
              <h1 className="text-xs font-black tracking-wider uppercase text-white font-display">Logisim Pro</h1>
              <p className="text-[9px] text-[#6B7280] font-mono font-bold tracking-tight">Diskret Tuzilmalar v2.0</p>
            </div>
          </div>

          {/* Core App Tab Links */}
          <nav className="flex items-center gap-1 p-0.5 bg-[#15181E] rounded-md border border-[#2A2D35]">
            {[
              { id: "titul", label: "Titul Sahifasi", icon: <School className="w-3.5 h-3.5" /> },
              { id: "darslik", label: "Interaktiv Darslik", icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: "logisim", label: "Logisim Laboratoriyasi", icon: <Play className="w-3.5 h-3.5" /> },
              { id: "oyinlar", label: "Mantiqiy O'yinlar (3 ta)", icon: <Gamepad2 className="w-3.5 h-3.5" /> },
              { id: "xulosa", label: "Xulosa & Sertifikat", icon: <Award className="w-3.5 h-3.5" /> }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded text-[11px] font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-[#4F46E5] text-white shadow-sm"
                      : "text-[#9CA3AF] hover:text-white hover:bg-[#1E2229]"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile input */}
          <div className="hidden md:flex items-center gap-2 bg-[#15181E] border border-[#2A2D35] px-2.5 py-1 rounded">
            <User className="w-3 h-3 text-[#6B7280]" />
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Ismingizni kiriting"
              className="bg-transparent border-none text-[11px] text-[#E0E0E0] focus:outline-none w-24 font-bold"
              title="Sertifikat olish uchun ismingizni kiriting"
            />
          </div>
        </div>
      </header>

      {/* Primary Dashboard Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {/* TAB 0: UNIVERSITY TITLE/COVER PAGE (Titul) */}
          {activeTab === "titul" && (
            <TitulPage onEnterApp={() => setActiveTab("darslik")} />
          )}

          {/* TAB 1: INTERACTIVE LESSONS */}
          {activeTab === "darslik" && (
            <motion.div
              key="darslik"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Sidebar: Lessons Directory tree */}
              <div className="lg:col-span-4 bg-[#15181E] rounded-md border border-[#2A2D35] p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-[#818CF8]" />
                    MUNDARIJA (20 QISM)
                  </h2>
                  <span className="text-[9px] bg-[#1E2229] text-[#818CF8] px-2 py-0.5 rounded-full font-mono font-bold">
                    {completedLessons.length}/20 kirmis
                  </span>
                </div>

                {/* Progress Indicator */}
                <div className="space-y-1.5 bg-[#0A0C10] p-2.5 rounded border border-[#2A2D35]">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#6B7280] uppercase">PROGRESS</span>
                    <span className="text-[#818CF8] font-bold">{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1E2229] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#4F46E5] transition-all duration-300" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                  </div>
                </div>

                {/* Categories and List Items */}
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {categories.map((category) => (
                    <div key={category} className="space-y-1">
                      <h3 className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider pl-1 py-1 border-b border-[#2A2D35]/30">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {lessonsData
                          .filter((l) => l.category === category)
                          .map((lesson) => {
                            const isCurrent = lesson.id === currentLessonId;
                            const isDone = completedLessons.includes(lesson.id);
                            return (
                              <div
                                key={lesson.id}
                                onClick={() => setCurrentLessonId(lesson.id)}
                                className={`w-full group text-left px-2 py-1.5 rounded text-[11px] flex items-center justify-between cursor-pointer transition-all ${
                                  isCurrent
                                    ? "bg-[#1E2229] text-white font-semibold border-l-2 border-[#4F46E5] pl-2"
                                    : "text-[#9CA3AF] hover:bg-[#1E2229] hover:text-white"
                                }`}
                              >
                                <span className="truncate pr-2">{lesson.id}. {lesson.title}</span>
                                <button
                                  onClick={(e) => toggleLessonStatus(lesson.id, e)}
                                  className="shrink-0 p-0.5 rounded transition hover:bg-[#1E2229]"
                                  title={isDone ? "O'qilmagan deb belgilash" : "O'qilgan deb belgilash"}
                                >
                                  <CheckSquare
                                    className={`w-3.5 h-3.5 transition-colors ${
                                      isDone ? "text-[#818CF8]" : "text-[#4B5563] hover:text-slate-400"
                                    }`}
                                  />
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main reading content pane */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-[#15181E] border border-[#2A2D35] rounded-lg shadow-xl overflow-hidden p-5 space-y-4">
                  {/* Category Pill Tag */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[9px] font-black tracking-wider uppercase bg-[#4F46E5]/10 text-[#818CF8] py-0.5 px-2 rounded border border-[#4F46E5]/30">
                      {currentLesson.category}
                    </span>
                    <span className="text-[10px] text-[#6B7280] font-mono">SAHIFA: {currentLesson.id}/20</span>
                  </div>

                  {/* Title & Description of Current Lesson */}
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight leading-tight uppercase font-display">
                      {currentLesson.title}
                    </h2>
                    <p className="text-[11px] text-[#9CA3AF] mt-1.5 border-l-2 border-[#4F46E5] pl-2.5 leading-relaxed italic">
                      {currentLesson.summary}
                    </p>
                  </div>

                  {/* Scientific Content Block */}
                  <div className="prose prose-invert max-w-none text-xs text-[#E0E0E0] leading-relaxed border-t border-[#2A2D35] pt-4 whitespace-pre-wrap">
                    {currentLesson.content}
                  </div>

                  {/* Dynamic interactive animation simulation box wrapper */}
                  <div className="pt-2">
                    <InteractiveLessonAnimation lesson={currentLesson} />
                  </div>

                  {/* Pagination control buttons */}
                  <div className="flex items-center justify-between border-t border-[#2A2D35] pt-4 mt-3">
                    <button
                      onClick={() => setCurrentLessonId((prev) => Math.max(1, prev - 1))}
                      disabled={currentLessonId === 1}
                      className="px-3 py-1.5 hover:bg-[#1E2229] disabled:opacity-30 rounded text-xs font-semibold text-[#9CA3AF] flex items-center gap-1 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Orqaga
                    </button>

                    <button
                      onClick={() => handleCompleteLesson(currentLesson.id)}
                      className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-bold rounded text-white flex items-center gap-1.5 shadow-md shadow-[#4F46E5]/10 transition"
                    >
                      {completedLessons.includes(currentLesson.id) ? "Keyingisiga O'tish" : "Tushundim (Kurs belgilash)"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: LOGISIM LABORATORY WORKSPACE */}
          {activeTab === "logisim" && (
            <motion.div
              key="logisim"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-[#15181E] border border-[#2A2D35] p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-[14px] font-bold text-white flex items-center gap-2 uppercase font-display">
                    <Cpu className="w-4 h-4 text-[#818CF8] rotate-45" />
                    Mantiqiy Sxemalarni Loyihalash Simulyatori (Logisim)
                  </h2>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                    Bu yerda mantiqiy darvozalarni simlar yordamida o'zaro bog'lab, o'z sxemalaringizni loyihalashingiz va sinab ko'rishingiz mumkin.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] bg-[#0A0C10] px-2.5 py-1.5 rounded border border-[#2A2D35] text-[#9CA3AF] select-none font-mono">
                  <Info className="w-3.5 h-3.5 text-[#818CF8] shrink-0" />
                  <span>Grid & Wire Snapping</span>
                </div>
              </div>

              {/* Mounted the interactive simulator Canvas */}
              <LogisimSimulator />
            </motion.div>
          )}

          {/* TAB 3: THE 3 INTERACTIVE LOGIC GAMES */}
          {activeTab === "oyinlar" && (
            <motion.div
              key="oyinlar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <LogicGames />
            </motion.div>
          )}

          {/* TAB 4: CONCLUSION & GRADUATION CERTIFICATE */}
          {activeTab === "xulosa" && (
            <motion.div
              key="xulosa"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-5 max-w-4xl mx-auto"
            >
              {/* Scientific course summary summary cards */}
              <div className="bg-[#15181E] border border-[#2A2D35] p-5 rounded-lg space-y-4">
                <span className="text-[9px] tracking-widest font-extrabold text-[#818CF8] uppercase font-mono block">YAKUNIY BOSQICH</span>
                <h2 className="text-lg font-bold text-white tracking-tight border-b border-[#2A2D35] pb-3 font-display uppercase">
                  Diskret Tuzilmalar Kursi Xulosasi
                </h2>
                
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Diskret tuzilmalar fanidan mantiqiy sxemalarni loyihalash va tahlil qilish bo'yicha interaktiv sayohat o'z nihoyasiga yetdi! 
                  Biz darslar davomida Bul algebrasi aksiomalaridan tortib boshlang'ich simvollar, and/or eshiklari, Karno soddalashtirishlari, hamda xotira triggerlarini mantiqan yig'ib chiqdik.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 bg-[#0A0C10] rounded border border-[#2A2D35] space-y-1">
                    <span className="text-[11px] font-bold text-[#818CF8] flex items-center gap-1.5 uppercase font-mono">
                      <CheckSquare className="w-3.5 h-3.5" /> Amaliy ko'nikmalar:
                    </span>
                    <ul className="text-[10px] text-[#9CA3AF] space-y-1 list-disc list-inside mt-2">
                      <li>Logisim yordamida kombinatsiyali zanjirlar yasash</li>
                      <li>To'liq jamlovchi ALU ishlash tamoyillari</li>
                      <li>Sinxronlashtirilgan D-Trigger registrlar xotirasi</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-[#0A0C10] rounded border border-[#2A2D35] space-y-1">
                    <span className="text-[11px] font-bold text-[#818CF8] flex items-center gap-1.5 uppercase font-mono">
                      <Sparkles className="w-3.5 h-3.5" /> Nazariy o'zlashtirishlar:
                    </span>
                    <ul className="text-[10px] text-[#9CA3AF] space-y-1 list-disc list-inside mt-2">
                      <li>De Morgan qonunlarini sxematik shakllantirish</li>
                      <li>Karno kartasi orqali mantiqiy ifodalarni samarali ulash</li>
                      <li>MDNS va MKNS normal mantiq shakllarini tahlil qilish</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Graduation Certificate Panel inside conclusion */}
              <div className="bg-[#15181E] border border-dashed border-[#2A2D35] rounded-lg p-6 text-center space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#4F46E5]/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#818CF8]/5 rounded-full blur-3xl -z-10" />

                <div className="max-w-md mx-auto space-y-3.5">
                  <div className="mx-auto w-10 h-10 bg-[#4F46E5]/10 border border-[#4F46E5]/30 rounded-full flex items-center justify-center text-[#818CF8] shadow-md">
                    <Award className="w-5 h-5 animate-pulse" />
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold tracking-wider uppercase text-white font-display">Mantiqiy Loyihalash Sertifikati</h3>
                    <p className="text-[9px] text-[#6B7280] font-mono">№ DISKRET_LOGIC_{Date.now().toString().slice(6)}</p>
                  </div>

                  <div className="py-2">
                    <span className="text-[10px] text-[#6B7280] block uppercase tracking-wider font-semibold">Ushbu hujjat kursni muvaffaqiyatli tamomlagani uchun beriladi:</span>
                    
                    {/* Enter student name live update */}
                    <div className="mt-2.5 inline-block border-b border-[#2A2D35] px-6 py-1">
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="bg-transparent text-center font-bold text-base text-[#818CF8] focus:outline-none placeholder-[#4B5563]"
                        placeholder="Nomingizni kiriting"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-[#9CA3AF] px-4 leading-relaxed font-sans">
                    Diskret tuzilmalar va raqamli elektronika algoritmlari asosida 20 ta mavzuni mukammal o'zlashtirgan, simulyatorda sxemalar yig'gan va mantiqiy o'yinlarda yuqori natijalar ko'rsatgan mutaxassisga tegishli!
                  </p>

                  <div className="flex items-center justify-center gap-8 text-[10px] text-[#6B7280] font-mono py-2">
                    <div className="text-center">
                      <div className="text-[#9CA3AF]">LogiLogic Pro Team</div>
                      <div className="text-[8px] text-[#4B5563] mt-0.5">SERTIFIKATLANGAN</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#9CA3AF]">BAHOLASH DARAJA</div>
                      <div className="text-[10px] text-green-500 font-bold mt-0.5">A+ (A'LO ENTRA)</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2229] border border-[#2A2D35] hover:bg-[#2A2D35] rounded text-xs font-bold text-white transition"
                    >
                      <Printer className="w-3.5 h-3.5" /> Chop etish / Saqlash (PDF)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Course progression footer */}
      <footer className="bg-[#0A0C10] border-t border-[#2A2D35] mt-8 py-4 text-center select-none text-[10px] text-[#4B5563] font-medium tracking-wide">
        &copy; 2026 Diskret Tuzilmalar va Matematik Mantiq O'quv Qo'llanmasi. Barcha huquqlar saqlangan.
      </footer>
    </div>
  );
}
