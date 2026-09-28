# Lesson media

Put lesson files here, grouped by path slug:

```
media/videos/<path>/<lesson>.mp4        e.g. media/videos/admin/approvals.mp4
media/videos/<path>/<lesson>.jpg        optional poster image
media/demos/<path>/<lesson>/index.html  e.g. an exported interactive demo
```

Then reference them from the lesson's `content` list in `assets/js/data.js`:

```js
{ title: "Approval workflows & guardrails", time: "15–30 min", content: [
    { type: "video", src: "media/videos/admin/approvals.mp4", poster: "media/videos/admin/approvals.jpg" },
    { type: "demo", src: "media/demos/admin/approvals/index.html", title: "Build an approval rule" }
] }
```

Paths are written from the site root. Hosted media works too: `src` can be a
YouTube, Vimeo or Loom link for videos, or an Arcade, Storylane, Navattic or
Supademo share link for demos.

Keep video files small (under about 50 MB each). GitHub rejects files over
100 MB, so host longer videos on YouTube, Vimeo or Loom and link them instead.
