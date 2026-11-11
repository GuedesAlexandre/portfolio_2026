import { useMemo, useRef } from 'react';
import type * as THREE from 'three';
import { canvasTexture, labelTexture, mat, SET_Y } from '../n64';
import type { ChapterId } from '../../story/chapters';

export const CARTRIDGES: { id: ChapterId; label: string; color: string }[] = [
  { id: 'sba', label: 'SBA', color: '#6db33f' },
  { id: 'kelp', label: 'Kelp', color: '#2ba58a' },
  { id: 'movierecom', label: 'Movie\nRecom', color: '#e8b04b' },
  { id: 'azathro', label: 'Azathro', color: '#6b4fd8' },
];

const GREY = '#3a3a40', GREY_TOP = '#46464d', HUMP = '#50505a', SLOT = '#16161a';

/** Console fidèle à la N64 (proportions, bosse et fente, sliders, 4 ports, LED) — sans logo ni nom. */
export function Console() {
  const brand = useMemo(() => labelTexture('a.', { w: 64, h: 32, bg: GREY_TOP, fg: '#8a8a92', font: '"Homemade Apple"', size: 20 }), []);
  return (
    <group>
      <mesh position={[0, 0.18, 0]} material={mat(GREY)}><boxGeometry args={[2.6, 0.36, 1.9]} /></mesh>
      <mesh position={[0, 0.41, -0.05]} material={mat(GREY_TOP)}><boxGeometry args={[2.36, 0.12, 1.66]} /></mesh>
      <mesh position={[0, 0.58, -0.2]} material={mat(HUMP)}><boxGeometry args={[1.12, 0.24, 0.92]} /></mesh>
      <mesh position={[0, 0.705, -0.22]} material={mat(SLOT)}><boxGeometry args={[0.78, 0.02, 0.14]} /></mesh>
      <mesh position={[-0.44, 0.49, 0.5]} material={mat('#2c2c31')}><boxGeometry args={[0.24, 0.05, 0.13]} /></mesh>
      <mesh position={[0.44, 0.49, 0.5]} material={mat('#2c2c31')}><boxGeometry args={[0.24, 0.05, 0.13]} /></mesh>
      <mesh position={[0, 0.475, 0.62]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.36, 0.18]} /><meshBasicMaterial map={brand} />
      </mesh>
      {[-0.51, -0.17, 0.17, 0.51].map((x) => (
        <mesh key={x} position={[x, 0.17, 0.96]} material={mat('#1b1b1f')}><boxGeometry args={[0.26, 0.16, 0.03]} /></mesh>
      ))}
      <mesh position={[1.05, 0.2, 0.96]}><boxGeometry args={[0.05, 0.05, 0.02]} /><meshBasicMaterial color="#ff3b30" /></mesh>
    </group>
  );
}

/** Manette trois branches, stick central. */
function Controller() {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} material={mat('#6e6e77')}><boxGeometry args={[1.3, 0.18, 0.55]} /></mesh>
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={x} position={[x, 0.08, 0.42]} rotation={[0.25, (i - 1) * -0.25, 0]} material={mat('#6a6a73')}><boxGeometry args={[0.3, 0.16, 0.6]} /></mesh>
      ))}
      <mesh position={[0, 0.24, 0.05]} material={mat('#8a8a92')}><cylinderGeometry args={[0.07, 0.09, 0.12, 6]} /></mesh>
      <mesh position={[0, 0.2, -0.16]} material={mat('#e5322d')}><cylinderGeometry args={[0.05, 0.05, 0.03, 6]} /></mesh>
      <mesh position={[-0.42, 0.2, -0.05]} material={mat('#2e2e33')}><boxGeometry args={[0.24, 0.03, 0.07]} /></mesh>
      <mesh position={[-0.42, 0.2, -0.05]} material={mat('#2e2e33')}><boxGeometry args={[0.07, 0.03, 0.24]} /></mesh>
      <mesh position={[0.4, 0.2, 0.06]} material={mat('#2d5bd8')}><cylinderGeometry args={[0.06, 0.06, 0.03, 6]} /></mesh>
      <mesh position={[0.3, 0.2, -0.06]} material={mat('#2fa84f')}><cylinderGeometry args={[0.06, 0.06, 0.03, 6]} /></mesh>
      {[[0.5, -0.14], [0.58, -0.06], [0.42, -0.06], [0.5, 0.02]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.2, z]} material={mat('#f2c230')}><cylinderGeometry args={[0.035, 0.035, 0.03, 6]} /></mesh>
      ))}
    </group>
  );
}

export function Cartridge({ label, color }: { label: string; color: string }) {
  const tex = useMemo(() => labelTexture(label, { w: 96, h: 96, bg: color, fg: '#141414', font: '"Homemade Apple"', size: label.includes('\n') ? 16 : 18 }), [label, color]);
  return (
    <group>
      <mesh position={[0, 0.5, 0]} material={mat('#8e8e96')}><boxGeometry args={[0.95, 1, 0.2]} /></mesh>
      {[0.88, 0.82, 0.76].map((y) => (
        <mesh key={y} position={[0, y, 0.105]} material={mat('#77777f')}><boxGeometry args={[0.8, 0.025, 0.01]} /></mesh>
      ))}
      <mesh position={[0, 0.4, 0.106]}><planeGeometry args={[0.76, 0.6]} /><meshLambertMaterial map={tex} /></mesh>
    </group>
  );
}

function Tv() {
  const screen = useMemo(() => canvasTexture(128, 96, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#8fddf5'); g.addColorStop(0.55, '#2e7fa8'); g.addColorStop(1, '#0b3352');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#0b3352'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(0, 64); for (let x = 0; x <= w; x += 16) ctx.lineTo(x, 62 + (x / 16 % 2 ? 4 : -2)); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();
    ctx.globalAlpha = 1; ctx.fillStyle = '#ede6d6'; ctx.font = 'bold 11px "Courier Prime"'; ctx.textAlign = 'center';
    ctx.fillText('PRESS START', w / 2, 44);
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let y = 0; y < h; y += 2) ctx.fillRect(0, y, w, 1);
  }), []);
  return (
    <group>
      <mesh position={[0, 0.45, 0]} material={mat('#2a2033')}><boxGeometry args={[3.8, 0.9, 2]} /></mesh>
      <mesh position={[0, 2.15, 0]} material={mat('#2b2730')}><boxGeometry args={[3.1, 2.5, 2.3]} /></mesh>
      <mesh position={[-0.25, 2.15, 1.16]}><planeGeometry args={[2.3, 1.85]} /><meshBasicMaterial map={screen} /></mesh>
      {[2.6, 2.0].map((y) => (
        <mesh key={y} position={[1.2, y, 1.16]} rotation={[Math.PI / 2, 0, 0]} material={mat('#1a171d')}><cylinderGeometry args={[0.16, 0.16, 0.06, 8]} /></mesh>
      ))}
      <pointLight position={[-0.2, 2.2, 2.6]} color="#5fb6d9" intensity={14} distance={9} decay={1.6} />
    </group>
  );
}

export function Room({ children, draggable = false }: { children?: React.ReactNode; draggable?: boolean }) {
  const consoleRef = useRef<THREE.Group>(null);
  const drag = useRef<number | null>(null);
  return (
    <group position={[0, SET_Y.chambre, 0]}>
      <ambientLight intensity={0.35} color="#6b5a7a" />
      <pointLight position={[5, 4.5, 1.5]} color="#ffb35c" intensity={18} distance={14} decay={1.5} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={mat('#2a2033')}><planeGeometry args={[30, 20]} /></mesh>
      <mesh position={[0, 5, -3.2]} material={mat('#22192d')}><planeGeometry args={[30, 12]} /></mesh>
      <group position={[-2.9, 0, -1.4]} rotation={[0, 0.18, 0]}><Tv /></group>
      <group
        ref={consoleRef}
        position={[1.9, 0, 0.9]}
        rotation={[0, -0.35, 0]}
        onPointerDown={draggable ? (e) => { e.stopPropagation(); (e.target as Element).setPointerCapture?.(e.pointerId); drag.current = e.clientX; document.body.style.cursor = 'grabbing'; } : undefined}
        onPointerMove={draggable ? (e) => {
          if (drag.current === null) return;
          consoleRef.current!.rotation.y += (e.clientX - drag.current) * 0.012;
          drag.current = e.clientX;
        } : undefined}
        onPointerUp={draggable ? () => { drag.current = null; document.body.style.cursor = ''; } : undefined}
        onPointerOver={draggable ? () => { if (drag.current === null) document.body.style.cursor = 'grab'; } : undefined}
        onPointerOut={draggable ? () => { if (drag.current === null) document.body.style.cursor = ''; } : undefined}
      ><Console /></group>
      <group position={[0.1, 0.02, 2.6]} rotation={[0, 0.3, 0]}><Controller /></group>
      {children}
    </group>
  );
}
