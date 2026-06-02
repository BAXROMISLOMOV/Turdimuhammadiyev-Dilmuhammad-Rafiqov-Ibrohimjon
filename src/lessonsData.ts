/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from "./types";

export const lessonsData: Lesson[] = [
  {
    id: 1,
    title: "1. Kirish va mantiqiy sxemalar tarixi",
    category: "Mantiq Asoslari",
    summary: "Mantiqiy amallar va ularning kompyuter arxitekturasidagi o'rni bilan tanishish.",
    content: `Zamonaviy kompyuter va mikroprotsessorlarning asosi mantiqiy elektron sxemalarga tayanadi. Diskret tuzilmalar fanida mantiqiy sxemalar Bul algebrasi qonunlariga muvofiq ishlaydi. 
    
Tarixda, George Boole (Jorj Bul) XIX asrda mantiq elementlarini matematik simvollar orqali ifodalash tizimini yaratdi. Keyinchalik, Claude Shannon (Klod Shennon) ushbu matematik mantiqni elektr rele sxemalari yordamida joriy etish mumkinligini isbotladi.

Har qanday murakkab dasturiy ta'minot yoki hisoblash jarayoni pirovardida mantiqiy elementlarning (tranzistorlarning kalitlik rejimida) **0 (past kuchlanish, Yolg'on)** va **1 (yuqori kuchlanish, Chin)** signallari bilan ishlashiga bog'liqdir. Logisim kabi dasturlar ushbu jarayonni vizual tushunishga xizmat qiladi.`,
    animationType: "basic-logic",
    interactiveSample: {
      inputs: ["A (Kalit)"],
      outputs: ["F (Chiroq)"],
      expression: "F = A",
      gateType: "NOT",
    }
  },
  {
    id: 2,
    title: "2. Bul algebrasi va mantiqiy amallar",
    category: "Mantiq Asoslari",
    summary: "Bul algebrasi aksiomalari, teoremalari va asosiy mantiqiy amallarining ta'rifi.",
    content: `Bul algebrasi faqat ikkita qiymatga ega bo'lgan to'plam bilan ishlaydi: {0, 1}.

**Asosiy aksiomalar va qoidalar:**
1. **Identifikatsiya:** A + 0 = A va A * 1 = A
2. **Kommutativlik (O'rin almashtirish):** A + B = B + A va A * B = B * A
3. **Distribaktivlik (Taqsimot):** A * (B + C) = (A * B) + (A * C)
4. **Inkor etish:** A + LŌG = 1 va A * LŌG = 0 (bunda LŌG - A ning teskarisi)

Mantiqiy ifodalarni soddalashtirish orqali biz fizikiydagi tranzistorlar va mantiqiy elementlar sonini kamaytiramiz, bu esa elektron plataning narxi va energiya sarfini sezilarli darajada kamaytiradi.`,
    animationType: "basic-logic",
    truthTable: {
      headers: ["A", "B", "A + B (Yoki)", "A * B (Va)"],
      rows: [
        { A: 0, B: 0, "A + B (Yoki)": 0, "A * B (Va)": 0 },
        { A: 0, B: 1, "A + B (Yoki)": 1, "A * B (Va)": 0 },
        { A: 1, B: 0, "A + B (Yoki)": 1, "A * B (Va)": 0 },
        { A: 1, B: 1, "A + B (Yoki)": 1, "A * B (Va)": 1 }
      ]
    },
    interactiveSample: {
      inputs: ["A", "B"],
      outputs: ["F_AND", "F_OR"],
      expression: "AND: A*B, OR: A+B"
    }
  },
  {
    id: 3,
    title: "3. VA (AND) mantiqiy elementi",
    category: "Asosiy Elementlar",
    summary: "Konyunksiya deb ataluvchi mantiqiy ko'paytirish amali, simvoli va haqiqiylik jadvali.",
    content: `**VA (AND) elementi** - mantiqiy ko'paytirishni (konyunksiyani) bajaradi.

Chiqish signali faqat va faqat barcha kirish signallari 1 (Haqiqat) bo'lgandagina 1 qiymatni qabul qiladi. Agar birorta kirish 0 bo'lsa, chiqish har doim 0 bo'ladi.

Matematik ifodasi: **F = A * B** yoki **F = A • B** yoki **F = A & B**.

Elektron sxemalarda VA elementi ketma-ket ulangan ikkita kalitga o'xshaydi: Chiroq yonishi uchun ikkala kalit ham yopiq bo'lishi shart.`,
    animationType: "basic-logic",
    truthTable: {
      headers: ["A", "B", "F = A * B"],
      rows: [
        { A: 0, B: 0, "F = A * B": 0 },
        { A: 0, B: 1, "F = A * B": 0 },
        { A: 1, B: 0, "F = A * B": 0 },
        { A: 1, B: 1, "F = A * B": 1 }
      ]
    },
    interactiveSample: {
      inputs: ["A", "B"],
      outputs: ["Chiqish (F)"],
      expression: "F = A • B",
      gateType: "AND"
    }
  },
  {
    id: 4,
    title: "4. YOKI (OR) mantiqiy elementi",
    category: "Asosiy Elementlar",
    summary: "Dizyunktsiya deb ataluvchi mantiqiy qo'shish amali, sxemadagi o'rni va jadvali.",
    content: `**YOKI (OR) elementi** - mantiqiy qo'shish amalini (dizyunksiya) bajaradi.

Chiqish signali kamida bitta kirish signali 1 bo'lganda 1 qiymatni qabul qiladi. Faqat barcha kirishlar 0 bo'lgandagina chiqish ham 0 bo'ladi.

Matematik ifodasi: **F = A + B** yoki **F = A v B**.

Elektron tushunchada parallel ulangan kalitlarga o'xshaydi: Kirishlardan birortasi yopilsa, tok o'tadi va chiroq yonadi.`,
    animationType: "basic-logic",
    truthTable: {
      headers: ["A", "B", "F = A + B"],
      rows: [
        { A: 0, B: 0, "F = A + B": 0 },
        { A: 0, B: 1, "F = A + B": 1 },
        { A: 1, B: 0, "F = A + B": 1 },
        { A: 1, B: 1, "F = A + B": 1 }
      ]
    },
    interactiveSample: {
      inputs: ["A", "B"],
      outputs: ["Chiqish (F)"],
      expression: "F = A + B",
      gateType: "OR"
    }
  },
  {
    id: 5,
    title: "5. EMAS / INKOR (NOT) mantiqiy elementi",
    category: "Asosiy Elementlar",
    summary: "Mantiqiy inkor amali, kirish signalini teskarisiga o'zgartiruvchi invertor.",
    content: `**EMAS (NOT) elementi** - mantiqiy inkor qilish (invertatlash) amalini bajaradi.

U faqat bitta kirish signaliga ega bo'lib, uni teskari qiymatga aylantiradi. Ya'ni, kirish 0 bo'lsa, chiqish 1; kirish 1 bo'lsa, chiqish 0 bo'ladi.

Sxemalarda ko'pincha kichkina yumaloq tugma (pufakcha) shaklida mantiqiy darvozalar kirish yoki chiqishida ko'rsatiladi.

Matematik ifodasi: **F = A'** yoki **F = Ā**`,
    animationType: "basic-logic",
    truthTable: {
      headers: ["Kirish (A)", "Chiqish (F = Ā)"],
      rows: [
        { "Kirish (A)": 0, "Chiqish (F = Ā)": 1 },
        { "Kirish (A)": 1, "Chiqish (F = Ā)": 0 }
      ]
    },
    interactiveSample: {
      inputs: ["A"],
      outputs: ["F = Ā"],
      expression: "F = Ā",
      gateType: "NOT"
    }
  },
  {
    id: 6,
    title: "6. VA-EMAS (NAND) universal elementi",
    category: "Universal va Murakkab Elementlar",
    summary: "Sheffer shtrixi deb ataluvchi amal. Har qanday sxemani faqat shu element yordamida qurish mumkin.",
    content: `**VA-EMAS (NAND) elementi** - ketma-ket ulangan VA (AND) va EMAS (NOT) elementlarining kombinatsiyasidir.

Chiqish signali faqat barcha kirish signallari bir vaqtda 1 bo'lganda 0 qiymatni oladi. Boshqa barcha hollarda chiqish 1 ga teng.

Matematik ifodasi: **F = (A * B)'** yoki **F = ĀB** ning umumiy inkori.

NAND elementi **universal** hisoblanadi. Chunki uning yordamida AND, OR, NOT amallarining barchasini yaratish mumkin. Bu chip ishlab chiqishni keskin osonlashtiradi.`,
    animationType: "basic-logic",
    truthTable: {
      headers: ["A", "B", "F = (A * B)'"],
      rows: [
        { A: 0, B: 0, "F = (A * B)'": 1 },
        { A: 0, B: 1, "F = (A * B)'": 1 },
        { A: 1, B: 0, "F = (A * B)'": 1 },
        { A: 1, B: 1, "F = (A * B)'": 0 }
      ]
    },
    interactiveSample: {
      inputs: ["A", "B"],
      outputs: ["Chiqish (F)"],
      expression: "F = ¬(A • B)",
      gateType: "NAND"
    }
  },
  {
    id: 7,
    title: "7. YOKI-EMAS (NOR) universal elementi",
    category: "Universal va Murakkab Elementlar",
    summary: "Pirs o'qi deb ataluvchi amal. Ikkinchi universal mantiqiy eshik tahlili.",
    content: `**YOKI-EMAS (NOR) elementi** - parallel mantiqiy qo'shish va keyinchalik inkor qilish kombinatsiyasidir (OR + NOT).

Chiqish signali faqat kirishlarning barchasi 0 bo'lgandagina 1 bo'ladi. Kirishlardan kamida bittasi 1 bo'lsa, chiqish darhol 0 ga aylanadi.

Matematik ifodasi: **F = (A + B)'** yoki **F = ¬(A + B)**.

Xuddi NAND kabi, NOR elementi ham universal hisoblanadi. Faqatgina NOR eshiklaridan foydalanib har qanday murakkab kompyuter sxemasini qaytadan yig'ish mumkin.`,
    animationType: "basic-logic",
    truthTable: {
      headers: ["A", "B", "F = (A + B)'"],
      rows: [
        { A: 0, B: 0, "F = (A + B)'": 1 },
        { A: 0, B: 1, "F = (A + B)'": 0 },
        { A: 1, B: 0, "F = (A + B)'": 0 },
        { A: 1, B: 1, "F = (A + B)'": 0 }
      ]
    },
    interactiveSample: {
      inputs: ["A", "B"],
      outputs: ["Chiqish (F)"],
      expression: "F = ¬(A + B)",
      gateType: "NOR"
    }
  },
  {
    id: 8,
    title: "8. XOR (Inkor etuvchi YOKI) elementi",
    category: "Universal va Murakkab Elementlar",
    summary: "Qat'iy dizyunksiya yoki mod2 bo'yicha qo'shish deb ataluvchi muhim arifmetik mantiq.",
    content: `**XOR (Exclusive OR) elementi** - kirish signallari har xil bo'lganda (biri 0, ikkinchisi 1) chiqishda 1 beradi. Kirishlar bir xil bo'lsa chiqish har doim 0 bo'ladi.

Matematik ifodasi: **F = A ⊕ B** (bu **A•B' + A'•B** ga teng).

Ushbu element raqamli kompyuterlarda arifmetik hisob-kitoblar, ayniqsa qo'shgich (adder), paritet tekshiruvchilari va shifrlash algoritmlari (masalan, kriptografiyadagi OTP shifri) uchun juda muhim hisoblanadi.`,
    animationType: "basic-logic",
    truthTable: {
      headers: ["A", "B", "F = A ⊕ B"],
      rows: [
        { A: 0, B: 0, "F = A ⊕ B": 0 },
        { A: 0, B: 1, "F = A ⊕ B": 1 },
        { A: 1, B: 0, "F = A ⊕ B": 1 },
        { A: 1, B: 1, "F = A ⊕ B": 0 }
      ]
    },
    interactiveSample: {
      inputs: ["A", "B"],
      outputs: ["Chiqish (F)"],
      expression: "F = A ⊕ B",
      gateType: "XOR"
    }
  },
  {
    id: 9,
    title: "9. XNOR (Ekvivalentlik) elementi",
    category: "Universal va Murakkab Elementlar",
    summary: "Mantiqiy tenglik amali bo'lib, kiritilgan qiymatlarning o'zaro o'xshashligini tekshiradi.",
    content: `**XNOR elementi** - inkor etilgan XOR elementidir.

Kirish signallari bir xil qiymatga (ikkalasi ham 0 yoki ikkalasi ham 1) ega bo'lganda chiqish 1 bo'ladi. Agar signallar har xil bo'lsa, chiqish 0 ga teng bo'ladi.

Matematik ifodasi: **F = (A ⊕ B)'** yoki **F = A•B + Ā•B'**.

Bu mantiqiy darvoza asosan taqqoslagich (comparator) sxemalari tuzishda, ya'ni ikki sonning bir-biriga tengligini tekshirish jarayonlarida keng qo'llaniladi.`,
    animationType: "basic-logic",
    truthTable: {
      headers: ["A", "B", "F = A ⊙ B"],
      rows: [
        { A: 0, B: 0, "F = A ⊙ B": 1 },
        { A: 0, B: 1, "F = A ⊙ B": 0 },
        { A: 1, B: 0, "F = A ⊙ B": 0 },
        { A: 1, B: 1, "F = A ⊙ B": 1 }
      ]
    },
    interactiveSample: {
      inputs: ["A", "B"],
      outputs: ["Chiqish (F)"],
      expression: "F = A ⊙ B",
      gateType: "XNOR"
    }
  },
  {
    id: 10,
    title: "10. De Morgan qonunlari",
    category: "Qonuniyatlar va Normal Shakllar",
    summary: "Mantiqiy algebra konvertatsiyasidagi eng muhim qonuniyatlar va ularning sxemadagi talqini.",
    content: `De Morgan qonunlari mantiqiy ko'paytma inkorini yig'indilar inkoriga va aksincha, mantiqiy yig'indi inkorini ko'paytmalar inkoriga tenglashtiradi:

1. **Birinchi qonun:** **(A * B)' = A' + B'**
   *(VA-EMAS eshigi kirishlari mantiqan inkor qilingan YOKI eshigiga teng)*
   
2. **Ikkinchi qonun:** **(A + B)' = A' * B'**
   *(YOKI-EMAS eshigi kirishlari mantiqan inkor qilingan VA eshigiga teng)*

Ushbu qonunlar mikrosxemalarni loyihalashda elementlar turini (masalan, and/or o'rniga faqat nand/nor ishlatish) optimallashtirishda xizmat qiladi.`,
    animationType: "demorgan",
    interactiveSample: {
      inputs: ["A", "B"],
      outputs: ["LHS ((A•B)')", "RHS (Ā+B̄)"],
      expression: "¬(A•B) = Ā + B̄"
    }
  },
  {
    id: 11,
    title: "11. Normal shakllar (MKNS va MDNS)",
    category: "Qonuniyatlar va Normal Shakllar",
    summary: "Mukammal Dizyunktiv Normal Shakl va Mukammal Konyunktiv Normal Shakl haqida dars.",
    content: `Ixtiyoriy mantiqiy ifodani standard ko'rinishga keltirish uchun mantiqiy normal shakllar qo'llaniladi:

1. **Mukammal Dizyunktiv Normal Shakl (MDNS - DNF):** 
   Haqiqiylik jadvalidagi **chiqishi 1** bo'lgan qatorlar asosida yoziladi. Har bir qator o'zgaruvchilarining konyunksiyasi (ko'paytmasi) bo'lib, o'zaro dizyunksiya (yig'indi) bilan bog'lanadi.
   *Masalan:* F = A'B + AB'

2. **Mukammal Konyunktiv Normal Shakl (MKNS - CNF):**
   Haqiqiylik jadvalidagi **chiqishi 0** bo'lgan qatorlar asosida yoziladi. Har bir qator elementlarining dizyunksiyasi o'zaro konyunksiyalar bilan ulanadi.
   *Masalan:* F = (A + B) * (A' + B')`,
    animationType: "normal-forms",
    interactiveSample: {
      inputs: ["A", "B", "C"],
      outputs: ["F = MDNS"],
      expression: "F = ĀB + AB'"
    }
  },
  {
    id: 12,
    title: "12. Karno xaritasi yordamida soddalashtirish",
    category: "Qonuniyatlar va Normal Shakllar",
    summary: "Mantiqiy ifodalarni grafik jadval yordamida minimal ko'rinishga keltirish usuli.",
    content: `**Karno xaritasi (Karnaugh Map / K-Map)** - mantiqiy ifodalarni inson ko'zi yordamida osongina soddalashtirish imkonini beruvchi jadval usulidir.

Jadval kataklari Gray kodi tizimi bo'yicha ketma-ket joylashtiriladi (faqat 1 bit farq qiladigan qo'shnichilik). Kataklardagi 1 qiymatlari 2^n (1, 2, 4, 8) o'lchamli guruhlarga (konturlarga) birlashtiriladi.

**Soddalashtirish qoidasi:** Guroh ichida o'z qiymatini o'zgartirgan o'zgaruvchi qisqarib ketadi, o'zgarishsiz qolgan o'zgaruvchi esa yakuniy minimal ifodada saqlanib qoladi.`,
    animationType: "k-map",
    interactiveSample: {
      inputs: ["A", "B"],
      outputs: ["F_Soddalashgan"],
      expression: "K-Map simplification 2x2"
    }
  },
  {
    id: 13,
    title: "13. Yarim jamlagich (Half Adder) sxemasi",
    category: "Jamlovchi va Kommutatsiya Sxemalari",
    summary: "Ikki dona bir bitli mantiqiy sonlarni qo'shuvchi boshlang'ich raqamli arifmetika sxema.",
    content: `**Yarim jamlagich (Half Adder)** - ikki bitli sonlarni (A va B) qo'shish amalini bajaradi va ikki xil chiqish hosil qiladi:
1. **Yig'indi (S - Sum):** XOR darvozasi orqali hisoblanadi (**S = A ⊕ B**).
2. **Ko'chirma (C - Carry out):** VA (AND) darvozasi yordamida hisoblanadi (**C = A * B**).

U kichik mantiqiy modullardan biri bo'lib, o'zidan oldingi razryaddan o'tgan carry (ko'chirma) signalni qabul qila olmagani uchun 'Yarim' deb ataladi.`,
    animationType: "adder",
    truthTable: {
      headers: ["A", "B", "S (Yig'indi)", "C (Ko'chirma)"],
      rows: [
        { A: 0, B: 0, "S (Yig'indi)": 0, "C (Ko'chirma)": 0 },
        { A: 0, B: 1, "S (Yig'indi)": 1, "C (Ko'chirma)": 0 },
        { A: 1, B: 0, "S (Yig'indi)": 1, "C (Ko'chirma)": 0 },
        { A: 1, B: 1, "S (Yig'indi)": 0, "C (Ko'chirma)": 1 }
      ]
    },
    interactiveSample: {
      inputs: ["A", "B"],
      outputs: ["Sum (S)", "Carry (C)"],
      expression: "S = A ⊕ B, C = A • B",
      gateType: "HALF-ADDER"
    }
  },
  {
    id: 14,
    title: "14. To'liq jamlagich (Full Adder) sxemasi",
    category: "Jamlovchi va Kommutatsiya Sxemalari",
    summary: "Oldingi razryaddan ko'chirma signalni ham hisobga oluvchi universal qo'shuvchi zanjir.",
    content: `**To'liq jamlagich (Full Adder)** - uchta kirish bitini qo'shadi: ikki asosiy bit (A, B) va oldingi razryaddan kelgan ko'chirma bit (**Cin**).

U ikkita yarim jamlagich va bitta OR darvozasidan iborat:
- **Sum (S) = A ⊕ B ⊕ Cin**
- **Cout = (A * B) + (Cin * (A ⊕ B))**

Kompyuter protsessorining ALU (Arifmetik Mantiqiy Qurilma) qismi ko'p razryadli sonlarni qo'shish uchun ko'plab To'liq Jamlagichlarni ketma-ket kaskad shaklida ulash orqali tuziladi.`,
    animationType: "adder",
    truthTable: {
      headers: ["A", "B", "Cin", "S", "Cout"],
      rows: [
        { A: 0, B: 0, Cin: 0, S: 0, Cout: 0 },
        { A: 0, B: 1, Cin: 0, S: 1, Cout: 0 },
        { A: 1, B: 0, Cin: 0, S: 1, Cout: 0 },
        { A: 1, B: 1, Cin: 0, S: 0, Cout: 1 },
        { A: 0, B: 0, Cin: 1, S: 1, Cout: 0 },
        { A: 0, B: 1, Cin: 1, S: 0, Cout: 1 },
        { A: 1, B: 0, Cin: 1, S: 0, Cout: 1 },
        { A: 1, B: 1, Cin: 1, S: 1, Cout: 1 }
      ]
    },
    interactiveSample: {
      inputs: ["A", "B", "Cin"],
      outputs: ["Sum (S)", "Cout"],
      expression: "S = A⊕B⊕Cin, Cout = AB + Cin(A⊕B)",
      gateType: "FULL-ADDER"
    }
  },
  {
    id: 15,
    title: "15. Multipleksor (MUX) sxemalari",
    category: "Jamlovchi va Kommutatsiya Sxemalari",
    summary: "Ko'p kirish signallaridan birini tanlovchi boshqaruv kaliti haqida dars.",
    content: `**Multipleksor (MUX)** - bir nechta axborot kirish kanallaridan birini tanlab, yagona chiqishga uzatuvchi selektor zanjiridir.

Kirishlardan qaysi biri chiqishga uzatilishini **boshqaruvchi (adres) signallar** hal qiladi.
Agar MUXda 2^n dona axborot kirishi bo'lsa, u n dona boshqaruvchi (select) kirishiga ega bo'ladi.

*Masalan:* 2:1 MUX mantiqiy ifodasi: **F = S'•I0 + S•I1** (bunda S - tanlovchi signal, I0 va I1 axborotlar). Compterlarda ma'lumotlar yo'lini marshrutlash uchun xizmat qiladi.`,
    animationType: "mux-demux",
    interactiveSample: {
      inputs: ["I0 (Kanal 0)", "I1 (Kanal 1)", "S (Tanlovchi)"],
      outputs: ["Chiqish (Y)"],
      expression: "Y = S'•I0 + S•I1",
      gateType: "MUX"
    }
  },
  {
    id: 16,
    title: "16. Demultipleksor (DEMUX) mantiqiy ishi",
    category: "Jamlovchi va Kommutatsiya Sxemalari",
    summary: "Bitta kirish ma'lumotini bir nechta chiqish yo'nalishlaridan biriga marshrutlash.",
    content: `**Demultipleksor (DEMUX)** - multipleksorning teskari vazifasini bajaradi. U bitta kirish signalini adres signallariga muvofiq, ko'plab chiqish kanallaridan biriga uzatadi.

Agar DEMUX n dona boshqaruvchi kirishga ega bo'lsa, chiqishlar soni 2^n gacha bo'lishi mumkin.

*Qo'llanilishi:* Kompyuter xotirasiga ma'lumot yozishda, ma'lumot uzatish tarmoqlarida dekoderlash va yuklashda muhim operatsiyalarda keng ishlatiladi.`,
    animationType: "mux-demux",
    interactiveSample: {
      inputs: ["Data (D)", "S (Adres)"],
      outputs: ["Out0 (Y0)", "Out1 (Y1)"],
      expression: "Y0 = D•S', Y1 = D•S",
      gateType: "DEMUX"
    }
  },
  {
    id: 17,
    title: "17. Shifrator (Encoder) ishlash prinsipi",
    category: "Jamlovchi va Kommutatsiya Sxemalari",
    summary: "Kirish signallarini qisqaroq ikkilik kodga aylantirib beruvchi qurilma tahlili.",
    content: `**Shifrator (Encoder)** - kirayotgan faol signal raqamini ikkilik kod ko'rinishiga o'tkazib beradi. 

Masalan, 2^n dona kirish portiga ega shifrator o'z chiqishida n bitli ikkilik kod hosil qiladi. Agar 8 (oktal) ta kirish tugmasidan biri bosilsa, chiqishda uning 3 bitli ikkilik kodi (000 dan 111 gacha) yuzaga keladi.

U asosan klaviatura tugmalarining bosilishini o'qib, ularni protsessor uchun mos ikkilik kodga o'tkazishda qo'llaniladi (ustuvorlik shifratorlari).`,
    animationType: "mux-demux",
    interactiveSample: {
      inputs: ["In0", "In1", "In2", "In3"],
      outputs: ["Out1 (Bit 1)", "Out0 (Bit 0)"],
      expression: "4-to-2 Binary Encoder",
      gateType: "ENCODER"
    }
  },
  {
    id: 18,
    title: "18. Deshifrator (Decoder) va uning vazifasi",
    category: "Jamlovchi va Kommutatsiya Sxemalari",
    summary: "Ikkilik kodni bitta faol jismoniy liniyaga tarjima qilish, xotira manzillarini tanlash.",
    content: `**Deshifrator (Decoder)** - kirishidagi n bitli ikkilik kodni tahlil qilib, unga mos ravishda 2^n dona chiqish portlarining faqat bittasini 1 (faol) qiymatga keltiradi.

Asosan protsessor buyruqlarini dekodlash, kompyuter tezkor xotirasi (RAM) dagi aniq katakchalar manzilini (address resolution) tekshirish va tanlash uchun ko'p qo'llaniladi.

*Masalan:* 2-to-4 dekoderda, kirish [0, 1] bo'lsa, chiqishlardan faqat ikkinchisi (Out1) faollashadi, qolgan chiqishlar esa 0 bo'lib qoladi.`,
    animationType: "mux-demux",
    interactiveSample: {
      inputs: ["A1 (Bit 1)", "A0 (Bit 0)"],
      outputs: ["Out0", "Out1", "Out2", "Out3"],
      expression: "2-to-4 Decoder",
      gateType: "DECODER"
    }
  },
  {
    id: 19,
    title: "19. RS-Trigger (Sequential Logic) zanjiri",
    category: "Ketma-ketlik va Xotira Sxemalari",
    summary: "Tezkari aloqa zanjirli birinchi xotira elementi. Reset va Set mantiqlari.",
    content: `Shu paytgacha ko'rilgan sxemalar faqat joriy kirish holatiga bog'liq (kombinatsiyali sxemalar). Ketma-ketlik sxemalari esa **o'zining oldingi holatini (xotirasini)** saqlab qoladi.

**RS-Trigger (Reset-Set Flip-Flop)** nor yoki nand eshiklarining teskari aloqa zanjiri shaklida ulanishidan hosil bo'ladi:
- **Set (S) = 1, Reset (R) = 0:** Trigggerni ishga tushuradi, ya'ni chiqish Q = 1 bo'ladi.
- **S = 0, R = 1:** Trigger o'chadi, Q = 0.
- **S = 0, R = 0:** Saqlash holati (oldingi Q qiymati o'zgarmasdan saqlanadi).
- **S = 1, R = 1:** Taqqiqlangan (noaniq) holat.

Bu kompyuterlardagi statik xotira (SRAM) yachekalarining eng sodda ko'rinishidir.`,
    animationType: "flip-flop",
    truthTable: {
      headers: ["S", "R", "Q_oldingi", "Q_yangi", "Izoh"],
      rows: [
        { S: 0, R: 0, Q_oldingi: 0, Q_yangi: 0, Izoh: 0 }, // 0 o'rnida saqlash
        { S: 0, R: 1, Q_oldingi: 1, Q_yangi: 0, Izoh: 1 }, // Reset bo'lish
        { S: 1, R: 0, Q_oldingi: 0, Q_yangi: 1, Izoh: 2 }, // Set bo'lish
        { S: 1, R: 1, Q_oldingi: 0, Q_yangi: -1, Izoh: 3 } // Noaniq holat!
      ]
    },
    interactiveSample: {
      inputs: ["S (Set)", "R (Reset)"],
      outputs: ["Q (To'g'ri)", "Q' (Inkor)"],
      expression: "RS-latch logic structure",
      gateType: "RS-TRIGGER"
    }
  },
  {
    id: 20,
    title: "20. D-Trigger (Delay / Memory) va Taktlash",
    category: "Ketma-ketlik va Xotira Sxemalari",
    summary: "Takt generatori ishtirokidagi xavfsiz va aniq mantiqiy xotira darvozasi.",
    content: `**D-Trigger (Data / Delay)** - RS-triggersagi mantiqiy taqiqlangan holat (S=1, R=1) xavfini butunlay bartaraf etadi va faqat taktlash (soat / clock) impulsi kelgandagina ma'lumotni eslab qoladi.

U ikkita kirishga ega: **D (Data - ma'lumot)** va **CLK (Clock - takt signal)**.

- CLK = 0 bo'lganda, kirishdagi D qiymati o'zgarsa ham xotira holati (Q) aslo o'zgarmaydi.
- CLK = 1 bo'lgan (yoki taktning ko'tarilish chetida), Q chiqish kirishdagi D ning qiymatini nusxalab oladi va eslab qoladi.

Taktlash orqali butun protsessor ichidagi millionlab xotira elementlari bir datchik vaqt pulsiga muvofiq sinxron tarzda ishlaydi. Bu registrlar yaratishning asosidir.`,
    animationType: "flip-flop",
    interactiveSample: {
      inputs: ["D (Ma'lumot)", "CLK (Takt shakli)"],
      outputs: ["Q (Xotira Qiymati)"],
      expression: "Q(t+1) = D (Triggered on CLK = 1)",
      gateType: "D-TRIGGER"
    }
  }
];
