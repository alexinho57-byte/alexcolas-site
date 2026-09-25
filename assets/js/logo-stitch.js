/*
 * logo-stitch.js
 * Anime une seule fois le monogramme AC de l'en-tête : une aiguille trace le A,
 * pique les points de couture de la barre, puis dessine le C.
 * - Sans son.
 * - Une seule fois par visite (sessionStorage).
 * - Désactivé si le visiteur a demandé à réduire les animations.
 * - À la fin, le logo redevient exactement le SVG d'origine.
 */
(() => {
  const svg = document.querySelector('.wordmark__mark');
  if (!svg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    if (sessionStorage.getItem('ac-stitch-played')) return;
    sessionStorage.setItem('ac-stitch-played', '1');
  } catch (e) { /* stockage bloqué : on joue quand même */ }

  const paths = svg.querySelectorAll('path');
  if (paths.length < 3 || !paths[0].getTotalLength) return;
  const [pA, pS, pC] = paths;
  const NS = 'http://www.w3.org/2000/svg';
  const LA = pA.getTotalLength();
  const LC = pC.getTotalLength();

  // Masque des points de couture + aiguille, ajoutés le temps de l'animation.
  const defs = document.createElementNS(NS, 'defs');
  const clip = document.createElementNS(NS, 'clipPath');
  clip.id = 'ac-stitch-clip';
  const rect = document.createElementNS(NS, 'rect');
  rect.setAttribute('x', '19'); rect.setAttribute('y', '29');
  rect.setAttribute('width', '0'); rect.setAttribute('height', '8');
  clip.appendChild(rect); defs.appendChild(clip); svg.prepend(defs);

  const needle = document.createElementNS(NS, 'g');
  needle.setAttribute('opacity', '0');
  const line = document.createElementNS(NS, 'line');
  line.setAttribute('stroke-width', '1.4'); line.setAttribute('stroke-linecap', 'round');
  const eye = document.createElementNS(NS, 'circle');
  eye.setAttribute('r', '1'); eye.setAttribute('fill', 'none'); eye.setAttribute('stroke-width', '.6');
  line.style.stroke = eye.style.stroke = 'var(--taupe-lo, #85705c)';
  needle.append(line, eye); svg.appendChild(needle);

  const prevOverflow = svg.style.overflow;
  svg.style.overflow = 'visible';
  pA.style.strokeDasharray = LA; pA.style.strokeDashoffset = LA;
  pC.style.strokeDasharray = LC; pC.style.strokeDashoffset = LC;
  pS.setAttribute('clip-path', 'url(#ac-stitch-clip)');

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const ease = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  function place(x, y, dx, dy) {
    line.setAttribute('x1', x + dx * 1.2); line.setAttribute('y1', y + dy * 1.2);
    line.setAttribute('x2', x - dx * 8);   line.setAttribute('y2', y - dy * 8);
    eye.setAttribute('cx', x - dx * 6.6);  eye.setAttribute('cy', y - dy * 6.6);
  }
  function onPath(path, L, p) {
    const l = Math.max(.7, L * p);
    const a = path.getPointAtLength(l), b = path.getPointAtLength(l - .7);
    const n = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    place(a.x, a.y, (a.x - b.x) / n, (a.y - b.y) / n);
  }

  // Une seule fonction dessine chaque image : render(t), t en secondes.
  const END = 2.9;
  function render(t) {
    const pa = ease(seg(t, .25, 1.25));
    pA.style.strokeDashoffset = LA * (1 - pa);
    const ps = seg(t, 1.3, 1.75);
    rect.setAttribute('width', (Math.min(3, Math.floor(ps * 3 + .001)) / 3) * 8);
    const pc = ease(seg(t, 1.8, 2.6));
    pC.style.strokeDashoffset = LC * (1 - pc);

    let op = 0;
    if (t >= .15 && t < 1.3) { onPath(pA, LA, pa); op = seg(t, .15, .3); }
    else if (t >= 1.3 && t < 1.8) { place(19.4 + 7.2 * ps, 32.8, 1, 0); op = 1; }
    else if (t >= 1.8 && t < END) { onPath(pC, LC, pc); op = 1 - seg(t, 2.6, END); }
    needle.setAttribute('opacity', op.toFixed(3));
  }

  function cleanUp() {
    [pA, pC].forEach(p => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
    pS.removeAttribute('clip-path');
    defs.remove(); needle.remove();
    svg.style.overflow = prevOverflow;
  }

  render(0);
  const start = performance.now();
  function frame(now) {
    const t = (now - start) / 1000;
    if (t >= END) { cleanUp(); return; }
    render(t);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
