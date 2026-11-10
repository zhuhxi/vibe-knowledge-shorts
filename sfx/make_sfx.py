# 自制音效库：全部用程序合成，版权归自己，可商用、可再分发
# 用法：python3 make_sfx.py  → 生成 *.wav（48kHz 单声道）
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR = 48000
rng = np.random.default_rng(7)
t_ = lambda d: np.arange(int(d * SR)) / SR
def env(n, a=0.002, r=0.2):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r); return e
def bp(x, lo, hi, o=2):
    b, a = butter(o, [lo / (SR / 2), hi / (SR / 2)], "band"); return lfilter(b, a, x)
def lp(x, f, o=2):
    b, a = butter(o, f / (SR / 2)); return lfilter(b, a, x)
def hp(x, f, o=2):
    b, a = butter(o, f / (SR / 2), "high"); return lfilter(b, a, x)
def save(name, x, peak=0.8):
    x = x / (np.abs(x).max() + 1e-9) * peak
    fade = int(0.005 * SR); x[-fade:] *= np.linspace(1, 0, fade)
    wavfile.write(f"{name}.wav", SR, (x * 32767).astype(np.int16))
def bell(f0, d=1.2, partials=((1, 1), (2.76, .4), (5.4, .2), (8.9, .08)), r=0.35):
    t = t_(d); return sum(a * np.sin(2 * np.pi * f0 * k * t) * np.exp(-t / (r / k ** 0.5)) for k, a in partials)

save("叮_出现", bell(1320, 1.0))                                         # 对勾 / 答对 / 关键数字落定
save("叮_低", bell(660, 1.4, r=0.5))                                     # 片名 / 重要结论
t = t_(0.06); save("嘀_计数", np.sin(2 * np.pi * 2400 * t) * env(len(t), 0.001, 0.015), 0.5)     # 数字滚动的每一跳
t = t_(0.03); save("咔_开关", hp(rng.standard_normal(len(t)), 2000) * env(len(t), 0.0005, 0.006) + 0.6 * np.sin(2 * np.pi * 1800 * t) * env(len(t), 0.0005, 0.004), 0.6)  # 拨开关 / 点击
n = int(0.7 * SR); w = rng.standard_normal(n); fc = np.linspace(300, 3500, n) ** 1
whoosh = np.concatenate([bp(w[i:i + 4800], max(100, fc[i] * .6), min(20000, fc[i] * 1.6)) for i in range(0, n, 4800)])[:n]
save("嗖_滑入", whoosh * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5, 0.6)                    # 卡片 / 稿子 滑入、转场
t = t_(0.9); boom = np.sin(2 * np.pi * (55 + 40 * np.exp(-t / 0.08)) * t) * env(len(t), 0.003, 0.35) + 0.3 * lp(rng.standard_normal(len(t)), 300) * env(len(t), 0.001, 0.08)
save("咚_重音", boom)                                                    # 大揭晓（更笨 / 152 层 / 一千层）
t = t_(0.35); stamp = 0.9 * np.sin(2 * np.pi * 90 * t) * env(len(t), 0.001, 0.06) + lp(rng.standard_normal(len(t)), 2500) * env(len(t), 0.0005, 0.03)
save("啪_盖章", stamp)                                                   # 印章 / 档案卡落定
t = t_(0.5); paper = bp(rng.standard_normal(len(t)), 1500, 7000) * (env(len(t), 0.01, 0.12) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t)))
save("沙_纸张", paper, 0.5)                                              # 稿子翻动 / 落下
pen = np.concatenate([bp(rng.standard_normal(int(0.05 * SR)), 2500, 9000) * env(int(0.05 * SR), 0.003, 0.02) * (0.5 + 0.5 * rng.random()) for _ in range(8)])
save("刷_写字", pen, 0.45)                                               # 红笔写字
t = t_(0.12); save("啵_气泡", np.sin(2 * np.pi * (500 + 900 * t / 0.12) * t) * env(len(t), 0.002, 0.04), 0.6)   # 对话气泡弹出
t = t_(0.25); save("嗡_错误", (np.sign(np.sin(2 * np.pi * 140 * t)) * 0.4 + np.sin(2 * np.pi * 147 * t)) * env(len(t), 0.003, 0.12) * 0.7, 0.5)   # 答错 / ✗
t = t_(1.6); rise = bp(rng.standard_normal(len(t)), 400, 6000) * (t / 1.6) ** 2.5 + 0.4 * np.sin(2 * np.pi * (200 + 500 * (t / 1.6) ** 2) * t) * (t / 1.6) ** 2
save("升_蓄力", rise, 0.55)                                              # 揭晓前的上扬
t = t_(0.18); save("嗒_多米诺", (lp(rng.standard_normal(len(t)), 3000) + 0.8 * np.sin(2 * np.pi * 420 * t)) * env(len(t), 0.0005, 0.03), 0.6)   # 一个个倒下
t = t_(1.2); sh = sum(np.sin(2 * np.pi * f * t) * np.exp(-t / 0.6) * 0.3 for f in (1760, 2217, 2637, 3520)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t))
save("闪_金光", sh, 0.4)                                                 # 金线 / 加号亮起
t = t_(1.4); burst = lp(rng.standard_normal(len(t)), 5000) * env(len(t), 0.001, 0.25) + np.sin(2 * np.pi * 70 * t) * env(len(t), 0.001, 0.3)
save("轰_碎裂", burst, 0.7)                                              # 推倒重来 / 崩塌
t = t_(0.2); save("滴_倒数", np.sin(2 * np.pi * 880 * t) * env(len(t), 0.002, 0.08), 0.6)   # 3、2、1
