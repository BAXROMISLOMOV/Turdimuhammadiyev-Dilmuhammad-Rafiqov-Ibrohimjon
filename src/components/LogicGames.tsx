/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HelpCircle, CheckCircle2, AlertTriangle, RefreshCw, Trophy, ArrowRight, Dna } from "lucide-react";

// Game 1 Questions list
const GATE_DETECTOR_QUESTIONS = [
  {
    table: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 1 }
    ],
    options: ["AND", "OR", "XOR", "NAND"],
    answer: "AND",
    explanation: "Faqat barcha kirishlar 1 bo'lgandagina chiqish elementining qiymati 1 ga teng bo'ladi. Bu - VA (AND) mantiqiy ko'paytirish amali."
  },
  {
    table: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 1 }
    ],
    options: ["AND", "OR", "NOT", "NOR"],
    answer: "OR",
    explanation: "Kamida bitta kirish signali 1 bo'lganda chiqish 1 bo'ladi. Bu - YOKI (OR) mantiqiy qo'shish amali."
  },
  {
    table: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 0 }
    ],
    options: ["OR", "XOR", "XNOR", "NAND"],
    answer: "XOR",
    explanation: "Kirish signallari har xil bo'lgandagina (biri 1, biri 0) chiqish 1 bo'ladi. Bir xillarda 0. Bu - Inkor etuvchi YOKI (XOR)."
  },
  {
    table: [
      { a: 0, b: 0, out: 1 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 0 }
    ],
    options: ["AND", "OR", "NAND", "NOR"],
    answer: "NAND",
    explanation: "Ikkala kirish 1 bo'lganda chiqish 0 bo'ladi, qolgan barcha hollarda 1. Bu - VA-EMAS (NAND) universal elementidir."
  },
  {
    table: [
      { a: 0, b: 0, out: 1 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 1 }
    ],
    options: ["XOR", "XNOR", "NOR", "OR"],
    answer: "XNOR",
    explanation: "Kirishlar bir xil bo'lganda (0 va 0 yoki 1 va 1) chiqish 1 bo'ladi. Bu - mantiqiy ekvivalentlik (XNOR) amali."
  }
];

// Game 2 Questions list (Formula targets)
const FORMULA_PUZZLES = [
  {
    id: 1,
    title: "1-bosqich: Inkor zanjiri",
    description: "A = 1, B = 0 kirishlar uchun chiqishda Y = 1 natijani hosil qiling.",
    inputs: { a: 1, b: 0 },
    target: 1,
    expressionTemplate: "(A {op1} B)",
    operations: ["AND", "OR", "XOR"],
    correctOp: "OR", // 1 OR 0 = 1
    hint: "Ikkala o'zgaruvchi orasiga qaysi mantiq elementini qo'ysa, natijada 1 chiqadi? Faqat AND 0 beradi."
  },
  {
    id: 2,
    title: "2-bosqich: Yarim jamlagich ko'chirmasi",
    description: "A = 1, B = 1 kirishlar uchun Carry out Y = 1 chiqish qiymatini yarating.",
    inputs: { a: 1, b: 1 },
    target: 1,
    expressionTemplate: "A {op1} B",
    operations: ["OR", "AND", "XOR"],
    correctOp: "AND", // 1 AND 1 = 1
    hint: "Yarim jamlagichda Carry (ko'chirma) signali faqat ikkala bit ham 1 bo'lgandagina yuzaga keladi."
  },
  {
    id: 3,
    title: "3-bosqich: Modulo 2 bo'yicha yig'indi",
    description: "A = 1, B = 1 bo'lgan holatda chiqishda Y = 0 natijani chiqaring.",
    inputs: { a: 1, b: 1 },
    target: 0,
    expressionTemplate: "A {op1} B",
    operations: ["OR", "XOR", "AND"],
    correctOp: "XOR", // 1 XOR 1 = 0 (same)
    hint: "Faqat bir xil kirishlarda 0 beradigan, lekin har xillikda 1 beradigan operatorni tanlang."
  }
];

// Game 3 Questions (K-Map Groupings)
const KMAP_QUESTIONS = [
  {
    id: 1,
    title: "Oddiy Karno Soddalashtirishi",
    map: [
      ["B\\A", "A=0", "A=1"],
      ["B=0", "1", "1"],
      ["B=1", "0", "0"]
    ],
    options: ["F = B'", "F = A", "F = A + B", "F = A * B"],
    answer: "F = B'",
    explanation: "Karto xaritasining birinchi satri (B=0 qatori) to'liq 1 lardan iborat bo'lib, ustun bo'yicha o'zgaruvchi A o'zgardi (A=0 dan A=1 ga). Shuning uchun A qisqarib ketadi, va B' (chunki B=0) saqlanib qoladi. Natija: F = B'."
  },
  {
    id: 2,
    title: "Ustun bo'yicha birlashma",
    map: [
      ["B\\A", "A=0", "A=1"],
      ["B=0", "0", "1"],
      ["B=1", "0", "1"]
    ],
    options: ["F = B", "F = A", "F = A'", "F = A • B"],
    answer: "F = A",
    explanation: "Ikkinchi ustun to'liq 1 lardan iborat. B o'zgaruvchisi o'zgargani uchun qisqaradi va A=1 bo'lgani u qoladi. Natija: F = A."
  },
  {
    id: 3,
    title: "Diagonal konyunksiya (Soddalashmaydi)",
    map: [
      ["B\\A", "A=0", "A=1"],
      ["B=0", "1", "0"],
      ["B=1", "0", "1"]
    ],
    options: ["F = A ⊙ B", "F = A ⊕ B", "F = A", "F = A + B"],
    answer: "F = A ⊙ B",
    explanation: "Kattalashtirilgan qator/ustun kontur guruhlarini hosil qilib bo'lmaydi (birlar alohida-alohida diagonal). MDNS ko'rinishi: F = A'B' + AB. Bu esa XNOR (A ⊙ B) mantiqiy tenglik elementiga teng!"
  }
];

export default function LogicGames() {
  const [activeGameTab, setActiveGameTab] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [gameFinishedMessage, setGameFinishedMessage] = useState<string | null>(null);

  // Game 1 state
  const [g1Idx, setG1Idx] = useState<number>(0);
  const [g1Selected, setG1Selected] = useState<string | null>(null);
  const [g1Submitted, setG1Submitted] = useState<boolean>(false);

  // Game 2 state
  const [g2Idx, setG2Idx] = useState<number>(0);
  const [g2SelectedOp, setG2SelectedOp] = useState<string | null>(null);
  const [g2Submitted, setG2Submitted] = useState<boolean>(false);

  // Game 3 state
  const [g3Idx, setG3Idx] = useState<number>(0);
  const [g3Selected, setG3Selected] = useState<string | null>(null);
  const [g3Submitted, setG3Submitted] = useState<boolean>(false);

  const resetGame = () => {
    setScore(0);
    setGameFinishedMessage(null);
    setG1Idx(0);
    setG1Selected(null);
    setG1Submitted(false);
    setG2Idx(0);
    setG2SelectedOp(null);
    setG2Submitted(false);
    setG3Idx(0);
    setG3Selected(null);
    setG3Submitted(false);
  };

  const currentG1 = GATE_DETECTOR_QUESTIONS[g1Idx];
  const currentG2 = FORMULA_PUZZLES[g2Idx];
  const currentG3 = KMAP_QUESTIONS[g3Idx];

  const handleG1Submit = () => {
    if (!g1Selected) return;
    setG1Submitted(true);
    if (g1Selected === currentG1.answer) {
      setScore((prev) => prev + 10);
    }
  };

  const handleG1Next = () => {
    setG1Selected(null);
    setG1Submitted(false);
    if (g1Idx < GATE_DETECTOR_QUESTIONS.length - 1) {
      setG1Idx((prev) => prev + 1);
    } else {
      setGameFinishedMessage(`Darvoza Topishmoq o'yini muvaffaqiyatli yakunlandi! Siz jami unvon oldingiz va ${score + (g1Selected === currentG1.answer ? 10 : 0)} ball to'pladingiz!`);
    }
  };

  const handleG2Submit = () => {
    if (!g2SelectedOp) return;
    setG2Submitted(true);
    if (g2SelectedOp === currentG2.correctOp) {
      setScore((prev) => prev + 15);
    }
  };

  const handleG2Next = () => {
    setG2SelectedOp(null);
    setG2Submitted(false);
    if (g2Idx < FORMULA_PUZZLES.length - 1) {
      setG2Idx((prev) => prev + 1);
    } else {
      setGameFinishedMessage(`Sxemani Yig' o'yini tugadi! Ikkilik zanjir signallaringiz va ballingiz: ${score + (g2SelectedOp === currentG2.correctOp ? 15 : 0)} ga yetdi.`);
    }
  };

  const handleG3Submit = () => {
    if (!g3Selected) return;
    setG3Submitted(true);
    if (g3Selected === currentG3.answer) {
      setScore((prev) => prev + 20);
    }
  };

  const handleG3Next = () => {
    setG3Selected(null);
    setG3Submitted(false);
    if (g3Idx < KMAP_QUESTIONS.length - 1) {
      setG3Idx((prev) => prev + 1);
    } else {
      setGameFinishedMessage(`Karno Chempioni o'yini yakunlandi! Siz diskret mantiq va Karno bo'yicha mukammal mantiqiy darvozalarni bilishingizni isbotladingiz! Jami koeffitsiyentingiz: ${score + (g3Selected === currentG3.answer ? 20 : 0)} ball!`);
    }
  };

  return (
    <div className="bg-[#15181E] border border-[#2A2D35] rounded p-4 text-white">
      {gameFinishedMessage ? (
        <div className="bg-[#0A0C10] border border-[#2A2D35] p-6 rounded text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-[#4F46E5]/10 text-[#818CF8] border border-[#4F46E5]/30 rounded-full">
              <Trophy className="w-6 h-6 animate-bounce" />
            </div>
          </div>
          <h3 className="text-xs font-bold font-mono tracking-widest text-[#818CF8] uppercase">O'YIN YAKUNLANDI (CONGRATULATIONS!)</h3>
          <p className="text-xs text-[#9CA3AF] max-w-md mx-auto leading-relaxed">{gameFinishedMessage}</p>
          <button 
            onClick={resetGame} 
            className="px-4 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[11px] font-bold rounded cursor-pointer transition-all"
          >
            Qayta o'ynash
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#2A2D35]/60 pb-3 mb-4">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-[#818CF8] uppercase flex items-center gap-1.5 font-mono">
                <Trophy className="w-4 h-4 text-[#818CF8] animate-pulse" />
                MANTIQIY O'YINLAR (DISCRET GAMEPLAY)
              </h2>
              <p className="text-[10px] text-[#6B7280] mt-0.5">
                Diskret tuzilmalar fanidan mantiqiy darvozalar, formulalar va Karno xaritalarini o'yin ko'rinishida mustahkamlang.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#0A0C10] px-2.5 py-1 rounded border border-[#2A2D35]">
              <span className="text-[9px] uppercase tracking-wider font-mono text-[#6B7280]">BALL:</span>
              <span className="text-base font-black font-mono text-[#818CF8]">{score}</span>
              <button 
                onClick={resetGame} 
                title="O'yinni qaytadan boshlash"
                className="p-1 hover:bg-[#1E2229] rounded text-[#6B7280] hover:text-white transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Game navigation tabs */}
          <div className="flex gap-1.5 p-1 bg-[#0A0C10] rounded mb-4 max-w-lg border border-[#2A2D35]/40">
            {[
              { id: 1, label: "1. Darvoza Topishmoq" },
              { id: 2, label: "2. Sxemani Yig'" },
              { id: 3, label: "3. Karno Chempioni" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGameTab(tab.id)}
                className={`flex-1 py-1 px-2 text-[10px] font-mono font-bold rounded cursor-pointer transition-all ${
                  activeGameTab === tab.id
                    ? "bg-[#4F46E5]/10 border border-[#4F46E5]/30 text-[#818CF8]"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

      {/* GAME 1 CONTENT */}
      {activeGameTab === 1 && currentG1 && (
        <div className="space-y-3.5">
          <div className="bg-[#0A0C10] border border-[#2A2D35] p-3 rounded flex flex-col md:flex-row gap-4 items-start justify-between">
            <div className="space-y-1 md:max-w-md">
              <h3 className="text-xs font-bold text-indigo-400 tracking-wider font-mono uppercase">DARVOZA DETEKTORI: SAVOL {g1Idx + 1}/5</h3>
              <p className="text-[11px] text-[#9CA3AF] leading-normal">
                Qo'shni jadvalda yashirilgan mantiqiy eshikning kiruvchi (A, B) va chiquvchi zanjir signallari ko'rsatilgan. Bu jadval qaysi elementga tegishli?
              </p>
            </div>
            
            {/* Table visualization */}
            <div className="w-full max-w-xs bg-[#15181E] border border-[#2A2D35]/60 rounded overflow-hidden shrink-0">
              <table className="w-full text-center text-[10.5px]">
                <thead>
                  <tr className="bg-[#0A0C10] text-[#6B7280] border-b border-[#2A2D35]/60 font-mono">
                    <th className="py-1 px-1.5">A</th>
                    <th className="py-1 px-1.5">B</th>
                    <th className="py-1 px-1.5 text-indigo-400 font-extrabold">Natija (F)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2D35]/40 font-mono text-[#D1D5DB]">
                  {currentG1.table.map((row, r_idx) => (
                    <tr key={r_idx} className="hover:bg-[#0A0C10]/40">
                      <td className="py-1">{row.a}</td>
                      <td className="py-1">{row.b}</td>
                      <td className="py-1 font-extrabold text-[#818CF8]">{row.out}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {currentG1.options.map((opt) => {
              const matchesSelected = g1Selected === opt;
              return (
                <button
                  key={opt}
                  onClick={() => !g1Submitted && setG1Selected(opt)}
                  disabled={g1Submitted}
                  className={`py-2 px-3 rounded border text-xs font-mono font-bold transition-all cursor-pointer ${
                    matchesSelected
                      ? "bg-[#4F46E5]/15 border-[#4F46E5] text-[#818CF8]"
                      : "bg-[#0A0C10] border-[#2A2D35] text-[#9CA3AF] hover:border-indigo-400/40"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback section */}
          {g1Submitted ? (
            <div className="p-3 bg-[#0A0C10] border border-[#2A2D35] rounded space-y-1.5">
              <div className="flex items-center gap-1.5">
                {g1Selected === currentG1.answer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-400 font-mono">To'g'ri javob! (+10 ball)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-400 font-mono">Noto'g'ri! To'g'ri javob: {currentG1.answer}</span>
                  </>
                )}
              </div>
              <p className="text-[10.5px] text-[#9CA3AF] leading-relaxed">{currentG1.explanation}</p>
              
              <div className="pt-1">
                <button
                  onClick={handleG1Next}
                  className="px-3 py-1 bg-[#1E2229] hover:bg-[#2A2D35] border border-[#2A2D35] rounded text-[10.5px] font-mono font-bold text-white flex items-center gap-1 cursor-pointer transition-all"
                >
                  {g1Idx < GATE_DETECTOR_QUESTIONS.length - 1 ? (
                    <>Keyingi Savol <ArrowRight className="w-3.5 h-3.5" /></>
                  ) : (
                    "O'yinni Tugatish"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end pt-1">
              <button
                onClick={handleG1Submit}
                disabled={!g1Selected}
                className="px-4 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-40 text-[11px] font-mono font-bold rounded text-white cursor-pointer transition-all"
              >
                Tasdiqlash (Tekshirish)
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 2 CONTENT */}
      {activeGameTab === 2 && currentG2 && (
        <div className="space-y-3.5">
          <div className="bg-[#0A0C10] border border-[#2A2D35] p-3 rounded space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-indigo-400 tracking-wider font-mono uppercase">{currentG2.title}</h3>
              <span className="text-[10px] font-mono text-[#6B7280]">BOSQICH {g2Idx + 1}/3</span>
            </div>
            
            <p className="text-[11px] text-[#9CA3AF]">
              {currentG2.description}
            </p>

            {/* Inputs Box */}
            <div className="bg-[#15181E] border border-[#2A2D35] p-2 rounded flex items-center justify-around">
              <div className="text-center">
                <div className="text-[9px] text-[#6B7280] uppercase font-mono">Signal A</div>
                <div className="text-sm font-black font-mono text-indigo-400">{currentG2.inputs.a}</div>
              </div>
              <div className="h-5 w-px bg-[#2A2D35]" />
              <div className="text-center font-bold text-[#6B7280] text-[9px] font-mono">
                ORALARIY OPERATOR
              </div>
              <div className="h-5 w-px bg-[#2A2D35]" />
              <div className="text-center">
                <div className="text-[9px] text-[#6B7280] uppercase font-mono">Signal B</div>
                <div className="text-sm font-black font-mono text-indigo-400">{currentG2.inputs.b}</div>
              </div>
            </div>

            {/* Target Formula Representation */}
            <div className="text-center py-1.5 bg-[#15181E]/60 rounded border border-dashed border-[#2A2D35]">
              <span className="text-[10px] text-[#6B7280] font-mono">Formula: </span>
              <span className="text-xs font-mono font-bold text-white">
                (A <span className="text-emerald-400 underline font-black mx-1">{g2SelectedOp || "?"}</span> B) = {currentG2.target}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {currentG2.operations.map((op) => (
              <button
                key={op}
                onClick={() => !g2Submitted && setG2SelectedOp(op)}
                disabled={g2Submitted}
                className={`py-1 px-4 rounded border text-xs font-mono font-bold transition-all cursor-pointer ${
                  g2SelectedOp === op
                    ? "bg-[#4F46E5]/15 border-[#4F46E5] text-[#818CF8]"
                    : "bg-[#0A0C10] border-[#2A2D35] text-[#9CA3AF] hover:border-indigo-400/40"
                }`}
              >
                {op}
              </button>
            ))}
          </div>

          {g2Submitted ? (
            <div className="p-3 bg-[#0A0C10] border border-[#2A2D35] rounded space-y-1.5">
              <div className="flex items-center gap-1.5">
                {g2SelectedOp === currentG2.correctOp ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-400 font-mono">To'g'ri! Sxema yig'ildi. (+15 ball)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-400 font-mono">Noto'g'ri tanlov!</span>
                  </>
                )}
              </div>
              <p className="text-[10.5px] text-[#9CA3AF] leading-relaxed">
                Tip: {currentG2.hint}
              </p>

              <div className="pt-1">
                <button
                  onClick={handleG2Next}
                  className="px-3 py-1 bg-[#1E2229] hover:bg-[#2A2D35] border border-[#2A2D35] rounded text-[10.5px] font-mono font-bold text-white flex items-center gap-1 cursor-pointer transition-all"
                >
                  {g2Idx < FORMULA_PUZZLES.length - 1 ? (
                    <>Keyingi Bosqich <ArrowRight className="w-3.5 h-3.5" /></>
                  ) : (
                    "Tugatish"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end pt-1">
              <button
                onClick={handleG2Submit}
                disabled={!g2SelectedOp}
                className="px-4 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-40 text-[11px] font-mono font-bold rounded text-white cursor-pointer transition-all"
              >
                Sxemani ishga tushurish
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 3 CONTENT */}
      {activeGameTab === 3 && currentG3 && (
        <div className="space-y-3.5">
          <div className="bg-[#0A0C10] border border-[#2A2D35] p-3 rounded flex flex-col md:flex-row gap-4 items-start justify-between">
            <div className="space-y-1 md:max-w-md">
              <h3 className="text-xs font-bold text-indigo-400 tracking-wider font-mono uppercase">KARNO KARTALARI: SAVOL {g3Idx + 1}/3</h3>
              <p className="text-[11px] text-[#9CA3AF]">
                Sizga 2x2 o'lchamli Karno xaritasi berilgan. Undan foydalanib eng kichik (soddalashgan) Bul algebra formula ifodasini toping.
              </p>
            </div>

            {/* K-MAP GRID representation */}
            <div className="bg-[#15181E] border border-[#2A2D35] p-2 rounded overflow-hidden shrink-0 w-full max-w-xs font-mono">
              <div className="text-[9px] text-indigo-400 font-bold border-b border-[#2A2D35]/50 pb-1 mb-2 tracking-wider">KARNAUGH MAP (2X2 GRID)</div>
              <div className="grid grid-cols-3 text-center text-[10px] divide-y divide-x divide-[#2A2D35] border border-[#2A2D35] bg-[#0A0C10]">
                {currentG3.map.map((rowArr, rIdx) => (
                  <React.Fragment key={rIdx}>
                    {rowArr.map((cellValue, cIdx) => (
                      <div 
                        key={cIdx} 
                        className={`p-1.5 font-bold ${
                          cellValue === "1" 
                            ? "bg-[#4F46E5]/10 text-[#818CF8]" 
                            : rIdx === 0 || cIdx === 0 
                            ? "text-[#6B7280] bg-[#0A0C10]" 
                            : "text-[#9CA3AF]"
                        }`}
                      >
                        {cellValue}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentG3.options.map((opt) => (
              <button
                key={opt}
                onClick={() => !g3Submitted && setG3Selected(opt)}
                disabled={g3Submitted}
                className={`py-2 px-3 rounded border text-xs font-mono font-bold transition-all text-left cursor-pointer ${
                  g3Selected === opt
                    ? "bg-[#4F46E5]/15 border-[#4F46E5] text-[#818CF8]"
                    : "bg-[#0A0C10] border-[#2A2D35] text-[#9CA3AF] hover:border-indigo-400/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {g3Submitted ? (
            <div className="p-3 bg-[#0A0C10] border border-[#2A2D35] rounded space-y-1.5">
              <div className="flex items-center gap-1.5">
                {g3Selected === currentG3.answer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-400 font-mono">To'g'ri javob! Karno xaritasi soddalashtirildi (+20 ball)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-400 font-mono">Karno tahlili noto'g'ri! To'g'ri ifoda: {currentG3.answer}</span>
                  </>
                )}
              </div>
              <p className="text-[10.5px] text-[#9CA3AF] leading-relaxed">{currentG3.explanation}</p>

              <div className="pt-1">
                <button
                  onClick={handleG3Next}
                  className="px-3 py-1 bg-[#1E2229] hover:bg-[#2A2D35] border border-[#2A2D35] rounded text-[10.5px] font-mono font-bold text-white flex items-center gap-1 cursor-pointer transition-all"
                >
                  {g3Idx < KMAP_QUESTIONS.length - 1 ? (
                    <>Keyingi Savol <ArrowRight className="w-3.5 h-3.5" /></>
                  ) : (
                    "O'yinni Tugatish"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end pt-1">
              <button
                onClick={handleG3Submit}
                disabled={!g3Selected}
                className="px-4 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-40 text-[11px] font-mono font-bold rounded text-white cursor-pointer transition-all"
              >
                Karnoni hisoblash (Tekshirish)
              </button>
            </div>
          )}
        </div>
      )}
        </>
      )}
    </div>
  );
}
