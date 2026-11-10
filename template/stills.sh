#!/bin/bash
# 快速看帧：./stills.sh 秒1 秒2 ... → out/stills/sheet.jpg（4 列联系表）
mkdir -p out/stills; rm -f out/stills/s_*.png; i=0
for s in "$@"; do i=$((i+1)); f=$(python3 -c "print(int(round($s*30)))")
  npx remotion still src/index.ts Film out/stills/s_$(printf %02d $i).png --frame=$f --scale=0.5 --log=error &
  if (( i % 4 == 0 )); then wait; fi
done; wait
ffmpeg -v error -y -pattern_type glob -i 'out/stills/s_*.png' -vf "tile=4x$(( ($#+3)/4 )):padding=6:color=0x333333" out/stills/sheet.jpg
