import { Environment, Lightformer } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Cube } from './Cube';

type Progress = { current: Record<string, number> };
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };

/** Place, oriente et résout le cube selon la progression des sections. */
function Rig({ progress, compact }: { progress: Progress; compact: boolean }) {
  const g = useRef<THREE.Group>(null);
  const solve = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const spin = useRef(0);
  const target = useMemo(() => ({ pos: new THREE.Vector3(), rot: new THREE.Euler(), scale: 1 }), []);

  useEffect(() => {
    const move = (e: PointerEvent) => { pointer.current = { x: (e.clientX / innerWidth) * 2 - 1, y: (e.clientY / innerHeight) * 2 - 1 }; };
    addEventListener('pointermove', move, { passive: true });
    return () => removeEventListener('pointermove', move);
  }, []);

  useFrame((_, dt) => {
    const m = progress.current.manifesto ?? 0;
    const p = progress.current.projects ?? 0;
    const k = 1 - Math.exp(-dt * 5);
    // Manifeste : on glisse à droite et on résout.
    const toSide = smooth((m - 0.1) / 0.3);
    solve.current += (smooth((m - 0.2) / 0.5) - solve.current) * k;
    // Projets : un quart de tour par projet, puis le cube s'en va.
    const step = clamp01((p - 0.05) / 0.85) * 3;
    const leave = smooth((p - 0.9) / 0.1);
    spin.current += dt * 0.25 * (1 - toSide);

    const side = compact ? 0 : 2.35;
    target.pos.set(side * toSide, (compact ? 1.2 : 0.42) * (1 - toSide) + leave * 7, 0);
    target.rot.set(
      0.45 + pointer.current.y * 0.15 * (1 - toSide),
      -0.6 + spin.current + pointer.current.x * 0.25 * (1 - toSide) + step * (Math.PI / 2),
      0,
    );
    target.scale = compact ? 0.5 * (1 - smooth(m / 0.25)) : 0.56 + 0.26 * toSide;

    const grp = g.current!;
    grp.position.lerp(target.pos, k);
    grp.rotation.x += (target.rot.x - grp.rotation.x) * k;
    grp.rotation.y += (target.rot.y - grp.rotation.y) * k;
    grp.scale.setScalar(grp.scale.x + (target.scale - grp.scale.x) * k);
  });

  return <group ref={g}><Cube solve={solve} /></group>;
}

export function CubeStage({ progress, compact }: { progress: Progress; compact: boolean }) {
  return (
    <div className="cube-stage" aria-hidden="true">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 10], fov: 32 }}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} />
        <pointLight position={[-4, -2, -3]} intensity={30} color="#ff6a1f" />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={1.5} position={[-5, 0, 2]} scale={[2, 6, 1]} />
          <Lightformer form="rect" intensity={2} color="#ff6a1f" position={[5, -1, -3]} scale={[3, 5, 1]} />
        </Environment>
        <Rig progress={progress} compact={compact} />
      </Canvas>
    </div>
  );
}
