import { Environment, Lightformer } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Keyboard, type Presses } from './Keyboard';
import { keyFor } from './layout';

type Progress = { current: Record<string, number> };
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
const HERO_TEXT = 'alexandre ';

/** Petit clavier au fond du hero : il tape le prénom, puis disparaît. */
function Rig({ progress, compact }: { progress: Progress; compact: boolean }) {
  const g = useRef<THREE.Group>(null);
  const presses: Presses = useRef(new Map());
  const pointer = useRef({ x: 0, y: 0 });
  const last = useRef({ hero: -1 });
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
    // Le clavier n'existe qu'au début : petit, au fond, il tape le prénom, puis s'efface dès le manifeste.
    const gone = smooth((progress.current.manifesto ?? 0) / 0.22);
    const i = Math.floor(now / 0.22) % HERO_TEXT.length;
    if (gone < 1 && i !== last.current.hero) { last.current.hero = i; press(HERO_TEXT[i], now); }

    target.pos.set(0, (compact ? 0.4 : -0.9) - gone * 2.5, -4);
    target.rot.set(0.95 + pointer.current.y * 0.05, -0.18 + pointer.current.x * 0.08, 0.05);
    const scale = (compact ? 0.18 : 0.27) * (1 - gone);

    const k = 1 - Math.exp(-dt * 4);
    const grp = g.current!;
    grp.position.lerp(target.pos, k);
    grp.rotation.x += (target.rot.x - grp.rotation.x) * k;
    grp.rotation.y += (target.rot.y - grp.rotation.y) * k;
    grp.rotation.z += (target.rot.z - grp.rotation.z) * k;
    grp.scale.setScalar(grp.scale.x + (scale - grp.scale.x) * k);
    grp.visible = grp.scale.x > 0.005;
  });

  return <group ref={g} scale={compact ? 0.18 : 0.27}><Keyboard presses={presses} /></group>;
}

export function KeyboardStage({ progress, compact, onReady }: { progress: Progress; compact: boolean; onReady?: () => void }) {
  return (
    <div className="keyboard-stage" aria-hidden="true">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 10], fov: 32 }} onCreated={() => requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()))}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 8, 6]} intensity={1.4} />
        <pointLight position={[0, -1, 3]} intensity={18} color="#ff6a1f" distance={12} />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.5} position={[0, 5, 3]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[-6, 1, 2]} scale={[2, 6, 1]} />
          <Lightformer form="rect" intensity={1.6} color="#ff6a1f" position={[6, -1, -2]} scale={[3, 5, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <Rig progress={progress} compact={compact} />
        </Suspense>
      </Canvas>
    </div>
  );
}
