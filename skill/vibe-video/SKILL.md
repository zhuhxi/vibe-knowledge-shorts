---
name: vibe-video
description: 按 vibe-knowledge-shorts 仓库的流程做一条「Vibe知识大赏」风格的 1 分钟竖屏知识短片——选题核实、找形象、字幕稿+分镜、加梗、配乐小节对齐、Remotion 动画、独立审片、音效混音、封面文案。Use when the user wants to make a Vibe知识大赏-style knowledge short or invokes /vibe-video.
---

# Vibe知识大赏 短片流程

仓库：vibe-knowledge-shorts（把它 clone 到本地，下文路径都相对仓库根目录）。

## 硬要求
- **画面**：不配音，字幕就是旁白；每句 ≤16 字，句末不加标点。暗底，竖屏 1080×1920。一帧只放 1 个主角 + 1 处大字 + ≤2 处小字。
- **开头**：第一秒要有屏幕中间的大字钩子。
- **知识**：讲成 3 条层层递进的规则，落到「下次该怎么做」。
- **改动和交付**：每处改动先说清爆款是怎么做的，再动手。先做 5–10 秒的片段给用户看，别让用户久等。
- **事实**：每个上屏数字都写进 `film.md`，标明出处。

## 步骤
1. **立题 + 事实表**：见 `docs/01_选题.md`。
2. **找形象**：每个概念找一样外行认得的东西，再定一个贯穿全片的主角。
3. **字幕稿**：写在 `template/src/script.ts` 的 `LINES` 里，时间对齐 `B(k)=5.2+2.126k` 的小节网格。
4. **加梗**：照 `docs/03_笑点手册.md` 给 3–5 个梗，每个标明用的手法和对标的爆款原句。对话用 `kit.tsx` 里的 `Bubble`。
5. **画面**：写在 `template/src/Film.tsx` 里。看帧用 `./stills.sh 秒...` 出联系表。
6. **声音**：在 `audio_mix.py` 里写 `cue(时间, 音效名, dB)`。配乐放在 `music/bgm.*`。
7. **渲染**：`npx remotion render src/index.ts Film out/名字_vN.mp4`，然后跑 `loudnorm=I=-14:TP=-1.5`。
8. **独立审片**：另派一个 subagent，只看每秒一帧的联系表 + 字幕稿 + 事实表，按 9 维打分，修最差的 3 项。
9. **封面 + 文案**：见 `docs/06_发布.md`。发布之前必须等用户明确说「发」。
