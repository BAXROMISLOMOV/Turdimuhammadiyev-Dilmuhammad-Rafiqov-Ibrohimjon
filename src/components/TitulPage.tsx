import React from "react";
import { motion } from "motion/react";
import { 
  School, Cpu, Users, GraduationCap, Calendar, 
  MapPin, ArrowRight, BookOpen, Sparkles, Award
} from "lucide-react";

interface TitulPageProps {
  onEnterApp: () => void;
}

export default function TitulPage({ onEnterApp }: TitulPageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Top Academic Banner */}
      <div className="relative overflow-hidden bg-[#15181E] border border-[#2A2D35] rounded-xl p-8 md:p-12 text-center space-y-8 shadow-2xl">
        {/* Abstract glowing backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#4F46E5]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#818CF8]/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Core University Identification */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-[#4F46E5]/10 text-[#818CF8] border border-[#4F46E5]/20 rounded-full shadow-lg shadow-[#4F46E5]/5 animate-pulse">
              <School className="w-10 h-10" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-sm font-bold uppercase tracking-[0.25em] text-[#818CF8] font-mono">
              O'zbekiston Respublikasi
            </h1>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-wider uppercase font-display leading-tight max-w-2xl mx-auto">
              Tashkent International University
            </h2>
            <p className="text-[10px] text-[#6B7280] font-mono tracking-widest uppercase font-bold">
              Katta ma'lumotlar va dasturiy muhandislik kafedrasi
            </p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2A2D35] to-transparent" />

        {/* Coursework & Subject Information */}
        <div className="space-y-3.5">
          <span className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-widest bg-[#4F46E5]/10 border border-[#4F46E5]/20 text-[#818CF8] px-3 py-1 rounded">
            KURS LOYIHASI / LABORATORIYA ISHI GURUHI
          </span>
          
          <div className="space-y-2">
            <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-mono block">FAN / SUBJECT</span>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug uppercase">
              Diskret Tuzilmalar va Matematik Mantiq
            </h3>
          </div>

          <div className="space-y-2 max-w-xl mx-auto bg-[#0A0C10] border border-[#2A2D35] p-4 rounded-lg">
            <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-mono block">MAVZU / THEME</span>
            <p className="text-xs sm:text-sm font-semibold text-gray-200 leading-normal">
              Logisim platformasi asosida kombinatsiyali va ketma-ket mantiqiy sxemalarni loyihalash hamda o'rganish bo'yicha interaktiv dasturiy qo'llanma
            </p>
          </div>
        </div>

        {/* Dynamic decorative visual node representing a logic gate */}
        <div className="flex justify-center items-center gap-1.5 md:gap-3 py-1 font-mono text-[10px] text-[#6B7280]">
          <span className="border border-[#2A2D35] bg-[#0A0C10] px-2.5 py-1 rounded">Kirish (A) ───▶</span>
          <div className="p-2 border border-[#4F46E5] bg-[#4F46E5]/10 rounded font-bold text-[#818CF8]">
            AND / OR / NOT
          </div>
          <span className="border border-[#2A2D35] bg-[#0A0C10] px-2.5 py-1 rounded">───▶ Chiqish (F)</span>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2A2D35] to-transparent" />

        {/* Team Metadata section - Custom grid matching Uzbek academic standards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
          {/* Performers: Names from user query */}
          <div className="bg-[#0A0C10]/80 border border-[#2A2D35] p-4 rounded-lg space-y-3.5">
            <h4 className="text-[10px] font-bold text-[#818CF8] uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Users className="w-3.5 h-3.5" />
              Bajaruvchilar (Talabalar):
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-white">Turdimuhammadiyev Dilmuhammad</div>
                  <div className="text-[10px] text-[#6B7280]">Tashkent International University talabasi</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 border-t border-[#2A2D35]/30 pt-2">
                <GraduationCap className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-white">Rafiqov Ibrohimjon</div>
                  <div className="text-[10px] text-[#6B7280]">Tashkent International University talabasi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Group and evaluation info */}
          <div className="bg-[#0A0C10]/80 border border-[#2A2D35] p-4 rounded-lg space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-[#818CF8] uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Award className="w-3.5 h-3.5" />
                Akademik Ma'lumot:
              </h4>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between border-b border-[#2A2D35]/30 pb-1">
                  <span className="text-[#6B7280]">Akademik Guruh:</span>
                  <span className="font-extrabold text-white">CS 1.25</span>
                </div>
                <div className="flex justify-between border-b border-[#2A2D35]/30 pb-1">
                  <span className="text-[#6B7280]">Bosqich / Kurs:</span>
                  <span className="font-semibold text-[#818CF8]">1-Kurs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Baholash:</span>
                  <span className="font-bold text-emerald-400">Tekshirishga tayyor</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-[#6B7280] font-mono flex items-center justify-between border-t border-[#2A2D35]/30 pt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> 2026-Yil
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Toshkent
              </span>
            </div>
          </div>
        </div>

        {/* Prominent Action Button to Enter Application */}
        <div className="pt-4">
          <button
            onClick={onEnterApp}
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-xl shadow-[#4F46E5]/20 cursor-pointer overflow-hidden transition-all duration-300 transform active:scale-95"
          >
            {/* Glossy hover lighting effect */}
            <div className="absolute inset-x-0 -top-full bottom-full bg-gradient-to-b from-[#818CF8]/30 to-transparent group-hover:top-0 group-hover:bottom-0 transition-all duration-500 pointer-events-none" />
            
            <BookOpen className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span>Interaktiv Darslikka Kirish</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
      
      {/* Quick Access Info Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[10px] text-center">
        <div className="bg-[#15181E] border border-[#2A2D35] py-2 px-3 rounded flex items-center justify-center gap-1.5 text-[#9CA3AF]">
          <Cpu className="w-3.5 h-3.5 text-[#818CF8]" />
          <span>Interactive logic simulator board</span>
        </div>
        <div className="bg-[#15181E] border border-[#2A2D35] py-2 px-3 rounded flex items-center justify-center gap-1.5 text-[#9CA3AF]">
          <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" />
          <span>Game-based educational puzzles</span>
        </div>
        <div className="bg-[#15181E] border border-[#2A2D35] py-2 px-3 rounded flex items-center justify-center gap-1.5 text-[#9CA3AF]">
          <Award className="w-3.5 h-3.5 text-[#818CF8]" />
          <span>Uzbek academic standards compliance</span>
        </div>
      </div>
    </motion.div>
  );
}
