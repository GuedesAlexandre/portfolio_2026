import * as THREE from 'three';

export type Axis = 'x' | 'y' | 'z';
export type Move = { axis: Axis; layer: -1 | 0 | 1; dir: 1 | -1 };

const AXES: Axis[] = ['x', 'y', 'z'];
const UNIT = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function scramble(seed: number, n: number): Move[] {
  const r = rng(seed);
  const out: Move[] = [];
  while (out.length < n) {
    const m: Move = { axis: AXES[Math.floor(r() * 3)], layer: (Math.floor(r() * 3) - 1) as Move['layer'], dir: r() < 0.5 ? 1 : -1 };
    const prev = out[out.length - 1];
    if (prev && prev.axis === m.axis && prev.layer === m.layer) continue;
    out.push(m);
  }
  return out;
}

export const solveSequence = (moves: Move[]): Move[] => [...moves].reverse().map((m) => ({ ...m, dir: (-m.dir) as Move['dir'] }));

export const inLayer = (m: THREE.Matrix4, move: Move) => {
  const p = new THREE.Vector3().setFromMatrixPosition(m);
  return Math.round(p[move.axis]) === move.layer;
};

export function rotationOf(move: Move, angle = Math.PI / 2) {
  return new THREE.Matrix4().makeRotationAxis(UNIT[move.axis], move.dir * angle);
}

export function applyMove(state: THREE.Matrix4[], move: Move): THREE.Matrix4[] {
  const R = rotationOf(move);
  return state.map((m) => {
    if (!inLayer(m, move)) return m.clone();
    const out = new THREE.Matrix4().multiplyMatrices(R, m);
    out.elements.forEach((v, i) => { out.elements[i] = Math.round(v); });
    return out;
  });
}

export const applyMoves = (state: THREE.Matrix4[], moves: Move[]) => moves.reduce(applyMove, state);

/** Les n+1 états successifs des 27 cubies (état 0 = cube résolu si `moves` est vide). */
export function cubieStates(moves: Move[]): THREE.Matrix4[][] {
  const start: THREE.Matrix4[] = [];
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) start.push(new THREE.Matrix4().makeTranslation(x, y, z));
  const states = [start];
  for (const m of moves) states.push(applyMove(states[states.length - 1], m));
  return states;
}

/** Où en est-on dans une suite de n coups pour une progression t (bornée à 0..1). */
export function poseAt(n: number, t: number): { k: number; frac: number } {
  const x = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0)) * n;
  const k = Math.min(n, Math.floor(x + 1e-9));
  return k >= n ? { k: n, frac: 0 } : { k, frac: x - k };
}
