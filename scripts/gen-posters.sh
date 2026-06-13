#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
cd /tmp/posters || exit 1

paths=(
 "videos/1777083129582-w8gt58-montaje-especializado.mp4"
 "videos/1777083127451-sva9bj-fabricacion-metalica.mp4"
 "videos/1777083124647-dunkjx-diseno-estructural.mp4"
 "categories/videos/comercial-ceiling-1763561202789.mp4"
 "categories/videos/1763566876543-s3nby6.mp4"
 "categories/videos/1763655398737-dsihkm.mp4"
 "categories/videos/1763655627877-ugt8zq.mp4"
 "categories/videos/1763563816699-yunj27.mp4"
 "categories/videos/1763656082765-915zik.mp4"
)

i=0
for path in "${paths[@]}"; do
  i=$((i+1))
  gsutil -q cp "gs://meisa-imagenes/$path" "v$i.mp4" </dev/null
  ffmpeg -nostdin -y -ss 00:00:01 -i "v$i.mp4" -frames:v 1 -update 1 -vf "scale=1280:-2" -q:v 5 "p$i.jpg" >/dev/null 2>&1
  if [ ! -s "p$i.jpg" ]; then
    ffmpeg -nostdin -y -i "v$i.mp4" -frames:v 1 -update 1 -vf "scale=1280:-2" -q:v 5 "p$i.jpg" >/dev/null 2>&1
  fi
  sz=$(stat -f%z "p$i.jpg" 2>/dev/null || echo 0)
  if [ "${sz:-0}" -gt 1000 ]; then
    dest="${path%.mp4}.poster.jpg"
    gsutil -q -h "Content-Type:image/jpeg" -h "Cache-Control:public, max-age=31536000" cp "p$i.jpg" "gs://meisa-imagenes/$dest" </dev/null
    echo "OK $((sz/1024))KB -> $dest"
  else
    echo "FALLO p$i size=$sz ($path)"
  fi
done
