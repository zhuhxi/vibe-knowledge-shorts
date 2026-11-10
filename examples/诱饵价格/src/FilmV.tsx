// 诱饵价格 v4：暗底 + 竖屏 1080×1920（用户 2026-11-10 定：黑色调、竖屏为主、不用章节卡缩到角落的动画）。
//  故事和时间轴同 v3（script.ts）。贯穿物：一张奶茶价目单；结尾一只手把大杯那行盖住。
//  规则切换：顶部固定一条「规则栏」（① ② ③ 三个进度点 + 当前规则名），新规则从右滑入、旧的向左滑出，不再做中央砸出再缩角。
//  竖屏安全区：主体放在 y 360–1380；字幕在 y 1470 一带（避开抖音/小红书底部的文案和按钮区、右侧的点赞栏）。
import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from "remotion";
import { B, BG, DIM, GOLD, INK, LINES, RED } from "./script";
import { FPS, SANS, SERIF, cl, ease, mix, rnd, span, win } from "./kit";

export const VW = 1080, VH = 1920;
const CARD = "#14142E", EDGE = "#4A4870", GREEN = "#5FD08A";
const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const glowT = (c: string) => `0 0 24px ${c}88, 0 0 4px ${c}`;

export const FilmV: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Backdrop t={t} />
      {t < B(2) + 0.3 && <OpeningAndTitle t={t} />}
      {t >= B(2) - 0.3 && t < B(11) + 0.3 && <Slips t={t} />}
      {t >= B(11) - 0.4 && t < B(16) + 0.3 && <MenuRule2 t={t} />}
      {t >= B(16) - 0.3 && t < B(22) + 0.3 && <Rule3 t={t} />}
      {t >= B(22) - 0.4 && <Ending t={t} />}
      <RuleBar t={t} />
      <Subs t={t} />
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: span(t, 59.4, 60) }} />
      <Audio src={staticFile("audio/mix.wav")} />
    </AbsoluteFill>
  );
};

// ── 暗底：顶光 + 微尘 ──
export const Backdrop: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 18%, rgba(255,244,214,.14) 0%, rgba(255,244,214,0) 55%)" }} />
    <svg width={VW} height={VH} style={{ position: "absolute" }}>
      {Array.from({ length: 60 }, (_, i) => {
        const x = (rnd(i, 1) * VW + t * (6 + rnd(i, 2) * 10)) % VW, y = (rnd(i, 3) * VH - t * (4 + rnd(i, 4) * 6) + VH) % VH;
        return <circle key={i} cx={x} cy={y} r={0.8 + rnd(i, 5) * 1.6} fill="#FFF4D6" opacity={0.08 + 0.16 * rnd(i, 6)} />;
      })}
    </svg>
  </AbsoluteFill>
);

// ── 字幕：竖屏中下部，单行大字 + 黑描边（石头剪刀布同款，放大到竖屏）──
const colorize = (text: string, color?: Record<string, string>) => {
  if (!color) return [text];
  let parts: (string | React.ReactElement)[] = [text];
  Object.entries(color).forEach(([k, c], j) => {
    parts = parts.flatMap((p) => typeof p !== "string" ? [p] : p.split(k).flatMap((s, i, arr) => i < arr.length - 1 ? [s, <span key={k + j + i} style={{ color: c }}>{k}</span>] : [s]));
  });
  return parts;
};
export const Subs: React.FC<{ t: number }> = ({ t }) => {
  const l = LINES.find((x) => t >= x.t && t < x.t + x.d);
  if (!l) return null;
  const a = span(t, l.t, l.t + 0.15) * (1 - span(t, l.t + l.d - 0.12, l.t + l.d));
  return <div style={{ position: "absolute", left: 40, right: 40, top: 1450, textAlign: "center", opacity: a, font: `700 62px '${SANS}'`, color: INK, letterSpacing: 2, lineHeight: 1.25, textShadow: "0 2px 14px #000, 0 0 3px #000" }}>{colorize(l.text, l.color)}</div>;
};

// ── 规则栏：顶部固定，① ② ③ 进度点 + 当前规则名；切换时旧的左滑出、新的右滑入 ──
const RULES = [{ at: B(2), until: B(8), num: "规则一", text: "没人选的那档 也在起作用" }, { at: B(8), until: B(16), num: "规则二", text: "被比下去的 就是诱饵" }, { at: B(16), until: B(22), num: "规则三", text: "先想好要什么" }];
export const RuleBar: React.FC<{ t: number }> = ({ t }) => {
  const on = span(t, B(2) - 0.1, B(2) + 0.3) * (1 - span(t, B(22) - 0.2, B(22) + 0.2));
  if (on <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 120, width: VW, height: 210, opacity: on, overflow: "hidden" }}>
      {RULES.map((r, i) => {
        const inn = span(t, r.at - 0.05, r.at + 0.45), out = span(t, r.until - 0.05, r.until + 0.4);
        if (inn <= 0 || out >= 1) return null;
        const x = mix(VW, 0, ease(inn)) - VW * ease(out);
        const big = 1 + 0.12 * win(t, r.at + 0.3, r.at + 1.2, 0.3);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 0, width: VW, textAlign: "center" }}>
            <div style={{ font: `800 46px '${SANS}'`, color: GOLD, letterSpacing: 10, textShadow: glowT(GOLD) }}>{r.num}</div>
            <div style={{ font: `900 76px '${SERIF}'`, color: INK, letterSpacing: 4, marginTop: 4, transform: `scale(${big})`, textShadow: "0 0 30px rgba(242,193,78,.25)" }}>{r.text}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 190, width: VW, display: "flex", justifyContent: "center", gap: 18 }}>
        {RULES.map((r, i) => <div key={i} style={{ width: t >= r.at ? 56 : 18, height: 10, borderRadius: 5, background: t >= r.at ? GOLD : EDGE, boxShadow: t >= r.at ? glowT(GOLD) : "none" }} />)}
      </div>
    </div>
  );
};

// ── 零件 ──
const CupIcon: React.FC<{ h: number; c?: string }> = ({ h, c = INK }) => (
  <svg width={80} height={130} viewBox="0 0 80 130" style={{ display: "block", flex: "none", filter: `drop-shadow(0 0 6px ${c}66)` }}>
    <g transform={`translate(40 125) scale(${h / 100})`}>
      <path d="M-28 -100 L28 -100 L20 0 L-20 0 Z" fill="none" stroke={c} strokeWidth={4} />
      <rect x={-32} y={-110} width={64} height={10} rx={3} fill="none" stroke={c} strokeWidth={4} />
      <line x1={6} y1={-110} x2={16} y2={-140} stroke={c} strokeWidth={5} strokeLinecap="round" />
      {[0, 1, 2, 3].map((j) => <circle key={j} cx={-12 + j * 8} cy={-12 - (j % 2) * 6} r={5} fill={c} />)}
    </g>
  </svg>
);
export const Stamp: React.FC<{ text: string; size?: number; k?: number; rot?: number }> = ({ text, size = 150, k = 1, rot = -8 }) => (
  <div style={{ width: size * (text.length > 1 ? 1.9 : 1), height: size, borderRadius: text.length > 1 ? 18 : "50%", border: `${size * 0.08}px solid ${RED}`, color: RED, font: `900 ${size * (text.length > 1 ? 0.5 : 0.72)}px '${SANS}'`, display: "flex", alignItems: "center", justifyContent: "center", opacity: k, transform: `rotate(${rot}deg) scale(${mix(1.8, 1, ease(k))})`, background: "rgba(10,10,30,.55)", boxShadow: `0 0 26px ${RED}66`, textShadow: glowT(RED) }}>{text}</div>
);
const Cite: React.FC<{ text: string; o: number; y?: number }> = ({ text, o, y = 1360 }) => <div style={{ position: "absolute", left: 0, width: VW, top: y, textAlign: "center", font: `500 30px '${SANS}'`, color: DIM, opacity: o }}>{text}</div>;
export const Note: React.FC<{ text: string; color?: string; size?: number; style?: React.CSSProperties }> = ({ text, color = RED, size = 54, style }) => (
  <div style={{ font: `900 ${size}px '${SANS}'`, color, whiteSpace: "nowrap", textShadow: glowT(color), ...style }}>{text}</div>
);

type Row = { n: string; ml: string; p: string; h: number };
const MENU: Row[] = [{ n: "中杯", ml: "500ml", p: "12", h: 70 }, { n: "大杯", ml: "600ml", p: "18", h: 85 }, { n: "超大杯", ml: "800ml", p: "18", h: 100 }];
export const MenuD: React.FC<{ hi?: number[] }> = ({ hi = [0, 0, 0] }) => (
  <div style={{ width: 860, padding: "38px 50px 24px", background: CARD, borderRadius: 18, border: `3px solid ${EDGE}`, boxShadow: "0 0 60px rgba(242,193,78,.08)" }}>
    <div style={{ font: `900 54px '${SERIF}'`, color: INK, letterSpacing: 6, borderBottom: `3px solid ${EDGE}`, paddingBottom: 14 }}>招牌珍珠奶茶</div>
    {MENU.map((r, i) => (
      <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 26, padding: "16px 12px", borderBottom: `2px dashed ${EDGE}`, background: `rgba(242,193,78,${0.18 * hi[i]})`, boxShadow: hi[i] > 0.5 ? `inset 0 0 0 3px ${GOLD}` : "none", borderRadius: 10 }}>
        <CupIcon h={r.h} c={hi[i] > 0.5 ? GOLD : INK} />
        <div style={{ flex: 1, font: `800 50px '${SANS}'`, color: INK }}>{r.n}<span style={{ font: `500 34px '${SANS}'`, color: DIM, marginLeft: 16 }}>{r.ml}</span></div>
        <div style={{ font: `900 72px '${SANS}'`, color: hi[i] > 0.5 ? GOLD : INK, textShadow: hi[i] > 0.5 ? glowT(GOLD) : "none" }}>¥{r.p}</div>
      </div>
    ))}
    <div style={{ font: `400 28px '${SANS}'`, color: DIM, marginTop: 12, textAlign: "right" }}>价格为举例</div>
  </div>
);
const rowY = (i: number) => 120 + 81 + i * 162;   // 菜单内第 i 行中心（scale=1）
export const Palm: React.FC<{ w?: number }> = ({ w = 880 }) => (
  <svg width={w + 40} height={200} viewBox={`${-w / 2 - 20} -100 ${w + 40} 200`} style={{ overflow: "visible" }}>
    <path d={`M${-w / 2} -88 Q${-w / 2 - 20} 0 ${-w / 2} 88 L${w / 2} 88 Q${w / 2 + 30} 0 ${w / 2} -88 Z`} fill="#2A2840" stroke={INK} strokeWidth={5} style={{ filter: `drop-shadow(0 0 14px ${INK}55)` }} />
    {[-50, 0, 50].map((y) => <line key={y} x1={w / 2 - 180} y1={y} x2={w / 2} y2={y} stroke={INK} strokeWidth={3} opacity={0.5} />)}
  </svg>
);
const Finger: React.FC<{ x: number; y: number; o?: number; rot?: number }> = ({ x, y, o = 1, rot = -20 }) => (
  <svg width={VW} height={VH} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M0 0 C 14 -6 26 -2 30 14 L 44 120 C 70 118 90 130 96 160 L 100 260 L 10 280 L -30 170 C -36 150 -20 140 -6 150 L 6 170 L -6 20 C -8 8 -6 2 0 0 Z" fill="#2A2840" stroke={INK} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${INK}66)` }} />
    </g>
  </svg>
);

const SLIPS = [
  { title: "网络版", price: "$59", rows: [["网络", true], ["印刷", false]] },
  { title: "印刷版", price: "$125", rows: [["网络", false], ["印刷", true]] },
  { title: "印刷 + 网络", price: "$125", rows: [["网络", true], ["印刷", true]] },
] as const;
// 订阅单：只留「图 + 价格」，名字做成图下面的小字；不再列「网络 ✓ / 印刷 ✗」（图标已经说明了）
const Slip: React.FC<{ i: number; band?: number; glow?: number }> = ({ i, glow = 0 }) => (
  <div style={{ width: 300, background: CARD, borderRadius: 22, border: `3px solid ${glow > 0.5 ? GOLD : EDGE}`, boxShadow: glow > 0.5 ? `0 0 30px ${GOLD}55` : "0 10px 30px rgba(0,0,0,.5)", padding: "26px 0 20px", textAlign: "center" }}>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, height: 150 }}>
      {(i === 0 ? ["laptop"] : i === 1 ? ["newspaper"] : ["newspaper", "laptop"]).map((ic) => <Img key={ic} src={staticFile(`assets/icons/${ic}_flat.svg`)} style={{ width: i === 2 ? 118 : 150, height: i === 2 ? 118 : 150 }} />)}
    </div>
    <div style={{ font: `600 34px '${SANS}'`, color: DIM, marginTop: 6 }}>{SLIPS[i].title}</div>
    <div style={{ font: `900 84px '${SANS}'`, color: glow > 0.5 ? GOLD : INK, lineHeight: 1.1, textShadow: glow > 0.5 ? glowT(GOLD) : "none" }}>{SLIPS[i].price}</div>
  </div>
);
const Chips: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ display: "flex", flexWrap: "wrap", width: 290, gap: 6, justifyContent: "center", alignContent: "flex-start", height: 300 }}>
    {Array.from({ length: n }, (_, i) => <div key={i} style={{ width: 23, height: 23, borderRadius: 5, background: GOLD, boxShadow: `0 0 8px ${GOLD}88` }} />)}
  </div>
);

// ── 冷开场 + 片名卡：价目单，镜头推近大杯，手指从中杯移到大杯；2.8 盖「诱饵?」；4.5 价目单退到后面变暗，片名砸下 ──
const OpeningAndTitle: React.FC<{ t: number }> = ({ t }) => {
  const inn = span(t, 0, 0.5), back = span(t, 4.5, 5.3), out = span(t, B(2) - 0.3, B(2) + 0.2);
  const push = ease(span(t, 0.3, 3.0));
  const ms = mix(mix(0.9, 0.98, push), 0.75, back), mx = mix(20, (VW - 960 * 0.75) / 2, back), my = mix(mix(mix(560, 470, inn), 420, push), 1150, back);
  const handRow = mix(rowY(0), rowY(1), span(t, 0.9, 1.6));
  const tk = span(t, 5.2, 5.7);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <div style={abs(mx, my, { transform: `scale(${ms})`, transformOrigin: "0 0", opacity: mix(inn, 0.25, back), filter: `blur(${3 * back}px)` })}>
        <MenuD hi={[win(t, 0.4, 1.4, 0.2), t > 1.4 ? 1 : 0, 0]} />
        <div style={abs(380, rowY(1) - 60)}><Stamp text="诱饵?" size={105} k={span(t, 2.8, 3.05)} /></div>
      </div>
      {/* 手指从下方伸上来，指尖停在当前行左侧的杯子上，不挡价格 */}
      <Finger x={mx + 885 * ms} y={my + handRow * ms} rot={-95} o={inn * (1 - back)} />
      {/* 片名 */}
      <div style={{ position: "absolute", left: 0, width: VW, top: 520, textAlign: "center", opacity: span(t, 5.2, 5.45), transform: `scale(${mix(0.6, 1, ease(tk))})` }}>
        <div style={{ font: `900 230px '${SERIF}'`, letterSpacing: 20, lineHeight: 1.05, background: `linear-gradient(180deg, #FFF3C9, ${GOLD} 60%, #B8862B)`, WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 30px rgba(242,193,78,.35))" }}>诱饵<br />价格</div>
        <div style={{ font: `700 62px '${SANS}'`, color: INK, marginTop: 20, opacity: span(t, 5.6, 6.0) }}>没人买的那一档<br /><span style={{ color: RED }}>是摆给你看的</span></div>
        <div style={{ font: `400 32px '${SANS}'`, color: DIM, marginTop: 24, letterSpacing: 2, opacity: span(t, 6.2, 6.6) }}>《怪诞行为学》实验 · 360 万笔真实账单</div>
      </div>
      <div style={abs(780, 400, { opacity: t > 5.4 ? 1 : 0 })}><Stamp text="饵" size={150} k={span(t, 5.4, 5.65)} /></div>
    </div>
  );
};

// ── 规则一 + 规则二前半：三张订阅单 → 16/0/84 → 拿掉印刷版 → 68/32 → 印刷版和套餐并排 → 诱饵 / 像白送 ──
const SX = [30, 390, 750];
export const Slips: React.FC<{ t: number }> = ({ t }) => {
  const o = span(t, B(2) - 0.3, B(2) + 0.2) * (1 - span(t, B(11) - 0.3, B(11) + 0.2));
  const drop = (i: number) => ease(span(t, B(3) - 0.3 + i * 0.15, B(3) + 0.2 + i * 0.15));
  const c1 = span(t, B(4), B(4) + 1.0), c2 = span(t, B(5), B(5) + 0.8), gone = span(t, B(6) + 0.8, B(6) + 1.5), c3 = span(t, B(7), B(7) + 1.2);
  const cmp = span(t, B(9) - 0.2, B(9) + 0.5), mark = span(t, B(10), B(10) + 0.3);
  const n = [Math.round(mix(16 * c1, 68, c3)), 0, Math.round(mix(84 * c2, 32, c3))];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {[0, 1, 2].map((i) => {
        const x = i === 0 ? SX[0] : mix(SX[i], i === 1 ? 110 : 560, ease(cmp));
        const y = mix(-600, 420, drop(i)) - (i === 1 ? 900 * ease(gone) * (1 - cmp) : 0) + (i > 0 ? 80 * ease(cmp) : 0);
        const s = i > 0 ? mix(1, 1.4, ease(cmp)) : 1;
        return (
          <div key={i} style={abs(x, y, { opacity: i === 0 ? 1 - cmp : 1, transform: `scale(${s})`, transformOrigin: "0 0" })}>
            <Slip i={i} band={i > 0 ? cmp : 0} glow={i === 2 && (mark > 0.5 || (c2 > 0.5 && c3 < 0.5)) ? 1 : 0} />
            {i === 1 && <div style={abs(30, 300, { opacity: mark })}><Stamp text="诱饵" size={100} k={mark} /></div>}
          </div>
        );
      })}
      {/* 人数：金色小方块 + 数字；印刷版是红圈 0 */}
      <div style={{ opacity: span(t, B(4) - 0.1, B(4) + 0.2) * (1 - cmp) }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={abs(SX[i] + 5, 860, { width: 290, display: "flex", flexDirection: "column", alignItems: "center", opacity: i === 1 ? 1 - gone : i === 2 ? (c2 > 0 ? 1 : 0) : 1 })}>
            {i === 1 ? <div style={{ height: 300, display: "flex", alignItems: "center" }}><Stamp text="0" size={150} k={span(t, B(4) + 0.6, B(4) + 0.85)} /></div> : <Chips n={n[i]} />}
            <div style={{ font: `900 80px '${SANS}'`, color: i === 1 ? RED : c3 > 0.5 && i === 2 ? RED : INK, marginTop: 8, textShadow: i === 2 && c2 > 0.5 && c3 < 0.5 ? glowT(GOLD) : "none" }}>{n[i]} 人</div>
          </div>
        ))}
      </div>
      {/* 拿掉印刷版：红叉 */}
      <svg width={VW} height={VH} style={{ position: "absolute", left: 0, top: 0, opacity: win(t, B(6), B(6) + 1.3, 0.2) }}>
        <path d="M420 440 L660 760 M660 440 L420 760" stroke={RED} strokeWidth={18} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${RED})` }} />
      </svg>
      {/* 并排比 */}
      <div style={abs(0, 1230, { width: VW, textAlign: "center", opacity: cmp })}>
        <Note text={mark > 0.5 ? "诱饵　　　像白送" : "同样 $125 · 少了网络版"} color={mark > 0.5 ? GOLD : RED} size={60} />
      </div>
    </div>
  );
};

// ── 规则二后半：回到价目单 → 大杯 vs 超大杯同价 → 大杯盖「诱饵」→ 圈出超大杯 → 同价少一样 = 诱饵 ──
const MenuRule2: React.FC<{ t: number }> = ({ t }) => {
  const o = span(t, B(11) - 0.4, B(11) + 0.1) * (1 - span(t, B(16) - 0.3, B(16) + 0.2));
  const zoom = ease(span(t, B(11) - 0.4, B(11) + 0.4));
  const cmp = span(t, B(12), B(12) + 0.5), stamp = span(t, B(13), B(13) + 0.25), circ = span(t, B(14), B(14) + 0.6), sum = span(t, B(15), B(15) + 0.5);
  const ms = 1.05, mx = (VW - 960 * ms) / 2, my = mix(700, 420, zoom);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={abs(mx, my, { transform: `scale(${ms})`, transformOrigin: "0 0" })}>
        <MenuD hi={[0, cmp * (1 - circ), cmp]} />
        <div style={abs(380, rowY(1) - 55, { opacity: stamp })}><Stamp text="诱饵" size={105} k={stamp} /></div>
        <svg width={1000} height={800} style={{ position: "absolute", left: -40, top: 0, overflow: "visible" }}>
          <ellipse cx={480} cy={rowY(2) + 5} rx={470} ry={86} fill="none" stroke={RED} strokeWidth={6} strokeDasharray={2960} strokeDashoffset={2960 * (1 - circ)} style={{ filter: `drop-shadow(0 0 8px ${RED})` }} />
        </svg>
      </div>
      <div style={abs(0, 1165, { width: VW, textAlign: "center", opacity: cmp * (1 - circ) })}><Note text="同价 · 少 200ml" size={64} /></div>
      <div style={abs(0, 1165, { width: VW, textAlign: "center", opacity: circ * (1 - sum) })}><Note text="店里想卖的 是它" color={GOLD} size={64} /></div>
      <div style={abs(90, 1150, { width: 900, textAlign: "center", padding: "18px 0", borderRadius: 16, border: `3px solid ${GOLD}`, opacity: sum, boxShadow: `0 0 30px ${GOLD}44` })}><Note text="同价少一样 = 诱饵" color={GOLD} size={64} /></div>
      <Cite text="诱饵效应：Huber、Payne & Puto 1982" o={span(t, B(13), B(13) + 0.4)} y={1330} />
    </div>
  );
};

// ── 规则三：红酒货架 → 360 万笔 → 目标 / 诱饵，金色方块落进目标 → 新客 vs 熟客 → 先定要多少，再看价签 ──
export const Bottle: React.FC<{ c: string; hi?: number; dim?: number }> = ({ c, hi = 0, dim = 0 }) => (
  <svg width={52} height={150} viewBox="-26 -140 52 150" style={{ opacity: 1 - 0.7 * dim, overflow: "visible" }}>
    <path d="M-17 0 L-17 -72 Q-17 -98 -6 -108 L-6 -134 L6 -134 L6 -108 Q17 -98 17 -72 L17 0 Z" fill="none" stroke={hi === 2 ? RED : hi === 1 ? GOLD : c} strokeWidth={hi ? 5 : 3.5} style={{ filter: `drop-shadow(0 0 ${hi ? 12 : 5}px ${hi === 2 ? RED : hi === 1 ? GOLD : c})` }} />
    <rect x={-12} y={-64} width={24} height={26} rx={3} fill={hi === 2 ? RED : hi === 1 ? GOLD : c} opacity={0.6} />
  </svg>
);
export const Rule3: React.FC<{ t: number }> = ({ t }) => {
  const o = span(t, B(16) - 0.3, B(16) + 0.2) * (1 - span(t, B(22) - 0.3, B(22) + 0.1));
  const shelf = 1 - span(t, B(21) - 0.2, B(21) + 0.2), cnt = cl((t - B(17)) / 1.0), dec = span(t, B(18), B(18) + 0.4);
  const ppl = span(t, B(19), B(19) + 0.5), list = span(t, B(20), B(20) + 0.5), steps = span(t, B(21), B(21) + 0.4);
  const cols = ["#B05A7A", "#C9B27A", "#7FD1AE", "#A99BF2", "#E8A15C"];
  const TR = 0, TC = 3;   // 目标在第 0 行第 3 瓶，诱饵在它右边
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ opacity: shelf }}>
        <div style={abs(60, 400, { width: 960 })}>
          {[0, 1, 2].map((r) => (
            <div key={r} style={{ display: "flex", justifyContent: "space-around", borderBottom: `6px solid ${EDGE}`, padding: "10px 10px 0", marginBottom: 18 }}>
              {Array.from({ length: 8 }, (_, i) => {
                const target = r === TR && i === TC, decoy = r === TR && i === TC + 1;
                return <div key={i} style={{ transform: target && dec > 0.5 ? "scale(1.18)" : undefined }}><Bottle c={cols[(i * 3 + r) % 5]} hi={dec > 0.5 ? (target ? 1 : decoy ? 2 : 0) : 0} dim={dec > 0.5 && !target && !decoy ? 1 : 0} /></div>;
              })}
            </div>
          ))}
        </div>
        {/* 目标 / 诱饵 标签 + 金色方块落进目标 */}
        <div style={{ opacity: dec * (1 - ppl) }}>
          <div style={abs(300, 330)}><Note text="目标" color={GOLD} size={46} /></div>
          <div style={abs(500, 330)}><Note text="诱饵：更差还不便宜" color={RED} size={40} /></div>
          {Array.from({ length: 12 }, (_, k) => { const f = cl((t - B(18) - 0.3 - k * 0.1) / 0.5); return <div key={k} style={abs(392 + (k % 3) * 28 - 28, mix(250, 560 - Math.floor(k / 3) * 26, ease(f)), { width: 24, height: 24, borderRadius: 5, background: GOLD, boxShadow: `0 0 8px ${GOLD}`, opacity: f > 0 ? 1 : 0 })} />; })}
        </div>
        <div style={abs(0, 1000, { width: VW, textAlign: "center", font: `900 104px '${SANS}'`, color: GOLD, textShadow: glowT(GOLD), opacity: span(t, B(17), B(17) + 0.3) * (1 - ppl) })}>{Math.round(3600000 * ease(cnt)).toLocaleString("en-US")} 笔</div>
        {/* 新客 / 熟客 */}
        <div style={{ opacity: ppl }}>
          {[["新客", 160, DIM], ["熟客", 680, GOLD]].map(([lab, x, c], k) => (
            <div key={k} style={abs(x as number, 1000, { width: 240, textAlign: "center" })}>
              <svg width={240} height={190} viewBox="-120 -180 240 190" style={{ filter: `drop-shadow(0 0 8px ${c})` }}><circle cx={0} cy={-128} r={40} fill="none" stroke={c as string} strokeWidth={7} /><path d="M-76 0 Q-76 -80 0 -80 Q76 -80 76 0" fill="none" stroke={c as string} strokeWidth={7} /></svg>
              <div style={{ font: `800 48px '${SANS}'`, color: c as string }}>{lab}</div>
            </div>
          ))}
          <svg width={VW} height={VH} style={{ position: "absolute", left: 0, top: 0 }}><path d="M280 1000 Q300 820 420 640" fill="none" stroke={DIM} strokeWidth={4} strokeDasharray="12 10" /></svg>
          <div style={abs(890, 960, { opacity: list, width: 160, padding: "12px 16px", background: CARD, border: `3px solid ${GOLD}`, borderRadius: 10, transform: "rotate(5deg)", font: `700 32px '${SANS}'`, color: INK })}>购物单<br /><span style={{ color: GREEN }}>✓</span> 这一瓶</div>
          <div style={abs(560, 1290, { width: 480, textAlign: "center" })}><Note text="几乎不受影响" color={GREEN} size={50} /></div>
        </div>
        <Cite text="Devine 等 2023 · 英国 75.5 万名顾客的红酒购买" o={span(t, B(17), B(17) + 0.4)} y={1370} />
      </div>
      {/* 先定要多少，再看价签：上下两张卡 */}
      <div style={{ opacity: steps }}>
        {["① 我要多少", "② 再看价签"].map((s, k) => (
          <div key={k} style={abs(140, 520 + k * 360, { width: 800, padding: "60px 0", textAlign: "center", borderRadius: 24, border: `4px solid ${k === 0 ? GOLD : EDGE}`, background: CARD, boxShadow: k === 0 ? `0 0 40px ${GOLD}44` : "none", opacity: span(t, B(21) + k * 0.4, B(21) + 0.3 + k * 0.4), transform: `translateY(${mix(-60, 0, ease(span(t, B(21) + k * 0.4, B(21) + 0.4 + k * 0.4)))}px)`, font: `900 88px '${SANS}'`, color: k === 0 ? GOLD : INK, textShadow: k === 0 ? glowT(GOLD) : "none" })}>{s}</div>
        ))}
        <svg width={VW} height={VH} style={{ position: "absolute", left: 0, top: 0, opacity: span(t, B(21) + 0.3, B(21) + 0.6) }}><path d="M540 760 L540 860 M510 830 L540 860 L570 830" fill="none" stroke={INK} strokeWidth={6} /></svg>
      </div>
    </div>
  );
};

// ── 结尾：回到价目单，一只手把大杯那行盖住；金句；三条规则 ──
const Ending: React.FC<{ t: number }> = ({ t }) => {
  const a = span(t, B(22) - 0.4, B(22) + 0.1), cover = ease(span(t, B(22) + 0.2, B(22) + 0.9));
  const up = span(t, B(23), B(23) + 0.5), chip = (i: number) => span(t, B(24) + i * 0.25, B(24) + 0.3 + i * 0.25);
  const ms = mix(1.05, 0.78, up), mx = (VW - 960 * ms) / 2, my = mix(470, 560, up);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: a }}>
      <div style={abs(mx, my, { transform: `scale(${ms})`, transformOrigin: "0 0" })}>
        <MenuD hi={[0, 0, 0]} />
        <div style={abs(mix(1200, 10, cover), rowY(1) - 100)}><Palm w={900} /></div>
      </div>
      <div style={abs(0, 200, { width: VW, textAlign: "center", opacity: up, font: `900 92px '${SERIF}'`, color: INK, lineHeight: 1.25, textShadow: "0 0 30px rgba(242,193,78,.25)" })}>没人买的那档<br /><span style={{ color: GOLD }}>是摆给你看的</span></div>
      <div style={abs(0, 1150, { width: VW, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 })}>
        {["① 没人选的 也在起作用", "② 被比下去的 就是诱饵", "③ 先想好要什么"].map((s, i) => (
          <div key={i} style={{ padding: "10px 36px", borderRadius: 40, border: `3px solid ${GOLD}`, background: CARD, opacity: chip(i), font: `700 40px '${SANS}'`, color: INK }}>{s}</div>
        ))}
      </div>
    </div>
  );
};
