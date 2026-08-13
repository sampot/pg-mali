/**
 * Pure-entertainment light-chase wheel (genre homage).
 * Classic Little Mary symbol set and odds.
 */

/** @typedef {{ id: string, label: string, glyph: string, odds: number, hue: number }} SymbolKind */

/** @type {SymbolKind[]} */
export const KINDS = [
  { id: "bar", label: "BAR", glyph: "BAR", odds: 100, hue: 45 },
  { id: "double7", label: "77", glyph: "77", odds: 40, hue: 0 },
  { id: "star", label: "星星", glyph: "星", odds: 30, hue: 55 },
  { id: "watermelon", label: "西瓜", glyph: "瓜", odds: 20, hue: 140 },
  { id: "bell", label: "鈴鐺", glyph: "鈴", odds: 20, hue: 35 },
  { id: "coconut", label: "椰子", glyph: "椰", odds: 15, hue: 155 },
  { id: "orange", label: "橘子", glyph: "橘", odds: 10, hue: 25 },
  { id: "apple", label: "蘋果", glyph: "蘋", odds: 5, hue: 350 },
];

/** 24 cells around the wheel — classic Little Mary repeating pattern. */
export const WHEEL = [
  "orange", "bell", "bar", "apple",
  "coconut", "watermelon", "star", "double7",
  "orange", "bell", "bar", "apple",
  "coconut", "watermelon", "star", "double7",
  "orange", "bell", "bar", "apple",
  "coconut", "watermelon", "star", "double7",
];

export function kindById(id) {
  return KINDS.find((k) => k.id === id) ?? KINDS[0];
}

export class MaliGame {
  constructor() {
    this.credits = 100;
    /** @type {Record<string, number>} */
    this.bets = Object.fromEntries(KINDS.map((k) => [k.id, 0]));
    this.running = false;
    this.lastIndex = 0;
    this.lastWin = 0;
  }

  totalBet() {
    return Object.values(this.bets).reduce((a, b) => a + b, 0);
  }

  canBet() {
    return !this.running && this.credits > 0;
  }

  addCredits(n) {
    if (this.running) return false;
    this.credits += n;
    return true;
  }

  /** Place one credit on a kind. */
  bet(kindId) {
    if (!this.canBet()) return false;
    if (this.credits < 1) return false;
    if (!(kindId in this.bets)) return false;
    this.credits -= 1;
    this.bets[kindId] += 1;
    return true;
  }

  clearBets() {
    if (this.running) return false;
    const refund = this.totalBet();
    for (const id of Object.keys(this.bets)) this.bets[id] = 0;
    this.credits += refund;
    return refund > 0;
  }

  /**
   * Pick a fair random cell; payout = betOnKind * odds.
   * @returns {{ index: number, kindId: string, payout: number, betOn: number }}
   */
  spin() {
    if (this.running) throw new Error("already running");
    const betSum = this.totalBet();
    if (betSum <= 0) throw new Error("no bets");

    const index = Math.floor(Math.random() * WHEEL.length);
    const kindId = WHEEL[index];
    const kind = kindById(kindId);
    const betOn = this.bets[kindId] || 0;
    const payout = betOn * kind.odds;

    this.running = true;
    this.lastIndex = index;
    this.lastWin = payout;

    for (const id of Object.keys(this.bets)) this.bets[id] = 0;

    return { index, kindId, payout, betOn };
  }

  settle(payout) {
    this.credits += payout;
    this.running = false;
  }
}

/**
 * Build chase path: many laps then ease onto target.
 * @param {number} targetIndex
 * @param {number} cellCount
 * @param {number} [laps]
 * @returns {number[]} sequence of cell indices
 */
export function buildChasePath(targetIndex, cellCount, laps = 4) {
  const start = Math.floor(Math.random() * cellCount);
  const totalSteps = laps * cellCount + ((targetIndex - start + cellCount) % cellCount);
  const path = [];
  for (let i = 0; i <= totalSteps; i++) {
    path.push((start + i) % cellCount);
  }
  path[path.length - 1] = targetIndex;
  return path;
}

/**
 * Duration (ms) for step i along a path of length n.
 * @param {number} i
 * @param {number} n
 */
export function stepDelayMs(i, n) {
  const t = i / Math.max(1, n - 1);
  let factor;
  if (t < 0.55) {
    factor = 1 - t * 1.2;
    factor = Math.max(0.15, factor);
  } else {
    const u = (t - 0.55) / 0.45;
    factor = 0.15 + u * u * 2.4;
  }
  return 28 + factor * 95;
}
