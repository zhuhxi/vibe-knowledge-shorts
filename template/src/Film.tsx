// 石头剪刀布 v5（60 秒，无配音）：三条「什么时候能赢」的规则，一条比一条深。
//  结构照爆款的编号分章（站在外面的Q「六层卸防」、燃茶哥哥「两大焚诀」）：章节卡先在中央砸出，再缩到左上角常驻。
//  开头：算法之外 0–4s（画面只演动作，钩子在底部字幕）；片名：秦始皇 4s（随放射光打出）
//  模拟段：算法之外 40–44s（计数走、点随计数落下）；机器人：银牌 96–108s（计时器慢放、两人同屏）；猜→快：秦始皇 20–24s（圆环里大字变形）
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { B, BG, CYAN, DIM, GOLD, INK, RED } from "./script";
import { Ambience, Defs, FPS, H, Hand, Kind, SANS, SERIF, Subtitles, W, cl, ease, mix, rnd, span, win } from "./kit";

const LX = 640, RX = 1280, HY = 560;
const KIND_NAME: Record<Kind, string> = { R: "石头", P: "布", S: "剪刀" };
const KC: Record<Kind, string> = { R: "#E8A15C", P: "#7FD1AE", S: "#A99BF2" };
const KS: Kind[] = ["R", "P", "S"];

export const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <Defs />
        <Ambience t={t} floor={1 - 0.7 * win(t, B(2), B(20), 0.6)} />
        {t < 5.6 && <Arena t={t} />}
        {t >= 5.0 && t < B(2) + 0.2 && <Burst t={t} />}
        {t >= B(2) - 0.2 && t < B(5) + 0.2 && <Rule1 t={t} />}
        {t >= B(5) - 0.2 && t < B(16) + 0.2 && <Rule2 t={t} />}
        {t >= B(16) - 0.2 && t < B(20) + 0.2 && <Rule3 t={t} />}
        {t >= B(20) - 0.2 && t < B(24) + 0.4 && <Robot t={t} />}
        {t >= B(24) - 0.1 && <Ending t={t} />}
        <rect width={W} height={H} fill="#E6F7FF" opacity={0.4 * (1 - span(t, B(20), B(20) + 0.5)) * (t >= B(20) ? 1 : 0)} />
      </svg>
      <Title t={t} />
      <Chapter t={t} at={B(2)} until={B(5)} num="规则一" text="第一把出布" />
      <Chapter t={t} at={B(6)} until={B(16)} num="规则二" text="看上一把的输赢" />
      <Chapter t={t} at={B(16)} until={B(20)} num="规则三" text="遇到高手 你也乱出" />
      <Subtitles t={t} />
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: span(t, 59.4, 60) }} />
      <Audio src={staticFile("audio/mix.wav")} />
    </AbsoluteFill>
  );
};

// ── 章节卡：中央砸出 1.6 秒，再缩到左上角常驻（站在外面的Q 的章节标） ──
const Chapter: React.FC<{ t: number; at: number; until: number; num: string; text: string }> = ({ t, at, until, num, text }) => {
  if (t < at - 0.05 || t > until + 0.3) return null;
  const inn = span(t, at, at + 0.25), park = span(t, at + 1.6, at + 2.1), o = inn * (1 - span(t, until - 0.1, until + 0.2));
  const x = mix(W / 2, 90, park), y = mix(400, 70, park), s = mix(1, 0.32, park);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: o, transform: `translate(${x}px, ${y}px) scale(${s * mix(1.15, 1, inn)})`, transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", left: park > 0.5 ? 0 : -700, width: 1400, textAlign: park > 0.5 ? "left" : "center", whiteSpace: "nowrap" }}>
        <div style={{ font: `700 60px '${SANS}'`, color: GOLD, letterSpacing: 12, opacity: 0.9 }}>{num}</div>
        <div style={{ font: `900 150px '${SERIF}'`, color: INK, letterSpacing: 8, textShadow: "0 0 30px rgba(242,193,78,.3)" }}>{text}</div>
      </div>
    </div>
  );
};

// ── 冷开场：两只手每 0.4 秒轮换拳型 → 你的手定格成「?」→ 80% 在上方 → 4.5s 起两拳相撞 ──
const Arena: React.FC<{ t: number }> = ({ t }) => {
  const cyc = Math.floor(t / 0.4), lk = (["R", "S", "P"] as Kind[])[cyc % 3], rk = (["R", "S", "P"] as Kind[])[(cyc + 1) % 3];
  const pick = t >= 2.4;
  const bob = !pick ? Math.abs(Math.sin((t / 0.4) * Math.PI)) * 18 : 0;
  const clash = span(t, 4.5, 5.2);
  const lx = mix(LX, W / 2 - 150, clash * clash), rx = mix(RX, W / 2 + 150, clash * clash);
  const slam = span(t, 2.7, 2.95);
  return (
    <g opacity={1 - span(t, 5.2, 5.5)}>
      <Hand x={lx} y={HY + 90 - bob} s={1.75} kind={pick ? "R" : lk} color={GOLD} rot={8 * (1 - clash)} o={pick && clash === 0 ? 0.55 : 1} />
      <Hand x={rx} y={HY + 90 - bob} s={1.75} kind={pick ? "R" : rk} color={INK} mirror rot={-8 * (1 - clash)} o={pick && clash === 0 ? 0.55 : 1} />
      <g opacity={1 - clash}>
        <text x={LX - 250} y={HY + 120} textAnchor="middle" fill={GOLD} fontSize={44} fontFamily={SANS} fontWeight={700}>你</text>
        <text x={RX + 250} y={HY + 120} textAnchor="middle" fill={DIM} fontSize={44} fontFamily={SANS} fontWeight={700}>对手</text>
        <text x={LX} y={HY - 140} textAnchor="middle" fill={GOLD} fontSize={170} fontFamily={SERIF} fontWeight={900} opacity={span(t, 2.4, 2.55)} filter="url(#glow)">?</text>
        {t > 2.7 && <g opacity={slam} transform={`translate(${W / 2} 250) scale(${mix(1.8, 1, slam)})`}>
          <text x={0} y={0} textAnchor="middle" fill={GOLD} fontSize={150} fontFamily={SANS} fontWeight={900} filter="url(#glow)">80%</text>
          <text x={0} y={60} textAnchor="middle" fill={INK} fontSize={34} fontFamily={SANS} opacity={0.8}>网上流传的「必胜口诀」</text>
        </g>}
      </g>
    </g>
  );
};

const Burst: React.FC<{ t: number }> = ({ t }) => {
  const b = span(t, 5.2, 5.9), o = (t >= 5.2 ? 1 : 0) * (1 - span(t, B(2) - 0.15, B(2) + 0.2));
  return (
    <g opacity={o}>
      {Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2, r0 = 60 + 200 * b, r1 = r0 + (120 + 260 * rnd(i, 3)) * b;
        return <line key={i} x1={W / 2 + Math.cos(a) * r0} y1={HY + 30 + Math.sin(a) * r0 * 0.7} x2={W / 2 + Math.cos(a) * r1} y2={HY + 30 + Math.sin(a) * r1 * 0.7} stroke={GOLD} strokeWidth={2} opacity={0.15 + 0.35 * (1 - b)} />;
      })}
      <circle cx={W / 2} cy={HY + 30} r={40 + 500 * b} fill="none" stroke={GOLD} strokeWidth={3} opacity={0.6 * (1 - b)} filter="url(#glow)" />
    </g>
  );
};

const Title: React.FC<{ t: number }> = ({ t }) => {
  const a = span(t, 5.2, 5.5) * (1 - span(t, B(2) - 0.15, B(2) + 0.2));
  if (a <= 0) return null;
  const k = span(t, 5.2, 5.7);
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <svg width={W} height={H} style={{ position: "absolute" }}><Defs />
        <Hand x={mix(W / 2 - 150, 330, k)} y={mix(HY + 90, 470, k)} s={mix(1.75, 0.8, k)} kind="R" color={GOLD} rot={10} />
        <Hand x={mix(W / 2 + 150, 1590, k)} y={mix(HY + 90, 470, k)} s={mix(1.75, 0.8, k)} kind="R" color={INK} mirror rot={-10} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", transform: `scale(${mix(0.6, 1, ease(k))})`, transformOrigin: "50% 140px" }}>
        <div style={{ font: `900 180px '${SERIF}'`, letterSpacing: 24, background: `linear-gradient(180deg, #FFF3C9, ${GOLD} 60%, #B8862B)`, WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 30px rgba(242,193,78,.35))" }}>石头剪刀布</div>
        <div style={{ font: `700 76px '${SANS}'`, color: INK, letterSpacing: 10, marginTop: 6, opacity: span(t, 5.6, 6.0) }}>三条赢面规则</div>
        <div style={{ font: `400 36px '${SANS}'`, color: DIM, letterSpacing: 4, marginTop: 20, opacity: span(t, 6.2, 6.6) }}>263 万局真实数据 + 浙大实验 + 100 万局模拟</div>
      </div>
    </AbsoluteFill>
  );
};

const Cite: React.FC<{ text: string; o: number }> = ({ text, o }) => <text x={W - 70} y={70} textAnchor="end" fill={DIM} fontSize={28} fontFamily={SANS} opacity={o}>{text}</text>;

// ── 规则一：第一把出布。把 263 万局第一把的比例换算成「净胜」（赢的减输的），只亮一个数（算法之外 第 2 行第 4 格） ──
const Rule1: React.FC<{ t: number }> = ({ t }) => {
  const o = span(t, B(2) - 0.2, B(2) + 0.2) * (1 - span(t, B(5) - 0.2, B(5) + 0.1));
  const show = span(t, B(3), B(3) + 0.4), grow = span(t, B(3) + 0.5, B(4) - 0.2), pick = span(t, B(4), B(4) + 0.4);
  const rows: [Kind, number][] = [["P", 2.1], ["S", 0.8], ["R", -2.8]];
  const cx = 1130, k = 105;
  return (
    <g opacity={o}>
      <Cite text="Batzilis, Jaffe, Levitt, List & Picel, Games, 2019 · 附录表 A1" o={show} />
      <g opacity={show * (1 - pick)}>
        <text x={W / 2} y={170} textAnchor="middle" fill={DIM} fontSize={38} fontFamily={SANS}>263 万局的第一把：布 34.5% · 石头 33.8% · 剪刀 31.7%</text>
        <text x={W / 2} y={235} textAnchor="middle" fill={INK} fontSize={46} fontFamily={SANS} fontWeight={700}>每种拳的净胜 = 赢的局 − 输的局</text>
      </g>
      {pick > 0 && <g opacity={pick}>
        <text x={W / 2} y={215} textAnchor="middle" fill={GOLD} fontSize={92} fontFamily={SANS} fontWeight={900} filter="url(#glow)">每 100 局 净多赢 2 局</text>
        <text x={W / 2} y={275} textAnchor="middle" fill={DIM} fontSize={36} fontFamily={SANS}>优势小 但白捡</text>
      </g>}
      <g opacity={show}>
        <line x1={cx} y1={330} x2={cx} y2={820} stroke={DIM} strokeWidth={2} />
        {rows.map(([kind, v], i) => {
          const y = 410 + i * 160, len = Math.abs(v) * k * grow, pos = v > 0, hi = kind === "P" && pick > 0;
          const col = pos ? (hi ? GOLD : KC[kind]) : RED;
          return <g key={kind} opacity={pick > 0 && !hi ? 0.45 : 1}>
            <Hand x={560} y={y + 40} s={0.5} kind={kind} color={KC[kind]} />
            <text x={680} y={y + 16} fill={INK} fontSize={48} fontFamily={SANS} fontWeight={700}>{KIND_NAME[kind]}</text>
            <rect x={pos ? cx : cx - len} y={y - 30} width={len} height={60} fill={col} opacity={hi ? 0.5 : 0.28} />
            <rect x={pos ? cx : cx - len} y={y - 30} width={len} height={60} fill="none" stroke={col} strokeWidth={hi ? 5 : 3} filter="url(#glow)" />
            <text x={pos ? cx + len + 24 : cx + 24} y={y + 18} fill={col} fontSize={52} fontFamily={SANS} fontWeight={900} opacity={span(t, B(3) + 1.2, B(4))}>{v > 0 ? "+" : "−"}{Math.abs(v)}</text>
          </g>;
        })}
      </g>
    </g>
  );
};

const Person: React.FC<{ x: number; y: number; c: string; o: number }> = ({ x, y, c, o }) => (
  <g opacity={o} transform={`translate(${x} ${y})`}><circle cx={0} cy={-9} r={6.5} fill={c} /><path d="M-11 9 Q-11 -1 0 -1 Q11 -1 11 9 Z" fill={c} /></g>
);

// ── 规则二：回到擂台实打一轮（先让观众猜，算法之外 第 1 行第 8 格）→ 口诀 → 最多 42%，开头的 80% 打红叉（燃茶 第 1 行第 2–4 格）
//    → 对手乱出就没用 → 高手拿口诀对付你（站在外面的Q 错句/对句当场演） ──
const Rule2: React.FC<{ t: number }> = ({ t }) => {
  const o = span(t, B(5) - 0.1, B(5) + 0.2) * (1 - span(t, B(16) - 0.2, B(16) + 0.1));
  const arena = span(t, B(5), B(5) + 0.4) * (1 - span(t, B(10) - 0.1, B(10) + 0.3));
  const reveal = span(t, B(8), B(8) + 0.35), youNext = span(t, B(8) + 0.6, B(8) + 0.9), same = span(t, B(9), B(9) + 0.4);
  const card = span(t, B(10) - 0.1, B(10) + 0.3) * (1 - span(t, B(12) - 0.1, B(12) + 0.2));
  const gauge = span(t, B(12), B(12) + 0.35) * (1 - span(t, B(13) - 0.1, B(13) + 0.2));
  const pct = mix(33, 42, span(t, B(12) + 0.3, B(13) - 0.5)), cross = span(t, B(12) + 1.0, B(12) + 1.3);
  const chart = span(t, B(13), B(13) + 0.3) * (1 - span(t, B(14) - 0.1, B(14) + 0.2));
  const back = span(t, B(13) + 0.4, B(13) + 1.7);
  const foe = span(t, B(14), B(14) + 0.35) * (1 - span(t, B(16) - 0.2, B(16) + 0.1)), eaten = span(t, B(15), B(15) + 0.4);
  const pts: [number, number][] = [[0, 33.3], [10, 38.0], [20, 42.8], [30, 48.2], [50, 60.0]];
  const X = (h: number) => 520 + h * 18, Y = (p: number) => 760 - (p - 30) * 16;
  return (
    <g opacity={o}>
      {/* 擂台：第 1 把你布赢他石头；他下一把出什么？ */}
      {arena > 0 && <g opacity={arena * (1 - 0.8 * win(t, B(6) - 0.1, B(6) + 1.8, 0.25))}>
        <text x={W / 2} y={170} textAnchor="middle" fill={DIM} fontSize={40} fontFamily={SANS}>{t < B(8) ? "第 1 把" : "第 2 把"}</text>
        <Hand x={LX} y={HY + 40} s={1.2} kind={youNext > 0.5 ? "R" : "P"} color={GOLD} o={t < B(6) ? 0.6 : 1} />
        <Hand x={RX} y={HY + 40} s={1.2} kind={reveal > 0.5 ? "S" : "R"} color={reveal > 0 ? INK : DIM} mirror o={t < B(6) ? 0.6 : 1} />
        <text x={LX} y={HY + 300} textAnchor="middle" fill={GOLD} fontSize={52} fontFamily={SANS} fontWeight={900}>{youNext > 0.5 ? "赢" : "赢 · 布"}</text>
        <text x={RX} y={HY + 300} textAnchor="middle" fill={reveal > 0.5 ? RED : DIM} fontSize={52} fontFamily={SANS} fontWeight={900}>{youNext > 0.5 ? "输" : "输 · 石头"}</text>
        {t >= B(7) && reveal < 1 && <text x={RX} y={HY - 230} textAnchor="middle" fill={GOLD} fontSize={170} fontFamily={SERIF} fontWeight={900} opacity={span(t, B(7), B(7) + 0.3) * (1 - reveal) * (0.75 + 0.25 * Math.sin(t * 8))} filter="url(#glow)">?</text>}
        {reveal > 0 && <g opacity={reveal * (1 - same)}>
          <text x={RX - 330} y={HY - 160} textAnchor="middle" fill={INK} fontSize={48} fontFamily={SANS} fontWeight={900}>他换成剪刀</text>
          <text x={RX - 330} y={HY - 100} textAnchor="middle" fill={DIM} fontSize={32} fontFamily={SANS}>剪刀 克制你刚才的布</text>
          <text x={LX + 330} y={HY + 60} textAnchor="middle" fill={GOLD} fontSize={44} fontFamily={SANS} fontWeight={900} opacity={youNext}>你出石头 → 赢</text>
        </g>}
        {same > 0 && <g opacity={same}>
          <Hand x={LX + 330} y={HY + 20} s={0.7} kind="R" color={GOLD} o={0.7} />
          <text x={LX + 330} y={HY + 200} textAnchor="middle" fill={GOLD} fontSize={40} fontFamily={SANS} fontWeight={700}>赢的你 下把还想出它</text>
        </g>}
      </g>}
      <Cite text="Wang, Xu & Zhou, Scientific Reports, 2014" o={win(t, B(8), B(10))} />
      {/* 口诀卡 */}
      {card > 0 && <g opacity={card} transform={`translate(${W / 2} 480) scale(${mix(0.92, 1, card)}) translate(${-W / 2} -480)`}>
        <rect x={300} y={250} width={1320} height={500} rx={22} fill="#14142C" stroke={GOLD} strokeWidth={2} opacity={0.95} />
        <text x={W / 2} y={335} textAnchor="middle" fill={GOLD} fontSize={52} fontFamily={SERIF} fontWeight={900}>口　诀</text>
        <g opacity={span(t, B(10) + 0.1, B(10) + 0.5)}>
          <text x={370} y={480} fill={GOLD} fontSize={68} fontFamily={SANS} fontWeight={900}>赢了</text>
          <text x={540} y={480} fill={INK} fontSize={52} fontFamily={SANS}>下把出 他上一把的</text>
          <Hand x={1220} y={485} s={0.42} kind="R" color={INK} /><text x={1325} y={495} fill={GOLD} fontSize={44} fontFamily={SANS}>→</text><Hand x={1440} y={485} s={0.42} kind="R" color={GOLD} />
        </g>
        <g opacity={span(t, B(11), B(11) + 0.4)}>
          <text x={370} y={640} fill={RED} fontSize={68} fontFamily={SANS} fontWeight={900}>输了</text>
          <text x={540} y={640} fill={INK} fontSize={52} fontFamily={SANS}>下把出 能赢他上一把的</text>
          <Hand x={1220} y={645} s={0.42} kind="P" color={INK} /><text x={1325} y={655} fill={RED} fontSize={44} fontFamily={SANS}>→</text><Hand x={1440} y={645} s={0.42} kind="S" color={RED} />
        </g>
        <text x={1220} y={735} textAnchor="middle" fill={DIM} fontSize={28} fontFamily={SANS} opacity={span(t, B(10) + 0.5, B(10) + 0.9)}>他上一把</text>
        <text x={1440} y={735} textAnchor="middle" fill={DIM} fontSize={28} fontFamily={SANS} opacity={span(t, B(10) + 0.5, B(10) + 0.9)}>你下一把</text>
      </g>}
      {/* 最多 42%：开头的 80% 打红叉 */}
      {gauge > 0 && <g opacity={gauge}>
        <Gauge pct={pct} big={`${pct.toFixed(0)}%`} label="随机出拳 = 33%" />
        <g transform="translate(1530 470)">
          <text x={0} y={0} textAnchor="middle" fill={DIM} fontSize={110} fontFamily={SANS} fontWeight={900}>80%</text>
          <line x1={-130} y1={-90} x2={mix(-130, 130, cross)} y2={mix(-90, 30, cross)} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          <line x1={130} y1={-90} x2={mix(130, -130, span(t, B(12) + 1.2, B(12) + 1.5))} y2={mix(-90, 30, span(t, B(12) + 1.2, B(12) + 1.5))} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          <text x={0} y={70} textAnchor="middle" fill={DIM} fontSize={30} fontFamily={SANS}>网上的说法</text>
        </g>
        <Cite text="Batzilis et al., Games, 2019：最优利用对手的可预测性 ≈ 41.7%" o={1} />
      </g>}
      {/* 对手乱出：胜率点沿曲线滑回 33%（模拟 100 万局） */}
      {chart > 0 && <g opacity={chart}>
        <text x={W - 80} y={165} textAnchor="end" fill={DIM} fontSize={36} fontFamily={SANS}>模拟 100 万局</text>
        <line x1={X(0)} y1={Y(30)} x2={X(52)} y2={Y(30)} stroke={DIM} strokeWidth={2} />
        <line x1={X(0)} y1={Y(30)} x2={X(0)} y2={Y(62)} stroke={DIM} strokeWidth={2} />
        <text x={X(26)} y={Y(30) + 85} textAnchor="middle" fill={INK} fontSize={36} fontFamily={SANS}>对手的习惯有多重</text>
        <text x={X(0) - 30} y={Y(62) - 20} fill={INK} fontSize={36} fontFamily={SANS}>你的胜率</text>
        <text x={X(0) + 10} y={Y(30) + 34} textAnchor="middle" fill={RED} fontSize={30} fontFamily={SANS}>乱出</text>
        <text x={X(50)} y={Y(30) + 34} textAnchor="middle" fill={DIM} fontSize={30} fontFamily={SANS}>习惯很重</text>
        <path d={pts.map(([h, p], i) => `${i ? "L" : "M"}${X(h)} ${Y(p)}`).join(" ")} fill="none" stroke={GOLD} strokeWidth={5} opacity={0.6} filter="url(#glow)" />
        {(() => { const h = mix(50, 0, back), p = mix(60, 33.3, back);
          return <g><circle cx={X(h)} cy={Y(p)} r={16} fill={back > 0.95 ? RED : GOLD} filter="url(#glow)" />
            <text x={X(h) + 40} y={Y(p) - 24} fill={back > 0.95 ? RED : GOLD} fontSize={56} fontFamily={SANS} fontWeight={900}>{p.toFixed(0)}%</text></g>; })()}
      </g>}
      {/* 高手视角：他也会口诀。你赢了不换 → 他算准你还出布 → 出剪刀吃掉你 */}
      {foe > 0 && <g opacity={foe}>
        <text x={W / 2} y={160} textAnchor="middle" fill={RED} fontSize={44} fontFamily={SANS} fontWeight={900}>高手的视角</text>
        <Hand x={LX} y={HY + 60} s={1.2} kind="P" color={GOLD} />
        <Hand x={RX} y={HY + 60} s={1.2} kind={eaten > 0.5 ? "S" : "R"} color={RED} mirror />
        <g opacity={span(t, B(14) + 0.3, B(14) + 0.7) * (1 - eaten)}>
          <rect x={RX - 520} y={180} width={600} height={150} rx={20} fill="#2A1420" stroke={RED} strokeWidth={2} />
          <text x={RX - 220} y={240} textAnchor="middle" fill={INK} fontSize={38} fontFamily={SANS}>他刚赢了 爱出同一拳</text>
          <text x={RX - 220} y={300} textAnchor="middle" fill={RED} fontSize={42} fontFamily={SANS} fontWeight={900}>那我出剪刀</text>
        </g>
        <text x={LX} y={HY + 320} textAnchor="middle" fill={GOLD} fontSize={44} fontFamily={SANS} fontWeight={700} opacity={1 - eaten}>上一把你赢了</text>
        {eaten > 0 && <g opacity={eaten}>
          <text x={LX} y={HY + 320} textAnchor="middle" fill={RED} fontSize={60} fontFamily={SANS} fontWeight={900}>输 · 被吃定</text>
          <text x={LX + 300} y={HY - 120} textAnchor="middle" fill={GOLD} fontSize={40} fontFamily={SANS}>又出了布</text>
        </g>}
      </g>}
    </g>
  );
};

const Gauge: React.FC<{ pct: number; big: string; label: string }> = ({ pct, big, label }) => {
  const a = Math.PI * (1 - cl((pct - 25) / 30));
  return <g>
    <path d="M660 640 A300 300 0 0 1 1260 640" fill="none" stroke={DIM} strokeWidth={10} opacity={0.45} />
    <path d="M660 640 A300 300 0 0 1 1260 640" fill="none" stroke={GOLD} strokeWidth={10} strokeDasharray={`${942 * cl((pct - 25) / 30)} 2000`} filter="url(#glow)" />
    <line x1={960} y1={640} x2={960 + 260 * Math.cos(a)} y2={640 - 260 * Math.sin(a)} stroke={INK} strokeWidth={5} strokeLinecap="round" />
    <text x={960} y={580} textAnchor="middle" fill={GOLD} fontSize={120} fontFamily={SANS} fontWeight={900} filter="url(#glow)">{big}</text>
    <text x={960} y={700} textAnchor="middle" fill={DIM} fontSize={36} fontFamily={SANS}>{label}</text>
  </g>;
};

// ── 规则三：遇到高手你也乱出。怎么真乱：看秒表个位（123 石头 / 456 剪刀 / 789 布 / 0 再看）；纳什均衡只当小标签（站在外面的Q 第 2 行第 1 格） ──
const Rule3: React.FC<{ t: number }> = ({ t }) => {
  const o = span(t, B(16) - 0.1, B(16) + 0.2) * (1 - span(t, B(20) - 0.2, B(20) + 0.1));
  const dial = span(t, B(17), B(17) + 0.4) * (1 - span(t, B(19) - 0.1, B(19) + 0.3));
  const sect = span(t, B(18), B(18) + 0.5);
  const tri = span(t, B(19), B(19) + 0.4);
  const cx = W / 2, cy = 520, R = 280;
  const digit = Math.floor(((t - B(17)) * 10) % 10 + 10) % 10;       // 秒表个位飞快地走
  const sector = (d: number): Kind | null => d >= 1 && d <= 3 ? "R" : d >= 4 && d <= 6 ? "S" : d >= 7 ? "P" : null;
  const ang = (d: number) => -Math.PI / 2 + (d / 10) * Math.PI * 2;
  const cur = sector(digit);
  return (
    <g opacity={o}>
      {dial > 0 && <g opacity={dial}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={INK} strokeWidth={4} opacity={0.8} />
        {Array.from({ length: 10 }, (_, d) => {
          const a0 = ang(d - 0.5), a1 = ang(d + 0.5), k = sector(d), c = k ? KC[k] : DIM;
          return <g key={d}>
            {sect > 0 && <path d={`M${cx} ${cy} L${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} Z`} fill={c} opacity={0.22 * sect} />}
            <text x={cx + (R - 55) * Math.cos(ang(d))} y={cy + (R - 55) * Math.sin(ang(d)) + 18} textAnchor="middle" fill={d === digit ? GOLD : INK} fontSize={d === digit ? 58 : 46} fontFamily={"DejaVu Sans Mono"} fontWeight={700}>{d}</text>
          </g>;
        })}
        <line x1={cx} y1={cy} x2={cx + (R - 100) * Math.cos(ang(digit))} y2={cy + (R - 100) * Math.sin(ang(digit))} stroke={GOLD} strokeWidth={6} strokeLinecap="round" filter="url(#glow)" />
        <circle cx={cx} cy={cy} r={12} fill={GOLD} />
        <text x={cx} y={cy - R - 30} textAnchor="middle" fill={DIM} fontSize={36} fontFamily={SANS}>秒表的个位</text>
        {sect > 0 && <g opacity={sect}>
          {(["R", "S", "P"] as Kind[]).map((k, i) => {
            const mid = ang(2 + i * 3), x = cx + (R + 150) * Math.cos(mid), y = cy + (R + 120) * Math.sin(mid);
            return <g key={k} opacity={cur === k ? 1 : 0.55}><Hand x={x} y={y + 30} s={0.5} kind={k} color={KC[k]} />
              <text x={x} y={y + 130} textAnchor="middle" fill={KC[k]} fontSize={40} fontFamily={SANS} fontWeight={900}>{["1 2 3", "4 5 6", "7 8 9"][i]}</text></g>;
          })}
          <text x={cx + (R + 110) * Math.cos(ang(0))} y={cy + (R + 50) * Math.sin(ang(0))} textAnchor="middle" fill={DIM} fontSize={34} fontFamily={SANS}>0 再看一眼</text>
        </g>}
      </g>}
      {/* 乱出的结果：三种拳各三分之一，对手的口诀全落空 */}
      {tri > 0 && (() => {
        const pos = (i: number) => [cx + 230 * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / 3), cy + 230 * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / 3)];
        const attack = span(t, B(19) + 0.3, B(19) + 1.6);
        return <g opacity={tri}>
          <circle cx={cx} cy={cy} r={300} fill="none" stroke={GOLD} strokeWidth={2} opacity={0.5} />
          {KS.map((k, i) => { const [x, y] = pos(i); return <g key={k}><Hand x={x} y={y + 40} s={0.55} kind={k} color={KC[k]} /><text x={x} y={y + 150} textAnchor="middle" fill={INK} fontSize={40} fontFamily={SANS} fontWeight={900}>⅓</text></g>; })}
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2 + 0.4, k = cl(attack * 1.4 - i * 0.08), r = k < 0.6 ? mix(820, 320, k / 0.6) : mix(320, 900, (k - 0.6) / 0.4);
            return <circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a) * 0.8} r={10} fill={RED} opacity={k > 0 && k < 1 ? 0.9 : 0} filter="url(#glow)" />;
          })}
          <text x={cx} y={cy - 360} textAnchor="middle" fill={INK} fontSize={46} fontFamily={SANS} fontWeight={700}>他的胜率：33%</text>
          <g opacity={span(t, B(19) + 0.8, B(19) + 1.2)}>
            <rect x={cx + 330} y={cy - 40} width={330} height={80} rx={14} fill="#14142C" stroke={GOLD} strokeWidth={2} />
            <text x={cx + 495} y={cy + 14} textAnchor="middle" fill={GOLD} fontSize={38} fontFamily={SANS} fontWeight={900}>博弈论：纳什均衡</text>
          </g>
        </g>;
      })()}
    </g>
  );
};

// ── 机器人：从右侧滑入；计时器慢放 0.000→0.200，机器人在 0.001 已出完；「靠快」：猜 → 快 ──
const Robot: React.FC<{ t: number }> = ({ t }) => {
  const inn = span(t, B(20), B(20) + 0.3), out = 1 - span(t, B(24) - 0.2, B(24) + 0.2);
  const slide = span(t, B(20) + 0.2, B(20) + 1.2);
  const T0 = B(22) - 0.3, T1 = B(23) - 0.3;
  const clock = t < T0 ? 0 : Math.min(0.2, (t - T0) / (T1 - T0) * 0.2);
  const form = cl(clock / 0.2), robotDone = t >= T0 && clock >= 0.001;
  const win100 = span(t, T1 + 0.05, T1 + 0.3), race = span(t, B(23), B(23) + 0.4), m = span(t, B(23) + 0.6, B(23) + 0.85);
  const rx = mix(W + 300, RX, slide);
  return (
    <g opacity={inn * out}>
      <Cite text="东京大学 石川·渡边实验室 Janken 机器人" o={span(t, B(21), B(21) + 0.4) * (1 - race)} />
      <g opacity={1 - race}>
        <path d={`M${rx - 40} 0 L${rx + 40} 0 L${rx + 260} ${HY + 300} L${rx - 260} ${HY + 300} Z`} fill={CYAN} opacity={0.07 * slide} />
        <Hand x={LX} y={HY + 60} s={1.5} kind={form > 0.08 ? "P" : "R"} morph={form} color={GOLD} />
        <Hand x={rx} y={HY + 60} s={1.5} kind={robotDone ? "S" : "R"} color={CYAN} mirror robot />
        {t > B(21) && <g opacity={span(t, B(21), B(21) + 0.4)}>
          <circle cx={RX + 60} cy={HY - 300} r={24} fill="none" stroke={CYAN} strokeWidth={3} filter="url(#glow)" />
          {Array.from({ length: 11 }, (_, i) => <line key={i} x1={RX + 60} y1={HY - 300} x2={LX + 160 - i * 30} y2={HY - 230 + i * 34} stroke={CYAN} strokeWidth={1.4} opacity={0.2 + 0.4 * Math.abs(Math.sin(t * 9 + i))} />)}
        </g>}
        {t > T0 && <g>
          <g opacity={span(t, T0, T0 + 0.3)}>
            <path d={`M${RX - 150} ${HY - 250} h-20 v330 h20`} fill="none" stroke={CYAN} strokeWidth={3} />
            <text x={RX - 190} y={HY - 70} textAnchor="end" fill={CYAN} fontSize={40} fontFamily={SANS} fontWeight={900}>1 毫秒 已看清</text>
          </g>
          <text x={LX + 330} y={HY + 150} textAnchor="middle" fill={GOLD} fontSize={40} fontFamily={SANS} fontWeight={700} opacity={form > 0.99 ? 1 : 0.5}>{form > 0.99 ? "0.200 秒 你才出完" : "你还在张手…"}</text>
        </g>}
        {t > B(21) + 0.5 && <text x={W / 2} y={230} textAnchor="middle" fill={CYAN} fontSize={140} fontFamily={"DejaVu Sans Mono"} fontWeight={700} filter="url(#glow)">{clock.toFixed(3)} s</text>}
        {win100 > 0 && <g opacity={win100} transform={`translate(${W / 2} 345) scale(${mix(1.25, 1, win100)})`}><text x={0} y={0} textAnchor="middle" fill={CYAN} fontSize={64} fontFamily={SANS} fontWeight={900}>胜率 100%</text></g>}
      </g>
      {race > 0 && <g opacity={race}>
        <circle cx={W / 2} cy={480} r={250} fill="none" stroke={m > 0.5 ? CYAN : GOLD} strokeWidth={4} filter="url(#glow)" />
        {m > 0 && Array.from({ length: 40 }, (_, i) => {
          const a = (i / 40) * Math.PI * 2, r1 = 260 + 200 * span(t, B(23) + 0.6, B(23) + 1.2);
          return <line key={i} x1={W / 2 + Math.cos(a) * 260} y1={480 + Math.sin(a) * 260} x2={W / 2 + Math.cos(a) * r1} y2={480 + Math.sin(a) * r1} stroke={CYAN} strokeWidth={2} opacity={0.5 * (1 - span(t, B(23) + 1.0, B(23) + 1.6))} />;
        })}
        <text x={W / 2} y={560} textAnchor="middle" fill={GOLD} fontSize={240} fontFamily={SERIF} fontWeight={900} opacity={1 - m} filter="url(#glow)">猜</text>
        <text x={W / 2} y={560} textAnchor="middle" fill={CYAN} fontSize={240} fontFamily={SERIF} fontWeight={900} opacity={m} filter="url(#glow)">看</text>
        <text x={W / 2} y={820} textAnchor="middle" fill={DIM} fontSize={34} fontFamily={SANS} opacity={span(t, B(23) + 0.9, B(23) + 1.2)}>它是慢半拍出拳 —— 所以要同时出</text>
      </g>}
    </g>
  );
};

// ── 结尾：回到开头的擂台；三条规则收成三张小卡；最后「?」回到你的拳上 ──
const Ending: React.FC<{ t: number }> = ({ t }) => {
  const a = span(t, B(24) - 0.1, B(24) + 0.4);
  const rules = ["① 第一把出布", "② 看上一把的输赢", "③ 遇到高手就乱出"];
  return (
    <g opacity={a}>
      <Hand x={LX} y={HY + 170} s={1.3} kind="R" color={GOLD} rot={8} o={0.85} />
      <Hand x={RX} y={HY + 170} s={1.3} kind="R" color={INK} mirror rot={-8} o={0.85} />
      {rules.map((r, i) => <g key={r} opacity={span(t, B(24) + 0.15 + i * 0.35, B(24) + 0.45 + i * 0.35)}>
        <rect x={210 + i * 520} y={130} width={460} height={110} rx={16} fill="#14142C" stroke={GOLD} strokeWidth={2} />
        <text x={440 + i * 520} y={203} textAnchor="middle" fill={GOLD} fontSize={44} fontFamily={SANS} fontWeight={900}>{r}</text>
      </g>)}
      <text x={W / 2} y={400} textAnchor="middle" fill={GOLD} fontSize={96} fontFamily={SERIF} fontWeight={900} opacity={span(t, B(24) + 1.2, B(24) + 1.6)} filter="url(#glow)">赢 靠的是信息</text>
      <text x={LX} y={HY - 10} textAnchor="middle" fill={GOLD} fontSize={150} fontFamily={SERIF} fontWeight={900} opacity={span(t, B(25), B(25) + 0.3)} filter="url(#glow)">?</text>
    </g>
  );
};
