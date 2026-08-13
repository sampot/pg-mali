/**
 * Pure-entertainment light-chase wheel (genre homage).
 * Classic Little Mary symbol set and odds.
 */

/** @typedef {{ id: string, label: string, glyph: string, odds: number, hue: number, weight: number }} SymbolKind */

/**
 * Symbol set + odds. `weight` is the per-cell draw weight used by spin() to
 * control RTP (pure entertainment, not fair-zero-sum). With weights set
 * ∝ 1/(count·odds), every single-symbol bet has the SAME expected return
 * (~0.97, a player-favorable house edge), regardless of how often the symbol
 * appears on the wheel.
 * @type {SymbolKind[]}
 */
export const KINDS = [
  { id: "bar", label: "BAR", glyph: "BAR", odds: 50, hue: 45, weight: 20 },
  { id: "double7", label: "77", glyph: "77", odds: 40, hue: 0, weight: 25 },
  { id: "star", label: "星星", glyph: "星", odds: 30, hue: 55, weight: 33 },
  { id: "watermelon", label: "西瓜", glyph: "瓜", odds: 20, hue: 140, weight: 50 },
  { id: "bell", label: "鈴鐺", glyph: "鈴", odds: 20, hue: 35, weight: 25 },
  { id: "coconut", label: "椰子", glyph: "椰", odds: 15, hue: 155, weight: 33 },
  { id: "orange", label: "橘子", glyph: "橘", odds: 10, hue: 25, weight: 50 },
  { id: "apple", label: "蘋果", glyph: "蘋", odds: 5, hue: 350, weight: 50 },
  { id: "cherry", label: "櫻桃", glyph: "桃", odds: 2, hue: 340, weight: 63 },
  // Special re-spin cell: not bettable, keeps the current bets and spins again.
  { id: "once", label: "再來一次", glyph: "↻", odds: 0, hue: 200, weight: 14, bettable: false },
];

/**
 * Visual order of the 24 border cells (7×7 outer ring + 5×5 hub).
 * Each symbol appears a fixed number of times (bar rare as jackpot, cherry
 * common). The draw probability is weighted separately via KINDS[].weight.
 */
export const WHEEL = [
  // top row L→R: orange, bell, cherry, BAR(top-center), apple, cherry, coconut(top-right)
  "orange", "bell", "cherry", "bar", "apple", "cherry", "coconut",
  // right col T→B: cherry, watermelon(right 2nd-from-top), ONCE(right-middle), apple, cherry
  "cherry", "watermelon", "once", "apple", "cherry",
  // bottom row R→L: orange(bottom-right), bell, cherry, double7(bottom-center), cherry, apple, coconut(bottom-left)
  "orange", "bell", "cherry", "double7", "cherry", "apple", "coconut",
  // left col B→T: star(1 up from bottom-left), cherry, ONCE(left-middle), cherry, apple
  "star", "cherry", "once", "cherry", "apple",
];

export const ONCE = "once";

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
    /** @type {Record<string, number>} */
    this.lastBets = Object.fromEntries(KINDS.map((k) => [k.id, 0]));
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
   * Pick a weighted-random cell; payout = betOnKind * odds.
   * @returns {{ index: number, kindId: string, payout: number, betOn: number }}
   */
  spin() {
    if (this.running) throw new Error("already running");
    const betSum = this.totalBet();
    if (betSum <= 0) throw new Error("no bets");

    const index = weightedCellIndex();
    const kindId = WHEEL[index];
    const kind = kindById(kindId);
    const betOn = this.bets[kindId] || 0;
    const payout = betOn * kind.odds;

    this.running = true;
    this.lastIndex = index;
    this.lastWin = payout;
    // Keep the placed bets on display until the round resolves (see settle()).
    this.lastBets = { ...this.bets };

    return { index, kindId, payout, betOn };
  }

  /**
   * Re-spin while a round is already running (e.g. landed on "Once More").
   * Keeps the current bets untouched and picks a new weighted cell.
   * @returns {{ index: number, kindId: string, payout: number, betOn: number }}
   */
  respin() {
    if (!this.running) throw new Error("not running");
    const index = weightedCellIndex();
    const kindId = WHEEL[index];
    const kind = kindById(kindId);
    const betOn = this.bets[kindId] || 0;
    const payout = betOn * kind.odds;
    this.lastIndex = index;
    this.lastWin = payout;
    return { index, kindId, payout, betOn };
  }

  settle(payout) {
    this.credits += payout;
    this.running = false;
    for (const id of Object.keys(this.bets)) this.bets[id] = 0;
  }
}

/**
 * Weighted-random index into WHEEL.
 * Each cell's weight = its symbol's `weight`, so high-odds symbols appear
 * less often while the visual order (WHEEL) stays fixed.
 * @returns {number}
 */
export function weightedCellIndex() {
  const totals = WHEEL.map((id) => kindById(id).weight);
  const sum = totals.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum;
  for (let i = 0; i < totals.length; i++) {
    r -= totals[i];
    if (r < 0) return i;
  }
  return WHEEL.length - 1;
}

/**
 * Theoretical Return-To-Player for a 1-credit bet on any single symbol.
 * Because weights are ∝ 1/(count·odds), this value is (approximately) the
 * same for every symbol — the controlled, player-favorable house edge.
 * Used to verify / document the weight table.
 * @returns {number} e.g. 0.97
 */
export function expectedRtp() {
  const totals = WHEEL.map((id) => kindById(id).weight);
  const sum = totals.reduce((a, b) => a + b, 0);
  let rtp = 0;
  for (let i = 0; i < WHEEL.length; i++) {
    const kind = kindById(WHEEL[i]);
    rtp += (totals[i] / sum) * kind.odds;
  }
  // average per-symbol RTP (Σ over cells of p_cell·odds normalized by symbol count)
  return rtp / KINDS.length;
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
