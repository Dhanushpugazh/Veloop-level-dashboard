import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   VELoop Rewards — CAPTCHA Earn Module
   States: CAPTCHA -> VERIFYING -> CHECKING -> RESULT (correct/wrong)
           -> CLAIM (mock ad) / NO_THANKS -> fresh CAPTCHA
   ============================================================ */

const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 ambiguity

function randChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

function randomCode(len = 6) {
  let s = "";
  for (let i = 0; i < len; i++) s += randChar();
  return s;
}

// Swap two characters' positions
function swapTwo(code) {
  const arr = code.split("");
  let i = Math.floor(Math.random() * arr.length);
  let j = Math.floor(Math.random() * arr.length);
  while (j === i) j = Math.floor(Math.random() * arr.length);
  [arr[i], arr[j]] = [arr[j], arr[i]];
  return arr.join("");
}

// Replace one character with a visually-similar-ish random one
function substituteOne(code) {
  const arr = code.split("");
  const idx = Math.floor(Math.random() * arr.length);
  let next = randChar();
  while (next === arr[idx]) next = randChar();
  arr[idx] = next;
  return arr.join("");
}

function makeSimilar(code, usedSet) {
  let attempt;
  let guard = 0;
  do {
    attempt = Math.random() > 0.5 ? swapTwo(code) : substituteOne(code);
    guard++;
  } while ((attempt === code || usedSet.has(attempt)) && guard < 30);
  return attempt;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateChallenge(previousCode) {
  let code = randomCode(6);
  while (code === previousCode) code = randomCode(6);

  const used = new Set([code]);
  const similar1 = makeSimilar(code, used);
  used.add(similar1);
  const similar2 = makeSimilar(code, used);
  used.add(similar2);

  let different = randomCode(6);
  let guard = 0;
  while (used.has(different) && guard < 30) {
    different = randomCode(6);
    guard++;
  }

  const options = shuffle([
    { code, correct: true },
    { code: similar1, correct: false },
    { code: similar2, correct: false },
    { code: different, correct: false },
  ]);

  return { code, options, id: `${code}-${Date.now()}` };
}

/* ---------------- Icons (inline SVG, no external deps) ---------------- */

const GemIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
    <path
      d="M6 3h12l3.5 5.5L12 21 2.5 8.5 6 3z"
      fill="url(#gemGrad)"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="0.6"
      strokeLinejoin="round"
    />
    <path d="M6 3l2.2 5.5H2.5L6 3z" fill="rgba(255,255,255,0.18)" />
    <path d="M18 3l-2.2 5.5h5.7L18 3z" fill="rgba(255,255,255,0.1)" />
    <path d="M8.2 8.5h7.6L12 21 8.2 8.5z" fill="rgba(255,255,255,0.14)" />
    <defs>
      <linearGradient id="gemGrad" x1="2.5" y1="3" x2="21.5" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#8B7CFF" />
        <stop offset="0.5" stopColor="#6E5CE6" />
        <stop offset="1" stopColor="#4C6BFF" />
      </linearGradient>
    </defs>
  </svg>
);

const ShieldIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l8 3v6c0 5-3.4 8.7-8 11-4.6-2.3-8-6-8-11V5l8-3z"
      stroke="#34D9A0"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M8.5 12.2l2.4 2.4 4.6-4.8" stroke="#34D9A0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#22C58B" />
    <path d="M7 12.3l3.3 3.3L17 8.6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#3A3660" />
    <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#FF8A8A" strokeWidth="2.1" strokeLinecap="round" />
  </svg>
);

const RefreshIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M18 3v4.4h-4.4M6 21v-4.4h4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlayIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.12)" />
    <path d="M10 8l6 4-6 4V8z" fill="white" />
  </svg>
);

/* ---------------- Sub-components ---------------- */

function GemBalance({ value, bump }) {
  return (
    <div className={`vl-balance ${bump ? "vl-balance--bump" : ""}`}>
      <GemIcon size={16} />
      <span className="vl-balance__num">{value.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
    </div>
  );
}

function TopBar({ balance, bump }) {
  return (
    <div className="vl-topbar">
      <div className="vl-secure">
        <ShieldIcon />
        <span>Secure Verification</span>
        <span className="vl-secure__dot" />
      </div>
      <GemBalance value={balance} bump={bump} />
    </div>
  );
}

function CaptchaPlate({ code, reveal }) {
  // Add a light noise/strike-through treatment purely via layered spans for texture
  const letters = code.split("");
  return (
    <div className={`vl-plate ${reveal ? "vl-plate--in" : ""}`}>
      <svg className="vl-plate__noise" viewBox="0 0 300 90" preserveAspectRatio="none">
        <line x1="8" y1="20" x2="290" y2="68" stroke="rgba(20,16,50,0.14)" strokeWidth="2" />
        <line x1="12" y1="72" x2="284" y2="16" stroke="rgba(20,16,50,0.1)" strokeWidth="2" />
        <line x1="0" y1="45" x2="300" y2="50" stroke="rgba(20,16,50,0.08)" strokeWidth="1.5" />
      </svg>
      <div className="vl-plate__code">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="vl-plate__char"
            style={{
              transform: `rotate(${((i % 3) - 1) * 4}deg) translateY(${(i % 2) * 3}px)`,
              animationDelay: `${i * 40}ms`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}

function OptionButton({ code, state, onSelect, disabled, index }) {
  // state: 'idle' | 'selected' | 'correct' | 'incorrect' | 'dim'
  return (
    <button
      type="button"
      className={`vl-option vl-option--${state}`}
      style={{ animationDelay: `${120 + index * 70}ms` }}
      disabled={disabled}
      onClick={onSelect}
    >
      <span className="vl-option__code">{code}</span>
      {state === "selected" && <span className="vl-option__spinner" />}
      {state === "correct" && <CheckIcon size={18} />}
      {state === "incorrect" && <XIcon size={18} />}
    </button>
  );
}

function CheckingPage() {
  return (
    <div className="vl-panel vl-checking">
      <div className="vl-checking__orbit">
        <div className="vl-checking__core">
          <ShieldIcon size={22} />
        </div>
        <div className="vl-checking__ring vl-checking__ring--1" />
        <div className="vl-checking__ring vl-checking__ring--2" />
      </div>
      <div className="vl-checking__title">Checking your answer</div>
      <div className="vl-checking__sub">Confirming your verification with VELoop</div>
      <div className="vl-checking__bar">
        <div className="vl-checking__bar-fill" />
      </div>
    </div>
  );
}

function ResultPage({ outcome, reward, code, onClaim, onNoThanks }) {
  const isCorrect = outcome === "correct";
  return (
    <div className="vl-panel vl-result">
      <div className={`vl-result__badge vl-result__badge--${isCorrect ? "ok" : "no"}`}>
        {isCorrect ? <CheckIcon size={30} /> : <XIcon size={30} />}
      </div>

      <div className="vl-result__title">{isCorrect ? "Verified" : "Not quite right"}</div>
      <div className="vl-result__sub">
        {isCorrect ? "CAPTCHA verified successfully" : "That answer wasn't correct — the code was "}
        {!isCorrect && <span className="vl-result__code">{code}</span>}
      </div>

      <div className="vl-reward">
        <div className="vl-reward__glow" />
        <GemIcon size={26} />
        <span className="vl-reward__amount">+{reward}</span>
        <span className="vl-reward__label">Gem{reward !== 1 ? "s" : ""}</span>
      </div>

      <div className="vl-result__actions">
        <button className="vl-btn vl-btn--primary" onClick={onClaim}>
          <GemIcon size={16} />
          <span>Claim</span>
        </button>
        <button className="vl-btn vl-btn--secondary" onClick={onNoThanks}>
          No Thanks
        </button>
      </div>
    </div>
  );
}

function MockAdState({ progress }) {
  return (
    <div className="vl-panel vl-ad">
      <div className="vl-ad__icon">
        <PlayIcon size={22} />
      </div>
      <div className="vl-ad__title">Preparing reward…</div>
      <div className="vl-ad__sub">Getting your next earning opportunity ready</div>
      <div className="vl-ad__bar">
        <div className="vl-ad__bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

/* ---------------- Main component ---------------- */

export default function CaptchaEarnModule() {
  const [challenge, setChallenge] = useState(() => generateChallenge(null));
  const [phase, setPhase] = useState("captcha"); // captcha | verifying | checking | result | ad
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [outcome, setOutcome] = useState(null); // 'correct' | 'wrong'
  const [balance, setBalance] = useState(12450);
  const [bump, setBump] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [plateReveal, setPlateReveal] = useState(false);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const after = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  };

  useEffect(() => {
    const t = requestAnimationFrame(() => setPlateReveal(true));
    return () => cancelAnimationFrame(t);
  }, [challenge.id]);

  useEffect(() => () => clearTimers(), []);

  const handleSelect = useCallback(
    (idx) => {
      if (phase !== "captcha") return;
      setSelectedIdx(idx);
      setPhase("verifying");

      after(() => {
        const correct = challenge.options[idx].correct;
        setOutcome(correct ? "correct" : "wrong");
        setPhase("checking");

        after(() => {
          setPhase("result");
          const delta = correct ? 1 : 0.5;
          after(() => {
            setBalance((b) => +(b + delta).toFixed(1));
            setBump(true);
            after(() => setBump(false), 700);
          }, 250);
        }, 1100);
      }, 500);
    },
    [phase, challenge]
  );

  const startNewChallenge = useCallback(() => {
    setChallenge((prev) => generateChallenge(prev.code));
    setSelectedIdx(null);
    setOutcome(null);
    setPlateReveal(false);
    setPhase("captcha");
  }, []);

  const handleNoThanks = useCallback(() => {
    startNewChallenge();
  }, [startNewChallenge]);

  const handleClaim = useCallback(() => {
    setPhase("ad");
    setAdProgress(0);
    let p = 0;
    const tick = setInterval(() => {
      p += 100 / 14; // ~1.4s fill
      if (p >= 100) {
        p = 100;
        clearInterval(tick);
        after(() => startNewChallenge(), 250);
      }
      setAdProgress(Math.min(100, p));
    }, 100);
    timers.current.push(tick);
  }, [startNewChallenge]);

  const reward = outcome === "correct" ? 1 : 0.5;

  return (
    <div className="vl-root">
      <StyleSheet />
      <div className="vl-bg">
        <div className="vl-bg__glow vl-bg__glow--1" />
        <div className="vl-bg__glow vl-bg__glow--2" />
        <FloatingGems />
      </div>

      <div className="vl-frame">
        <TopBar balance={balance} bump={bump} />

        {phase === "captcha" || phase === "verifying" ? (
          <div className="vl-panel vl-captcha">
            <div className="vl-captcha__head">
              <h1 className="vl-captcha__title">Verify to Earn Gems</h1>
              <p className="vl-captcha__sub">Match the code below to confirm you're human</p>
            </div>

            <CaptchaPlate code={challenge.code} reveal={plateReveal} />

            <div className="vl-refresh-row">
              <span>Select the matching code</span>
            </div>

            <div className="vl-options">
              {challenge.options.map((opt, i) => {
                let state = "idle";
                if (phase === "verifying") {
                  state = i === selectedIdx ? "selected" : "dim";
                }
                return (
                  <OptionButton
                    key={opt.code + i}
                    code={opt.code}
                    state={state}
                    index={i}
                    disabled={phase !== "captcha"}
                    onSelect={() => handleSelect(i)}
                  />
                );
              })}
            </div>

            <div className="vl-earn-note">
              <GemIcon size={14} />
              <span>Earn up to <strong>+1 Gem</strong> per verification</span>
            </div>
          </div>
        ) : null}

        {phase === "checking" && <CheckingPage />}

        {phase === "result" && (
          <ResultPage
            outcome={outcome}
            reward={reward}
            code={challenge.code}
            onClaim={handleClaim}
            onNoThanks={handleNoThanks}
          />
        )}

        {phase === "ad" && <MockAdState progress={adProgress} />}

        <div className="vl-navbar">
          {[
            { label: "Dashboard", icon: "grid" },
            { label: "Earn", icon: "gem", active: true },
            { label: "Wallet", icon: "wallet" },
            { label: "Profile", icon: "profile" },
          ].map((item) => (
            <div key={item.label} className={`vl-navitem ${item.active ? "vl-navitem--active" : ""}`}>
              <NavIcon kind={item.icon} active={item.active} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavIcon({ kind, active }) {
  const c = active ? "#B9A9FF" : "rgba(255,255,255,0.45)";
  if (kind === "gem") return <GemIcon size={18} className={active ? "vl-nav-gem-active" : ""} />;
  if (kind === "grid")
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="2" stroke={c} strokeWidth="1.6" />
        <rect x="13" y="3" width="8" height="8" rx="2" stroke={c} strokeWidth="1.6" />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke={c} strokeWidth="1.6" />
        <rect x="13" y="13" width="8" height="8" rx="2" stroke={c} strokeWidth="1.6" />
      </svg>
    );
  if (kind === "wallet")
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="13" rx="2.5" stroke={c} strokeWidth="1.6" />
        <path d="M3 10h18" stroke={c} strokeWidth="1.6" />
        <circle cx="16.5" cy="14" r="1.3" fill={c} />
      </svg>
    );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.4" stroke={c} strokeWidth="1.6" />
      <path d="M5 20c1.2-4 4.2-6 7-6s5.8 2 7 6" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FloatingGems() {
  const gems = [
    { top: "12%", left: "6%", size: 30, delay: 0 },
    { top: "68%", left: "88%", size: 40, delay: 1.2 },
    { top: "40%", left: "92%", size: 20, delay: 2.1 },
    { top: "82%", left: "10%", size: 24, delay: 0.6 },
  ];
  return (
    <>
      {gems.map((g, i) => (
        <div
          key={i}
          className="vl-floating-gem"
          style={{ top: g.top, left: g.left, animationDelay: `${g.delay}s` }}
        >
          <GemIcon size={g.size} />
        </div>
      ))}
    </>
  );
}

/* ---------------- Styles ---------------- */

function StyleSheet() {
  return (
    <style>{`
      .vl-root {
        --bg-deep: #0A0B18;
        --bg-mid: #12122A;
        --purple: #7C5CFF;
        --purple-2: #5B4BDB;
        --blue: #4C7BFF;
        --teal: #34D9A0;
        --ink: #EDEBFB;
        --ink-dim: rgba(237,235,251,0.6);
        --card: #FFFFFF;
        --card-ink: #17162E;
        font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
        position: relative;
        width: 100%;
        max-width: 420px;
        margin: 0 auto;
        border-radius: 32px;
        overflow: hidden;
        isolation: isolate;
        box-shadow: 0 30px 80px rgba(0,0,0,0.45);
      }
      .vl-root * { box-sizing: border-box; }
      .vl-bg {
        position: absolute; inset: 0;
        background: radial-gradient(120% 90% at 50% -10%, #1B1740 0%, var(--bg-mid) 45%, var(--bg-deep) 100%);
        z-index: 0;
        overflow: hidden;
      }
      .vl-bg__glow { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.35; }
      .vl-bg__glow--1 { width: 260px; height: 260px; background: var(--purple); top: -60px; left: -40px; }
      .vl-bg__glow--2 { width: 220px; height: 220px; background: var(--blue); bottom: -40px; right: -50px; }
      .vl-floating-gem {
        position: absolute; opacity: 0.16; filter: drop-shadow(0 0 6px rgba(124,92,255,0.4));
        animation: vlFloat 7s ease-in-out infinite;
      }
      @keyframes vlFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-14px) rotate(8deg); }
      }

      .vl-frame {
        position: relative; z-index: 1;
        display: flex; flex-direction: column;
        min-height: 640px;
        padding: 20px 18px 0;
      }

      .vl-topbar {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 22px;
      }
      .vl-secure {
        display: flex; align-items: center; gap: 6px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.08);
        padding: 7px 12px; border-radius: 999px;
        font-size: 12.5px; color: var(--ink-dim);
      }
      .vl-secure__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 8px var(--teal); }
      .vl-balance {
        display: flex; align-items: center; gap: 6px;
        background: rgba(124,92,255,0.14);
        border: 1px solid rgba(124,92,255,0.3);
        padding: 7px 12px; border-radius: 999px;
        color: var(--ink); font-weight: 600; font-size: 13.5px;
        transition: transform 0.25s ease;
      }
      .vl-balance--bump { transform: scale(1.08); }
      .vl-balance__num { font-variant-numeric: tabular-nums; }

      .vl-panel { animation: vlRise 0.5s cubic-bezier(.22,1,.36,1); }
      @keyframes vlRise {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Captcha card */
      .vl-captcha {
        background: linear-gradient(180deg, #FBFAFF 0%, #F3F1FC 100%);
        border-radius: 24px;
        padding: 24px 20px 20px;
        box-shadow: 0 20px 50px rgba(10,8,30,0.35), inset 0 1px 0 rgba(255,255,255,0.6);
      }
      .vl-captcha__head { text-align: center; margin-bottom: 18px; }
      .vl-captcha__title {
        margin: 0 0 4px; font-size: 21px; font-weight: 700; letter-spacing: -0.02em;
        background: linear-gradient(90deg, #4C3FD9, #7C5CFF 60%, #4C7BFF);
        -webkit-background-clip: text; background-clip: text; color: transparent;
      }
      .vl-captcha__sub { margin: 0; font-size: 13px; color: #6B6785; }

      .vl-plate {
        position: relative;
        background: #FFFFFF;
        border: 1px solid #E7E3F7;
        border-radius: 16px;
        padding: 18px 10px;
        margin-bottom: 14px;
        overflow: hidden;
        opacity: 0;
        transform: scale(0.96);
      }
      .vl-plate--in { animation: vlPlateIn 0.55s cubic-bezier(.22,1,.36,1) forwards; }
      @keyframes vlPlateIn { to { opacity: 1; transform: scale(1); } }
      .vl-plate__noise { position: absolute; inset: 0; width: 100%; height: 100%; }
      .vl-plate__code {
        position: relative; display: flex; justify-content: center; gap: 3px;
      }
      .vl-plate__char {
        font-family: "Space Mono", "SFMono-Regular", Consolas, monospace;
        font-size: 30px; font-weight: 700; color: #211D4A;
        display: inline-block;
        animation: vlCharIn 0.4s cubic-bezier(.22,1,.36,1) both;
      }
      @keyframes vlCharIn {
        from { opacity: 0; transform: translateY(6px) scale(0.85); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .vl-refresh-row {
        display: flex; justify-content: center; margin-bottom: 12px;
        font-size: 12.5px; color: #7A7595; font-weight: 500;
      }

      .vl-options {
        display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;
      }
      .vl-option {
        position: relative;
        font-family: "Space Mono", Consolas, monospace;
        font-size: 15px; font-weight: 700; letter-spacing: 0.02em;
        color: #26224C;
        background: #FFFFFF;
        border: 1.5px solid #E4E0F5;
        border-radius: 14px;
        padding: 15px 10px;
        display: flex; align-items: center; justify-content: center; gap: 8px;
        cursor: pointer;
        transition: transform 0.15s ease, border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, opacity 0.25s ease;
        opacity: 0;
        animation: vlOptIn 0.45s cubic-bezier(.22,1,.36,1) both;
      }
      @keyframes vlOptIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .vl-option--idle:hover {
        border-color: #B9A9FF;
        box-shadow: 0 6px 18px rgba(124,92,255,0.18);
        transform: translateY(-2px);
        background: #FBFAFF;
      }
      .vl-option--idle:active { transform: translateY(0) scale(0.98); }
      .vl-option--selected {
        border-color: var(--purple);
        background: linear-gradient(180deg, #F3F0FF, #EAE5FF);
        box-shadow: 0 0 0 4px rgba(124,92,255,0.15);
      }
      .vl-option--dim { opacity: 0.35; filter: grayscale(0.3); }
      .vl-option:disabled { cursor: default; }

      .vl-option__spinner {
        width: 15px; height: 15px; border-radius: 50%;
        border: 2px solid rgba(124,92,255,0.25);
        border-top-color: var(--purple);
        animation: vlSpin 0.6s linear infinite;
      }
      @keyframes vlSpin { to { transform: rotate(360deg); } }

      .vl-earn-note {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        font-size: 12.5px; color: #6B6785;
      }
      .vl-earn-note strong { color: #4C3FD9; }

      /* Checking */
      .vl-checking {
        background: linear-gradient(180deg, #FBFAFF, #F3F1FC);
        border-radius: 24px; padding: 46px 20px;
        display: flex; flex-direction: column; align-items: center; gap: 6px;
      }
      .vl-checking__orbit { position: relative; width: 76px; height: 76px; margin-bottom: 18px; }
      .vl-checking__core {
        position: absolute; inset: 0; margin: auto; width: 40px; height: 40px;
        background: white; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 6px 16px rgba(124,92,255,0.25);
      }
      .vl-checking__ring {
        position: absolute; inset: 0; border-radius: 50%;
        border: 2.5px solid transparent;
      }
      .vl-checking__ring--1 { border-top-color: var(--purple); border-right-color: var(--purple); animation: vlSpin 1s linear infinite; }
      .vl-checking__ring--2 {
        inset: -10px; border-bottom-color: var(--blue); opacity: 0.5;
        animation: vlSpin 1.6s linear infinite reverse;
      }
      .vl-checking__title { font-size: 16.5px; font-weight: 700; color: #211D4A; }
      .vl-checking__sub { font-size: 12.5px; color: #7A7595; margin-bottom: 18px; }
      .vl-checking__bar { width: 140px; height: 4px; border-radius: 4px; background: #E7E3F7; overflow: hidden; }
      .vl-checking__bar-fill {
        height: 100%; width: 40%; border-radius: 4px;
        background: linear-gradient(90deg, var(--purple), var(--blue));
        animation: vlBarSlide 1.1s ease-in-out infinite;
      }
      @keyframes vlBarSlide {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(250%); }
      }

      /* Result */
      .vl-result {
        background: linear-gradient(180deg, #FBFAFF, #F3F1FC);
        border-radius: 24px; padding: 34px 22px 24px;
        display: flex; flex-direction: column; align-items: center; text-align: center;
      }
      .vl-result__badge {
        width: 56px; height: 56px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 14px;
        animation: vlPop 0.5s cubic-bezier(.34,1.56,.64,1) both;
      }
      @keyframes vlPop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .vl-result__title { font-size: 19px; font-weight: 700; color: #211D4A; margin-bottom: 4px; }
      .vl-result__sub { font-size: 13px; color: #7A7595; margin-bottom: 18px; }
      .vl-result__code { font-family: "Space Mono", monospace; font-weight: 700; color: #4C3FD9; }

      .vl-reward {
        position: relative;
        display: flex; align-items: baseline; gap: 6px;
        background: linear-gradient(135deg, #EFEBFF, #E4EEFF);
        border: 1px solid #D9D2FA;
        border-radius: 18px;
        padding: 16px 26px;
        margin-bottom: 22px;
        animation: vlRewardIn 0.6s cubic-bezier(.22,1,.36,1) 0.15s both;
      }
      @keyframes vlRewardIn {
        from { opacity: 0; transform: translateY(8px) scale(0.9); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .vl-reward__glow {
        position: absolute; inset: -20px; z-index: -1; border-radius: 50%;
        background: radial-gradient(circle, rgba(124,92,255,0.25), transparent 70%);
      }
      .vl-reward__amount { font-size: 26px; font-weight: 800; color: #3A2FB8; font-variant-numeric: tabular-nums; }
      .vl-reward__label { font-size: 13px; font-weight: 600; color: #6B6785; }

      .vl-result__actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }

      .vl-btn {
        border: none; border-radius: 14px; padding: 14px 18px;
        font-size: 15px; font-weight: 700; cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: 8px;
        transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        width: 100%;
      }
      .vl-btn--primary {
        color: white;
        background: linear-gradient(90deg, var(--purple-2), var(--purple) 55%, var(--blue));
        box-shadow: 0 12px 24px rgba(124,92,255,0.35);
      }
      .vl-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 16px 30px rgba(124,92,255,0.42); }
      .vl-btn--primary:active { transform: translateY(0) scale(0.98); }
      .vl-btn--secondary {
        color: #57517A; background: transparent; border: 1.5px solid #DAD5F2;
      }
      .vl-btn--secondary:hover { background: #F2EFFF; border-color: #C7BDF5; }

      /* Mock ad */
      .vl-ad {
        background: linear-gradient(180deg, #15112E, #1E1846);
        border-radius: 24px; padding: 46px 22px;
        display: flex; flex-direction: column; align-items: center; text-align: center;
        border: 1px solid rgba(255,255,255,0.08);
      }
      .vl-ad__icon {
        width: 52px; height: 52px; border-radius: 50%;
        background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14);
        display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
        animation: vlPulse 1.4s ease-in-out infinite;
      }
      @keyframes vlPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
      .vl-ad__title { color: var(--ink); font-size: 16.5px; font-weight: 700; margin-bottom: 4px; }
      .vl-ad__sub { color: var(--ink-dim); font-size: 12.5px; margin-bottom: 20px; }
      .vl-ad__bar { width: 160px; height: 5px; border-radius: 4px; background: rgba(255,255,255,0.1); overflow: hidden; }
      .vl-ad__bar-fill {
        height: 100%; border-radius: 4px;
        background: linear-gradient(90deg, var(--purple), var(--blue));
        transition: width 0.1s linear;
      }

      /* Nav bar */
      .vl-navbar {
        margin-top: auto;
        display: flex; justify-content: space-around; align-items: center;
        padding: 14px 6px 18px;
      }
      .vl-navitem {
        display: flex; flex-direction: column; align-items: center; gap: 4px;
        font-size: 10.5px; color: rgba(255,255,255,0.45); font-weight: 500;
      }
      .vl-navitem--active { color: #B9A9FF; }
      .vl-nav-gem-active { filter: drop-shadow(0 0 6px rgba(124,92,255,0.6)); }

      @media (max-width: 380px) {
        .vl-plate__char { font-size: 24px; }
        .vl-option { font-size: 13px; padding: 13px 6px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .vl-root *, .vl-root *::before, .vl-root *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}
