/*
 * In-page YouTube player for lesson videos.
 *
 * Plays YouTube videos inside the lesson box with Light Academy's own
 * controls, so learners are never sent to youtube.com:
 *  - YouTube's own controls, title, logo and "Watch on YouTube" link are
 *    hidden or covered by a click shield, so they cannot be clicked.
 *  - Our own cover shows while paused or finished, hiding YouTube's
 *    "more videos" suggestions.
 *  - Full screen enlarges this player, not YouTube's.
 *
 * The YouTube script only loads when a learner presses play.
 * Requirements on the YouTube side: the video must be Public or Unlisted,
 * with "Allow embedding" switched on (YouTube Studio > video > Details > Show more).
 */
window.ACADEMY_YT = (function () {
  const U = window.ACADEMY_UTIL;
  const esc = U.escape;
  const players = new Set();
  let apiPromise;

  // Returns the 11-character video id for any common YouTube link, or null.
  function parseId(src) {
    const m = String(src).match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  // Start time from ?t=90, ?t=1m30s or ?start=90.
  function parseStart(src) {
    const m = String(src).match(/[?&#](?:t|start)=([\dhms]+)/);
    if (!m) return 0;
    if (/^\d+$/.test(m[1])) return Number(m[1]);
    const part = (u) => Number((m[1].match(new RegExp("(\\d+)" + u)) || [0, 0])[1]);
    return part("h") * 3600 + part("m") * 60 + part("s");
  }

  function loadApi() {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (!apiPromise) {
      apiPromise = new Promise((resolve, reject) => {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function () {
          if (typeof prev === "function") prev();
          resolve(window.YT);
        };
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        s.onerror = () => {
          apiPromise = null;
          reject(new Error("YouTube could not be reached"));
        };
        document.head.appendChild(s);
      });
    }
    return apiPromise;
  }

  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = String(sec % 60).padStart(2, "0");
    return h ? h + ":" + String(m).padStart(2, "0") + ":" + s : m + ":" + s;
  }

  function markup(b, id) {
    const title = b.title || "Lesson video";
    const poster = b.poster
      ? '<img class="yt-poster" src="' + esc(b.poster) + '" alt="" />'
      : '<img class="yt-poster" src="https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg" data-fallback="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" />';
    return (
      '<div class="yt-player" tabindex="0" data-yt-id="' + id + '" data-yt-start="' + parseStart(b.src) + '" data-yt-title="' + esc(title) + '" aria-label="' + esc(title) + ' video player">' +
      '<div class="yt-stage"><div class="yt-frame"></div></div>' +
      '<div class="yt-shield" aria-hidden="true"></div>' +
      '<div class="yt-cover">' + poster +
      '<button class="yt-big-play" type="button" aria-label="Play ' + esc(title) + '">' + U.icon("play") + "</button>" +
      '<p class="yt-cover-msg" hidden></p>' +
      "</div>" +
      '<div class="yt-controls">' +
      '<button class="yt-btn yt-toggle" type="button" aria-label="Play">' + U.icon("play") + "</button>" +
      '<span class="yt-time"><span class="yt-cur">0:00</span> / <span class="yt-dur">0:00</span></span>' +
      '<input class="yt-seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek" />' +
      '<button class="yt-btn yt-mute" type="button" aria-label="Mute">' + U.icon("volume") + "</button>" +
      '<button class="yt-btn yt-speed" type="button" aria-label="Playback speed">1x</button>' +
      '<button class="yt-btn yt-full" type="button" aria-label="Full screen">' + U.icon("expand") + "</button>" +
      "</div>" +
      "</div>"
    );
  }

  function Player(el) {
    this.el = el;
    this.id = el.dataset.ytId;
    this.start = Number(el.dataset.ytStart) || 0;
    this.yt = null;
    this.ready = false;
    this.timer = null;
    this.speeds = [1, 1.25, 1.5, 2, 0.75];
    this.speedIndex = 0;
    players.add(this);
  }

  Player.prototype.q = function (sel) {
    return this.el.querySelector(sel);
  };

  Player.prototype.setState = function (state) {
    const el = this.el;
    el.dataset.state = state;
    const playing = state === "playing" || state === "buffering";
    this.q(".yt-toggle").innerHTML = U.icon(playing ? "pause" : "play");
    this.q(".yt-toggle").setAttribute("aria-label", playing ? "Pause" : "Play");
    const big = this.q(".yt-big-play");
    big.innerHTML = U.icon(state === "ended" ? "replay" : "play");
    big.setAttribute("aria-label", state === "ended" ? "Replay video" : "Play video");
  };

  Player.prototype.load = function () {
    if (this.yt || this.loading) return;
    this.loading = true;
    this.setState("loading");
    const vars = {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      start: this.start
    };
    if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
    loadApi()
      .then((YT) => {
        this.yt = new YT.Player(this.q(".yt-frame"), {
          host: "https://www.youtube-nocookie.com",
          videoId: this.id,
          playerVars: vars,
          events: {
            onReady: () => {
              this.ready = true;
              const iframe = this.el.querySelector("iframe");
              if (iframe) {
                iframe.title = this.el.dataset.ytTitle;
                iframe.setAttribute("tabindex", "-1");
                iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
              }
              this.q(".yt-dur").textContent = fmt(this.yt.getDuration());
              this.play();
            },
            onStateChange: (e) => this.onState(e.data),
            onError: (e) => this.fail(e.data)
          }
        });
      })
      .catch(() => this.fail("network"));
  };

  Player.prototype.onState = function (s) {
    // -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
    if (s === 1) {
      players.forEach((p) => p !== this && p.pause());
      this.setState("playing");
      this.q(".yt-dur").textContent = fmt(this.yt.getDuration());
      this.tick();
    } else if (s === 3) {
      this.setState("buffering");
    } else if (s === 2) {
      this.setState("paused");
      this.stopTick();
    } else if (s === 0) {
      this.setState("ended");
      this.stopTick();
      this.q(".yt-seek").value = 1000;
    }
  };

  Player.prototype.fail = function (code) {
    this.loading = false;
    this.setState("error");
    const msg = this.q(".yt-cover-msg");
    msg.hidden = false;
    msg.textContent =
      code === "network"
        ? "The video could not load. Check your connection and try again."
        : code === 101 || code === 150 || code === 153
          ? "This video can't be played here yet. In YouTube Studio, set it to Public or Unlisted and turn on “Allow embedding”."
          : "This video is unavailable. Check that the YouTube link is correct.";
    if (code === "network") this.yt = null;
  };

  Player.prototype.tick = function () {
    this.stopTick();
    const seek = this.q(".yt-seek");
    const cur = this.q(".yt-cur");
    const update = () => {
      if (!this.ready || this.seeking) return;
      const d = this.yt.getDuration() || 0;
      const t = this.yt.getCurrentTime() || 0;
      cur.textContent = fmt(t);
      seek.value = d ? Math.round((t / d) * 1000) : 0;
      seek.style.setProperty("--p", (d ? (t / d) * 100 : 0) + "%");
    };
    update();
    this.timer = setInterval(update, 250);
  };
  Player.prototype.stopTick = function () {
    clearInterval(this.timer);
  };

  Player.prototype.play = function () {
    if (!this.yt) return this.load();
    if (!this.ready) return;
    if (this.el.dataset.state === "ended") {
      this.yt.seekTo(0, true);
      this.q(".yt-cur").textContent = fmt(0);
    }
    this.yt.playVideo();
  };
  Player.prototype.pause = function () {
    if (this.ready && this.yt.getPlayerState() === 1) this.yt.pauseVideo();
  };
  Player.prototype.toggle = function () {
    const st = this.el.dataset.state;
    if (st === "playing" || st === "buffering") this.pause();
    else if (st !== "error" || !this.yt) this.play();
  };
  Player.prototype.seekBy = function (sec) {
    if (!this.ready) return;
    this.yt.seekTo(Math.max(0, this.yt.getCurrentTime() + sec), true);
  };
  Player.prototype.toggleMute = function () {
    if (!this.ready) return;
    const muted = this.yt.isMuted();
    muted ? this.yt.unMute() : this.yt.mute();
    this.q(".yt-mute").innerHTML = U.icon(muted ? "volume" : "mute");
    this.q(".yt-mute").setAttribute("aria-label", muted ? "Mute" : "Unmute");
  };
  Player.prototype.cycleSpeed = function () {
    if (!this.ready) return;
    this.speedIndex = (this.speedIndex + 1) % this.speeds.length;
    const r = this.speeds[this.speedIndex];
    this.yt.setPlaybackRate(r);
    this.q(".yt-speed").textContent = r + "x";
  };
  Player.prototype.toggleFull = function () {
    const el = this.el;
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (fsEl === el) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  function get(el) {
    if (!el._yt) el._yt = new Player(el);
    return el._yt;
  }

  // Wire up every player inside `root` using event delegation.
  function init(root) {
    root.querySelectorAll(".yt-player").forEach((el) => {
      el.dataset.state = "idle";
      const img = el.querySelector(".yt-poster[data-fallback]");
      // YouTube serves a tiny grey image when there is no HD thumbnail.
      if (img) {
        const swap = () => {
          if (img.naturalWidth && img.naturalWidth < 200) img.src = img.dataset.fallback;
        };
        img.addEventListener("load", swap);
        img.addEventListener("error", () => (img.src = img.dataset.fallback), { once: true });
        if (img.complete) swap();
      }
      const fs = document.documentElement;
      if (!fs.requestFullscreen && !fs.webkitRequestFullscreen) el.querySelector(".yt-full").hidden = true;
    });

    root.addEventListener("click", (e) => {
      const el = e.target.closest(".yt-player");
      if (!el) return;
      const p = get(el);
      if (e.target.closest(".yt-big-play, .yt-toggle")) p.toggle();
      else if (e.target.closest(".yt-shield")) p.toggle();
      else if (e.target.closest(".yt-cover") && el.dataset.state !== "error") p.toggle();
      else if (e.target.closest(".yt-mute")) p.toggleMute();
      else if (e.target.closest(".yt-speed")) p.cycleSpeed();
      else if (e.target.closest(".yt-full")) p.toggleFull();
    });
    root.addEventListener("dblclick", (e) => {
      const el = e.target.closest(".yt-player");
      if (el && e.target.closest(".yt-shield")) get(el).toggleFull();
    });

    root.addEventListener("input", (e) => {
      if (!e.target.classList.contains("yt-seek")) return;
      const p = get(e.target.closest(".yt-player"));
      if (!p.ready) return;
      p.seeking = true;
      const d = p.yt.getDuration() || 0;
      const t = (Number(e.target.value) / 1000) * d;
      e.target.style.setProperty("--p", e.target.value / 10 + "%");
      p.q(".yt-cur").textContent = fmt(t);
      p.yt.seekTo(t, true);
    });
    root.addEventListener("change", (e) => {
      if (!e.target.classList.contains("yt-seek")) return;
      get(e.target.closest(".yt-player")).seeking = false;
    });

    root.addEventListener("keydown", (e) => {
      const el = e.target.closest && e.target.closest(".yt-player");
      if (!el || e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
      const p = get(el);
      const k = e.key.toLowerCase();
      if (k === " " || k === "k") p.toggle();
      else if (k === "arrowright" || k === "l") p.seekBy(k === "l" ? 10 : 5);
      else if (k === "arrowleft" || k === "j") p.seekBy(k === "j" ? -10 : -5);
      else if (k === "m") p.toggleMute();
      else if (k === "f") p.toggleFull();
      else return;
      e.preventDefault();
    });
  }

  return { parseId: parseId, markup: markup, init: init };
})();
