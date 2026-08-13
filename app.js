import { MaliAudio } from "./audio.js";
import {
  KINDS,
  WHEEL,
  ONCE,
  MaliGame,
  buildChasePath,
  kindById,
  stepDelayMs,
} from "./game.js";
import { iconSvg } from "./icons.js";

const audio = new MaliAudio();
const game = new MaliGame();

const creditsEl = document.getElementById("credits");
const statusEl = document.getElementById("status");
const wheelEl = document.getElementById("wheel");
const betGrid = document.getElementById("bet-grid");
const btnStart = document.getElementById("btn-start");
const btnClear = document.getElementById("btn-clear");
const btnCredit = document.getElementById("btn-credit");
const btnMute = document.getElementById("btn-mute");
const totalBetEl = document.getElementById("total-bet");

/** @type {HTMLButtonElement[]} */
let cellEls = [];
/** @type {Promise<void> & { skip: () => void } | null} */
let currentChase = null;
/** @type {HTMLElement | null} */
let hubEl = null;
/** @type {HTMLElement | null} */
let hubSubEl = null;
/** @type {HTMLElement | null} */
let hubCreditsEl = null;
/** @type {HTMLElement | null} */
let hubBetEl = null;
/** @type {HTMLElement | null} */
let hubWinEl = null;
/** @type {HTMLElement[]} */
let hubLedEls = [];

function setStatus(msg, tone = "") {
  statusEl.textContent = msg;
  statusEl.dataset.tone = tone;
}

/** @param {'idle' | 'run' | 'win' | 'lose'} mode */
function setHubMode(mode, detail = "") {
  if (!hubEl || !hubSubEl) return;
  hubEl.dataset.mode = mode;
  if (mode === "run") {
    hubSubEl.textContent = "跑燈中";
    if (hubWinEl) hubWinEl.textContent = "—";
  } else if (mode === "win") {
    hubSubEl.textContent = "中獎！";
    if (hubWinEl) hubWinEl.textContent = detail || "+0";
  } else if (mode === "lose") {
    hubSubEl.textContent = "再來";
    if (hubWinEl) hubWinEl.textContent = "0";
  } else {
    hubSubEl.textContent = "純娛樂";
    if (hubWinEl) hubWinEl.textContent = "—";
  }
}

function pulseHubLeds(stepIndex) {
  if (!hubLedEls.length) return;
  const n = hubLedEls.length;
  const on = stepIndex % n;
  hubLedEls.forEach((el, i) => {
    el.classList.toggle("on", i === on || i === (on + 1) % n);
  });
}

function renderCredits() {
  creditsEl.textContent = String(game.credits);
  totalBetEl.textContent = String(game.totalBet());
  if (hubCreditsEl) hubCreditsEl.textContent = String(game.credits);
  if (hubBetEl) hubBetEl.textContent = String(game.totalBet());
}

function renderBets() {
  for (const kind of KINDS) {
    const el = betGrid.querySelector(`[data-bet="${kind.id}"] .bet-count`);
    if (el) el.textContent = String(game.bets[kind.id]);
  }
  // Keep wheel cells in sync with the same shared bet state.
  cellEls.forEach((btn) => {
    const kindId = btn.dataset.kind;
    if (!kindId) return;
    const n = game.bets[kindId];
    const countEl = btn.querySelector(".cell-count");
    if (countEl) countEl.textContent = n > 0 ? String(n) : "";
    btn.classList.toggle("bet-on", n > 0);
    btn.setAttribute(
      "aria-label",
      `${kindById(kindId).label} ×${kindById(kindId).odds}${n > 0 ? `，已押 ${n}` : ""}`,
    );
  });
  renderCredits();
  btnStart.disabled = game.running || game.totalBet() === 0;
  btnClear.disabled = game.running || game.totalBet() === 0;
  btnCredit.disabled = game.running;
  cellEls.forEach((btn) => {
    btn.disabled = game.running || !game.canBet();
  });
}

/** Shared bet placement used by both the bet cards and the wheel cells. */
async function placeBet(kindId) {
  await audio.unlock();
  if (!game.bet(kindId)) {
    if (game.credits <= 0) setStatus("娛樂幣不足，請加幣。", "warn");
    return;
  }
  audio.bet();
  renderBets();
  setStatus(`已押 ${kindById(kindId).label}（目前該格 ${game.bets[kindId]}）`);
}

function highlight(index) {
  cellEls.forEach((el, i) => {
    el.classList.toggle("lit", i === index);
  });
}

function flashWin(index) {
  cellEls.forEach((el, i) => {
    el.classList.toggle("win", i === index);
  });
}

function clearFlash() {
  cellEls.forEach((el) => el.classList.remove("win", "lit"));
}

/**
 * Map chase index → 7×7 grid outer ring (24 border cells).
 * The 5×5 center is occupied by the hub. Ring layout:
 * top 7 (row 1) + right 5 (col 7) + bottom 7 (row 7) + left 5 (col 1) = 24.
 */
function rectSlot(i) {
  if (i < 7) return { col: i + 1, row: 1 }; // top L→R
  if (i < 12) return { col: 7, row: i - 5 }; // right T→B (rows 2–6)
  if (i < 19) return { col: 19 - i, row: 7 }; // bottom R→L
  return { col: 1, row: 25 - i }; // left B→T (rows 6–2)
}

function buildWheel() {
  wheelEl.innerHTML = "";
  cellEls = [];
  hubLedEls = [];

  const hub = document.createElement("div");
  hub.className = "hub";
  hub.dataset.mode = "idle";
  hub.innerHTML = `
    <div class="hub-leds" aria-hidden="true"></div>
    <div class="hub-glow" aria-hidden="true"></div>
    <div class="hub-scan" aria-hidden="true"></div>
    <div class="hub-led-display hub-credits"><span class="led-label">CREDIT</span><span class="led-value">100</span></div>
    <div class="hub-led-display hub-bet"><span class="led-label">BET</span><span class="led-value">0</span></div>
    <div class="hub-copy">
      <strong>小瑪莉</strong>
      <span class="hub-sub">純娛樂</span>
    </div>
    <div class="hub-led-display hub-win-display"><span class="led-label">WIN</span><span class="led-value">—</span></div>
  `;
  const leds = hub.querySelector(".hub-leds");
  // 16 LEDs around square hub: 3 top + 5 right + 3 bottom + 5 left
  const ledSlots = [];
  for (let i = 0; i < 3; i++) ledSlots.push({ x: i / 2, y: 0 });
  for (let i = 0; i < 5; i++) ledSlots.push({ x: 1, y: (i + 0.5) / 5 });
  for (let i = 2; i >= 0; i--) ledSlots.push({ x: i / 2, y: 1 });
  for (let i = 4; i >= 0; i--) ledSlots.push({ x: 0, y: (i + 0.5) / 5 });
  ledSlots.forEach((slot, i) => {
    const dot = document.createElement("span");
    dot.className = "hub-led";
    dot.style.setProperty("--i", String(i));
    dot.style.left = `calc(${slot.x * 100}% - 0.19rem)`;
    dot.style.top = `calc(${slot.y * 100}% - 0.19rem)`;
    leds.appendChild(dot);
    hubLedEls.push(dot);
  });
  hubEl = hub;
  hubSubEl = hub.querySelector(".hub-sub");
  hubCreditsEl = hub.querySelector(".hub-credits .led-value");
  hubBetEl = hub.querySelector(".hub-bet .led-value");
  hubWinEl = hub.querySelector(".hub-win-display .led-value");
  wheelEl.appendChild(hub);

  WHEEL.forEach((kindId, i) => {
    const kind = kindById(kindId);
    const { col, row } = rectSlot(i);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cell";
    btn.style.setProperty("--hue", String(kind.hue));
    btn.style.gridColumn = String(col);
    btn.style.gridRow = String(row);
    btn.dataset.index = String(i);
    btn.dataset.kind = kindId;
    if (kind.bettable === false) {
      btn.classList.add("cell-once");
      btn.innerHTML = `<span class="once-label">再來<br>一次</span><span class="cell-count" aria-hidden="true"></span>`;
      btn.title = `${kind.label}：免費再轉一次`;
      btn.setAttribute("aria-label", kind.label);
      btn.disabled = true;
    } else {
      btn.innerHTML = `${iconSvg(kind.id)}<span class="cell-count" aria-hidden="true"></span>`;
      btn.title = `點擊押注 ${kind.label} ×${kind.odds}`;
      btn.setAttribute("aria-label", `${kind.label} ×${kind.odds}`);
      btn.addEventListener("click", () => void placeBet(kindId));
    }
    wheelEl.appendChild(btn);
    cellEls.push(btn);
  });
}

function buildBetGrid() {
  betGrid.innerHTML = "";
  // 押注列順序：蘋果、西瓜、星星、77、Bar、鈴鐺、椰子、橘子、櫻桃
  const order = ["apple", "watermelon", "star", "double7", "bar", "bell", "coconut", "orange", "cherry"];
  for (const id of order) {
    const kind = kindById(id);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "bet-card";
    card.dataset.bet = kind.id;
    card.style.setProperty("--hue", String(kind.hue));
    card.innerHTML = `
      <span class="bet-icon">${iconSvg(kind.id)}</span>
      <span class="bet-info">
        <span class="bet-odds">×${kind.odds}</span>
      </span>
      <span class="bet-count">0</span>
    `;
    card.setAttribute("aria-label", `押注 ${kind.label}`);
    card.addEventListener("click", () => void placeBet(kind.id));
    betGrid.appendChild(card);
  }
}

/**
 * Convert the per-step delay curve (stepDelayMs) into a cumulative time table.
 * @param {number} n
 * @returns {number[]} cumulative elapsed time (ms) at which each step fires
 */
function chaseTimeline(n) {
  const times = [0];
  for (let i = 1; i < n; i++) {
    times.push(times[i - 1] + stepDelayMs(i, n));
  }
  return times;
}

/**
 * Run a light chase using requestAnimationFrame. Time-based so it survives
 * tab throttling; supports skip-to-end and pause/resume on visibility change.
 * @param {number[]} path
 * @param {(i: number, idx: number) => void} onStep
 * @returns {Promise<void> & { skip: () => void }} chase promise with a skip()
 */
function runChase(path, onStep) {
  const timeline = chaseTimeline(path.length);
  const total = timeline[path.length - 1];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fast = reduced ? 0.32 : 1;
  const duration = total * fast;

  let start = 0;
  let raf = 0;
  let pausedAt = 0;
  let done = false;
  let skipped = false;
  let lastTickIndex = -1;

  const onVisibility = () => {
    if (document.hidden) {
      pausedAt += performance.now() - start;
    } else {
      start = performance.now();
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  function finish() {
    if (done) return;
    done = true;
    onStep(path.length - 1, path[path.length - 1]);
    const urgency = Math.min(1, (path.length - 1) / (path.length * 0.55));
    if (!skipped) audio.tick(urgency);
    if (raf) cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", onVisibility);
    resolve();
  }

  function step(now) {
    if (!start) start = now;
    if (done) return;
    const elapsed = pausedAt + (now - start) * fast;

    if (skipped || elapsed >= duration) {
      finish();
      return;
    }

    // Binary-search the last step whose cumulative time has elapsed.
    let lo = 0,
      hi = timeline.length - 1;
    while (lo < hi) {
      const m = (lo + hi + 1) >> 1;
      if (timeline[m] * fast <= elapsed) lo = m;
      else hi = m - 1;
    }
    const i = lo;
    const idx = path[i];
    const urgency = Math.min(1, i / (path.length * 0.55));
    onStep(i, idx);
    // Play a tick only when the visible cell actually advances — one tone per
    // lit cell, matching the original audible cadence (not one per rAF frame).
    if (i !== lastTickIndex) {
      lastTickIndex = i;
      audio.tick(urgency);
    }

    raf = window.requestAnimationFrame(step);
  }

  let resolve;
  const promise = new Promise((r) => (resolve = r));
  // Attach the controller so callers can `await runChase(...)` AND call
  // `.skip()` on the same returned promise. finish() is invoked directly so a
  // skip landing between rAF frames still resolves promptly.
  promise.skip = () => {
    skipped = true;
    finish();
  };
  raf = window.requestAnimationFrame(step);
  return promise;
}

/** Promise that resolves after `ms` milliseconds. */
function wait(ms) {
  return new Promise((r) => window.setTimeout(r, ms));
}

/** Run the light-chase animation to the given result's cell. */
async function animateChase(result) {
  const path = buildChasePath(result.index, WHEEL.length, 3 + Math.floor(Math.random() * 1));
  const chase = runChase(path, (i, idx) => {
    highlight(idx);
    pulseHubLeds(i);
    const urgency = Math.min(1, i / (path.length * 0.55));
    hubEl?.style.setProperty("--urgency", String(urgency));
  });
  currentChase = chase;
  audio.chaseStart();
  setStatus("跑燈中…按一下開始可跳轉。", "run");
  await chase;
  audio.chaseEnd();
  currentChase = null;
  btnStart.textContent = "開始";
}

async function startRound() {
  await audio.unlock();
  if (game.running || game.totalBet() === 0) return;

  let result;
  try {
    result = game.spin();
  } catch {
    setStatus("請先押注。", "warn");
    return;
  }

  clearFlash();
  renderBets();
  btnStart.disabled = false;
  btnStart.textContent = "跳過";
  btnClear.disabled = true;
  btnCredit.disabled = true;
  setHubMode("run");
  if (hubEl) hubEl.style.setProperty("--urgency", "0");

  let guard = 0;
  while (result.kindId === ONCE && guard < 12) {
    guard += 1;
    await animateChase(result);
    audio.stopHit();
    highlight(result.index);
    flashWin(result.index);
    setHubMode("run", "↻");
    setStatus("「再來一次」！賭注不變，免費再轉一次。", "run");
    await wait(900);
    clearFlash();
    result = game.respin();
  }

  await animateChase(result);
  audio.stopHit();
  highlight(result.index);
  flashWin(result.index);

  game.settle(result.payout);
  renderCredits();

  const kind = kindById(result.kindId);
  if (result.payout > 0) {
    audio.win(kind.odds);
    setHubMode("win", `+${result.payout}`);
    setStatus(
      `停在「${kind.label}」！押 ${result.betOn} × ${kind.odds} = +${result.payout}`,
      "win",
    );
  } else {
    audio.lose();
    setHubMode("lose", kind.label);
    setStatus(`停在「${kind.label}」— 沒押中，再來。`, "lose");
  }

  btnCredit.disabled = false;
  renderBets();

  window.setTimeout(() => {
    if (!game.running) setHubMode("idle");
  }, 2200);
}

btnStart.addEventListener("click", () => {
  if (currentChase) {
    currentChase.skip();
    return;
  }
  void startRound();
});

// Space / Enter skips the chase while a round is running.
window.addEventListener("keydown", (e) => {
  if (currentChase && (e.code === "Space" || e.code === "Enter")) {
    e.preventDefault();
    currentChase.skip();
  }
});

btnClear.addEventListener("click", async () => {
  await audio.unlock();
  if (game.clearBets()) {
    audio.clear();
    renderBets();
    setStatus("已撤銷押注，娛樂幣已退回。");
  }
});

btnCredit.addEventListener("click", async () => {
  await audio.unlock();
  if (game.addCredits(50)) {
    audio.coin();
    renderCredits();
    setStatus("加了 50 枚娛樂幣。");
  }
});

btnMute.addEventListener("click", async () => {
  await audio.unlock();
  audio.setEnabled(!audio.enabled);
  btnMute.textContent = audio.enabled ? "音效開" : "音效關";
  btnMute.setAttribute("aria-pressed", audio.enabled ? "true" : "false");
  if (audio.enabled) audio.idle();
});

// First gesture unlocks audio on any control
document.body.addEventListener(
  "pointerdown",
  () => {
    void audio.unlock();
  },
  { once: true },
);

buildWheel();
buildBetGrid();
renderBets();
setStatus("加幣 → 點圖案押注 → 開始。純娛樂，無真實金錢。");
