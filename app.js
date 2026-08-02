import { MaliAudio } from "./audio.js";
import {
  KINDS,
  WHEEL,
  MaliGame,
  buildChasePath,
  kindById,
  stepDelayMs,
} from "./game.js";

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

function setStatus(msg, tone = "") {
  statusEl.textContent = msg;
  statusEl.dataset.tone = tone;
}

function renderCredits() {
  creditsEl.textContent = String(game.credits);
  totalBetEl.textContent = String(game.totalBet());
}

function renderBets() {
  for (const kind of KINDS) {
    const el = betGrid.querySelector(`[data-bet="${kind.id}"] .bet-count`);
    if (el) el.textContent = String(game.bets[kind.id]);
  }
  renderCredits();
  btnStart.disabled = game.running || game.totalBet() === 0;
  btnClear.disabled = game.running || game.totalBet() === 0;
  btnCredit.disabled = game.running;
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

/** Map chase index → 7×7 grid border slot (square ring, 24 cells). */
function squareSlot(i) {
  if (i < 7) return { col: i + 1, row: 1 }; // top L→R
  if (i < 12) return { col: 7, row: i - 5 }; // right T→B (rows 2–6)
  if (i < 19) return { col: 19 - i, row: 7 }; // bottom R→L
  return { col: 1, row: 26 - i }; // left B→T (rows 6–2)
}

function buildWheel() {
  wheelEl.innerHTML = "";
  cellEls = [];

  const hub = document.createElement("div");
  hub.className = "hub";
  hub.innerHTML = "<strong>小瑪莉</strong><span>純娛樂</span>";
  wheelEl.appendChild(hub);

  WHEEL.forEach((kindId, i) => {
    const kind = kindById(kindId);
    const { col, row } = squareSlot(i);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cell";
    btn.style.setProperty("--hue", String(kind.hue));
    btn.style.gridColumn = String(col);
    btn.style.gridRow = String(row);
    btn.dataset.index = String(i);
    btn.innerHTML = `<span class="glyph">${kind.glyph}</span><span class="odds">×${kind.odds}</span>`;
    btn.title = `${kind.label} ×${kind.odds}`;
    btn.disabled = true;
    wheelEl.appendChild(btn);
    cellEls.push(btn);
  });
}

function buildBetGrid() {
  betGrid.innerHTML = "";
  for (const kind of KINDS) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "bet-card";
    card.dataset.bet = kind.id;
    card.style.setProperty("--hue", String(kind.hue));
    card.innerHTML = `
      <span class="bet-glyph">${kind.glyph}</span>
      <span class="bet-label">${kind.label}</span>
      <span class="bet-odds">×${kind.odds}</span>
      <span class="bet-count">0</span>
    `;
    card.addEventListener("click", async () => {
      await audio.unlock();
      if (!game.bet(kind.id)) {
        if (game.credits <= 0) setStatus("娛樂幣不足，請加幣。", "warn");
        return;
      }
      audio.bet();
      renderBets();
      setStatus(`已押 ${kind.label}（目前該格 ${game.bets[kind.id]}）`);
    });
    betGrid.appendChild(card);
  }
}

/**
 * @param {number[]} path
 * @param {(i: number, idx: number) => void} onStep
 */
function runChase(path, onStep) {
  return new Promise((resolve) => {
    let i = 0;
    const step = () => {
      const idx = path[i];
      const urgency = Math.min(1, i / (path.length * 0.55));
      onStep(i, idx);
      audio.tick(urgency);
      i += 1;
      if (i >= path.length) {
        resolve();
        return;
      }
      window.setTimeout(step, stepDelayMs(i, path.length));
    };
    step();
  });
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
  btnStart.disabled = true;
  btnClear.disabled = true;
  btnCredit.disabled = true;
  setStatus("跑燈中…", "run");

  const path = buildChasePath(result.index, WHEEL.length, 4 + Math.floor(Math.random() * 2));
  await runChase(path, (_i, idx) => highlight(idx));

  audio.stopHit();
  highlight(result.index);
  flashWin(result.index);

  game.settle(result.payout);
  renderCredits();

  const kind = kindById(result.kindId);
  if (result.payout > 0) {
    audio.win(kind.odds);
    setStatus(
      `停在「${kind.label}」！押 ${result.betOn} × ${kind.odds} = +${result.payout}`,
      "win",
    );
  } else {
    audio.lose();
    setStatus(`停在「${kind.label}」— 沒押中，再來。`, "lose");
  }

  btnCredit.disabled = false;
  renderBets();
}

btnStart.addEventListener("click", () => {
  void startRound();
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
