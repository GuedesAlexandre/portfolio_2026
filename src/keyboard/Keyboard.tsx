import { RoundedBox, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import fontUrl from '@fontsource/hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff?url';
import { KEYS, ROW_WIDTH, type Key, type Tone } from './layout';

const CAP: Record<Tone, string> = { base: '#232323', mod: '#3a3936', accent: '#ff6a1f' };
const LEGEND: Record<Tone, string> = { base: '#ede8df', mod: '#bdb6aa', accent: '#0b0b0c' };
const ARROWS: Record<string, number> = { '↑': 0, '→': -Math.PI / 2, '↓': Math.PI, '←': Math.PI / 2 };
const ROWS = 6;

/** Instant (en secondes d'horloge) jusqu'auquel chaque touche reste enfoncée. */
export type Presses = { current: Map<string, number> };

function Keycap({ k, presses, mats, arrow }: { k: Key; presses: Presses; mats: Record<Tone, THREE.Material>; arrow: THREE.ShapeGeometry }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }, dt) => {
    const down = (presses.current.get(k.id) ?? 0) > clock.elapsedTime;
    const target = down ? -0.16 : 0;
    g.current!.position.y += (target - g.current!.position.y) * (1 - Math.exp(-dt * 30));
  });
  const x = -ROW_WIDTH / 2 + k.x + k.w / 2;
  const z = -ROWS / 2 + k.row + 0.5;
  const small = k.label.length > 2;
  return (
    <group position={[x, 0, z]}>
      <group ref={g}>
        <RoundedBox args={[k.w - 0.1, 0.46, 0.9]} radius={0.12} smoothness={3} position={[0, 0.23, 0]} material={mats[k.tone]} />
        {k.label in ARROWS ? (
          <mesh geometry={arrow} position={[0, 0.465, 0]} rotation={[-Math.PI / 2, 0, ARROWS[k.label]]}>
            <meshBasicMaterial color={LEGEND[k.tone]} />
          </mesh>
        ) : k.label ? (
          <Text
            font={fontUrl}
            fontSize={small ? 0.15 : k.sub ? 0.2 : 0.24}
            color={LEGEND[k.tone]}
            anchorX="center"
            anchorY="middle"
            position={[0, 0.465, k.sub ? 0.14 : 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {k.label}
          </Text>
        ) : null}
        {k.sub && (
          <Text font={fontUrl} fontSize={0.17} color={LEGEND[k.tone]} anchorX="center" anchorY="middle" position={[0, 0.465, -0.16]} rotation={[-Math.PI / 2, 0, 0]}>
            {k.sub}
          </Text>
        )}
      </group>
    </group>
  );
}

/** Clavier 75 % aux couleurs du site : touches sombres, légendes crème, Échap et Entrée orange. */
export function Keyboard({ presses }: { presses: Presses }) {
  const mats = useMemo(() => Object.fromEntries((Object.keys(CAP) as Tone[]).map((t) => [t, new THREE.MeshPhysicalMaterial({
    color: CAP[t], roughness: t === 'accent' ? 0.35 : 0.5, clearcoat: 0.4, clearcoatRoughness: 0.4,
    emissive: t === 'accent' ? CAP[t] : '#000000', emissiveIntensity: t === 'accent' ? 0.25 : 0,
  })])) as unknown as Record<Tone, THREE.Material>, []);
  const caseMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#141415', roughness: 0.3, metalness: 0.4, clearcoat: 1, clearcoatRoughness: 0.15 }), []);
  const arrow = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.11); s.lineTo(0.1, -0.06); s.lineTo(-0.1, -0.06); s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);
  return (
    <group>
      <RoundedBox args={[ROW_WIDTH + 0.7, 0.55, ROWS + 0.7]} radius={0.22} smoothness={4} position={[0, -0.2, 0]} material={caseMat} />
      {KEYS.map((k) => <Keycap key={k.id} k={k} presses={presses} mats={mats} arrow={arrow} />)}
    </group>
  );
}
