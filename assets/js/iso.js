/*
 * Isometric illustrations in the style of light.inc, drawn as SVG.
 *
 *   <div class="iso" data-iso="blocks"></div>   orange blocks rising on a grid board,
 *                                                with small agents moving across it
 *   <div class="iso" data-iso="ledger"></div>   a flat ledger grid whose cells light up
 *
 * Animation runs only while the illustration is on screen, and is replaced by
 * a still frame for visitors who prefer reduced motion.
 */
window.ACADEMY_ISO = (function () {
  const NS = "http://www.w3.org/2000/svg";
  const C = {
    boardTop: "#efe9dd",
    boardLeft: "#d9d0bf",
    boardRight: "#c6bca8",
    grid: "rgba(40, 30, 10, 0.1)",
    blockTop: "#ff5a1f",
    blockLeft: "#c23a0e",
    blockRight: "#e04815",
    edge: "rgba(255, 255, 255, 0.14)",
    agent: "#ff5a1f"
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  // Grid units -> screen. Higher x + y is closer to the viewer.
  function makeProject(s) {
    return (x, y, z) => [((x - y) * s * 0.866).toFixed(2), ((x + y) * s * 0.5 - z * s).toFixed(2)];
  }
  const pts = (P, list) => list.map((p) => P(p[0], p[1], p[2]).join(",")).join(" ");

  function board(svg, P, n, t) {
    el("polygon", { points: pts(P, [[0, n, 0], [n, n, 0], [n, n, -t], [0, n, -t]]), fill: C.boardLeft }, svg);
    el("polygon", { points: pts(P, [[n, 0, 0], [n, n, 0], [n, n, -t], [n, 0, -t]]), fill: C.boardRight }, svg);
    el("polygon", { points: pts(P, [[0, 0, 0], [n, 0, 0], [n, n, 0], [0, n, 0]]), fill: C.boardTop }, svg);
    const g = el("g", { stroke: C.grid, "stroke-width": 1, fill: "none" }, svg);
    for (let i = 1; i < n; i++) {
      el("polyline", { points: pts(P, [[i, 0, 0], [i, n, 0]]) }, g);
      el("polyline", { points: pts(P, [[0, i, 0], [n, i, 0]]) }, g);
    }
  }

  function viewBox(P, n, t, maxH) {
    const c = [[0, 0, maxH], [n, 0, maxH], [0, n, maxH], [n, n, -t], [0, n, -t], [n, 0, -t], [0, 0, -t]].map((p) => P(p[0], p[1], p[2]).map(Number));
    const xs = c.map((p) => p[0]);
    const ys = c.map((p) => p[1]);
    const pad = 24;
    const minX = Math.min(...xs) - pad;
    const minY = Math.min(...ys) - pad;
    return [minX, minY, Math.max(...xs) - minX + pad, Math.max(...ys) - minY + pad].map((v) => v.toFixed(1)).join(" ");
  }

  /* ---------- Agents: small dots that travel along grid lines ---------- */
  function Agents(svg, P, n, count) {
    const layer = el("g", {}, svg);
    this.list = [];
    for (let i = 0; i < count; i++) {
      const g = el("g", {}, layer);
      const trail = el("line", { stroke: C.agent, "stroke-width": 1.6, "stroke-linecap": "round", opacity: 0.75 }, g);
      const halo = el("circle", { r: 7, fill: C.agent, opacity: 0.22 }, g);
      const dot = el("circle", { r: 2.8, fill: C.agent }, g);
      const start = [1 + ((i * 3) % (n - 2)), 1 + ((i * 5) % (n - 2))];
      this.list.push({ from: start.slice(), to: this.next(start, null, n), p: Math.random(), speed: 0.55 + i * 0.12, trail, halo, dot });
    }
    this.P = P;
    this.n = n;
  }
  Agents.prototype.next = function (at, prevDir, n) {
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter((d) => {
      const nx = at[0] + d[0];
      const ny = at[1] + d[1];
      const back = prevDir && d[0] === -prevDir[0] && d[1] === -prevDir[1];
      return nx >= 0 && ny >= 0 && nx <= n && ny <= n && !back;
    });
    const d = dirs[Math.floor(Math.random() * dirs.length)];
    return [at[0] + d[0], at[1] + d[1]];
  };
  Agents.prototype.step = function (dt) {
    const P = this.P;
    this.list.forEach((a) => {
      a.p += dt * a.speed;
      while (a.p >= 1) {
        a.p -= 1;
        const dir = [a.to[0] - a.from[0], a.to[1] - a.from[1]];
        a.from = a.to;
        a.to = this.next(a.from, dir, this.n);
      }
      const x = a.from[0] + (a.to[0] - a.from[0]) * a.p;
      const y = a.from[1] + (a.to[1] - a.from[1]) * a.p;
      const back = Math.min(a.p, 0.9);
      const tx = x - (a.to[0] - a.from[0]) * back;
      const ty = y - (a.to[1] - a.from[1]) * back;
      const h = P(x, y, 0.08);
      const t = P(tx, ty, 0.08);
      a.trail.setAttribute("x1", t[0]);
      a.trail.setAttribute("y1", t[1]);
      a.trail.setAttribute("x2", h[0]);
      a.trail.setAttribute("y2", h[1]);
      a.halo.setAttribute("cx", h[0]);
      a.halo.setAttribute("cy", h[1]);
      a.dot.setAttribute("cx", h[0]);
      a.dot.setAttribute("cy", h[1]);
    });
  };

  /* ---------- Scene: rising blocks ---------- */
  function blocksScene(svg) {
    const n = 8;
    const t = 0.55;
    const P = makeProject(30);
    const blocks = [
      { x: 1, y: 1, w: 2, d: 1, h: 1.4 },
      { x: 5.5, y: 1, w: 1.5, d: 1.5, h: 2.3 },
      { x: 3.5, y: 2, w: 2, d: 2, h: 3.4 },
      { x: 1, y: 3, w: 1, d: 2, h: 1.1 },
      { x: 5.5, y: 4, w: 1.5, d: 2, h: 2.6 },
      { x: 3, y: 5, w: 2.5, d: 1, h: 1.3 },
      { x: 1.5, y: 6, w: 1, d: 1, h: 0.8 }
    ].sort((a, b) => a.x + a.y + (a.w + a.d) / 2 - (b.x + b.y + (b.w + b.d) / 2));
    svg.setAttribute("viewBox", viewBox(P, n, t, 3.8));
    board(svg, P, n, t);
    const agents = new Agents(svg, P, n, 3);
    const layer = el("g", { stroke: C.edge, "stroke-width": 0.6, "stroke-linejoin": "round" }, svg);
    // Agents move on the board, blocks sit on top of them.
    svg.appendChild(layer);
    blocks.forEach((b) => {
      b.left = el("polygon", { fill: C.blockLeft }, layer);
      b.right = el("polygon", { fill: C.blockRight }, layer);
      b.top = el("polygon", { fill: C.blockTop }, layer);
      b.phase = Math.random() * Math.PI * 2;
    });
    function draw(time, dt) {
      blocks.forEach((b, i) => {
        const grow = Math.min(Math.max((time - 0.2 - i * 0.12) / 1.1, 0), 1);
        const eased = 1 - Math.pow(1 - grow, 3);
        const h = Math.max(0.02, b.h * eased * (1 + 0.07 * Math.sin(time * 0.9 + b.phase)));
        const { x, y, w, d } = b;
        b.left.setAttribute("points", pts(P, [[x, y + d, 0], [x + w, y + d, 0], [x + w, y + d, h], [x, y + d, h]]));
        b.right.setAttribute("points", pts(P, [[x + w, y, 0], [x + w, y + d, 0], [x + w, y + d, h], [x + w, y, h]]));
        b.top.setAttribute("points", pts(P, [[x, y, h], [x + w, y, h], [x + w, y + d, h], [x, y + d, h]]));
      });
      agents.step(dt);
    }
    return draw;
  }

  /* ---------- Scene: ledger grid with cells lighting up ---------- */
  function ledgerScene(svg) {
    const n = 10;
    const t = 0.5;
    const P = makeProject(24);
    svg.setAttribute("viewBox", viewBox(P, n, t, 0.6));
    board(svg, P, n, t);
    const layer = el("g", {}, svg);
    const cells = [];
    for (let i = 0; i < 7; i++) {
      cells.push({ poly: el("polygon", { fill: C.blockTop, opacity: 0 }, layer), born: -10, life: 2.6 + Math.random() });
    }
    const agents = new Agents(svg, P, n, 2);
    let last = 0;
    function place(c, time) {
      const x = Math.floor(Math.random() * n);
      const y = Math.floor(Math.random() * n);
      c.poly.setAttribute("points", pts(P, [[x, y, 0], [x + 1, y, 0], [x + 1, y + 1, 0], [x, y + 1, 0]]));
      c.born = time;
    }
    function draw(time, dt) {
      if (time - last > 0.55) {
        last = time;
        const free = cells.find((c) => time - c.born > c.life);
        if (free) place(free, time);
      }
      cells.forEach((c) => {
        const k = (time - c.born) / c.life;
        const o = k < 0 || k > 1 ? 0 : Math.sin(k * Math.PI) * 0.5;
        c.poly.setAttribute("opacity", o.toFixed(3));
      });
      agents.step(dt);
    }
    // A still frame shows a few lit cells.
    draw.still = (time) => {
      cells.slice(0, 4).forEach((c) => place(c, time - c.life / 2));
      draw(time, 0);
    };
    return draw;
  }

  function mount(host) {
    if (host.dataset.isoReady) return;
    host.dataset.isoReady = "1";
    const svg = el("svg", { role: "presentation", "aria-hidden": "true", preserveAspectRatio: "xMidYMid meet" });
    host.appendChild(svg);
    const draw = host.dataset.iso === "ledger" ? ledgerScene(svg) : blocksScene(svg);

    if (reduce) {
      if (draw.still) draw.still(10);
      else draw(10, 0);
      return;
    }
    let visible = false;
    let raf = 0;
    let t0 = null;
    let prev = 0;
    function frame(now) {
      if (t0 === null) t0 = now;
      const time = (now - t0) / 1000;
      draw(time, Math.min(time - prev, 0.05));
      prev = time;
      raf = visible ? requestAnimationFrame(frame) : 0;
    }
    draw(0, 0);
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !raf) {
        if (t0 !== null) t0 = performance.now() - prev * 1000;
        raf = requestAnimationFrame(frame);
      }
    }).observe(host);
  }

  document.querySelectorAll("[data-iso]").forEach(mount);
  return { mount: mount };
})();
