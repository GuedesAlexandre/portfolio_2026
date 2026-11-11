import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type * as THREE from 'three';
import { Cartridge } from './sets/Room';

/** Une cartouche : se soulève au survol, coupe franche vers son projet au clic. */
export function InteractiveCart({ label, color, onPick, onHover }: {
  label: string; color: string; onPick: () => void; onHover: (on: boolean) => void;
}) {
  const g = useRef<THREE.Group>(null);
  const [hot, setHot] = useState(false);
  useFrame((_, dt) => {
    const target = hot ? 0.35 : 0;
    g.current!.position.y += (target - g.current!.position.y) * (1 - Math.exp(-dt * 10));
  });
  return (
    <group
      ref={g}
      onPointerOver={(e) => { e.stopPropagation(); setHot(true); onHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHot(false); onHover(false); document.body.style.cursor = ''; }}
      onClick={(e) => { e.stopPropagation(); document.body.style.cursor = ''; onPick(); }}
    >
      <Cartridge label={label} color={color} />
    </group>
  );
}
