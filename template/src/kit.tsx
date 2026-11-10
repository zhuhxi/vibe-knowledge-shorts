// 公共零件：时间工具、发光线描的手、字幕、氛围层
import React from "react";
import { BG, DIM, GOLD, INK, LINES } from "./script";

export const W = 1920, H = 1080, FPS = 30;
export const SANS = "Noto Sans CJK SC", SERIF = "Noto Serif CJK SC", MONO = "DejaVu Sans Mono";
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const ease = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };
export const span = (t: number, a: number, b: number) => ease((t - a) / (b - a));
export const win = (t: number, a: number, b: number, f = 0.4) => span(t, a, a + f) * (1 - span(t, b - f, b));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const rnd = (i: number, s = 0) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

export const Defs: React.FC = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" /></filter>
    <radialGradient id="spot" cx="50%" cy="0%" r="100%"><stop offset="0%" stopColor="#FFF4D6" stopOpacity=".22" /><stop offset="100%" stopColor="#FFF4D6" stopOpacity="0" /></radialGradient>
    <radialGradient id="floor" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3A3A6A" stopOpacity=".55" /><stop offset="100%" stopColor="#3A3A6A" stopOpacity="0" /></radialGradient>
  </defs>
);

// 手：线描 + 辉光。kind R 石头 / P 布 / S 剪刀；指尖朝上，mirror 让右边的手朝左
export type Kind = "R" | "P" | "S";
export const Hand: React.FC<{ x: number; y: number; s?: number; kind: Kind; color?: string; o?: number; mirror?: boolean; rot?: number; morph?: number; robot?: boolean }> = ({ x, y, s = 1, kind, color = INK, o = 1, mirror = false, rot = 0, morph = 1, robot = false }) => {
  const sw = 4.5 / s;
  const finger = (fx: number, len: number, w = 26, a = 0) => (
    <g transform={`translate(${fx} -40) rotate(${a})`}>
      <path d={`M${-w / 2} 0 V${-len + w / 2} A${w / 2} ${w / 2} 0 0 1 ${w / 2} ${-len + w / 2} V0`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      {robot && <><circle cx={0} cy={-len * 0.45} r={5} fill="none" stroke={color} strokeWidth={sw * 0.7} /><line x1={-w / 2} y1={-len * 0.75} x2={w / 2} y2={-len * 0.75} stroke={color} strokeWidth={sw * 0.6} /></>}
    </g>
  );
  const knuckle = (fx: number) => <path d={`M${fx - 15} -40 a15 15 0 0 1 30 0`} fill="none" stroke={color} strokeWidth={sw} />;
  const up = (len: number) => len * morph + 20 * (1 - morph);
  return (
    <g opacity={o} transform={`translate(${x} ${y}) rotate(${rot}) scale(${mirror ? -s : s} ${s})`} filter="url(#glow)">
      {/* 手掌 + 手腕 */}
      <path d="M-68 -40 Q-74 40 -48 78 L-44 150 M48 78 L44 150 M-48 78 Q0 92 48 78 Q74 40 68 -40" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      {robot && <><line x1={-46} y1={110} x2={46} y2={110} stroke={color} strokeWidth={sw * 0.6} /><circle cx={0} cy={30} r={14} fill="none" stroke={color} strokeWidth={sw * 0.6} /></>}
      {/* 拇指 */}
      <path d={kind === "P" ? "M-68 10 Q-110 -10 -118 -58" : "M-68 10 Q-60 -22 -20 -26"} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      {kind === "R" && [-45, -15, 15, 45].map((fx) => <g key={fx}>{knuckle(fx)}</g>)}
      {kind === "P" && <>{finger(-45, up(120), 26, -6)}{finger(-15, up(150))}{finger(15, up(140))}{finger(45, up(110), 26, 6)}</>}
      {kind === "S" && <>{finger(-28, up(150), 28, -12)}{finger(12, up(145), 28, 12)}{knuckle(45)}<path d="M28 -40 a10 10 0 0 1 20 0" fill="none" stroke={color} strokeWidth={sw} /></>}
    </g>
  );
};

// 氛围：暗场 + 顶光 + 地面光圈 + 微尘
export const Ambience: React.FC<{ t: number; floor?: number; spot?: number }> = ({ t, floor = 1, spot = 1 }) => (
  <g>
    <rect width={W} height={H} fill={BG} />
    <ellipse cx={W / 2} cy={0} rx={900} ry={900} fill="url(#spot)" opacity={spot} />
    <ellipse cx={W / 2} cy={760} rx={760} ry={150} fill="url(#floor)" opacity={floor} />
    {Array.from({ length: 70 }, (_, i) => {
      const x = (rnd(i, 1) * W + t * (8 + rnd(i, 2) * 14)) % W, y = (rnd(i, 3) * H - t * (4 + rnd(i, 4) * 6) + H) % H;
      return <circle key={i} cx={x} cy={y} r={0.8 + rnd(i, 5) * 1.6} fill="#FFF4D6" opacity={0.08 + 0.18 * rnd(i, 6) * (0.6 + 0.4 * Math.sin(t * 1.3 + i))} />;
    })}
  </g>
);

// 字幕：底部单行 52px，关键词上色；hook 句用大字在中下部砸出
const colorize = (text: string, color?: Record<string, string>) => {
  if (!color) return [text];
  let parts: (string | React.ReactElement)[] = [text];
  Object.entries(color).forEach(([k, c], j) => {
    parts = parts.flatMap((p) => typeof p !== "string" ? [p] : p.split(k).flatMap((s, i, arr) => i < arr.length - 1 ? [s, <span key={k + j + i} style={{ color: c }}>{k}</span>] : [s]));
  });
  return parts;
};
export const Subtitles: React.FC<{ t: number }> = ({ t }) => {
  const l = LINES.find((x) => t >= x.t && t < x.t + x.d);
  if (!l) return null;
  const a = span(t, l.t, l.t + 0.15) * (1 - span(t, l.t + l.d - 0.12, l.t + l.d));
  if (l.hook) {
    const k = span(t, l.t, l.t + 0.25);
    return <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", font: `900 92px '${SANS}'`, color: INK, letterSpacing: 4, opacity: a, transform: `scale(${mix(1.12, 1, k)})`, textShadow: "0 0 30px rgba(242,193,78,.25), 0 4px 18px #000" }}>{colorize(l.text, l.color)}</div>;
  }
  return <div style={{ position: "absolute", left: 0, right: 0, top: 952, textAlign: "center", font: `600 52px '${SANS}'`, color: INK, letterSpacing: 2, opacity: a, textShadow: "0 2px 14px #000, 0 0 3px #000" }}>{colorize(l.text, l.color)}</div>;
};

// 小字出处
export const Cite: React.FC<{ text: string; o: number; y?: number }> = ({ text, o, y = 60 }) => (
  <div style={{ position: "absolute", right: 70, top: y, font: `400 24px '${SANS}'`, color: DIM, letterSpacing: 1, opacity: o }}>{text}</div>
);
export const Big: React.FC<{ x: number; y: number; text: string; size: number; o?: number; color?: string; font?: string; w?: number }> = ({ x, y, text, size, o = 1, color = GOLD, font = SANS, w = 900 }) => (
  <div style={{ position: "absolute", left: x - w / 2, width: w, top: y - size * 0.6, textAlign: "center", font: `900 ${size}px '${font}'`, color, opacity: o, textShadow: `0 0 28px ${color}55, 0 0 6px #000`, whiteSpace: "nowrap" }}>{text}</div>
);

// 对话气泡（做「角色一本正经说出知识点」的梗用）：k 弹出进度 0→1；tail 尾巴在下边(b)或上边(t)，tx = 尾巴离气泡左边的距离
export const Bubble: React.FC<{ x: number; y: number; k: number; lines: string[]; c?: string; size?: number; tail?: "b" | "t"; tx?: number }> = ({ x, y, k, lines, c = INK, size = 52, tail = "b", tx = 60 }) => {
  if (k <= 0) return null;
  const sq: React.CSSProperties = { position: "absolute", left: tx - 16, width: 32, height: 32, background: "#14142E", transform: "rotate(45deg)", ...(tail === "b" ? { bottom: -19, borderRight: `4px solid ${c}`, borderBottom: `4px solid ${c}` } : { top: -19, borderLeft: `4px solid ${c}`, borderTop: `4px solid ${c}` }) };
  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "16px 32px", borderRadius: 34, background: "#14142E", border: `4px solid ${c}`, boxShadow: `0 0 24px ${c}55, 0 10px 30px rgba(0,0,0,.6)`, opacity: Math.min(1, k * 3), transform: `scale(${mix(0.6, 1, ease(Math.min(1, k * 2)))})`, transformOrigin: `${tx}px ${tail === "b" ? "100%" : "0%"}` }}>
      <div style={sq} />
      {lines.map((l, i) => <div key={i} style={{ position: "relative", font: `900 ${size}px '${SANS}'`, color: c, whiteSpace: "nowrap", lineHeight: 1.3 }}>{l}</div>)}
    </div>
  );
};
// 气泡在 a 秒弹出、b 秒收回
export const pop = (t: number, a: number, b: number) => span(t, a, a + 0.25) * (1 - span(t, b - 0.15, b));
