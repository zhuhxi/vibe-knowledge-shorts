// 字幕稿 v6：三条「什么时候能赢」的规则，一层推一层：没信息（第一把）→ 有信息（看输赢）→ 信息反被利用（高手）→ 全信息（机器人偷看）。
// 无配音，字幕就是旁白；每句 ≤16 字、句末无标点。时间排在配乐小节线上（每小节 2.126 秒）。
export type Line = { t: number; d: number; text: string; hook?: boolean; color?: Record<string, string> };
export const GOLD = "#F2C14E", RED = "#E5484D", CYAN = "#5EC8F2", INK = "#EDEAF5", DIM = "#8C8AA6", BG = "#0A0A1E";

export const B = (k: number) => 5.2 + 2.126 * k;   // 第 k 小节（片名卡 = 第 0 小节 = 曲子 17.01 秒的起势）

export const LINES: Line[] = [
  { t: 0.3, d: 2.3, text: "先在心里 出一拳" },
  { t: 2.6, d: 2.6, text: "网上说 两句口诀 胜率 80%", color: { "80%": GOLD } },
  // 片名卡 B0–B2，无字幕
  { t: B(2), d: 2.1, text: "规则一 第一把出布", color: { 出布: GOLD } },
  { t: B(3), d: 2.1, text: "263 万局的第一把 算一遍净胜", color: { "263 万": GOLD } },
  { t: B(4), d: 2.1, text: "出布 每 100 局净多赢 2 局", color: { "2 局": GOLD } },
  { t: B(5), d: 2.1, text: "从第二把起 对手会露馅" },
  { t: B(6), d: 2.1, text: "规则二 看上一把的输赢", color: { 输赢: GOLD } },
  { t: B(7), d: 2.1, text: "他石头输给你的布 下把出什么" },
  { t: B(8), d: 2.1, text: "输的人 爱换成克制你的那拳", color: { 输: RED } },
  { t: B(9), d: 2.1, text: "赢的人 爱再出同一拳", color: { 赢: GOLD } },
  { t: B(10), d: 2.1, text: "你赢了 下把出他上一把的", color: { 赢: GOLD } },
  { t: B(11), d: 2.1, text: "你输了 下把出能赢他上一把的", color: { 输: RED } },
  { t: B(12), d: 2.1, text: "盯住对手习惯 最多到 42%", color: { "42%": GOLD } },
  { t: B(13), d: 2.1, text: "可对手要是乱出 口诀就没用" },
  { t: B(14), d: 2.1, text: "更糟 高手会拿口诀对付你", color: { 对付你: RED } },
  { t: B(15), d: 2.1, text: "你赢了不换 正好被他吃定", color: { 吃定: RED } },
  { t: B(16), d: 2.1, text: "规则三 遇到高手 你也乱出", color: { 乱出: GOLD } },
  { t: B(17), d: 2.1, text: "想真乱 就看秒表个位" },
  { t: B(18), d: 2.1, text: "123 石头 456 剪刀 789 布" },
  { t: B(19), d: 2.1, text: "谁也猜不透你 这就够了" },
  { t: B(20), d: 2.1, text: "那有没有 百战百胜的" },
  { t: B(21), d: 2.1, text: "东京大学的猜拳机器人", color: { 机器人: CYAN } },
  { t: B(22), d: 2.1, text: "你出手的 1 毫秒里 它已看清", color: { "1 毫秒": CYAN } },
  { t: B(23), d: 2.1, text: "它在偷看 所以猜拳要同时出", color: { 同时出: GOLD } },
  { t: B(24), d: 2.1, text: "三条规则 赢靠的都是信息", color: { 信息: GOLD } },
  { t: B(25), d: 1.6, text: "你第一把出的什么 布扣 1" },
];
export const DURATION = 60;

// 配乐：《Claude Opus 5.5の小曲》（Vibe 赛道常用曲，112.9 BPM），从曲子 11.81 秒起播，
// 让曲子 17.01 秒的第一次起势落在片名卡（5.2 秒）；每 4 小节一个乐句：规则二后半（B12）、规则三（B16）、机器人（B20）、结尾（B24）落在乐句开头。
export const MUSIC_OFFSET = 11.81;
export const unwarp = (real: number) => real;
