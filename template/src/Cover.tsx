// 封面：成片同一套画法。主体 = 擂台上的两只手；大字 = 网上的说法被打问号；小字 = 数据来源
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { BG, DIM, GOLD, INK } from "./script";
import { Ambience, Defs, Hand, SANS, SERIF } from "./kit";

export const Cover: React.FC = () => {
  const { width: w, height: h } = useVideoConfig();
  const wide = w > h, cx = w / 2, hy = wide ? 760 : 900, gap = wide ? 400 : 250, s = wide ? 1.35 : 1.5;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg width={w} height={h} style={{ position: "absolute" }}>
        <Defs />
        <g transform={`translate(${(w - 1920) / 2} ${(h - 1080) / 2})`}><Ambience t={3} /></g>
        <Hand x={cx - gap} y={hy} s={s} kind="P" color={GOLD} />
        <Hand x={cx + gap} y={hy} s={s} kind="R" color={INK} mirror />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: wide ? 70 : 120, textAlign: "center" }}>
        <div style={{ font: `900 ${wide ? 150 : 140}px '${SERIF}'`, letterSpacing: 10, background: `linear-gradient(180deg,#FFF3C9,${GOLD} 60%,#B8862B)`, WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 30px rgba(242,193,78,.35))" }}>石头剪刀布</div>
        <div style={{ font: `900 ${wide ? 84 : 88}px '${SANS}'`, color: INK, marginTop: 6 }}>第一把 <span style={{ color: GOLD }}>出布</span>？</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: wide ? 60 : 110, textAlign: "center", font: `500 ${wide ? 40 : 44}px '${SANS}'`, color: DIM, letterSpacing: 4 }}>263 万局数据里的 三条赢面规则</div>
    </AbsoluteFill>
  );
};
