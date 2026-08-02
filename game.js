/**
 * Pure-entertainment light-chase wheel (genre homage).
 * Odds and layout are original — not copied from any commercial cabinet ROM.
 */

/** @typedef {{ id: string, label: string, glyph: string, odds: number, hue: number }} SymbolKind */

/** @type {SymbolKind[]} */
export const KINDS = [
  { id: "lion", label: "獅", glyph: "獅", odds: 12, hue: 28 },
  { id: "panda", label: "熊", glyph: "熊", odds: 8, hue: 200 },
  { id: "monkey", label: "猴", glyph: "猴", odds: 6, hue: 45 },
  { id: "rabbit", label: "兔", glyph: "兔", odds: 4, hue: 320 },
  { id: "eagle", label: "鷹", glyph: "鷹", odds: 12, hue: 210 },
  { id: "peacock", label: "雀", glyph: "雀", odds: 8, hue: 160 },
  { id: "dove", label: "鴿", glyph: "鴿", odds: 6, hue: 250 },
  { id: "swallow", label: "燕", glyph: "燕", odds: 4, hue: 10 },
];

/** 24 cells around the wheel (original repeating pattern). */
export const WHEEL = [
  "lion",
  "swallow",
  "monkey",
  "dove",
  "panda",
  "rabbit",
  "eagle",
  "peacock",
  "lion",
  "swallow",
  "monkey",
  "dove",
  "panda",
  "rabbit",
  "eagle",
  "peacock",
  "lion",
  "swallow",
  "monkey",
  "dove",
  "panda",
  "rabbit",
  "eagle",
  "peacock",
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

    // Clear bets for next round; credits updated after animation.
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
  // Ensure last is target
  path[path.length - 1] = targetIndex;
  return path;
}

/**
 * Duration (ms) for step i along a path of length n — fast middle, slow end.
 * @param {number} i
 * @param {number} n
 */
export function stepDelayMs(i, n) {
  const t = i / Math.max(1, n - 1);
  // Ease: start moderate, accelerate, strong decelerate near end
  let factor;
  if (t < 0.55) {
    factor = 1 - t * 1.2; // speed up
    factor = Math.max(0.15, factor);
  } else {
    const u = (t - 0.55) / 0.45;
    factor = 0.15 + u * u * 2.4; // slow down hard
  }
  return 28 + factor * 95;
}
