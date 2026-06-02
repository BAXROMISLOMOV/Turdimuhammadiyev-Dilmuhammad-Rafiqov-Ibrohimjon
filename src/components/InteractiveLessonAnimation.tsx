/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Lesson } from "../types";
import { ToggleLeft, ToggleRight, Play, CheckCircle2, Cpu, Grid } from "lucide-react";

interface Props {
  lesson: Lesson;
}

export default function InteractiveLessonAnimation({ lesson }: Props) {
  // Shared state for interactive elements
  const [inpA, setInpA] = useState<number>(0);
  const [inpB, setInpB] = useState<number>(0);
  const [inpC, setInpC] = useState<number>(0);
  
  // Flip-flop states (Persistent state for lessons 19 & 20)
  const [qFlip, setQFlip] = useState<number>(0);
  const [qNotFlip, setQNotFlip] = useState<number>(1);
  const [clockTick, setClockTick] = useState<number>(0);

  // Reset inputs when lesson changes
  useEffect(() => {
    setInpA(0);
    setInpB(0);
    setInpC(0);
    if (lesson.id === 19) {
      // RS default state
      setQFlip(1);
      setQNotFlip(0);
    } else {
      setQFlip(0);
      setQNotFlip(1);
    }
  }, [lesson.id]);

  // Handle sequential updates for flip flops
  const triggerRS = (s: number, r: number) => {
    if (s === 1 && r === 0) {
      setQFlip(1);
      setQNotFlip(0);
    } else if (s === 0 && r === 1) {
      setQFlip(0);
      setQNotFlip(1);
    } else if (s === 1 && r === 1) {
      // Invalid/forbidden state
      setQFlip(-1);
      setQNotFlip(-1);
    }
    // s=0, r=0 is "Hold" (no action)
  };

  const triggerD = (d: number, clk: number) => {
    if (clk === 1) {
      setQFlip(d);
      setQNotFlip(d === 1 ? 0 : 1);
    }
  };

  // Live output evaluation based on current lesson configuration
  let outputVal = 0;
  let customExpr = "";

  const evalBasicGate = (type?: string, a: number = 0, b: number = 0) => {
    switch (type) {
      case "AND": return a && b ? 1 : 0;
      case "OR": return a || b ? 1 : 0;
      case "NOT": return a ? 0 : 1;
      case "NAND": return !(a && b) ? 1 : 0;
      case "NOR": return !(a || b) ? 1 : 0;
      case "XOR": return a !== b ? 1 : 0;
      case "XNOR": return a === b ? 1 : 0;
      default: return 0;
    }
  };

  // Determine values based on active lesson's animation type
  if (lesson.interactiveSample.gateType) {
    outputVal = evalBasicGate(lesson.interactiveSample.gateType, inpA, inpB);
  }

  // Double check De-Morgan's laws
  const lhsDeMorgan = !(inpA && inpB) ? 1 : 0; // (A*B)'
  const rhsDeMorgan = (!inpA || !inpB) ? 1 : 0; // A' + B'

  // K-Map dynamic simplification data
  const [kmapVals, setKmapVals] = useState<number[]>([1, 1, 0, 0]); // Represents cells: A'B', AB', A'B, AB
  const toggleKmapVal = (idx: number) => {
    setKmapVals((prev) => {
      const copy = [...prev];
      copy[idx] = copy[idx] === 1 ? 0 : 1;
      return copy;
    });
  };
  
  // Calculate minimized expression for 2x2 Karno Map:
  // kmapVals indices: 0: A'B', 1: AB', 2: A'B, 3: AB
  let kmapResult = "0";
  if (kmapVals[0] && kmapVals[1] && kmapVals[2] && kmapVals[3]) kmapResult = "1";
  else if (kmapVals[0] && kmapVals[1] && !kmapVals[2] && !kmapVals[3]) kmapResult = "B'";
  else if (kmapVals[2] && kmapVals[3] && !kmapVals[0] && !kmapVals[1]) kmapResult = "B";
  else if (kmapVals[0] && kmapVals[2] && !kmapVals[1] && !kmapVals[3]) kmapResult = "A'";
  else if (kmapVals[1] && kmapVals[3] && !kmapVals[0] && !kmapVals[2]) kmapResult = "A";
  else {
    // Collect separate active terms
    const activeTerms: string[] = [];
    if (kmapVals[0]) activeTerms.push("A'•B'");
    if (kmapVals[1]) activeTerms.push("A•B'");
    if (kmapVals[2]) activeTerms.push("A'•B");
    if (kmapVals[3]) activeTerms.push("A•B");
    kmapResult = activeTerms.length > 0 ? activeTerms.join(" + ") : "0";
  }

  // Active highlighted row in truth table helper
  const isRowActive = (row: any) => {
    if (lesson.id === 5) {
      return (row["Kirish (A)"] ?? row["A"]) === inpA;
    }
    // Trigger RS Row highlighting
    if (lesson.id === 19) {
      if (row.S === inpA && row.R === inpB) {
        return true;
      }
      return false;
    }
    // standard two input gates
    return row.A === inpA && row.B === inpB && (row.Cin !== undefined ? row.Cin === inpC : true);
  };

  return (
    <div className="bg-[#15181E] p-4 rounded border border-[#2A2D35] space-y-4">
      <div className="flex items-center justify-between border-b border-[#2A2D35]/60 pb-2.5">
        <h3 className="text-[11px] font-bold tracking-wider text-[#818CF8] uppercase flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#818CF8]" />
          Mavzuga Mos Interaktiv Laboratoriya & Animatsiya
        </h3>
        <span className="text-[10px] bg-[#0A0C10] text-[#9CA3AF] px-2 py-0.5 rounded border border-[#2A2D35] font-mono">
          Hozirgi holat: A={inpA}, B={inpB}
        </span>
      </div>

      {/* RENDER BASIC INPUT TOGGLES */}
      {lesson.animationType === "basic-logic" && (
        <div className="space-y-4">
          <p className="text-xs text-[#9CA3AF]">
            *Pastdagi kirish pultidagi tugmalarni bosib qiymatlarni o'zgartiring va mantiqiy darvozaning qizil/yashil chiziqlar orqali qanday ishlashini ko'ring:
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-around bg-[#0A0C10] p-4 rounded border border-[#2A2D35]">
            {/* Input switches */}
            <div className="flex flex-col gap-2.5 shrink-0">
              {lesson.interactiveSample.inputs.map((inp, idx) => {
                const val = idx === 0 ? inpA : inpB;
                const setVal = idx === 0 ? setInpA : setInpB;
                return (
                  <div key={inp} className="flex items-center gap-2 bg-[#15181E] py-1 px-2.5 rounded border border-[#2A2D35]">
                    <span className="text-[11px] font-bold font-mono text-[#9CA3AF]">{inp}:</span>
                    <button
                      onClick={() => setVal(val === 1 ? 0 : 1)}
                      className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded flex items-center transition border ${
                        val === 1 
                          ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#818CF8] font-bold" 
                          : "bg-[#1E2229] border-[#2A2D35] text-[#9CA3AF]"
                      }`}
                    >
                      {val === 1 ? <ToggleRight className="w-5 h-5 mr-1 text-[#818CF8]" /> : <ToggleLeft className="w-5 h-5 mr-1 text-[#6B7280]" />}
                      {val === 1 ? "1 (CHIN)" : "0 (YOLG'ON)"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Simulated Logic Gate Diagram */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex flex-col gap-3">
                <div className={`w-3 h-3 rounded-full ${inpA === 1 ? "bg-[#818CF8] shadow-md" : "bg-[#2A2D35]"}`} />
                {lesson.interactiveSample.inputs.length > 1 && (
                  <div className={`w-3 h-3 rounded-full ${inpB === 1 ? "bg-[#818CF8] shadow-md" : "bg-[#2A2D35]"}`} />
                )}
              </div>
              <div className="bg-[#0A0C10] border-2 border-dashed border-[#2A2D35] text-white font-black font-mono text-[11px] py-2 px-4 rounded">
                {lesson.interactiveSample.gateType || "MANTIQIY ELEMENT"}
              </div>
              <div className="h-[2px] w-8 bg-[#2A2D35] relative">
                <div className={`absolute inset-y-0 left-0 transition-all ${outputVal === 1 ? "bg-[#818CF8] w-full" : "bg-[#2A2D35] w-0"}`} />
              </div>
              <div className="text-center">
                <div className="text-[9px] text-[#6B7280] uppercase font-mono tracking-wider">Chiqish (F)</div>
                <div className={`text-xs font-black font-mono px-2.5 py-1 rounded border mt-0.5 ${
                  outputVal === 1 
                    ? "bg-[#4F46E5]/15 text-[#818CF8] border-[#4F46E5]/45 shadow-[0_0_10px_rgba(79,70,229,0.2)] animate-pulse" 
                    : "bg-[#0A0C10] text-[#6B7280] border-[#2A2D35]"
                }`}>
                  F = {outputVal}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER DEMORGAN THEOREM COMPARER (Lesson 10) */}
      {lesson.animationType === "demorgan" && (
        <div className="space-y-4">
          <p className="text-xs text-[#9CA3AF]">
            A va B kirishlarini o'zgartiring va bir vaqtning o'zida chap tomon **LHS ((A•B)')** va o'ng tomon **RHS (Ā+B̄)** ning ishlash tengligiga ishonch hosil qiling:
          </p>
          <div className="bg-[#0A0C10] p-3 rounded border border-[#2A2D35] space-y-3">
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setInpA(inpA === 1 ? 0 : 1)}
                className={`py-1 px-2.5 rounded text-[10px] font-mono font-bold border transition ${inpA === 1 ? "bg-[#4F46E5]/10 text-[#818CF8] border-[#4F46E5]/30" : "bg-[#15181E] border-[#2A2D35] text-[#9CA3AF]"}`}
              >
                Kirish A: {inpA}
              </button>
              <button 
                onClick={() => setInpB(inpB === 1 ? 0 : 1)}
                className={`py-1 px-2.5 rounded text-[10px] font-mono font-bold border transition ${inpB === 1 ? "bg-[#4F46E5]/10 text-[#818CF8] border-[#4F46E5]/30" : "bg-[#15181E] border-[#2A2D35] text-[#9CA3AF]"}`}
              >
                Kirish B: {inpB}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* LHS block */}
              <div className="bg-[#15181E] p-3 rounded border border-[#2A2D35] text-center">
                <div className="text-[9px] text-[#6B7280] uppercase tracking-widest font-mono">Chap Tomon (NAND)</div>
                <div className="text-[10px] text-slate-400 mt-1">F = ¬(A • B)</div>
                <div className={`mt-3 text-lg font-mono font-black ${lhsDeMorgan === 1 ? "text-[#818CF8]" : "text-[#4B5563]"}`}>
                  {lhsDeMorgan}
                </div>
                <div className="text-[8px] text-[#6B7280] mt-1 uppercase font-mono">AND plus Invertor</div>
              </div>
              {/* RHS block */}
              <div className="bg-[#15181E] p-3 rounded border border-[#2A2D35] text-center">
                <div className="text-[9px] text-[#6B7280] uppercase tracking-widest font-mono">O'ng Tomon (Ā + B̄)</div>
                <div className="text-[10px] text-[#9CA3AF] mt-1">F = Ā + B̄</div>
                <div className={`mt-3 text-lg font-mono font-black ${rhsDeMorgan === 1 ? "text-[#818CF8]" : "text-[#4B5563]"}`}>
                  {rhsDeMorgan}
                </div>
                <div className="text-[8px] text-[#6B7280] mt-1 uppercase font-mono">Invertorlar plus OR</div>
              </div>
            </div>

            {lhsDeMorgan === rhsDeMorgan && (
              <div className="text-center text-[10px] text-[#818CF8] font-bold bg-[#4F46E5]/10 py-1 rounded border border-[#4F46E5]/35 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Matematik Tasdiq: {lhsDeMorgan} === {rhsDeMorgan} (Har doim tenglik bajarilyapti!)
              </div>
            )}
          </div>
        </div>
      )}

      {/* NORMAL FORMS DNF/CNF (Lesson 11) */}
      {lesson.animationType === "normal-forms" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            A, B, C pultlarini qo'shing va o'zgaruvchilar dizyunksiyasi va konyunksiyasi (MDNS qiymatlari uning darsligidagi kabi) haqiqiy mantiqiy ifodasini bering:
          </p>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-4">
            <div className="flex gap-3 justify-center">
              {[
                { label: "A", val: inpA, set: setInpA },
                { label: "B", val: inpB, set: setInpB },
                { label: "C", val: inpC, set: setInpC }
              ].map((inp) => (
                <button
                  key={inp.label}
                  onClick={() => inp.set(inp.val === 1 ? 0 : 1)}
                  className={`py-1 px-3 text-xs font-mono font-black border rounded transition ${
                    inp.val === 1 ? "bg-emerald-950/40 text-emerald-400 border-emerald-800" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  {inp.label} = {inp.val}
                </button>
              ))}
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
              <div className="text-center font-mono text-[11px] text-indigo-400 font-bold">
                MDNS formulasining joriy tarkibi:
              </div>
              <p className="text-center font-mono text-xs mt-2 text-slate-300">
                F = (A' * B * C') + (A * B' * C) + (A * B * C)
              </p>
              <div className="mt-3 text-center text-xs text-slate-400">
                Hozirgi qiymat: <span className="font-extrabold text-white">{( (!inpA && inpB && !inpC) || (inpA && !inpB && inpC) || (inpA && inpB && inpC) ) ? "1" : "0"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KARNO MAP INTERACTIVE GRID (Lesson 12) */}
      {lesson.animationType === "k-map" && (
        <div className="space-y-4">
          <p className="text-xs text-[#9CA3AF]">
            Karno xaritasi kataklarini ustiga bosib ularni 1 yoki 0 ga o'zgartiring va o'ng tarafda kompyuter real-vaqtda qanday dars formuladagi kabi soddalashtirib qayta yozishini ko'rib boring:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0A0C10] p-4 rounded border border-[#2A2D35]">
            {/* Left part: Grid */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-[#818CF8] uppercase tracking-widest font-mono text-center">Interactive 2x2 Karno Map</div>
              <div className="grid grid-cols-3 gap-1 border border-[#2A2D35] p-2 rounded bg-[#15181E] text-[10px] font-mono text-center">
                <div className="p-1 text-slate-500">B \ A</div>
                <div className="p-1 text-slate-500 bg-[#0A0C10]">A = 0</div>
                <div className="p-1 text-slate-500 bg-[#0A0C10]">A = 1</div>
                
                <div className="p-1 text-slate-500 bg-[#0A0C10] justify-self-center self-center">B = 0</div>
                <button onClick={() => toggleKmapVal(0)} className={`p-1.5 font-bold hover:bg-[#1E2229] transition rounded border ${kmapVals[0] === 1 ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#818CF8]" : "bg-[#0A0C10] border-[#2A2D35] text-[#4B5563]"}`}>{kmapVals[0]}</button>
                <button onClick={() => toggleKmapVal(1)} className={`p-1.5 font-bold hover:bg-[#1E2229] transition rounded border ${kmapVals[1] === 1 ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#818CF8]" : "bg-[#0A0C10] border-[#2A2D35] text-[#4B5563]"}`}>{kmapVals[1]}</button>

                <div className="p-1 text-slate-500 bg-[#0A0C10] justify-self-center self-center">B = 1</div>
                <button onClick={() => toggleKmapVal(2)} className={`p-1.5 font-bold hover:bg-[#1E2229] transition rounded border ${kmapVals[2] === 1 ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#818CF8]" : "bg-[#0A0C10] border-[#2A2D35] text-[#4B5563]"}`}>{kmapVals[2]}</button>
                <button onClick={() => toggleKmapVal(3)} className={`p-1.5 font-bold hover:bg-[#1E2229] transition rounded border ${kmapVals[3] === 1 ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#818CF8]" : "bg-[#0A0C10] border-[#2A2D35] text-[#4B5563]"}`}>{kmapVals[3]}</button>
              </div>
            </div>

            {/* Right part: simplify explanation */}
            <div className="bg-[#15181E] p-3.5 rounded border border-[#2A2D35] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#818CF8] uppercase font-mono block font-semibold">Soddalashish Hisobi (Algoritmik):</span>
                <p className="text-[10.5px] text-[#9CA3AF] mt-1">2x2 xaritadagi guruhlarni (A va B qiymatlarini inobatga olgan holda) optimal kontur zanjirlash orqali hosil qilingan eng qisqa formula:</p>
              </div>
              <div className="bg-[#0A0C10] p-2 rounded border border-[#2A2D35] text-center mt-3 font-mono">
                <span className="text-[10px] text-[#6B7280]">Eng minimal formulası: </span>
                <span className="text-xs font-bold text-[#818CF8] block mt-1">{kmapResult}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADDERS LOGIC (HALF ADDER / FULL ADDER - Lessons 13-14) */}
      {lesson.animationType === "adder" && (
        <div className="space-y-4">
          <p className="text-xs text-[#9CA3AF]">
            A va B (hamda To'liq jamlagich uchun Cin - kiruvchi ko'churma) signallarini bering va ulardan arifmetik sum hamda carry signallari qanday hosil bo'lishini ko'ring:
          </p>

          <div className="bg-[#0A0C10] p-3 rounded border border-[#2A2D35] space-y-3">
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => setInpA(inpA === 1 ? 0 : 1)} className={`py-1 px-2.5 border hover:bg-[#1E2229] transition text-[10px] font-mono font-bold rounded ${inpA === 1 ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#818CF8]" : "bg-[#15181E] border-[#2A2D35] text-[#9CA3AF]"}`}>
                A = {inpA}
              </button>
              <button onClick={() => setInpB(inpB === 1 ? 0 : 1)} className={`py-1 px-2.5 border hover:bg-[#1E2229] transition text-[10px] font-mono font-bold rounded ${inpB === 1 ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#818CF8]" : "bg-[#15181E] border-[#2A2D35] text-[#9CA3AF]"}`}>
                B = {inpB}
              </button>
              {lesson.id === 14 && (
                <button onClick={() => setInpC(inpC === 1 ? 0 : 1)} className={`py-1 px-2.5 border hover:bg-[#1E2229] transition text-[10px] font-mono font-bold rounded ${inpC === 1 ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#818CF8]" : "bg-[#15181E] border-[#2A2D35] text-[#9CA3AF]"}`}>
                  Ko'chirma bit (Cin) = {inpC}
                </button>
              )}
            </div>

            {/* Calculations outputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#15181E] p-3 rounded text-center border border-[#2A2D35]">
                <span className="text-[9px] text-[#6B7280] uppercase tracking-wide block font-mono">Arifmetik Yig'indi (Sum - S)</span>
                <span className="text-[10px] text-[#9CA3AF] block mt-0.5">{lesson.id === 13 ? "S = A ⊕ B" : "S = A ⊕ B ⊕ Cin"}</span>
                <span className={`text-lg font-mono font-extrabold block mt-2 text-[#818CF8]`}>
                  {lesson.id === 13 ? (inpA !== inpB ? 1 : 0) : ((inpA !== inpB) !== (inpC === 1) ? 1 : 0)}
                </span>
                <div className="text-[8px] text-[#6B7280] uppercase font-mono mt-0.5">XOR logic</div>
              </div>
              <div className="bg-[#15181E] p-3 rounded text-center border border-[#2A2D35]">
                <span className="text-[9px] text-[#6B7280] uppercase tracking-wide block font-mono">Carry out (Cout - Ko'chirma)</span>
                <span className="text-[10px] text-[#9CA3AF] block mt-0.5">{lesson.id === 13 ? "C = A • B" : "Cout = AB + Cin(A⊕B)"}</span>
                <span className={`text-lg font-mono font-extrabold block mt-2 text-[#818CF8]`}>
                  {lesson.id === 13 ? (inpA && inpB ? 1 : 0) : ((inpA && inpB) || (inpC && (inpA !== inpB)) ? 1 : 0)}
                </span>
                <div className="text-[8px] text-[#6B7280] uppercase font-mono mt-0.5">AND-OR logic</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MULTIPLEXERS / DECODERS (Lessons 15-18) */}
      {lesson.animationType === "mux-demux" && (
        <div className="space-y-4">
          <p className="text-xs text-[#9CA3AF]">
            Adres (Saylovchi) bitlarni boshqarish orqali signallarni kerakli portlarga commutatsiya (marshrut) qiling:
          </p>

          <div className="bg-[#0A0C10] p-3 rounded border border-[#2A2D35] space-y-3">
            <div className="flex gap-4 justify-center">
              <button onClick={() => setInpA(inpA === 1 ? 0 : 1)} className="py-1 px-2.5 bg-[#15181E] hover:bg-[#1E2229] border border-[#2A2D35] text-[10px] font-mono font-bold rounded text-[#9CA3AF]">
                Tanlovchi / Adres (S) = {inpA}
              </button>
              {lesson.id === 15 && (
                <div className="flex gap-2">
                  <button onClick={() => setInpB(inpB === 1 ? 0 : 1)} className={`py-1 px-2 border text-[10px] font-mono rounded ${inpB === 1 ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#818CF8]" : "bg-[#15181E] border-[#2A2D35] text-[#9CA3AF]"}`}>
                    I0 = {inpB}
                  </button>
                  <button onClick={() => setInpC(inpC === 1 ? 0 : 1)} className={`py-1 px-2 border text-[10px] font-mono rounded ${inpC === 1 ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#818CF8]" : "bg-[#15181E] border-[#2A2D35] text-[#9CA3AF]"}`}>
                    I1 = {inpC}
                  </button>
                </div>
              )}
            </div>

            {/* Visualizer showing routing paths */}
            <div className="p-3 bg-[#15181E] border border-[#2A2D35] rounded text-center space-y-2">
              {lesson.id === 15 ? (
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase block font-mono">Multipleksor yechimlari:</span>
                  <div className="text-xs mt-1 text-[#9CA3AF]">
                    Siz I{inpA} kanalini tanladingiz. Chiqishda ma'lumot: {" "}
                    <span className="font-black text-[#818CF8]">{inpA === 0 ? inpB : inpC}</span>
                  </div>
                </div>
              ) : lesson.id === 16 ? (
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase block font-mono">Demultipleksor holati:</span>
                  <div className="text-xs mt-1 text-[#9CA3AF]">
                    S={inpA} bo'lgani uchun kiruvchi Data oqimi chiqish Port {inpA} ga yo'llandi.
                    <div className="grid grid-cols-2 gap-2 mt-2 max-w-xs mx-auto">
                      <div className={`p-1 rounded border text-[11px] font-mono ${inpA === 0 ? "border-[#4F46E5]/40 text-[#818CF8]" : "text-[#4B5563] border-[#2A2D35]"}`}>Port 0: {inpA === 0 ? "DATA IN (1)" : "0"}</div>
                      <div className={`p-1 rounded border text-[11px] font-mono ${inpA === 1 ? "border-[#4F46E5]/40 text-[#818CF8]" : "text-[#4B5563] border-[#2A2D35]"}`}>Port 1: {inpA === 1 ? "DATA IN (1)" : "0"}</div>
                    </div>
                  </div>
                </div>
              ) : lesson.id === 17 ? (
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase block font-mono">Shifrator (Encoder) Simulyatsiyasi:</span>
                  <p className="text-[11px] text-[#9CA3AF]">Port {inpA === 0 ? "0 (Aktiv)" : "1 (Aktiv)"} bosildi. Chiqqan ikkilik kod: <span className="font-bold text-[#818CF8] font-mono">0{inpA}</span></p>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase block font-mono">Deshifrator (Decoder) Simulyatsiyasi:</span>
                  <p className="text-[11px] text-[#9CA3AF]">Kirish ikkilik qiymat S={inpA} so'rov qilindi. Faol zanjir liniyasi: <span className="font-bold text-[#818CF8] font-mono">Out{inpA}</span></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEQUENTIAL CIRCUIT FLIP-FLOPS (Lessons 19-20) */}
      {lesson.animationType === "flip-flop" && (
        <div className="space-y-4">
          <p className="text-xs text-[#9CA3AF]">
            Teskari aloqa va xotira elementi. Kalitlarni bosing va trigger uning dars bayonidagi mantiqlari kabi holatlarini qanday xotirlab qolayotganini tahlil qiling:
          </p>

          <div className="bg-[#0A0C10] p-3 rounded border border-[#2A2D35] space-y-3">
            {lesson.id === 19 ? (
              /* RS Flip Flop Control Panel */
              <div className="space-y-4">
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => {
                      setInpA(1); setInpB(0); // S=1, R=0
                      triggerRS(1, 0);
                    }}
                    className="py-1 px-2.5 bg-[#4F46E5]/10 hover:bg-[#4F46E5]/15 border border-[#4F46E5]/35 text-[10px] font-mono font-bold rounded text-[#818CF8]"
                  >
                    Set (S = 1, R = 0)
                  </button>
                  <button 
                    onClick={() => {
                      setInpA(0); setInpB(1); // S=0, R=1
                      triggerRS(0, 1);
                    }}
                    className="py-1 px-2.5 bg-red-950/40 hover:bg-red-950/60 border border-red-900/60 text-[10px] font-mono font-bold rounded text-red-400"
                  >
                    Reset (S = 0, R = 1)
                  </button>
                  <button 
                    onClick={() => {
                      setInpA(0); setInpB(0); // S=0, R=0
                      triggerRS(0, 0);
                    }}
                    className="py-1 px-2.5 bg-[#15181E] hover:bg-[#1E2229] border border-[#2A2D35] text-[10px] font-mono font-bold rounded text-[#9CA3AF]"
                  >
                    Hold (S = 0, R = 0)
                  </button>
                  <button 
                    onClick={() => {
                      setInpA(1); setInpB(1); // S=1, R=1
                      triggerRS(1, 1);
                    }}
                    className="py-1 px-2.5 bg-red-650/40 hover:bg-red-650 border border-red-500 text-[10px] font-mono font-bold rounded text-white"
                  >
                    Invalid (1, 1)
                  </button>
                </div>

                <div className="text-center text-[10.5px] text-[#9CA3AF]">
                  Kirish: S={inpA}, R={inpB} | Chiqish: 
                  <span className="font-extrabold text-[#818CF8] ml-1">Q = {qFlip === -1 ? "Taqiqlangan" : qFlip}</span>, 
                  <span className="font-extrabold text-[#818CF8] ml-1">Q' = {qNotFlip === -1 ? "Taqiqlangan" : qNotFlip}</span>
                </div>
              </div>
            ) : (
              /* D Flip Flop Control Panel with Clock Timer simulation */
              <div className="space-y-3">
                <div className="flex gap-4 items-center justify-center">
                  <div className="flex items-center gap-1.5 bg-[#15181E] px-2 py-0.5 rounded border border-[#2A2D35]">
                    <span className="text-[10px] text-[#6B7280]">D (Data):</span>
                    <button 
                      onClick={() => setInpA(inpA === 1 ? 0 : 1)}
                      className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border ${inpA === 1 ? "bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#818CF8]" : "bg-[#1E2229] border-[#2A2D35] text-[#9CA3AF]"}`}
                    >
                      D = {inpA}
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      // Simulate a safe high clock pulse transition
                      triggerD(inpA, 1);
                      setClockTick((prev) => prev + 1);
                    }}
                    className="py-1 px-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-[10px] font-bold text-white rounded flex items-center gap-1 transition"
                  >
                    Takt impulsi (Pulse Clock CLK=1)
                  </button>
                </div>

                <p className="text-[10px] text-[#6B7280] text-center uppercase tracking-wide font-mono">Takt soati: {clockTick} marta ishladi</p>

                <div className="p-2.5 bg-[#15181E] border border-[#2A2D35] rounded text-center font-mono">
                  <div className="text-[10px] text-[#9CA3AF]">Trigger ichida yashirin eslab qolingan xotira holati:</div>
                  <div className="text-base font-black text-[#818CF8] mt-0.5">Q = {qFlip}</div>
                  <p className="text-[8.5px] text-[#6B7280] mt-0.5">*Tegishli D-Trigger faqat Takt (CLK) tugmasi bosilgandagina D-ninng qiymatini o'ziga yozib manzil saqlaydi!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRUTH TABLE OUTPUT (HIGHLIGHTS THE MATCHING STATE ROW IN REALTIME) */}
      {lesson.truthTable && (
        <div className="space-y-2">
          <div className="text-[10px] text-[#818CF8] uppercase tracking-widest font-extrabold flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5" />
            Zanjir Haqiqiylik Jadvali (Avtomatik yo'l tahlili)
          </div>
          <div className="overflow-hidden border border-[#2A2D35] rounded bg-[#0A0C10]">
            <table className="w-full text-center text-[10.5px] select-none">
              <thead>
                <tr className="bg-[#15181E] text-[#9CA3AF] border-b border-[#2A2D35] font-mono">
                  {lesson.truthTable.headers.map((h) => (
                    <th key={h} className="py-2 px-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2D35]/30 font-mono text-[#9CA3AF]">
                {lesson.truthTable.rows.map((row, idx) => {
                  const isActive = isRowActive(row);
                  return (
                    <tr
                      key={idx}
                      className={`transition-all duration-75 ${
                        isActive
                          ? "bg-[#4F46E5]/10 text-white font-extrabold border-l-2 border-[#4F46E5] pl-2"
                          : "hover:bg-[#1E2229]/40"
                      }`}
                    >
                      {lesson.truthTable.headers.map((colName) => {
                        let renderVal: number | string = row[colName];
                        if (renderVal === -1) renderVal = "Taqiqlangan";
                        return (
                          <td key={colName} className="py-2 px-3">
                            {renderVal}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
