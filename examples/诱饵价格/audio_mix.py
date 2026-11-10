# 声音：配乐窗口 + 音效挂点 → public/audio/mix.wav（配乐版）和 sfx_only.wav（只音效版，发布时可叠平台曲库）
# 配乐：《Claude Opus 5.5の小曲》从 11.81 秒起播，17.01 秒的起势落在片名卡 5.2 秒
import subprocess, numpy as np
from pathlib import Path
from scipy.io import wavfile

ROOT = Path(__file__).parent
LIB = ROOT.parent.parent / "sfx"
MUSIC = next((p for p in (ROOT / "music").glob("bgm.*")), None)   # 配乐自备：本片用的是 B 站上的《Claude Opus 5.5の小曲》，从 11.81 秒起播
SR, DUR, M0 = 48000, 60.5, 11.81
N = int(SR * DUR)

C = []
def B(k): return 5.2 + 2.126 * (k - 1 if k >= 2 else k)                     # 配乐小节线（片名卡 = 第 0 小节）
def cue(t, name, db=0): C.append((t, name, db))
def ticks(a, b, n, db=-14):
    for k in range(n): cue(a + (b - a) * (1 - (1 - k / n) ** 2), "嘀_计数", db)

# 冷开场：价目单滑入，手指移到大杯；2.8 盖「诱饵?」章
cue(0.1, "沙_纸张", -6); cue(0.9, "嗖_滑入", -12); cue(1.4, "叮_出现", -8)
for at in (1.9, 2.9, 3.5): cue(at, "啵_气泡", -6)                       # 梗①对话气泡
cue(4.5, "嗖_滑入", -8); cue(5.2, "咚_重音", -1); cue(5.4, "啪_盖章", -3)   # 片名 + 「饵」章
for at in (B(2), B(8), B(16)):                                          # 章节卡
    cue(at, "咚_重音", -3); cue(at + 1.6, "嗖_滑入", -12)
for i in range(3): cue(B(3) - 0.1 + i * 0.15, "沙_纸张", -8)            # 三张订阅单落下
[cue(B(4) + k * 0.1, "嘀_计数", -16) for k in range(10)]; cue(B(4) + 0.6, "啪_盖章", -3)   # 16 人 / 红圈 0
[cue(B(5) + k * 0.08, "嘀_计数", -16) for k in range(10)]; cue(B(5) + 0.8, "叮_出现", -3)   # 84 人
cue(B(6), "刷_写字", -3); cue(B(6) + 0.9, "嗖_滑入", -6)                 # 红叉，印刷版飞走
[cue(B(7) + k * 0.1, "嘀_计数", -16) for k in range(12)]; cue(B(7) + 1.2, "叮_低", -3)    # 68 / 32
cue(B(9) - 0.2, "嗖_滑入", -8); cue(B(9) + 0.4, "刷_写字", -8)          # 并排比
cue(B(10), "啪_盖章", -2)                                               # 诱饵章
cue(B(11) - 0.3, "沙_纸张", -6)                                          # 回到价目单
cue(B(12), "刷_写字", -6); cue(B(12) + 0.3, "叮_出现", -6)              # +¥1 +200ml
cue(B(13), "啪_盖章", -2)
cue(B(14), "刷_写字", -4)                                               # 红笔圈
cue(B(14) + 0.5, "啵_气泡", -6); cue(B(15) - 0.1, "啵_气泡", -6); cue(B(15) + 0.6, "嗡_错误", -8)   # 梗②
for k in range(8): cue(B(16) + 0.3 + k * 0.05, "嗒_多米诺", -18)        # 货架
[cue(B(17) + k * 0.1, "嘀_计数", -14) for k in range(14)]; cue(B(17) + 1.4, "叮_出现", -4)   # 360 万
cue(B(18), "咔_开关", -6)
cue(B(19), "嗖_滑入", -8); cue(B(20), "沙_纸张", -6); cue(B(20) + 0.4, "叮_出现", -6)
cue(B(21), "啪_盖章", -8); cue(B(21) + 0.4, "啪_盖章", -8)              # 两张便签
cue(B(22) + 0.2, "嗖_滑入", -6); cue(B(22) + 0.9, "啪_盖章", -4)         # 手盖住大杯
cue(B(23), "咚_重音", -3); cue(B(23), "闪_金光", -10)
for i in range(3): cue(B(24) + i * 0.25, "沙_纸张", -6)
for at in (B(4) + 1.0, B(6) + 0.15, B(7) + 0.7): cue(at, "啵_气泡", -7)  # 梗④印刷版说话
for i in range(5): cue(B(11) + 0.5 + i * 0.14, "叮_出现", -12)          # 梗③超大杯一长串
cue(B(11) + 1.3, "叮_低", -8)                                           # 大杯「600ml。」，然后留白
cue(B(25), "咔_开关", -4); cue(B(25) + 0.4, "啵_气泡", -6); cue(B(25) + 1.3, "叮_出现", -4)   # 梗⑤合照
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
