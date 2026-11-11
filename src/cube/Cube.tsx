import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { cubieStates, inLayer, poseAt, rotationOf, scramble, solveSequence } from './model';

/** Faces dans la palette du site : orange d'accent, crème, gris. */
const FACE_COLORS: Record<string, string> = {
  '+x': '#ff6a1f', '-x': '#ede8df', '+y': '#bdb6aa', '-y': '#3d3b38', '+z': '#d9d2c5', '-z': '#7a766f',
};
const FACES: { key: string; normal: [number, number, number]; rot: [number, number, number] }[] = [
  { key: '+x', normal: [1, 0, 0], rot: [0, Math.PI / 2, 0] },
  { key: '-x', normal: [-1, 0, 0], rot: [0, -Math.PI / 2, 0] },
  { key: '+y', normal: [0, 1, 0], rot: [-Math.PI / 2, 0, 0] },
  { key: '-y', normal: [0, -1, 0], rot: [Math.PI / 2, 0, 0] },
  { key: '+z', normal: [0, 0, 1], rot: [0, 0, 0] },
  { key: '-z', normal: [0, 0, -1], rot: [0, Math.PI, 0] },
];

function roundedSquare(size: number, r: number) {
  const s = size / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-s + r, -s);
  shape.lineTo(s - r, -s); shape.quadraticCurveTo(s, -s, s, -s + r);
  shape.lineTo(s, s - r); shape.quadraticCurveTo(s, s, s - r, s);
  shape.lineTo(-s + r, s); shape.quadraticCurveTo(-s, s, -s, s - r);
  shape.lineTo(-s, -s + r); shape.quadraticCurveTo(-s, -s, -s + r, -s);
  return new THREE.ShapeGeometry(shape, 6);
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Rubik's cube : `solve` (0 = mélangé, 1 = résolu) est lu à chaque image. */
export function Cube({ solve }: { solve: { current: number } }) {
  const { moves, states } = useMemo(() => {
    const mix = scramble(2028, 18);
    const fix = solveSequence(mix);
    return { moves: fix, states: cubieStates([...mix, ...fix]).slice(mix.length) };
  }, []);
  const sticker = useMemo(() => roundedSquare(0.8, 0.12), []);
  const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#111112', roughness: 0.35, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.2 }), []);
  const faceMats = useMemo(() => Object.fromEntries(Object.entries(FACE_COLORS).map(([k, c]) => [k, new THREE.MeshPhysicalMaterial({
    color: c, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12, emissive: k === '+x' ? c : '#000000', emissiveIntensity: k === '+x' ? 0.18 : 0, side: THREE.DoubleSide,
  })])), []);
  const refs = useRef<(THREE.Group | null)[]>([]);
  const tmp = useMemo(() => new THREE.Matrix4(), []);

  // Chaque cubie porte les stickers de ses faces extérieures à l'état résolu.
  const cubies = useMemo(() => states[states.length - 1].map((m) => {
    const p = new THREE.Vector3().setFromMatrixPosition(m);
    return FACES.filter((f) => f.normal.some((n, i) => n !== 0 && Math.round(p.getComponent(i)) === n));
  }), [states]);

  useFrame(() => {
    const { k, frac } = poseAt(moves.length, solve.current);
    const move = moves[k];
    states[k].forEach((base, i) => {
      const g = refs.current[i];
      if (!g) return;
      if (frac > 0 && move && inLayer(base, move)) tmp.multiplyMatrices(rotationOf(move, ease(frac) * Math.PI / 2), base);
      else tmp.copy(base);
      g.matrix.copy(tmp);
    });
  });

  return (
    <group>
      {cubies.map((faces, i) => (
        <group key={i} ref={(g) => { refs.current[i] = g; }} matrixAutoUpdate={false}>
          <RoundedBox args={[0.96, 0.96, 0.96]} radius={0.09} smoothness={4} material={bodyMat} />
          {faces.map((f) => (
            <mesh key={f.key} geometry={sticker} material={faceMats[f.key]} position={f.normal.map((n) => n * 0.482) as [number, number, number]} rotation={f.rot} />
          ))}
        </group>
      ))}
    </group>
  );
}
