// Prépare les données de la scène « Déserts médicaux » depuis le dépôt Projet_Multidisciplinaire_S2.
// Usage : node scripts/genetique-data.mjs <chemin du dépôt cloné>
import { readFileSync, writeFileSync } from 'node:fs';
const repo = process.argv[2];
const K = Math.cos((46.5 * Math.PI) / 180);
const proj = (lon, lat) => [lon * K, -lat];

const communes = readFileSync(`${repo}/assets/communes-france-metrople-2025.csv`, 'utf8').trim().split('\n').map((l) => l.split(','));
const byInsee = new Map();
const pts = [];
for (const c of communes) {
  const lat = +c[c.length - 2], lon = +c[c.length - 1];
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
  const p = proj(lon, lat);
  byInsee.set(c[0], p);
  pts.push(p);
}
const geo = JSON.parse(readFileSync(`${repo}/assets/metropole.geojson`, 'utf8')).geometry.coordinates;
const rings = geo.filter((poly) => poly[0].length >= 200).map((poly) => {
  const ring = poly[0], step = Math.max(1, Math.floor(ring.length / 900));
  return ring.filter((_, i) => i % step === 0).map(([lon, lat]) => proj(lon, lat));
});
const all = [...pts, ...rings.flat()];
const minX = Math.min(...all.map((p) => p[0])), maxX = Math.max(...all.map((p) => p[0]));
const minY = Math.min(...all.map((p) => p[1])), maxY = Math.max(...all.map((p) => p[1]));
const size = Math.max(maxX - minX, maxY - minY);
const norm = ([x, y]) => [(x - minX) / size, (y - minY) / size];
const r4 = (v) => Math.round(v * 1e4) / 1e4;

const u16 = new Uint16Array(pts.length * 2);
pts.forEach((p, i) => { const [x, y] = norm(p); u16[i * 2] = Math.round(x * 65535); u16[i * 2 + 1] = Math.round(y * 65535); });

const hospitals = readFileSync(`${repo}/best_solution.csv`, 'utf8').trim().split('\n').slice(1).map((l) => l.split(','))
  .filter((r) => r[1] === '1' && byInsee.has(r[0])).map((r) => { const [x, y] = norm(byInsee.get(r[0])); return [r4(x), r4(y), +r[2]]; });

// 10 km exprimés dans l'unité de la carte (1 degré de latitude ≈ 111 km).
const km10 = 10 / 111 / size;
writeFileSync('public/genetique/data.json', JSON.stringify({
  w: r4((maxX - minX) / size), h: r4((maxY - minY) / size), km10: r4(km10),
  outline: rings.map((r) => r.map(norm).flat().map(r4)),
  communes: Buffer.from(u16.buffer).toString('base64'),
  hospitals,
}));
console.log({ communes: pts.length, hospitals: hospitals.length, chru: hospitals.filter((h) => h[2]).length, rings: rings.length });
