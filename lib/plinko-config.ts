// Plinko multiplier configurations by risk level and number of rows
// Multipliers count = rows + 1
// Probabilities follow binomial distribution pattern (higher in center, lower at edges)

export interface MultiplierConfig {
  multiplier: number;
  probability: number; // percentage
}

export interface RowConfig {
  multipliers: MultiplierConfig[];
}

export interface RiskConfig {
  low: Record<number, RowConfig>;
  medium: Record<number, RowConfig>;
  high: Record<number, RowConfig>;
}

// Helper to generate binomial-like probabilities for n+1 buckets
function generateProbabilities(buckets: number): number[] {
  const probs: number[] = [];
  const n = buckets - 1;

  for (let k = 0; k <= n; k++) {
    // Binomial coefficient approximation
    const coeff = factorial(n) / (factorial(k) * factorial(n - k));
    probs.push(coeff);
  }

  // Normalize to 100%
  const sum = probs.reduce((a, b) => a + b, 0);
  return probs.map(p => Number(((p / sum) * 100).toFixed(2)));
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Low risk multipliers - conservative, less variance
const LOW_MULTIPLIERS: Record<number, number[]> = {
  8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
  9: [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
  10: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
  11: [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
  12: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
  13: [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
  14: [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
  15: [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15],
  16: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
};

// Medium risk multipliers - balanced
const MEDIUM_MULTIPLIERS: Record<number, number[]> = {
  8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
  9: [18, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 18],
  10: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
  11: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
  12: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
  13: [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 43],
  14: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
  15: [88, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 88],
  16: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
};

// High risk multipliers - aggressive, high variance
const HIGH_MULTIPLIERS: Record<number, number[]> = {
  8: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
  9: [43, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 43],
  10: [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76],
  11: [121, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 121],
  12: [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170],
  13: [260, 37, 11, 4, 1, 0.2, 0.2, 0.2, 0.2, 1, 4, 11, 37, 260],
  14: [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 420],
  15: [620, 83, 27, 8, 3, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 3, 8, 27, 83, 620],
  16: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000],
};

function buildRowConfig(multipliers: number[], rows: number): RowConfig {
  const probabilities = generateProbabilities(rows + 1);

  return {
    multipliers: multipliers.map((multiplier, index) => ({
      multiplier,
      probability: probabilities[index],
    })),
  };
}

function buildRiskConfig(multipliersMap: Record<number, number[]>): Record<number, RowConfig> {
  const config: Record<number, RowConfig> = {};

  for (let rows = 8; rows <= 16; rows++) {
    config[rows] = buildRowConfig(multipliersMap[rows], rows);
  }

  return config;
}

export const plinkoConfig: RiskConfig = {
  low: buildRiskConfig(LOW_MULTIPLIERS),
  medium: buildRiskConfig(MEDIUM_MULTIPLIERS),
  high: buildRiskConfig(HIGH_MULTIPLIERS),
};

// Bucket colors by row count (rows + 1 colors needed)
// Colors gradient from red (edges) to yellow/green (center)
export const BUCKET_COLORS: Record<number, string[]> = {
  8: [
    'rgb(255, 47, 47)', 'rgb(255, 96, 31)', 'rgb(255, 145, 16)', 'rgb(255, 193, 0)',
    'rgb(255, 220, 0)',
    'rgb(255, 193, 0)', 'rgb(255, 145, 16)', 'rgb(255, 96, 31)', 'rgb(255, 47, 47)',
  ],
  9: [
    'rgb(255, 47, 47)', 'rgb(255, 80, 35)', 'rgb(255, 120, 25)', 'rgb(255, 160, 12)',
    'rgb(255, 200, 0)', 'rgb(255, 200, 0)',
    'rgb(255, 160, 12)', 'rgb(255, 120, 25)', 'rgb(255, 80, 35)', 'rgb(255, 47, 47)',
  ],
  10: [
    'rgb(255, 47, 47)', 'rgb(255, 75, 38)', 'rgb(255, 105, 28)', 'rgb(255, 135, 18)',
    'rgb(255, 168, 9)', 'rgb(255, 200, 0)',
    'rgb(255, 168, 9)', 'rgb(255, 135, 18)', 'rgb(255, 105, 28)', 'rgb(255, 75, 38)', 'rgb(255, 47, 47)',
  ],
  11: [
    'rgb(255, 47, 47)', 'rgb(255, 96, 31)', 'rgb(255, 120, 25)', 'rgb(255, 145, 16)',
    'rgb(255, 168, 9)', 'rgb(255, 193, 0)', 'rgb(255, 193, 0)',
    'rgb(255, 168, 9)', 'rgb(255, 145, 16)', 'rgb(255, 120, 25)', 'rgb(255, 96, 31)', 'rgb(255, 47, 47)',
  ],
  12: [
    'rgb(255, 47, 47)', 'rgb(255, 75, 38)', 'rgb(255, 96, 31)', 'rgb(255, 120, 25)',
    'rgb(255, 145, 16)', 'rgb(255, 168, 9)', 'rgb(255, 200, 0)',
    'rgb(255, 168, 9)', 'rgb(255, 145, 16)', 'rgb(255, 120, 25)', 'rgb(255, 96, 31)', 'rgb(255, 75, 38)', 'rgb(255, 47, 47)',
  ],
  13: [
    'rgb(255, 47, 47)', 'rgb(255, 70, 40)', 'rgb(255, 90, 33)', 'rgb(255, 110, 27)',
    'rgb(255, 130, 20)', 'rgb(255, 155, 12)', 'rgb(255, 180, 5)', 'rgb(255, 180, 5)',
    'rgb(255, 155, 12)', 'rgb(255, 130, 20)', 'rgb(255, 110, 27)', 'rgb(255, 90, 33)', 'rgb(255, 70, 40)', 'rgb(255, 47, 47)',
  ],
  14: [
    'rgb(255, 47, 47)', 'rgb(255, 65, 42)', 'rgb(255, 85, 35)', 'rgb(255, 100, 30)',
    'rgb(255, 120, 25)', 'rgb(255, 140, 18)', 'rgb(255, 160, 12)', 'rgb(255, 190, 0)',
    'rgb(255, 160, 12)', 'rgb(255, 140, 18)', 'rgb(255, 120, 25)', 'rgb(255, 100, 30)', 'rgb(255, 85, 35)', 'rgb(255, 65, 42)', 'rgb(255, 47, 47)',
  ],
  15: [
    'rgb(255, 47, 47)', 'rgb(255, 62, 44)', 'rgb(255, 78, 38)', 'rgb(255, 94, 32)',
    'rgb(255, 110, 27)', 'rgb(255, 128, 22)', 'rgb(255, 145, 16)', 'rgb(255, 165, 10)', 'rgb(255, 165, 10)',
    'rgb(255, 145, 16)', 'rgb(255, 128, 22)', 'rgb(255, 110, 27)', 'rgb(255, 94, 32)', 'rgb(255, 78, 38)', 'rgb(255, 62, 44)', 'rgb(255, 47, 47)',
  ],
  16: [
    'rgb(255, 47, 47)', 'rgb(255, 60, 45)', 'rgb(255, 73, 40)', 'rgb(255, 87, 35)',
    'rgb(255, 100, 30)', 'rgb(255, 115, 25)', 'rgb(255, 130, 20)', 'rgb(255, 145, 16)', 'rgb(255, 170, 8)',
    'rgb(255, 145, 16)', 'rgb(255, 130, 20)', 'rgb(255, 115, 25)', 'rgb(255, 100, 30)', 'rgb(255, 87, 35)', 'rgb(255, 73, 40)', 'rgb(255, 60, 45)', 'rgb(255, 47, 47)',
  ],
};
