# 声音：配乐窗口 + 音效挂点 → public/audio/mix.wav（配乐版）和 sfx_only.wav（只音效版，发布时可叠平台曲库）
# 配乐自备：放到 music/bgm.m4a（或 .mp3）。M0 = 从曲子第几秒起播，调到让曲子的起势落在片名卡 B(0)。没有配乐就只出音效版。
import subprocess, numpy as np
from pathlib import Path
from scipy.io import wavfile

ROOT = Path(__file__).parent
LIB = ROOT.parent / "sfx"                                   # 仓库自带的 16 个自制音效
MUSIC = next((p for p in (ROOT / "music").glob("bgm.*")), None)
SR, DUR, M0 = 48000, 60.0, 11.81
N = int(SR * DUR)

C = []
def B(k): return 5.2 + 2.126 * k                      # 配乐小节线（片名卡 = 第 0 小节）
def cue(t, name, db=0): C.append((t, name, db))
def ticks(a, b, n, db=-14):
    for k in range(n): cue(a + (b - a) * (1 - (1 - k / n) ** 2), "嘀_计数", db)

for k in range(6): cue(k * 0.4, "嗒_多米诺", -8)        # 拳型每 0.4 秒轮换
cue(2.4, "叮_出现", -6); cue(2.7, "咚_重音", -2)        # ? 定格；80% 砸下
cue(4.5, "嗖_滑入", -8); cue(5.2, "咚_重音", -1); cue(5.2, "闪_金光", -4)   # 两拳相撞 → 片名
for at in (B(2), B(6), B(16)):                          # 章节卡
    cue(at, "咚_重音", -3); cue(at, "闪_金光", -8); cue(at + 1.6, "嗖_滑入", -12)
cue(B(3), "沙_纸张", -10); cue(B(3) + 0.5, "嗖_滑入", -10); cue(B(3) + 1.2, "嘀_计数", -10)   # 净胜条长出
cue(B(4), "叮_出现", -2); cue(B(4) + 0.1, "闪_金光", -8)                     # 每 100 局净多赢 2 局
cue(B(5), "嗖_滑入", -10)                                                    # 回到擂台
for k in range(4): cue(B(7) + 0.3 + k * 0.45, "嘀_计数", -14)               # ? 等观众猜
cue(B(8), "咔_开关", -4); cue(B(8) + 0.6, "啪_盖章", -6); cue(B(8) + 0.75, "叮_出现", -6)   # 揭晓：他换剪刀，你出石头赢
cue(B(9), "啵_气泡", -10)
cue(B(10), "沙_纸张", -8); cue(B(10) + 0.1, "叮_出现", -8); cue(B(11), "叮_低", -8)   # 口诀两行
cue(B(12), "升_蓄力", -10); cue(B(12) + 1.0, "刷_写字", -4); cue(B(12) + 1.2, "刷_写字", -4); cue(B(13) - 0.5, "咚_重音", -6)   # 42%，80% 打叉
cue(B(13), "嗖_滑入", -10); cue(B(13) + 0.4, "嗖_滑入", -12); cue(B(13) + 1.7, "嗡_错误", -6)   # 滑回 33%
cue(B(14), "嗡_错误", -12); cue(B(14) + 0.3, "啵_气泡", -10)                 # 高手视角
cue(B(15), "啪_盖章", -2); cue(B(15) + 0.1, "嗡_错误", -6)                   # 被吃定
for k in range(10): cue(B(17) + 0.2 + k * 0.2, "嘀_计数", -18)              # 秒表在走
cue(B(18), "叮_出现", -8); cue(B(18) + 0.3, "叮_出现", -10); cue(B(18) + 0.6, "叮_出现", -12)   # 三个扇区
cue(B(19), "嗖_滑入", -10)
for k in range(6): cue(B(19) + 0.5 + k * 0.12, "啵_气泡", -12)              # 对手的口诀落空
cue(B(19) + 0.8, "叮_低", -8)                                                # 纳什均衡小标签
cue(B(20), "闪_金光", -4); cue(B(20), "咚_重音", -2); cue(B(20) + 0.2, "嗖_滑入", -6)   # 机器人
for k in range(6): cue(B(21) + k * 0.15, "嘀_计数", -14)
cue(B(22) - 0.3, "啪_盖章", -2); cue(B(23) - 0.3, "叮_低", -6); cue(B(23) - 0.25, "闪_金光", -4)
cue(B(23), "嗖_滑入", -6); cue(B(23) + 0.6, "闪_金光", -2); cue(B(23) + 0.6, "咚_重音", -4)   # 猜 → 看
cue(B(24), "沙_纸张", -10)
for i in range(3): cue(B(24) + 0.15 + i * 0.35, "叮_出现", -6)              # 三条规则
cue(B(24) + 1.2, "闪_金光", -4); cue(B(24) + 1.2, "咚_重音", -4)            # 赢靠的是信息
cue(B(25), "叮_低", -6)

sfx = np.zeros(N, np.float32); cache = {}
for t, name, db in C:
    if name not in cache:
        sr, x = wavfile.read(LIB / f"{name}.wav"); x = x.astype(np.float32) / 32768
        if x.ndim > 1: x = x.mean(1)
        if sr != SR: x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x).astype(np.float32)
        cache[name] = x
    x = cache[name] * 10 ** (db / 20); a = int(t * SR); b = min(N, a + len(x)); sfx[a:b] += x[: b - a]

if MUSIC is None:
    print("没找到 music/bgm.*，只出音效版"); m = np.zeros(N, np.float32)
else:
    m = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-ss", str(M0), "-t", str(DUR), "-i", str(MUSIC), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32).copy()
m = np.pad(m, (0, max(0, N - len(m))))[:N]
ts = np.arange(N) / SR
m *= np.clip(ts / 0.6, 0, 1) * np.clip((DUR - ts) / 2.5, 0, 1)            # 进 0.6 秒、出 2.5 秒

def write(name, x):
    x = x / max(1.0, np.abs(x).max() / 0.89)
    wavfile.write(ROOT / "public/audio" / name, SR, (np.stack([x, x], 1) * 32767).astype(np.int16))
write("mix.wav", m * 0.85 + sfx)
write("sfx_only.wav", sfx)
print(len(C), "个音效")
