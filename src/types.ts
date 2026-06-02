/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string; // Detail explanations in Uzb
  truthTable?: {
    headers: string[];
    rows: Array<{ [key: string]: number }>;
  };
  animationType: "basic-logic" | "demorgan" | "adder" | "mux-demux" | "flip-flop" | "k-map" | "normal-forms";
  interactiveSample: {
    inputs: string[];
    outputs: string[];
    expression?: string;
    gateType?: "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR" | "HALF-ADDER" | "FULL-ADDER" | "MUX" | "DEMUX" | "ENCODER" | "DECODER" | "RS-TRIGGER" | "D-TRIGGER";
  };
}

// Logisim Simulator Types
export type JointType = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR" | "XNOR" | "INPUT" | "OUTPUT";

export interface SimNode {
  id: string;
  type: JointType;
  x: number;
  y: number;
  inputs: { id: string; value: number }[]; // Input slot IDs and values
  outputValue: number;
  label?: string;
}

export interface SimWire {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  toInputIdx: number; // which input slot of the target node (usually 0 or 1, except NOT which has 1, or OUTPUT which has 1)
}

// Games state types
export interface GateMatcherQuestion {
  inputs: number[][]; // e.g. [[0,0], [0,1], [1,0], [1,1]]
  outputs: number[];  // e.g. [0, 0, 0, 1] for AND
  options: ("AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR")[];
  correctAnswer: string;
  explanation: string;
}

export interface FormulaBuilderPuzzle {
  id: number;
  title: string;
  description: string;
  inputs: { name: string; value: number }[];
  targetValue: number;
  availableGates: ("AND" | "OR" | "NOT" | "XOR")[];
}

export interface KMapPuzzleQuestion {
  id: number;
  table: number[][]; // 2x2 or 4x2 truth value configuration
  minimizedExpression: string;
  options: string[];
  correctAnswer: string;
  description: string;
}
