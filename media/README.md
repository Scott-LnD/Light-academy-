# Lesson media

Videos and demos can live inside this project and deploy to Vercel with the site.

## Folder layout

```
media/videos/<path>/<lesson>.mp4                 a normal video file
media/videos/<path>/<lesson>.jpg                 optional cover image
media/videos/<path>/<lesson>/index.m3u8 + *.ts   a long video split into small pieces
media/demos/<path>/<lesson>/index.html           an exported interactive demo
```

`<path>` is the path slug: `get-started`, `admin`, `controller`, `payables`,
`receivables`, `employee`, `finance-leader`, `go-live`, `partners`.

## Option 1: a normal .mp4 (videos up to about 100 MB)

1. Compress the video with HandBrake (preset **General > Fast 1080p30**).
2. Save it as `media/videos/get-started/how-the-ledger-works.mp4`.
3. In `assets/js/data.js`, give the lesson a `content` list:

```js
{ title: "How the ledger works", time: "15 min", content: [
    { type: "video", src: "media/videos/get-started/how-the-ledger-works.mp4", title: "How the ledger works" }
] },
```

## Option 2: split a long video into small pieces (any length)

No single file gets big, so file size limits stop mattering, and playback starts
straight away. Install ffmpeg (https://ffmpeg.org), then in the folder with your video:

```
mkdir how-the-ledger-works
ffmpeg -i how-the-ledger-works.mp4 -c:v libx264 -crf 26 -preset veryfast -c:a aac -b:a 128k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "how-the-ledger-works/seg_%03d.ts" how-the-ledger-works/index.m3u8
```

Move the whole `how-the-ledger-works` folder into `media/videos/get-started/`, then:

```js
{ title: "How the ledger works", time: "15 min", content: [
    { type: "video", src: "media/videos/get-started/how-the-ledger-works/index.m3u8", title: "How the ledger works" }
] },
```

Safari plays these natively; other browsers use hls.js (bundled in
`assets/vendor/`, loaded only on lessons that need it). `vercel.json` makes
Vercel serve the playlist and pieces with the right file types.

## Hosted media

`src` can also be a full link: an .mp4 on Cloudflare R2 or Vercel Blob, or a
YouTube, Vimeo or Loom link. Demos can be Arcade, Storylane, Navattic or
Supademo share links.

## Good to know

- Paths are written from the site root (no `../`), even for lesson pages.
- GitHub rejects single files over 100 MB; option 2 keeps every piece small.
- Every view is served from your hosting plan, so check its monthly bandwidth.
