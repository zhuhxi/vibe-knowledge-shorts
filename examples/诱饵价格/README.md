# 《诱饵价格》源码（竖屏 1080×1920，60 秒）

```bash
npm install
python3 audio_mix.py                  # 用 ../../sfx 的音效生成音轨；配乐放 music/bgm.*（可不放）
npx remotion studio                   # 预览
npx remotion render src/index.ts FilmR out/诱饵价格.mp4
```

| 文件 | 内容 |
|---|---|
| `src/script.ts` | 字幕稿 + 小节网格 `B(k)`（片名卡只占 1 小节，之后整体提前） |
| `src/FilmR.tsx` | 真实场景版主片：街道 → 柜台三只杯 → 书店（规则一）→ 酒窖（规则三）→ 结尾总结 + 合照彩蛋；对话气泡 `Bubble`、介绍卡 `SpecCards`、印刷版说话 `SlipTalk`、合照 `PhotoGag` |
| `src/FilmV.tsx` | 共用零件：字幕、规则栏、印章、三张订阅单、酒瓶 |
| `audio_mix.py` | 音效挂点（`cue(时间, 音效, dB)`） |
| `film.md` | 事实表：每个上屏说法的出处 |
| `demo/` | 5 个梗的动图 + 720p 完整版（只音效） |
