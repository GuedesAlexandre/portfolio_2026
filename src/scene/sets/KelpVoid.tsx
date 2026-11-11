import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { mat, SET_Y } from '../n64';
import { hexLabel } from './Depths';

type Hex = { id: string; pos: THREE.Vector3 };
const START: [string, number, number, number][] = [
  ['api', 0.8, 0.9, 0], ['postgres', 3.2, 1.9, -0.6], ['worker', 5, 0.2, -0.2], ['nginx', 3.4, -1.3, 0.3], ['redis', 0.6, -1.6, 0.4],
];
const LINKS: [string, string][] = [['api', 'postgres'], ['api', 'nginx'], ['api', 'redis'], ['postgres', 'worker'], ['nginx', 'worker']];

function Cable({ a, b }: { a: THREE.Vector3; b: THREE.Vector3 }) {
  const geo = useMemo(() => {
    const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, -0.6, 0.3));
    return new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 16, 0.035, 4);
  }, [a.x, a.y, a.z, b.x, b.y, b.z]); // eslint-disable-line react-hooks/exhaustive-deps
  return <mesh geometry={geo}><meshBasicMaterial color="#7cffd9" transparent opacity={0.75} /></mesh>;
}

function Stalk({ x, z, h, phase }: { x: number; z: number; h: number; phase: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    g.current!.children.forEach((c, i) => { c.rotation.z = Math.sin(clock.elapsedTime * 0.8 + phase + i * 0.4) * 0.12 * (i / 6); });
  });
  const segs = Math.round(h / 1.1);
  return (
    <group ref={g} position={[x, -6, z]}>
      {Array.from({ length: segs }, (_, i) => (
        <group key={i} position={[Math.sin(i * 0.9 + phase) * 0.35, i * 1.1, 0]}>
          <mesh material={mat(i % 2 ? '#16624e' : '#1d7a5f')}><boxGeometry args={[0.16, 1.15, 0.16]} /></mesh>
          <mesh position={[(i % 2 ? 1 : -1) * 0.35, 0.2, 0]} rotation={[0, 0, (i % 2 ? -1 : 1) * 0.9]} material={mat('#1d7a5f')}><boxGeometry args={[0.7, 0.08, 0.3]} /></mesh>
        </group>
      ))}
    </group>
  );
}

/** Le Void de Kelp : des alvéoles reliées par des câbles. `draggable` active la mini-démo. */
export function KelpVoid({ draggable = false }: { draggable?: boolean }) {
  const [hexes, setHexes] = useState<Hex[]>(() => START.map(([id, x, y, z]) => ({ id, pos: new THREE.Vector3(x, y, z) })));
  const labels = useMemo(() => Object.fromEntries(START.map(([id]) => [id, hexLabel(id)])), []);
  const drag = useRef<{ id: string; plane: THREE.Plane } | null>(null);
  const byId = Object.fromEntries(hexes.map((h) => [h.id, h.pos]));
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.85, 0.85, 0.3, 6)), []);

  return (
    <group position={[1.6, SET_Y.kelp, 0]}>
      <ambientLight intensity={0.5} color="#2b6f8f" />
      <pointLight position={[3, 1, 3]} color="#7cffd9" intensity={10} distance={12} decay={1.5} />
      {[[-6.5, 2, 13, 0], [-4, -3, 10, 1.4], [9.5, -1, 12, 2.2], [8, -4, 9, 0.7], [-8, -6, 14, 3]].map(([x, z, h, p], i) => (
        <Stalk key={i} x={x} z={z} h={h} phase={p} />
      ))}
      {LINKS.map(([a, b]) => <Cable key={`${a}${b}`} a={byId[a]} b={byId[b]} />)}
      {hexes.map((h) => (
        <group
          key={h.id}
          position={h.pos}
          onPointerDown={draggable ? (e) => {
            e.stopPropagation();
            (e.target as Element).setPointerCapture?.(e.pointerId);
            drag.current = { id: h.id, plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), -(h.pos.z)) };
            document.body.style.cursor = 'grabbing';
          } : undefined}
          onPointerMove={draggable ? (e) => {
            if (drag.current?.id !== h.id) return;
            const hit = new THREE.Vector3();
            const local = e.ray.clone();
            local.origin.y -= SET_Y.kelp;
            local.origin.x -= 1.6;
            if (local.intersectPlane(drag.current.plane, hit)) setHexes((hs) => hs.map((x) => (x.id === h.id ? { ...x, pos: hit } : x)));
          } : undefined}
          onPointerUp={draggable ? () => { drag.current = null; document.body.style.cursor = ''; } : undefined}
          onPointerOver={draggable ? () => { if (!drag.current) document.body.style.cursor = 'grab'; } : undefined}
          onPointerOut={draggable ? () => { if (!drag.current) document.body.style.cursor = ''; } : undefined}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]} material={mat('#0c3a57')}><cylinderGeometry args={[0.85, 0.85, 0.3, 6]} /></mesh>
          <lineSegments rotation={[Math.PI / 2, 0, 0]} geometry={edges}><lineBasicMaterial color="#7cffd9" /></lineSegments>
          <mesh position={[0, 0, 0.17]}><planeGeometry args={[1.2, 0.45]} /><meshBasicMaterial map={labels[h.id]} transparent /></mesh>
        </group>
      ))}
    </group>
  );
}
