/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { SimNode, SimWire, JointType } from "../types";
import { 
  Play, RotateCcw, Plus, Trash2, HelpCircle, 
  ToggleLeft, ToggleRight, Lightbulb, Grid, CheckCircle
} from "lucide-react";

// Presets representing classic circuits in Logisim
const PRESETS = [
  {
    name: "Yarim Jamlagich (Half Adder)",
    description: "XOR yordamida yig'indi, AND yordamida ko'chirma hisoblanuvchi qo'shgich.",
    nodes: [
      { id: "in_a", type: "INPUT" as const, x: 50, y: 100, inputs: [], outputValue: 0, label: "Kirish A" },
      { id: "in_b", type: "INPUT" as const, x: 50, y: 220, inputs: [], outputValue: 1, label: "Kirish B" },
      { id: "gate_xor", type: "XOR" as const, x: 230, y: 80, inputs: [{ id: "0", value: 0 }, { id: "1", value: 0 }], outputValue: 0, label: "XOR" },
      { id: "gate_and", type: "AND" as const, x: 230, y: 200, inputs: [{ id: "0", value: 0 }, { id: "1", value: 0 }], outputValue: 0, label: "AND" },
      { id: "out_s", type: "OUTPUT" as const, x: 420, y: 100, inputs: [{ id: "0", value: 0 }], outputValue: 0, label: "Yig'indi (S)" },
      { id: "out_c", type: "OUTPUT" as const, x: 420, y: 220, inputs: [{ id: "0", value: 0 }], outputValue: 0, label: "Ko'chirma (C)" }
    ],
    wires: [
      { id: "w1", fromNodeId: "in_a", toNodeId: "gate_xor", toInputIdx: 0 },
      { id: "w2", fromNodeId: "in_b", toNodeId: "gate_xor", toInputIdx: 1 },
      { id: "w3", fromNodeId: "in_a", toNodeId: "gate_and", toInputIdx: 0 },
      { id: "w4", fromNodeId: "in_b", toNodeId: "gate_and", toInputIdx: 1 },
      { id: "w5", fromNodeId: "gate_xor", toNodeId: "out_s", toInputIdx: 0 },
      { id: "w6", fromNodeId: "gate_and", toNodeId: "out_c", toInputIdx: 0 }
    ]
  },
  {
    name: "RS-Trigger (SRAM yachekasi)",
    description: "Ikkita taqiqlangan teskari aloqa NOR darvozasi yordamida holat saqlovchi trigger.",
    nodes: [
      { id: "in_s", type: "INPUT" as const, x: 50, y: 100, inputs: [], outputValue: 0, label: "Set (S)" },
      { id: "in_r", type: "INPUT" as const, x: 50, y: 240, inputs: [], outputValue: 0, label: "Reset (R)" },
      { id: "nor_top", type: "NOR" as const, x: 230, y: 90, inputs: [{ id: "0", value: 0 }, { id: "1", value: 0 }], outputValue: 1, label: "NOR 1" },
      { id: "nor_bottom", type: "NOR" as const, x: 230, y: 210, inputs: [{ id: "0", value: 0 }, { id: "1", value: 0 }], outputValue: 0, label: "NOR 2" },
      { id: "out_q", type: "OUTPUT" as const, x: 420, y: 110, inputs: [{ id: "0", value: 0 }], outputValue: 1, label: "Chiqish Q" },
      { id: "out_q_not", type: "OUTPUT" as const, x: 420, y: 230, inputs: [{ id: "0", value: 0 }], outputValue: 0, label: "Inkor Q'" }
    ],
    wires: [
      { id: "w1", fromNodeId: "in_s", toNodeId: "nor_top", toInputIdx: 0 },
      { id: "w2", fromNodeId: "in_r", toNodeId: "nor_bottom", toInputIdx: 1 },
      { id: "w3", fromNodeId: "nor_top", toNodeId: "nor_bottom", toInputIdx: 0 },
      { id: "w4", fromNodeId: "nor_bottom", toNodeId: "nor_top", toInputIdx: 1 },
      { id: "w5", fromNodeId: "nor_top", toNodeId: "out_q", toInputIdx: 0 },
      { id: "w6", fromNodeId: "nor_bottom", toNodeId: "out_q_not", toInputIdx: 0 }
    ]
  },
  {
    name: "Invertor zanjiri (Miltillovchi)",
    description: "NOT elementi chiqishini uning kirishiga ulash orqali hosil qilingan generator.",
    nodes: [
      { id: "gate_not", type: "NOT" as const, x: 200, y: 150, inputs: [{ id: "0", value: 0 }], outputValue: 1, label: "NOT" },
      { id: "out_pulse", type: "OUTPUT" as const, x: 380, y: 150, inputs: [{ id: "0", value: 0 }], outputValue: 1, label: "Impuls chiqishi" }
    ],
    wires: [
      { id: "w1", fromNodeId: "gate_not", toNodeId: "out_pulse", toInputIdx: 0 },
      { id: "w2", fromNodeId: "gate_not", toNodeId: "gate_not", toInputIdx: 0 }
    ]
  }
];

export default function LogisimSimulator() {
  const [nodes, setNodes] = useState<SimNode[]>(() => {
    // Default load Half Adder
    return JSON.parse(JSON.stringify(PRESETS[0].nodes));
  });
  const [wires, setWires] = useState<SimWire[]>(() => {
    return JSON.parse(JSON.stringify(PRESETS[0].wires));
  });

  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<{ nodeId: string } | null>(null);
  const [selectedTool, setSelectedTool] = useState<JointType | "WIRE" | "DELETE" | null>(null);
  const [infoMessage, setInfoMessage] = useState<string>("Tepadagi elementlarni tanlab, ish maydoniga qo'shing. Sim o'tkazish uchun elementlarning o'ng terminalidan ikkinchi element chap terminaliga torting.");

  const workspaceRef = useRef<HTMLDivElement>(null);

  // Propagate calculations through simulation graph
  const runSimulation = (currentNodes: SimNode[], currentWires: SimWire[]): SimNode[] => {
    let cloned = JSON.parse(JSON.stringify(currentNodes)) as SimNode[];
    
    // Perform 12 iterations to solve feedback loops (like RS laches or oscillators)
    for (let round = 0; round < 12; round++) {
      // Initialize inputs using wires
      for (let n of cloned) {
        if (n.type !== "INPUT") {
          n.inputs.forEach((inp) => {
            inp.value = 0;
          });
        }
      }

      for (let wire of currentWires) {
        const source = cloned.find((nd) => nd.id === wire.fromNodeId);
        const target = cloned.find((nd) => nd.id === wire.toNodeId);
        if (source && target) {
          if (target.inputs[wire.toInputIdx]) {
            target.inputs[wire.toInputIdx].value = source.outputValue;
          }
        }
      }

      // Recalculate outputs for each gate
      for (let n of cloned) {
        if (n.type === "INPUT") {
          // kept intact
        } else if (n.type === "AND") {
          n.outputValue = (n.inputs[0]?.value === 1 && n.inputs[1]?.value === 1) ? 1 : 0;
        } else if (n.type === "OR") {
          n.outputValue = (n.inputs[0]?.value === 1 || n.inputs[1]?.value === 1) ? 1 : 0;
        } else if (n.type === "NOT") {
          n.outputValue = n.inputs[0]?.value === 1 ? 0 : 1;
        } else if (n.type === "NAND") {
          n.outputValue = (n.inputs[0]?.value === 1 && n.inputs[1]?.value === 1) ? 0 : 1;
        } else if (n.type === "NOR") {
          n.outputValue = (n.inputs[0]?.value === 1 || n.inputs[1]?.value === 1) ? 0 : 1;
        } else if (n.type === "XOR") {
          n.outputValue = (n.inputs[0]?.value !== n.inputs[1]?.value) ? 1 : 0;
        } else if (n.type === "XNOR") {
          n.outputValue = (n.inputs[0]?.value === n.inputs[1]?.value) ? 1 : 0;
        } else if (n.type === "OUTPUT") {
          n.outputValue = n.inputs[0]?.value ?? 0;
        }
      }
    }
    return cloned;
  };

  // Run simulation whenever nodes / wires structurally change
  useEffect(() => {
    setNodes((prev) => runSimulation(prev, wires));
  }, [wires]);

  const toggleInputNode = (id: string) => {
    setNodes((prev) => {
      const updated = prev.map((node) => {
        if (node.id === id && node.type === "INPUT") {
          return { ...node, outputValue: node.outputValue === 1 ? 0 : 1 };
        }
        return node;
      });
      return runSimulation(updated, wires);
    });
  };

  const handleWorkspaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedTool || selectedTool === "WIRE" || selectedTool === "DELETE") return;

    if (workspaceRef.current) {
      const rect = workspaceRef.current.getBoundingClientRect();
      // Snap to 10px grid
      const x = Math.round((e.clientX - rect.left - 50) / 10) * 10;
      const y = Math.round((e.clientY - rect.top - 30) / 10) * 10;

      const newId = `${selectedTool.toLowerCase()}_${Date.now()}`;
      
      const inputCount = selectedTool === "NOT" || selectedTool === "OUTPUT" ? 1 : selectedTool === "INPUT" ? 0 : 2;
      const initialInputs = Array.from({ length: inputCount }, (_, idx) => ({ id: `${idx}`, value: 0 }));

      const newNode: SimNode = {
        id: newId,
        type: selectedTool,
        x,
        y: Math.max(20, y),
        inputs: initialInputs,
        outputValue: selectedTool === "NOT" ? 1 : 0,
        label: `${selectedTool} ${nodes.length + 1}`
      };

      const updatedNodes = [...nodes, newNode];
      setNodes(runSimulation(updatedNodes, wires));
      setSelectedTool(null);
      setInfoMessage(`Yangi ${selectedTool} elementi qo'shildi! Uni istalgancha surishingiz mumkin.`);
    }
  };

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedTool === "DELETE") {
      deleteNode(nodeId);
      return;
    }
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setDraggedNodeId(nodeId);
      if (workspaceRef.current) {
        const rect = workspaceRef.current.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left - node.x,
          y: e.clientY - rect.top - node.y
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId && workspaceRef.current) {
      const rect = workspaceRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left - dragOffset.x) / 10) * 10;
      const y = Math.round((e.clientY - rect.top - dragOffset.y) / 10) * 10;

      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === draggedNodeId) {
            return { ...node, x: Math.max(10, x), y: Math.max(10, y) };
          }
          return node;
        })
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const startWiring = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectingFrom({ nodeId });
    setInfoMessage("Sim tortilmoqda. Endi boshqa darvozaning kirish terminaliga (chap tarafdagi nuqtaga) bosing.");
  };

  const endWiring = (targetNodeId: string, inputIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!connectingFrom) return;
    if (connectingFrom.nodeId === targetNodeId) {
      setConnectingFrom(null);
      setInfoMessage("Ulanish bekor qilindi. O'zini-o'ziga ulash mumkin emas.");
      return;
    }

    // Check if slot already has a wire, remove old wire if exists (Logisim 1 input = max 1 wire rule)
    const filteredWires = wires.filter(
      (w) => !(w.toNodeId === targetNodeId && w.toInputIdx === inputIdx)
    );

    const newWire: SimWire = {
      id: `wire_${Date.now()}`,
      fromNodeId: connectingFrom.nodeId,
      toNodeId: targetNodeId,
      toInputIdx: inputIdx
    };

    const updatedWires = [...filteredWires, newWire];
    setWires(updatedWires);
    setConnectingFrom(null);
    setInfoMessage("Yangi sim ulandi! Signal oqishi boshlandi.");
  };

  const deleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setWires((prev) => prev.filter((w) => w.fromNodeId !== nodeId && w.toNodeId !== nodeId));
    setInfoMessage("Element va unga bog'langan simlar o'chirildi.");
  };

  const deleteWire = (wireId: string) => {
    setWires((prev) => prev.filter((w) => w.id !== wireId));
    setInfoMessage("Sim o'chirildi.");
  };

  const clearAll = () => {
    setNodes([]);
    setWires([]);
    setInfoMessage("Ish maydoni bo'shatildi. Elementlarni qaytadan qo'shishingiz mumkin.");
  };

  const loadPreset = (presetIndex: number) => {
    setNodes(JSON.parse(JSON.stringify(PRESETS[presetIndex].nodes)));
    setWires(JSON.parse(JSON.stringify(PRESETS[presetIndex].wires)));
    setInfoMessage(`"${PRESETS[presetIndex].name}" sxemasi muvaffaqiyatli yuklandi.`);
  };

  // Wire signal state determination (returns 1 or 0)
  const getWireSignal = (wire: SimWire) => {
    const src = nodes.find((n) => n.id === wire.fromNodeId);
    return src ? src.outputValue : 0;
  };

  return (
    <div className="bg-[#15181E] border border-[#2A2D35] rounded shadow-xl overflow-hidden text-white flex flex-col md:flex-row h-[550px]">
      {/* Sidebar controls */}
      <div className="w-full md:w-56 bg-[#0A0C10] border-b md:border-b-0 md:border-r border-[#2A2D35] p-3 flex flex-col gap-3.5 overflow-y-auto shrink-0 select-none">
        <div>
          <h3 className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-2 flex items-center gap-1.5 font-mono">
            <Plus className="w-3.5 h-3.5 text-[#818CF8]" />
            SXEMA ELEMENTLARI
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { type: "INPUT", label: "Kiruvchi Pin", icon: <ToggleLeft className="w-3.5 h-3.5 mr-1 text-[#818CF8]" /> },
              { type: "OUTPUT", label: "Bulb (Chiroq)", icon: <Lightbulb className="w-3.5 h-3.5 mr-1 text-yellow-500" /> },
              { type: "AND", label: "VA (AND)" },
              { type: "OR", label: "YOKI (OR)" },
              { type: "NOT", label: "EMAS (NOT)" },
              { type: "NAND", label: "VA-EMAS" },
              { type: "NOR", label: "YOKI-EMAS" },
              { type: "XOR", label: "XOR" },
              { type: "XNOR", label: "XNOR" }
            ].map((gate) => (
              <button
                key={gate.type}
                onClick={() => {
                  setSelectedTool(gate.type as JointType);
                  setConnectingFrom(null);
                  setInfoMessage(`Ish maydonining istalgan joyiga bosib, yangi ${gate.type} elementini joylashtiring.`);
                }}
                className={`py-1 px-1.5 bg-[#15181E] rounded border text-[10px] font-mono flex items-center justify-center hover:bg-[#1E2229] transition-all cursor-pointer ${
                  selectedTool === gate.type 
                    ? "border-[#4F46E5]/60 text-[#818CF8] bg-[#4F46E5]/10 font-bold" 
                    : "border-[#2A2D35] text-[#9CA3AF]"
                }`}
              >
                {"icon" in gate ? gate.icon : null}
                {gate.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-2 flex items-center gap-1.5 font-mono">
            <Grid className="w-3.5 h-3.5 text-[#818CF8]" />
            TAYYOR SHONLAR (PRESETS)
          </h3>
          <div className="flex flex-col gap-1.5">
            {PRESETS.map((p, idx) => (
              <button
                key={p.name}
                onClick={() => loadPreset(idx)}
                className="p-1.5 text-left bg-[#15181E] hover:bg-[#1E2229] text-[9.5px] rounded border border-[#2A2D35] transition-all cursor-pointer"
              >
                <div className="font-extrabold text-white font-mono">{p.name}</div>
                <div className="text-[8.5px] text-[#6B7280] mt-0.5 line-clamp-2 leading-tight">{p.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-[#2A2D35]/60 flex flex-col gap-1.5">
          <button
            onClick={() => {
              setSelectedTool(selectedTool === "DELETE" ? null : "DELETE");
              setConnectingFrom(null);
              setInfoMessage("Elementni o'chirish uchun istalgan darvozaga yoki simga bosing.");
            }}
            className={`w-full py-1 px-2 hover:bg-red-950/20 text-[10px] font-mono font-bold rounded border flex items-center justify-center gap-1 transition-all cursor-pointer ${
              selectedTool === "DELETE"
                ? "border-red-500 text-red-400 bg-red-950/10"
                : "border-red-955/60 text-[#9CA3AF] bg-transparent"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            O'chirish Rejimi
          </button>
          
          <button
            onClick={clearAll}
            className="w-full py-1 px-2 bg-[#15181E] hover:bg-[#1E2229] border border-[#2A2D35] text-[10px] font-mono rounded text-[#9CA3AF] flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Hammasini Tozalash
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Info bar */}
        <div className="bg-[#0A0C10] border-b border-[#2A2D35]/50 p-2 text-[10px] text-[#9CA3AF] flex items-start gap-1.5 select-none font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-[#818CF8] shrink-0 mt-0.5" />
          <span>{infoMessage}</span>
        </div>

        {/* The dynamic canvas board */}
        <div
          ref={workspaceRef}
          onClick={handleWorkspaceClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex-1 bg-[#0A0C10] relative overflow-hidden transition-all duration-150 cursor-crosshair select-none"
          style={{
            backgroundImage: "radial-gradient(#2A2D35 1px, transparent 1px)",
            backgroundSize: "16px 16px"
          }}
        >
          {connectingFrom && (
            <div className="absolute top-2 right-2 bg-indigo-950/60 border border-indigo-900 text-[9px] text-[#818CF8] px-2 py-0.5 rounded font-mono">
              Sim tortilmoqda. Bekor qilish uchun istalgan joyga bosing.
            </div>
          )}

          {/* SVG Wires Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {wires.map((wire) => {
              const fromNode = nodes.find((n) => n.id === wire.fromNodeId);
              const toNode = nodes.find((n) => n.id === wire.toNodeId);
              if (!fromNode || !toNode) return null;

              // Output anchor point is on the right of the fromNode
              const fromX = fromNode.x + 100;
              const fromY = fromNode.y + 25;

              // Input anchor point is on the left of the toNode
              const toX = toNode.x;
              // NOT gate has only 1 input in the center, OUTPUT has only 1, others have 2
              let toY = toNode.y + 25;
              if (toNode.type !== "NOT" && toNode.type !== "OUTPUT" && toNode.inputs.length > 1) {
                toY = toNode.y + (wire.toInputIdx === 0 ? 15 : 35);
              }

              const signal = getWireSignal(wire);
              const isHigh = signal === 1;

              // Draw bezier curve for beauty (Logisim wires)
              const controlX1 = fromX + 40;
              const controlY1 = fromY;
              const controlX2 = toX - 40;
              const controlY2 = toY;

              const pathString = `M ${fromX} ${fromY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${toX} ${toY}`;

              return (
                <g key={wire.id} className="pointer-events-auto cursor-pointer">
                  {/* Invisible wide line for easier clicking to delete wire */}
                  <path
                    d={pathString}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="12"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedTool === "DELETE") {
                        deleteWire(wire.id);
                      } else {
                        setInfoMessage("Ushbu simni o'chirish uchun pastdagi 'O'chirish Rejimi'ni yoqing va unga bosing.");
                      }
                    }}
                  />
                  {/* Visible wire path */}
                  <path
                    d={pathString}
                    fill="none"
                    stroke={isHigh ? "#22c55e" : "#475569"}
                    strokeWidth="3.5"
                    className="transition-colors duration-150"
                  />
                  {/* Glowing signal dots */}
                  {isHigh && (
                    <path
                      d={pathString}
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="3.5"
                      strokeDasharray="8, 12"
                      className="animate-[dash_1s_linear_infinite]"
                      style={{
                        animation: "dash 1.2s linear infinite"
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Logic Gate Nodes */}
          {nodes.map((node) => {
            const isInput = node.type === "INPUT";
            const isOutput = node.type === "OUTPUT";

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(node.id, e)}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className={`absolute w-24 h-[44px] rounded border select-none transition-all duration-75 z-10 ${
                  isInput
                    ? node.outputValue === 1
                      ? "bg-[#15181E] border-[#4F46E5] shadow-xs shadow-[#4F46E5]/15 animate-pulse"
                      : "bg-[#15181E] border-[#2A2D35] hover:border-[#4B5563]"
                    : isOutput
                    ? node.outputValue === 1
                      ? "bg-[#15181E] border-yellow-500/70 shadow-xs shadow-yellow-500/5"
                      : "bg-[#15181E] border-[#2A2D35] hover:border-[#4B5563]"
                    : "bg-[#0A0C10] border-[#2A2D35] hover:border-[#4B5563] shadow-xs"
                }`}
              >
                {/* Wiring Target Anchors (Left Input dots) */}
                {!isInput && (
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around py-0.5 -translate-x-1 w-3">
                    {node.inputs.map((inp, idx) => {
                      return (
                        <div
                          key={inp.id}
                          onClick={(e) => endWiring(node.id, idx, e)}
                          title={`Ulash porti ${idx}`}
                          className={`w-2.5 h-2.5 rounded-full border cursor-pointer flex items-center justify-center transition-all ${
                            connectingFrom 
                              ? "bg-[#4F46E5] border-white animate-pulse scale-110" 
                              : inp.value === 1 
                              ? "bg-[#4F46E5] border-white" 
                              : "bg-[#2A2D35] border-[#4B5563]"
                          }`}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Node Center Layout */}
                <div className="h-full w-full flex flex-col justify-between p-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] uppercase font-mono tracking-wider text-[#6B7280]">
                      {node.type}
                    </span>
                    {selectedTool === "DELETE" && (
                      <span className="text-[8px] text-red-500 font-bold font-mono">X</span>
                    )}
                  </div>

                  {/* Body interactive area inside */}
                  <div className="flex-1 flex items-center justify-center">
                    {isInput ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleInputNode(node.id);
                        }}
                        className={`py-px px-1.5 rounded text-[8.5px] font-bold flex items-center gap-1 transition-all ${
                          node.outputValue === 1
                            ? "bg-[#4F46E5] text-white hover:bg-[#4338CA]"
                            : "bg-[#1E2229] border border-[#2A2D35] text-[#9CA3AF] hover:bg-[#2A2D35]"
                        }`}
                      >
                        {node.outputValue === 1 ? "1 (CHIN)" : "0 (YOLG'ON)"}
                      </button>
                    ) : isOutput ? (
                      <div className="flex items-center gap-1">
                        <Lightbulb
                          className={`w-3.5 h-3.5 transition-all duration-200 ${
                            node.outputValue === 1
                              ? "text-yellow-400 fill-yellow-400 scale-110 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]"
                              : "text-[#4B5563]"
                          }`}
                        />
                        <span className={`text-[9px] font-mono ${node.outputValue === 1 ? "text-yellow-400 font-bold" : "text-[#4B5563]"}`}>
                          {node.outputValue}
                        </span>
                      </div>
                    ) : (
                      /* Logic Gates Symbol representations */
                      <span className="text-[9.5px] font-bold tracking-wide font-mono text-[#818CF8]">
                        {node.type === "AND" && "A • B"}
                        {node.type === "OR" && "A + B"}
                        {node.type === "NOT" && "Ā"}
                        {node.type === "NAND" && "¬(A•B)"}
                        {node.type === "NOR" && "¬(A+B)"}
                        {node.type === "XOR" && "A ⊕ B"}
                        {node.type === "XNOR" && "A ⊙ B"}
                      </span>
                    )}
                  </div>

                  <div className="text-[8px] truncate text-[#6B7280] font-mono leading-none">
                    {node.label || node.id}
                  </div>
                </div>

                {/* Wiring Output Anchor (Right Output dot) */}
                {!isOutput && (
                  <div
                    onClick={(e) => startWiring(node.id, e)}
                    title="Ulash simi tortish"
                    className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 rounded-full border cursor-pointer transition-all ${
                      node.outputValue === 1 
                        ? "bg-[#4F46E5] border-white" 
                        : "bg-[#2A2D35] border-[#4B5563]"
                    } hover:scale-110 hover:bg-[#4F46E5]`}
                  />
                )}
              </div>
            );
          })}

          {/* Empty Space Instruction Background */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center pointer-events-none">
              <div className="p-3 bg-[#0A0C10] rounded-full border border-[#2A2D35] mb-2 text-[#818CF8]">
                <Grid className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-xs font-semibold text-white">Bo'sh Simulyator Doskasi</h4>
              <p className="text-[10px] text-[#9CA3AF] max-w-xs mt-0.5">
                Tepadagi eshiklarni bosing yoki chap tarafdagi tayyor sxemalardan birini tanlab yuklang.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Dynamic CSS animations styles for wire pulses and dash effects */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
    </div>
  );
}
