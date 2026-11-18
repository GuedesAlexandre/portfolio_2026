// Génère les 4 chapitres projet (même gabarit keynote) dans compositions/.
// Usage : node tools/gen-chapters.mjs  (depuis annonce/). Les fichiers produits restent éditables à la main.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'compositions');
const D = 3.93; // durée d'un chapitre : deux mesures

const css = (p) => `
    #root { position: absolute; inset: 0; color: #f5f5f7; font-family: "Inter", sans-serif; overflow: hidden; }
    #${p}-eyebrow { position: absolute; left: 0; right: 0; top: 112px; text-align: center; font-weight: 700; font-size: 36px; letter-spacing: -0.01em; }
    #${p}-eyebrow span { background: linear-gradient(95deg, #ffb36b, #ff5a4e 50%, #e2337f); -webkit-background-clip: text; background-clip: text; color: transparent; }
    #${p}-head { position: absolute; left: 0; right: 0; top: 172px; text-align: center; font-weight: 900; font-size: 78px; line-height: 1.04; letter-spacing: -0.045em; white-space: nowrap; }
    #${p}-l2 { color: #86868b; }
    #${p}-card { position: absolute; left: 80px; top: 420px; width: 920px; height: 500px; border-radius: 28px; overflow: hidden; background: #0b0b0c; box-shadow: 0 0 0 1px rgb(255 255 255 / 0.1), 0 30px 90px rgb(0 0 0 / 0.8); }
    #${p}-stack { position: absolute; left: 0; right: 0; top: 958px; text-align: center; font-weight: 700; font-size: 28px; color: #6e6e73; }`;

const tlShell = (p) => `
      tl.fromTo("#${p}-eyebrow", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0);
      tl.fromTo("#${p}-l1", { y: 34, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }, 0.06);
      tl.fromTo("#${p}-l2", { y: 34, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }, 0.28);
      tl.fromTo("#${p}-card", { y: 260, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1.0, ease: "expo.out" }, 0.4);
      tl.to("#${p}-card", { scale: 1.035, duration: ${(D - 1.4).toFixed(2)}, ease: "sine.inOut" }, 1.4);
      tl.fromTo("#${p}-stack", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.9);
      tl.fromTo("#${p}-all", { opacity: 1 }, { opacity: 0, duration: 0.25, ease: "power2.in" }, ${(D - 0.3).toFixed(2)});`;

// Fond : la vraie scène du site (palette sombre du trailer), rejouée en fonction du temps.
const canvas = (p, fn, from, to) => ({
  html: `<canvas id="${p}-canvas" width="1840" height="1000"></canvas>`,
  css: `#${p}-canvas { position: absolute; left: 0; top: 0; width: 920px; height: 500px; }`,
  js: `
      var cv = document.getElementById("${p}-canvas");
      var ctx = cv.getContext("2d");
      var clock = { t: ${from} };
      function draw() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.setTransform(2, 0, 0, 2, 0, 0);
        window.Portfolio.${fn}(ctx, clock.t, 920, 500);
      }
      tl.fromTo(clock, { t: ${from} }, { t: ${to}, duration: ${D}, ease: "none", onUpdate: draw, immediateRender: false }, 0);
      draw();`,
});

const chapters = [
  { p: 'kelp', eyebrow: 'Kelp', l1: 'Kubernetes.', l2: 'Sans une ligne de YAML.', stack: 'Spring Boot · Fabric8 · WebSocket', visual: canvas('kelp', 'drawKelpDark', 2.0, 10.6) },
  { p: 'movie', eyebrow: 'MovieRecom', l1: 'Le film du soir.', l2: 'Choisi par un LLM local.', stack: 'Helidon · jOOQ · Svelte · Qwen2.5', visual: canvas('movie', 'drawCatalogueDark', 4.5, 9.6) },
  {
    p: 'azathro', eyebrow: 'Azathro', l1: 'Un roguelike.', l2: 'Recodé de zéro en Java.', stack: 'Java · sealed interfaces · records',
    // Les vrais assets du jeu et le vrai combo du Dealer (Full House = 40 × 4)
    visual: {
      html: `<div id="azathro-frame"><img id="azathro-bg" src="assets/azathro/background.webp" alt="" /><span id="azathro-eye-l" class="az-eye"></span><span id="azathro-eye-r" class="az-eye"></span></div>
        <div id="azathro-hand">
          <img id="azathro-c0" class="az-card" src="assets/azathro/king_heart.png" alt="" />
          <img id="azathro-c1" class="az-card" src="assets/azathro/king_spade.png" alt="" />
          <img id="azathro-c2" class="az-card" src="assets/azathro/king_club.png" alt="" />
          <img id="azathro-c3" class="az-card" src="assets/azathro/ace_spade.png" alt="" />
          <img id="azathro-c4" class="az-card" src="assets/azathro/ace_heart.png" alt="" />
        </div>
        <p id="azathro-score"><span class="az-combo">Full House</span><span class="az-chips">40</span><span class="az-x">×</span><span class="az-mult">4</span></p>`,
      css: `@font-face { font-family: "Pix32"; src: url("assets/azathro/pix32.woff2") format("woff2"); }
    #azathro-card { background: #0e1424; }
    #azathro-frame { position: absolute; left: 0; top: -60px; width: 920px; height: 621px; }
    #azathro-bg { width: 100%; height: 100%; display: block; image-rendering: pixelated; }
    .az-eye { position: absolute; top: 44%; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; background: radial-gradient(circle, rgb(255 236 210 / 0.95) 0 22%, rgb(232 50 47 / 0.55) 40%, transparent 70%); mix-blend-mode: screen; }
    #azathro-eye-l { left: 41.9%; } #azathro-eye-r { left: 50.5%; }
    #azathro-hand { position: absolute; left: 0; right: 0; bottom: -40px; display: flex; justify-content: center; }
    .az-card { width: 124px; height: auto; margin: 0 -8px; image-rendering: pixelated; transform-origin: 50% 120%; filter: drop-shadow(0 10px 14px rgb(0 0 0 / 0.55)); }
    #azathro-score { position: absolute; left: 0; right: 0; top: 120px; display: flex; justify-content: center; align-items: center; gap: 14px; font: 400 42px/1 "Pix32", monospace; color: #ede8df; }
    #azathro-score span { padding: 8px 18px; border: 3px solid #ede8df; }
    #azathro-score .az-combo { background: rgb(20 20 40 / 0.85); }
    #azathro-score .az-chips { background: #2f5bd8; }
    #azathro-score .az-x { border: none; padding: 0; }
    #azathro-score .az-mult { background: #e5322d; }`,
      js: `
      tl.fromTo("#azathro-frame", { scale: 1.02 }, { scale: 1.07, y: -8, duration: ${D}, ease: "sine.inOut" }, 0);
      tl.fromTo(".az-eye", { opacity: 0.3, scale: 0.9 }, { opacity: 1, scale: 1.25, duration: 0.65, ease: "sine.inOut", repeat: 4, yoyo: true }, 0);
      [0, 1, 2, 3, 4].forEach(function (i) {
        tl.fromTo("#azathro-c" + i, { y: 260, rotation: 0 }, { y: Math.abs(i - 2) * 12, rotation: (i - 2) * 6, duration: 0.5, ease: "back.out(1.4)" }, 0.8 + i * 0.08);
        tl.to("#azathro-c" + i, { y: Math.abs(i - 2) * 12 - 64, duration: 0.28, ease: "power3.out" }, 1.95 + i * 0.04);
      });
      tl.fromTo("#azathro-score", { scale: 1.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.32, ease: "power4.in" }, 2.2);
      tl.fromTo("#azathro-frame", { x: 0 }, { keyframes: [{ x: -9, duration: 0.04 }, { x: 7, duration: 0.05 }, { x: -4, duration: 0.05 }, { x: 0, duration: 0.06 }], ease: "none" }, 2.52);`,
    },
  },
  { p: 'deserts', eyebrow: 'Déserts médicaux', l1: '1 299 hôpitaux.', l2: 'Placés par un algo génétique.', stack: 'C · MLV · Python · GeoJSON', size: 68, visual: canvas('deserts', 'drawGeneticDark', 4.0, 12.2) },
];

for (const c of chapters) {
  const { p, visual } = c;
  const extra = c.size ? `\n    #${p}-head { font-size: ${c.size}px; }` : '';
  const html = `<template>
  <style>${css(p)}${extra}
    ${visual.css}
  </style>
  <div id="root" data-composition-id="${p}" data-width="1080" data-height="1080">
    <div id="${p}-all">
      <p id="${p}-eyebrow"><span>${c.eyebrow}</span></p>
      <h2 id="${p}-head"><span id="${p}-l1">${c.l1}</span><br /><span id="${p}-l2">${c.l2}</span></h2>
      <div id="${p}-card">
        ${visual.html}
      </div>
      <p id="${p}-stack">${c.stack}</p>
    </div>
  </div>
  <script>
    (function () {
      var tl = gsap.timeline({ paused: true });${visual.js}${tlShell(p)}
      window.__timelines["${p}"] = tl;
    })();
  </script>
</template>
`;
  writeFileSync(join(OUT, `${p}.html`), html);
}
console.log('chapitres générés');
