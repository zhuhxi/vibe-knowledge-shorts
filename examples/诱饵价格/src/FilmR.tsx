// 诱饵价格（Vibe知识大赏 风格演示，60 秒竖屏）
//  开场：顾客进店问「大杯是卖给谁的」→ 片名卡 → 规则一 订杂志实验（印刷版会说话）→ 规则二 咖啡三只杯（冷停顿 + 「系统里没有这个按钮」）
//  → 规则三 红酒货架（新客 vs 熟客）→ 结尾三条规则总结 + 合照彩蛋
//  背景素材：Magnific 免费素材预览图（带水印），作者见 public/assets/来源.md
import React from "react";
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from "remotion";
import { B, BG, DIM, DURATION, GOLD, INK, RED } from "./script";
import { FPS, SANS, SERIF, ease, mix, span } from "./kit";
import { Backdrop, Bottle, Note, Palm, RuleBar, Slips, Stamp, Subs, VH, VW } from "./FilmV";

// 顾客：罗永浩插画（玩他 2011 年「这是大杯」的梗），按脚底中心定位
const LuoFig: React.FC<{ x: number; foot: number; h: number; o?: number; rot?: number }> = ({ x, foot, h, o = 1, rot = 0 }) => {
  const w = h * 1193 / 1318;
  return <Img src={staticFile("assets/luo.png")} style={{ position: "absolute", left: x - w / 2, top: foot - h, width: w, height: h, opacity: o, transform: `rotate(${rot}deg)`, transformOrigin: "50% 100%", filter: "drop-shadow(0 0 2px rgba(255,244,214,.6)) drop-shadow(0 10px 20px rgba(0,0,0,.5))", WebkitMaskImage: "linear-gradient(180deg, #000 70%, transparent 98%)", maskImage: "linear-gradient(180deg, #000 70%, transparent 98%)" }} />;
};

// 对话气泡：k 弹出进度；tail 尾巴在下边(b)或上边(t)，tx = 尾巴离左边的距离
const Bubble: React.FC<{ x: number; y: number; k: number; lines: string[]; c?: string; size?: number; tail?: "b" | "t"; tx?: number }> = ({ x, y, k, lines, c = INK, size = 52, tail = "b", tx = 60 }) => {
  if (k <= 0) return null;
  const sq: React.CSSProperties = { position: "absolute", left: tx - 16, width: 32, height: 32, background: "#14142E", transform: "rotate(45deg)", ...(tail === "b" ? { bottom: -19, borderRight: `4px solid ${c}`, borderBottom: `4px solid ${c}` } : { top: -19, borderLeft: `4px solid ${c}`, borderTop: `4px solid ${c}` }) };
  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "16px 32px", borderRadius: 34, background: "#14142E", border: `4px solid ${c}`, boxShadow: `0 0 24px ${c}55, 0 10px 30px rgba(0,0,0,.6)`, opacity: Math.min(1, k * 3), transform: `scale(${mix(0.6, 1, ease(Math.min(1, k * 2)))})`, transformOrigin: `${tx}px ${tail === "b" ? "100%" : "0%"}` }}>
      <div style={sq} />
      {lines.map((l, i) => <div key={i} style={{ position: "relative", font: `900 ${size}px '${SANS}'`, color: c, whiteSpace: "nowrap", lineHeight: 1.3 }}>{l}</div>)}
    </div>
  );
};
const pop = (t: number, a: number, b: number) => span(t, a, a + 0.25) * (1 - span(t, b - 0.15, b));

const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const glowT = (c: string) => `0 0 24px ${c}88, 0 0 4px ${c}`;

export const FilmR: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  // 柜台在三段出现：开场后半、规则二、结尾
  const counterOn = Math.max(win2(t, 1.3, B(2)), win2(t, B(11) - 0.4, B(16)), span(t, B(22) - 0.4, B(22) + 0.1));
  return (
    <AbsoluteFill style={{ background: BG }}>
      {t < 1.7 && <Street t={t * 1.6} />}
      {/* v16：第一秒大字钩子（替代底部小字幕） */}
      {t < 1.8 && <div style={abs(0, 330, { width: VW, textAlign: "center", opacity: span(t, 0.05, 0.2) * (1 - span(t, 1.4, 1.7)), transform: `scale(${mix(1.25, 1, ease(span(t, 0.05, 0.35)))})`, font: `900 150px '${SANS}'`, lineHeight: 1.15, color: INK, textShadow: "0 0 30px rgba(0,0,0,.9), 0 6px 24px #000" })}>咖啡<br />你点<span style={{ color: GOLD, textShadow: glowT(GOLD) + ", 0 6px 24px #000" }}>哪一杯？</span></div>}
      {t >= B(2) - 0.4 && t < B(11) + 0.3 && <ShopBg t={t} o={win2(t, B(2) - 0.3, B(11))} />}
      {t >= B(16) - 0.4 && t < B(22) + 0.3 && <WineBg t={t} o={win2(t, B(16) - 0.3, B(22))} />}
      {counterOn > 0 && <CounterScene t={t} o={counterOn} />}
      <Backdrop t={t} />
      {t >= 4.4 && t < B(2) + 0.3 && <Title t={t} />}
      {t >= B(2) - 0.3 && t < B(11) + 0.3 && <Slips t={t} />}
      {t >= B(4) && t < B(8) && <SlipTalk t={t} />}
      {t >= B(16) - 0.3 && t < B(22) + 0.3 && <Rule3R t={t} />}
      {t >= B(22) && <EndText t={t} />}
      {t >= B(25) - 0.3 && <PhotoGag t={t} />}
      <RuleBar t={t} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1405, height: 170, background: "linear-gradient(180deg, rgba(10,10,30,0), rgba(10,10,30,.6) 30%, rgba(10,10,30,.6) 70%, rgba(10,10,30,0))" }} />
      <Subs t={t} />
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: span(t, DURATION - 0.6, DURATION) }} />
      <Audio src={staticFile("audio/mix.wav")} />
    </AbsoluteFill>
  );
};
// a 处淡入、b 处淡出（各 0.4 秒）
const win2 = (t: number, a: number, b: number) => span(t, a, a + 0.4) * (1 - span(t, b - 0.3, b + 0.1));

// ── 背景照片：铺满竖屏、压暗、虚化，慢慢推近 ──
const BgPhoto: React.FC<{ file: string; pos: string; o: number; t: number; t0: number }> = ({ file, pos, o, t, t0 }) => (
  <AbsoluteFill style={{ opacity: o, overflow: "hidden" }}>
    <Img src={staticFile("assets/" + file)} style={{ width: VW, height: VH, objectFit: "cover", objectPosition: pos, filter: "brightness(0.38) blur(7px) saturate(1.1)", transform: `scale(${1.08 + 0.012 * (t - t0)})` }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,30,.55), rgba(10,10,30,.25) 40%, rgba(10,10,30,.8))" }} />
  </AbsoluteFill>
);

// ── 开场街道：顾客站在街上，镜头推向条纹遮阳棚那家店；镜头跟着推进门里 ──
const Street: React.FC<{ t: number }> = ({ t }) => {
  const s = VH / 1333, ox = -560 * s;
  const fly = ease(span(t, 0.1, 1.9)), push = ease(span(t, 1.5, 2.6));
  const z = mix(1, 2.6, push), fx = 212, fy = 1250;   // 推向一楼店门
  const gx = mix(560, 212, fly), gfoot = mix(2150, 1365, fly) - 10 * Math.abs(Math.sin(t * 7)) * (1 - fly), gh = mix(1100, 210, fly);
  return (
    <AbsoluteFill style={{ opacity: 1 - span(t, 2.2, 2.6) }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${fx}px ${fy}px`, transform: `scale(${mix(1.04, 1, span(t, 0, 1.5)) * z})` }}>
        <Img src={staticFile("assets/夜景_商店街.jpg")} style={{ position: "absolute", left: ox, top: 0, height: VH, width: 2000 * s }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,30,0) 60%, rgba(10,10,30,.8) 85%)" }} />
        <LuoFig x={260} foot={mix(2400, 1830, ease(span(t, 0, 0.5)))} h={860} o={1 - span(t, 1.5, 1.85)} />
      </div>
    </AbsoluteFill>
  );
};

// ── 三只实物奶茶杯：圆润塑料杯 + 拱形盖 + 吸管 + 珍珠；杯下价签。hi 发光、stampK 盖章、circ 金框、cover 手盖住大杯 ──
const Cup: React.FC<{ H: number; glow: number; extra?: number }> = ({ H, glow, extra = 0 }) => {
  // 白色纸咖啡杯 + 平盖 + 绿色圆标（参考用户给的咖啡杯）；extra>0：杯身上部标出「多出来的那段」
  const W = H * 0.62, wb = W * 0.74, lid = 26;
  const xAt = (y: number) => wb / 2 + (W / 2 - wb / 2) * (-y / H);
  const body = `M${-W / 2} ${-H} L${W / 2} ${-H} L${wb / 2} -10 Q${wb / 2} 0 ${wb / 2 - 10} 0 L${-wb / 2 + 10} 0 Q${-wb / 2} 0 ${-wb / 2} -10 Z`;
  const top = -H, cut = -H + H * extra;
  return (
    <svg width={W + 60} height={H + lid + 80} viewBox={`${-W / 2 - 30} ${-H - lid - 70} ${W + 60} ${H + lid + 80}`} style={{ overflow: "visible", filter: glow > 0 ? `drop-shadow(0 0 ${18 * glow}px ${GOLD})` : "drop-shadow(0 8px 10px rgba(0,0,0,.5))" }}>
      <defs><linearGradient id={`cup${H}`} x1="0" x2="1"><stop offset="0" stopColor="#DCD6CC" /><stop offset=".35" stopColor="#FAF7F1" /><stop offset="1" stopColor="#CFC8BC" /></linearGradient></defs>
      <path d={body} fill={`url(#cup${H})`} stroke="#2B2620" strokeWidth={4} strokeLinejoin="round" />
      {extra > 0 && <path d={`M${-xAt(top) + 3} ${top + 2} L${xAt(top) - 3} ${top + 2} L${xAt(cut) - 3} ${cut} L${-xAt(cut) + 3} ${cut} Z`} fill={GOLD} opacity={0.6} />}
      <circle cx={0} cy={-H * 0.5} r={W * 0.27} fill="#0F6B45" stroke="#F4F1EA" strokeWidth={4} />
      <circle cx={0} cy={-H * 0.5} r={W * 0.17} fill="none" stroke="#F4F1EA" strokeWidth={3} opacity={0.8} />
      <path d={`M${-W / 2 - 8} ${-H} L${W / 2 + 8} ${-H} L${W / 2 + 4} ${-H - 12} L${-W / 2 - 4} ${-H - 12} Z`} fill="#F4F1EA" stroke="#2B2620" strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${-W / 2 + 4} ${-H - 12} L${-W / 2 + 12} ${-H - lid} L${W / 2 - 12} ${-H - lid} L${W / 2 - 4} ${-H - 12} Z`} fill="#F4F1EA" stroke="#2B2620" strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${-W / 2 + 12} ${-H + 14} L${-wb / 2 + 10} -16`} stroke="rgba(255,255,255,.8)" strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
};
const Cups: React.FC<Board & { t: number }> = ({ hi, stampK = 0, stampText = "诱饵", circ = 0, cover = 0, t }) => {
  const extra = span(t, B(12) + 0.3, B(12) + 0.8) * (t < B(16) ? 1 : 0);
  return (
    <>
      {CUPS.map((c, i) => {
        const W = c.H * 0.62;
        return (
          <div key={i} style={{ position: "absolute", left: c.x - W / 2 - 30, top: CTOP - c.H - 26 - 70 }}>
            <Cup H={c.H} glow={hi[i]} extra={i === 2 ? extra * 0.25 : 0} />
            {/* 杯身贴标：容量 */}
            <div style={{ position: "absolute", left: 0, width: W + 60, top: 26 + 70 + c.H * 0.72, textAlign: "center", font: `800 ${Math.round(c.H * 0.1)}px '${SANS}'`, color: "#2B2620" }}>{c.ml}ml</div>
            {i === 2 && circ > 0 && <div style={{ position: "absolute", left: 6, top: 40, width: W + 48, height: c.H + c.H * 0.18 + 40, borderRadius: 24, border: `${5 * circ}px solid ${GOLD}`, boxShadow: `0 0 ${26 * circ}px ${GOLD}` }} />}
            {i === 1 && stampK > 0 && <div style={abs(W / 2 + 30 - 84, c.H * 0.45)}><Stamp text={stampText} size={88} k={stampK} /></div>}
            {i === 1 && cover > 0 && <div style={abs(14, mix(-420, 26, ease(cover)), { width: W + 32, height: c.H + c.H * 0.18 + 52, borderRadius: "40px 40px 18px 18px", background: "linear-gradient(180deg, #3B3858, #24223A)", border: "4px solid #8C8AA6", boxShadow: "0 10px 30px rgba(0,0,0,.6)", opacity: cover > 0.01 ? 1 : 0 })}><div style={{ marginTop: (c.H + 60) / 2 - 30, textAlign: "center", font: `900 44px '${SANS}'`, color: "#8C8AA6" }}>盖住</div></div>}
          </div>
        );
      })}
      {/* 价签：台面前沿 */}
      {CUPS.map((c, i) => (
        <div key={"tag" + i} style={abs(c.x - 70, CTOP + 12, { width: 140, textAlign: "center", padding: "4px 0 6px", borderRadius: 10, background: hi[i] > 0.5 ? "rgba(60,44,20,.95)" : "rgba(20,20,46,.9)", border: `2px solid ${hi[i] > 0.5 ? GOLD : "#4A4870"}` })}>
          <div style={{ font: `700 22px '${SANS}'`, color: DIM }}>{c.n}</div>
          <div style={{ font: `900 38px '${SANS}'`, color: hi[i] > 0.5 ? GOLD : INK, lineHeight: 1 }}>¥{c.p}</div>
        </div>
      ))}
      {/* 「多出来的 200ml」标在超大杯旁 */}
      <div style={abs(CUPS[2].x + 92, CTOP - 232, { opacity: extra * (1 - span(t, B(14), B(14) + 0.3)), font: `900 30px '${SANS}'`, color: GOLD, textShadow: glowT(GOLD), whiteSpace: "nowrap", transform: "scale(.9)", transformOrigin: "0 0" })}>+200</div>
    </>
  );
};

// ── 柜台 + 价目牌 ──
type Board = { hi: number[]; stampK?: number; stampText?: string; circ?: number; cover?: number };
const ROWS = [["中杯", "500ml", "12"], ["大杯", "600ml", "18"], ["超大杯", "800ml", "18"]];
const PriceBoard: React.FC<Board> = ({ hi, stampK = 0, stampText = "诱饵", circ = 0, cover = 0 }) => (
  <div style={{ width: "100%", height: "100%", background: "#2B1E1A", borderRadius: 8, padding: "18px 20px", boxSizing: "border-box", fontFamily: SANS }}>
    <div style={{ color: "#F3E6CF", font: `900 44px '${SANS}'`, textAlign: "center", letterSpacing: 6, marginBottom: 12 }}>奶茶</div>
    {ROWS.map(([n, ml, p], i) => (
      <div key={n} style={{ position: "relative", display: "flex", alignItems: "baseline", padding: "12px 8px", borderTop: "2px dashed #6A5548", background: `rgba(242,193,78,${0.25 * hi[i]})`, borderRadius: 6, boxShadow: i === 2 && circ > 0 ? `inset 0 0 0 ${4 * circ}px ${GOLD}, 0 0 ${24 * circ}px ${GOLD}` : "none" }}>
        <div style={{ flex: 1, color: "#F3E6CF", font: `800 36px '${SANS}'` }}>{n} <span style={{ font: `500 24px '${SANS}'`, color: "#BFA88F" }}>{ml}</span></div>
        <div style={{ color: hi[i] > 0.5 ? GOLD : "#F3E6CF", font: `900 44px '${SANS}'` }}>¥{p}</div>
        {i === 1 && stampK > 0 && <div style={abs(178, -2)}><Stamp text={stampText} size={58} k={stampK} /></div>}
        {i === 1 && cover > 0 && <div style={abs(mix(560, -24, cover), -18, { transform: "scale(0.5)", transformOrigin: "0 0" })}><Palm w={880} /></div>}
      </div>
    ))}
    <div style={{ color: "#8F7A68", font: `400 18px '${SANS}'`, textAlign: "right", marginTop: 6 }}>价格为举例</div>
  </div>
);

const CS = VW / 2000, COX = 0, COY = 380;               // 柜台图取原图 x150–1850（拉远，店员变小），顶在 y300
const BX = COX + 1090 * CS, BY = COY + 245 * CS, BW = 600 * CS, BH = 740 * CS;   // 价目牌在屏上的位置
// v12：价目牌换成柜台上的三只实物杯子；镜头对准杯子
const CTOP = 930;                                     // 台面在屏上的 y（z=1 时）
const CUPS = [{ x: 560, H: 200, n: "中杯", ml: 500, p: 12 }, { x: 705, H: 228, n: "大杯", ml: 600, p: 18 }, { x: 870, H: 275, n: "超大杯", ml: 800, p: 18 }];
const BCX = 715, BCY = 840;

const CounterScene: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  // 镜头：开场和结尾看全景，规则二推到价目牌
  const zk = ease(span(t, B(11) - 0.3, B(11) + 0.5)) * (1 - ease(span(t, B(16) - 0.4, B(16))));
  const ek = ease(span(t, B(22) - 0.3, B(22) + 0.5));   // 结尾：推近到价目牌，顾客站到柜台前
  const z0 = mix(1.15, 1, ease(span(t, 1.3, 2.3))), z = mix(mix(z0, 1.7, zk), 1.7, ek);
  const base = [mix(mix((1 - z0) * 540, 540 - BCX * 1.7, zk), 540 - BCX * 1.7, ek), mix(mix((1 - z0) * 900, 900 - BCY * 1.7, zk), 880 - BCY * 1.7, ek)];
  // 价目牌状态
  let b: Board = { hi: [0, 0, 0] };
  if (t < B(2)) b = { hi: [0, span(t, 2.0, 2.3), span(t, 3.7, 4.0)] };
  else if (t < B(17)) {
    const cmp = span(t, B(12), B(12) + 0.4);
    b = { hi: [0, cmp, cmp], stampK: span(t, B(13), B(13) + 0.25), circ: span(t, B(14), B(14) + 0.4) };
  } else b = { hi: [0, 0, 0], cover: ease(span(t, B(22) + 0.2, B(22) + 0.9)) };
  const dim = span(t, 4.9, 5.3) * (t < B(2) ? 1 : 0);   // 片名卡时退后变暗
  const ending = t >= B(22) - 0.5;
  const up = span(t, B(23), B(23) + 0.5);
  return (
    <AbsoluteFill style={{ opacity: o * (1 - 0.7 * dim), filter: dim > 0 ? `blur(${5 * dim}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${base[0]}px, ${base[1]}px) scale(${z})` }}>
        <div style={{ position: "absolute", left: 0, top: COY, width: VW, height: 1550 * CS, overflow: "hidden" }}>
          <Img src={staticFile("assets/柜台_菜单板.jpg")} style={{ position: "absolute", left: COX, top: 0, width: 2000 * CS, filter: "brightness(0.6) saturate(1.05) hue-rotate(-8deg)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,20,60,.35), rgba(10,10,30,.2)), linear-gradient(90deg, rgba(10,10,30,.55), rgba(10,10,30,0) 55%)" }} />
        </div>
        <div style={{ position: "absolute", left: -400, top: COY + 1550 * CS - 2, width: VW + 800, height: 1400, background: "linear-gradient(180deg, #3B3040, #241C2E 35%, #120E1E)" }} />
        <Cups {...b} t={t} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1280, height: 640, background: "linear-gradient(180deg, rgba(10,10,30,0), #0A0A1E 30%)" }} />
      <CustomerAtCounter t={t} />
      {t >= B(11) && t < B(12) + 0.3 && <SpecCards t={t} />}
      {t >= B(11) && t < B(16) + 0.2 && <Rule2Notes t={t} />}
    </AbsoluteFill>
  );
};

// 顾客：开场站在柜台前抬头看价目牌「?」；规则二末尾手里多了超大杯；结尾站在一边
const CustomerAtCounter: React.FC<{ t: number }> = ({ t }) => {
  if (t < B(2)) {
    // 梗①：罗永浩问「大杯是卖给谁的」，店员面无表情说出潜规则
    const k = ease(span(t, 1.4, 2.0));
    return (
      <>
        <LuoFig x={250} foot={mix(2400, 1840, k)} h={860} />
        <Bubble x={380} y={1065} k={pop(t, 1.9, 3.0)} lines={["大杯 是卖给谁的？"]} c={GOLD} size={56} tail="t" tx={50} />
        <Bubble x={250} y={180} k={pop(t, 2.9, 5.1)} lines={t < 3.5 ? ["大杯不卖。"] : ["大杯不卖。", "是用来让您买超大杯的。"]} size={56} tail="b" tx={120} />
      </>
    );
  }
  if (t < B(16)) {
    const k = ease(span(t, B(14) + 0.1, B(14) + 0.6)), off = span(t, B(16) - 0.4, B(16));
    if (k <= 0) return null;
    return (
      <>
        <LuoFig x={175} foot={mix(1980, 1640, k)} h={400} o={1 - off} />
        {/* 梗②：偏要大杯 → 店员找了半天按钮 */}
        <Bubble x={240} y={1290} k={pop(t, B(14) + 0.5, B(15))} lines={["那我偏要大杯！"]} c={GOLD} size={56} tx={40} />
        <Bubble x={60} y={330} k={pop(t, B(15) - 0.1, B(16) - 0.2)} lines={t < B(15) + 0.6 ? ["……"] : ["……", "系统里没有这个按钮。"]} size={56} tail="t" tx={60} />
      </>
    );
  }
  if (t >= B(22) - 0.5) return <LuoFig x={230} foot={mix(2600, 1900, ease(span(t, B(22) - 0.3, B(22) + 0.5)))} h={760} />;
  return null;
};

// 规则二的标注：同价少 200ml → 总结框；出处小字
const Rule2Notes: React.FC<{ t: number }> = ({ t }) => {
  const cmp = span(t, B(12), B(12) + 0.4), circ = span(t, B(14), B(14) + 0.4), sum = span(t, B(15), B(15) + 0.4), off = 1 - span(t, B(16) - 0.4, B(16));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: off }}>
      <div style={abs(0, 1270, { width: VW, textAlign: "center", opacity: cmp * (1 - circ) })}><Note text="同价 · 少 200ml" size={64} /></div>
      <div style={abs(300, 1260, { width: 720, textAlign: "center", padding: "14px 0", borderRadius: 16, border: `3px solid ${GOLD}`, background: "rgba(20,20,46,.85)", opacity: sum, boxShadow: `0 0 30px ${GOLD}44` })}><Note text="同价少一样 = 诱饵" color={GOLD} size={56} /></div>
    </div>
  );
};

// ── 片名卡：柜台退后变暗，片名砸下 ──
const Title: React.FC<{ t: number }> = ({ t }) => {
  const tk = span(t, 5.2, 5.7), out = span(t, B(2) - 0.3, B(2) + 0.2);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <div style={{ position: "absolute", left: 0, width: VW, top: 520, textAlign: "center", opacity: span(t, 5.2, 5.45), transform: `scale(${mix(0.6, 1, ease(tk))})` }}>
        <div style={{ font: `900 230px '${SERIF}'`, letterSpacing: 20, lineHeight: 1.05, background: `linear-gradient(180deg, #FFF3C9, ${GOLD} 60%, #B8862B)`, WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 30px rgba(242,193,78,.35))" }}>诱饵<br />价格</div>
        <div style={{ font: `700 62px '${SANS}'`, color: INK, marginTop: 20, opacity: span(t, 5.6, 6.0) }}>没人买的那一档<br /><span style={{ color: RED }}>是摆给你看的</span></div>
      </div>
      <div style={abs(780, 400, { opacity: t > 5.4 ? 1 : 0 })}><Stamp text="饵" size={150} k={span(t, 5.4, 5.65)} /></div>
    </div>
  );
};

// ── 梗③：两张商品介绍卡。超大杯一长串，大杯只有「600ml。」……没了 ──
const SpecCards: React.FC<{ t: number }> = ({ t }) => {
  const o = span(t, B(11) + 0.4, B(11) + 0.6) * (1 - span(t, B(12) - 0.1, B(12) + 0.2));
  const long = ["800ml", "同价 ¥18", "超值之选", "店长推荐", "人生首选"];
  const card = (x: number, c: string): React.CSSProperties => ({ position: "absolute", left: x, top: 380, width: 430, minHeight: 720, padding: "40px 0", boxSizing: "border-box", textAlign: "center", borderRadius: 28, background: "#14142E", border: `4px solid ${c}`, boxShadow: `0 0 30px ${c}33` });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,30,.72)" }} />
      <div style={card(570, GOLD)}>
        <div style={{ font: `800 40px '${SANS}'`, color: DIM, marginBottom: 20 }}>超大杯</div>
        {long.map((l, i) => <div key={i} style={{ font: `900 ${i === 0 ? 76 : 58}px '${SANS}'`, color: GOLD, lineHeight: 1.5, opacity: span(t, B(11) + 0.5 + i * 0.14, B(11) + 0.6 + i * 0.14) }}>{l}</div>)}
      </div>
      <div style={card(80, "#4A4870")}>
        <div style={{ font: `800 40px '${SANS}'`, color: DIM, marginBottom: 20 }}>大杯</div>
        <div style={{ font: `900 76px '${SANS}'`, color: INK, lineHeight: 1.5, opacity: span(t, B(11) + 1.3, B(11) + 1.4) }}>600ml。</div>
        <div style={{ font: `700 44px '${SANS}'`, color: DIM, marginTop: 300, opacity: span(t, B(11) + 1.85, B(11) + 1.95) }}>（没了）</div>
      </div>
    </div>
  );
};

// ── 梗④：印刷版会说话。没人选也在上班 → 被拿掉就下班 → 套餐喊它回来 ──
const SlipTalk: React.FC<{ t: number }> = ({ t }) => {
  const gone = ease(span(t, B(6) + 0.8, B(6) + 1.5));
  return (
    <>
      <Bubble x={255} y={312} k={pop(t, B(4) + 1.0, B(5) + 0.1)} lines={["没人选我 但我一直在上班"]} size={46} tx={285} />
      <Bubble x={380} y={312 - 900 * gone} k={pop(t, B(6) + 0.15, B(6) + 1.3)} lines={["那我下班了"]} size={46} tx={160} />
      <Bubble x={560} y={312} k={pop(t, B(7) + 0.7, B(8))} lines={["你回来上班！"]} c={RED} size={46} tx={335} />
    </>
  );
};

// ── 梗⑤ 彩蛋：Ariely 的照片实验——旁边放一个 P 丑的你，选你的人更多 ──
const PhotoGag: React.FC<{ t: number }> = ({ t }) => {
  const k = ease(span(t, B(25) - 0.2, B(25) + 0.3)), ugly = span(t, B(25) + 0.4, B(25) + 0.8), pick = span(t, B(25) + 1.3, B(25) + 1.6);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: k }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,30,.9)" }} />
      <div style={abs(120, 470, { width: 840, height: 820, background: "#F4F1EA", borderRadius: 12, padding: 30, boxSizing: "border-box", transform: `rotate(${mix(-8, -3, k)}deg) translateY(${mix(80, 0, k)}px)`, boxShadow: "0 20px 60px rgba(0,0,0,.7)" })}>
        <div style={{ position: "relative", width: 780, height: 640, background: "linear-gradient(180deg, #3B4A6B, #1E2540)", overflow: "hidden", borderRadius: 6 }}>
          <LuoFig x={215} foot={700} h={600} />
          <div style={{ position: "absolute", inset: 0, opacity: ugly, transform: "translate(390px, 60px) scale(1.22, 0.8)", transformOrigin: "180px 640px", filter: "saturate(.5) hue-rotate(50deg) contrast(1.25)" }}><LuoFig x={180} foot={640} h={600} rot={6} /></div>
        </div>
        <div style={{ font: `700 40px '${SERIF}'`, color: "#2B2620", textAlign: "center", marginTop: 26 }}>合照 · 2026</div>
      </div>
      <div style={abs(150, 380, { opacity: pick, transform: `scale(${mix(1.6, 1, ease(pick))})` })}><Note text="选他！" color={GOLD} size={72} /></div>
    </div>
  );
};

// ── 结尾文字：金句在上，三条规则在下 ──
const EndText: React.FC<{ t: number }> = ({ t }) => {
  const up = span(t, B(23), B(23) + 0.5), sum = span(t, B(24) - 0.1, B(24) + 0.3), chip = (i: number) => span(t, B(24) + i * 0.25, B(24) + 0.35 + i * 0.25);
  return (
    <>
      {/* 总结屏：柜台压暗，三条规则做成大卡片，适合截图 */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,30,.78)", opacity: sum }} />
      <div style={abs(0, 230, { width: VW, textAlign: "center", opacity: up, font: `900 88px '${SERIF}'`, color: INK, lineHeight: 1.2, textShadow: "0 0 30px rgba(242,193,78,.25), 0 4px 18px #000" })}>没人买的那档<br /><span style={{ color: GOLD }}>是摆给你看的</span></div>
      <div style={abs(80, 560, { width: 920, display: "flex", flexDirection: "column", gap: 30, opacity: 1 - span(t, B(25) - 0.3, B(25)) })}>
        {[["没人选的那档", "也在起作用"], ["被比下去的", "就是诱饵"], ["先想好要什么", "再看价签"]].map(([a, b], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, padding: "30px 40px", borderRadius: 28, border: `3px solid ${GOLD}`, background: "#14142E", boxShadow: `0 0 30px ${GOLD}33`, opacity: chip(i), transform: `translateY(${mix(40, 0, ease(chip(i)))}px)` }}>
            <div style={{ flex: "none", width: 96, height: 96, borderRadius: "50%", background: GOLD, color: "#14142E", font: `900 60px '${SANS}'`, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ font: `800 56px '${SANS}'`, color: INK, lineHeight: 1.25 }}>{a} <span style={{ color: GOLD }}>{b}</span></div>
          </div>
        ))}
      </div>
    </>
  );
};

// ── 规则三：酒窖货架（真场景，不虚化）→ 360 万笔 → 两瓶摆到前面：目标 / 诱饵 → 新客 vs 熟客 → 先定要多少 ──
const WineBg: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  const dim = span(t, B(18) - 0.2, B(18) + 0.3), cards = span(t, B(21) - 0.2, B(21) + 0.3);
  return (
    <AbsoluteFill style={{ opacity: o, overflow: "hidden" }}>
      <Img src={staticFile("assets/红酒_酒窖货架.jpg")} style={{ width: VW, height: VH, objectFit: "cover", objectPosition: "88% 70%", transform: `scale(${1.25 + 0.02 * (t - B(16))})`, transformOrigin: "80% 70%", filter: `brightness(${0.7 - 0.25 * dim - 0.2 * cards}) saturate(1.1) blur(${6 * cards}px)` }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,30,.7), rgba(10,10,30,.1) 25%, rgba(10,10,30,.1) 60%, rgba(10,10,30,.9) 80%)" }} />
    </AbsoluteFill>
  );
};
const Rule3R: React.FC<{ t: number }> = ({ t }) => {
  const o = span(t, B(16) - 0.3, B(16) + 0.2) * (1 - span(t, B(22) - 0.3, B(22) + 0.1));
  const shelf = 1 - span(t, B(21) - 0.2, B(21) + 0.2), cnt = Math.min(1, Math.max(0, (t - B(17)) / 1.0)), dec = span(t, B(18), B(18) + 0.4);
  const ppl = span(t, B(19), B(19) + 0.5), list = span(t, B(20), B(20) + 0.5), steps = span(t, B(21), B(21) + 0.4);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ opacity: shelf }}>
        <div style={abs(0, 1000, { width: VW, textAlign: "center", font: `900 104px '${SANS}'`, color: GOLD, textShadow: glowT(GOLD) + ", 0 4px 20px #000", opacity: span(t, B(17), B(17) + 0.3) * (1 - dec) })}>{Math.round(3600000 * ease(cnt)).toLocaleString("en-US")} 笔</div>
        {/* 两瓶拿到前面：目标（金）和诱饵（红） */}
        <div style={{ opacity: dec * (1 - ppl) }}>
          {[[330, 1, "目标"], [750, 2, "诱饵"]].map(([x, hi, lab]) => (
            <div key={lab as string} style={abs((x as number) - 90, mix(1000, 640, ease(dec)), { width: 180, textAlign: "center" })}>
              <div style={{ transform: "scale(2.6)", transformOrigin: "50% 100%", height: 150 }}><Bottle c={INK} hi={hi as number} /></div>
              <div style={{ marginTop: 20 }}><Note text={lab as string} color={hi === 1 ? GOLD : RED} size={54} /></div>
            </div>
          ))}
          {/* 被买走：一瓶瓶目标酒从架上飞进购物车，下面计数；诱饵那瓶一动不动 */}
          {Array.from({ length: Math.min(9, Math.max(0, Math.floor((t - B(18) - 0.5) / 0.32))) }, (_, j) => <div key={"p" + j} style={abs(262 + (j % 5) * 22, 1010 - Math.floor(j / 5) * 18, { transform: `scale(0.6) rotate(${(j % 3 - 1) * 10}deg)`, transformOrigin: "50% 100%" })}><Bottle c={GOLD} hi={1} /></div>)}
          <Img src={staticFile("assets/icons/shopping_cart_flat.svg")} style={{ position: "absolute", left: 230, top: 1040, width: 200, height: 200, opacity: span(t, B(18) + 0.2, B(18) + 0.5) }} />
          {Array.from({ length: 9 }, (_, k) => {
            const f = Math.min(1, Math.max(0, (t - B(18) - 0.5 - k * 0.32) / 0.45));
            if (f <= 0 || f >= 1) return null;
            const e = ease(f);
            return <div key={k} style={abs(mix(320, 320 + (k % 3 - 1) * 30, e) - 26, mix(700, 1080, e) - 75 * Math.sin(Math.PI * e) * 0.6, { transform: `scale(${mix(1.6, 0.7, e)}) rotate(${mix(0, 40, e)}deg)`, opacity: 1 - span(f, 0.85, 1) })}><Bottle c={GOLD} hi={1} /></div>;
          })}
          <div style={abs(130, 1250, { width: 400, textAlign: "center", opacity: span(t, B(18) + 0.6, B(18) + 0.8) })}><Note text={`卖出 ${Math.min(9, Math.max(0, Math.floor((t - B(18) - 0.5) / 0.32) + 1))} 瓶`} color={GOLD} size={56} /></div>
          <div style={abs(560, 1250, { width: 380, textAlign: "center", opacity: span(t, B(18) + 0.6, B(18) + 0.8) })}><Note text="卖出 0 瓶" color={DIM} size={56} /></div>
        </div>
        {/* 新客 / 熟客 */}
        <div style={{ opacity: ppl }}>
          {[["新客", 160, DIM], ["熟客", 680, GOLD]].map(([lab, x, c], k) => (
            <div key={k} style={abs(x as number, 880, { width: 240, textAlign: "center", padding: "20px 0", borderRadius: 24, background: "rgba(10,10,30,.75)" })}>
              <svg width={240} height={190} viewBox="-120 -180 240 190" style={{ filter: `drop-shadow(0 0 8px ${c})` }}><circle cx={0} cy={-128} r={40} fill="none" stroke={c as string} strokeWidth={7} /><path d="M-76 0 Q-76 -80 0 -80 Q76 -80 76 0" fill="none" stroke={c as string} strokeWidth={7} /></svg>
              <div style={{ font: `800 48px '${SANS}'`, color: c as string }}>{lab}</div>
            </div>
          ))}
          <div style={abs(880, 840, { opacity: list, width: 160, padding: "12px 16px", background: "#14142E", border: `3px solid ${GOLD}`, borderRadius: 10, transform: "rotate(5deg)", font: `700 32px '${SANS}'`, color: INK })}>购物单<br /><span style={{ color: "#5FD08A" }}>✓</span> 这一瓶</div>
          <div style={abs(560, 1210, { width: 480, textAlign: "center" })}><Note text="几乎不受影响" color="#5FD08A" size={50} /></div>
        </div>
      </div>
      <div style={{ opacity: steps }}>
        {["① 我要多少", "② 再看价签"].map((x, k) => (
          <div key={k} style={abs(140, 520 + k * 360, { width: 800, padding: "60px 0", textAlign: "center", borderRadius: 24, border: `4px solid ${k === 0 ? GOLD : "#4A4870"}`, background: "rgba(20,20,46,.9)", boxShadow: k === 0 ? `0 0 40px ${GOLD}44` : "none", opacity: span(t, B(21) + k * 0.4, B(21) + 0.3 + k * 0.4), font: `900 88px '${SANS}'`, color: k === 0 ? GOLD : INK, textShadow: k === 0 ? glowT(GOLD) : "none" })}>{x}</div>
        ))}
      </div>
    </div>
  );
};

// ── 规则一背景：书店（杂志架 + 书架），压暗但不虚化；上方挂一块「杂志订阅」牌子 ──
const ShopBg: React.FC<{ t: number; o: number }> = ({ t, o }) => (
  <AbsoluteFill style={{ opacity: o, overflow: "hidden" }}>
    <Img src={staticFile("assets/书店_杂志架.jpg")} style={{ width: VW, height: VH, objectFit: "cover", objectPosition: "22% 60%", transform: `scale(${1.02 + 0.012 * (t - B(2))})`, filter: "brightness(0.4) saturate(1.05) blur(3px)" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,30,.92), rgba(10,10,30,.85) 16%, rgba(10,10,30,.25) 28%, rgba(10,10,30,.35) 60%, rgba(10,10,30,.9) 78%)" }} />
  </AbsoluteFill>
);
