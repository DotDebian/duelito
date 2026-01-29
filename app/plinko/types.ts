export type Ball = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number;
  path: ('L' | 'R')[];
  pathIndex: number;
  direction?: 'L' | 'R';
};

export type ActivePeg = {
  rowIndex: number;
  pegIndex: number;
  progress: number;
};

export type ActiveBucket = {
  index: number;
  progress: number;
};

export type DropResult = {
  id: number;
  multiplier: number;
  color: string;
  exiting?: boolean;
};

export type PegConfig = {
  pegs: { x: number; y: number }[][];
  pegRadius: number;
  ballRadius: number;
  totalRows: number;
  pegSpacing: number;
  rowSpacing: number;
  paddingTop: number;
  paddingX: number;
  width: number;
};
