import { Environment, Lightformer } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MANIFESTO } from '../story/about';
import { PROJECTS } from '../story/projects';
import { Keyboard, type Presses } from './Keyboard';
import { keyFor } from './layout';

type Progress = { current: Record<string, number> };
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
const WORDS = MANIFESTO.split(' ');
const HERO_TEXT = 'alexandre ';

/** Place le clavier et le fait taper selon la section : le prénom, le manifeste, puis le nom de chaque projet. */
function Rig({ progress, compact }: { progress: Progress; compact: boolean }) {
  const g = useRef<THREE.Group>(null);
  const presses: Presses = useRef(new Map());
  const pointer = useRef({ x: 0, y: 0 });
  const last = useRef({ hero: -1, word: -1, letter: '' });
  const target = useMemo(() => ({ pos: new THREE.Vector3(), rot: new THREE.Euler() }), []);

  useEffect(() => {
    const move = (e: PointerEvent) => { pointer.current = { x: (e.clientX / innerWidth) * 2 - 1, y: (e.clientY / innerHeight) * 2 - 1 }; };
    addEventListener('pointermove', move, { passive: true });
    return () => removeEventListener('pointermove', move);
  }, []);

  const press = (ch: string, now: number) => {
    const k = keyFor(ch);
    if (k) presses.current.set(k.id, now + 0.14);
  };

  useFrame(({ clock }, dt) => {
    const now = clock.elapsedTime;
    const m = progress.current.manifesto ?? 0;
    const p = progress.current.projects ?? 0;
    const toSide = smooth((m - 0.1) / 0.3);
    const leave = smooth((p - 0.92) / 0.08);

    // Frappe : prénom en boucle dans le hero, un mot par mot du manifeste, puis le nom de chaque projet.
    if (m < 0.12) {
      const i = Math.floor(now / 0.22) % HERO_TEXT.length;
      if (i !== last.current.hero) { last.current.hero = i; press(HERO_TEXT[i], now); }
    } else if (p <= 0) {
      const w = Math.round(clamp01((m - 0.2) / 0.5) * WORDS.length) - 1;
      if (w >= 0 && w !== last.current.word) { last.current.word = w; press(WORDS[w][0], now); }
    } else {
      const seg = clamp01(p) * PROJECTS.length;
      const proj = PROJECTS[Math.min(PROJECTS.length - 1, Math.floor(seg))];
      const typed = proj.title.slice(0, Math.floor(clamp01((seg % 1) * 2.2) * proj.title.length));
      const tag = proj.id + typed.length;
      if (typed && tag !== last.current.letter) { last.current.letter = tag; press(typed[typed.length - 1], now); }
    }

    const side = compact ? 0 : 2.35;
    const step = clamp01(p) * PROJECTS.length;
    target.pos.set(side * toSide, (compact ? 0.9 : -0.35) * (1 - toSide) + leave * 7, compact ? -2 : -1.2 * (1 - toSide));
    target.rot.set(
      0.95 - 0.25 * toSide + pointer.current.y * 0.06,
      -0.12 * (1 - toSide) - 0.5 * toSide + Math.sin(step * Math.PI) * 0.12 + pointer.current.x * 0.08,
      0.04 * (1 - toSide) + 0.12 * toSide,
    );
    const scale = compact ? 0.3 * (1 - smooth(m / 0.25)) : 0.6 - 0.28 * toSide;

    const k = 1 - Math.exp(-dt * 4);
    const grp = g.current!;
    grp.position.lerp(target.pos, k);
    grp.rotation.x += (target.rot.x - grp.rotation.x) * k;
    grp.rotation.y += (target.rot.y - grp.rotation.y) * k;
    grp.rotation.z += (target.rot.z - grp.rotation.z) * k;
    grp.scale.setScalar(grp.scale.x + (scale - grp.scale.x) * k);
  });

  return <group ref={g} scale={compact ? 0.3 : 0.6}><Keyboard presses={presses} /></group>;
}

export function KeyboardStage({ progress, compact }: { progress: Progress; compact: boolean }) {
  return (
    <div className="keyboard-stage" aria-hidden="true">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 10], fov: 32 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 8, 6]} intensity={1.4} />
        <pointLight position={[0, -1, 3]} intensity={18} color="#ff6a1f" distance={12} />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.5} position={[0, 5, 3]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[-6, 1, 2]} scale={[2, 6, 1]} />
          <Lightformer form="rect" intensity={1.6} color="#ff6a1f" position={[6, -1, -2]} scale={[3, 5, 1]} />
        </Environment>
        <Rig progress={progress} compact={compact} />
      </Canvas>
    </div>
  );
}
