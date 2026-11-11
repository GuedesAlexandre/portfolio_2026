import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { blend, chaosAt, sampleTargets, staggerDelays } from './field';

type Progress = { current: Record<string, number> };
const N = 4200;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };

/** Cible : le logo « a. » écrit à la plume, échantillonné sur un canvas. */
function logoTargets(width: number) {
  const c = document.createElement('canvas');
  c.width = 460; c.height = 220;
  const ctx = c.getContext('2d')!;
  ctx.font = '150px "Homemade Apple"';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText('a.', 230, 120);
  return sampleTargets(ctx.getImageData(0, 0, c.width, c.height), N, width);
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.45, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function Field({ compact, target }: { compact: boolean; target: Float32Array }) {
  const pts = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const { geo, chaos, delays } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    const col = new Float32Array(N * 3);
    const cream = new THREE.Color('#ede8df'), orange = new THREE.Color('#ff6a1f');
    for (let i = 0; i < N; i++) (i % 9 === 0 ? orange : cream).toArray(col, i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return { geo: g, chaos: new Float32Array(N * 3), delays: staggerDelays(N, 0.45) };
  }, []);
  const tex = useMemo(dotTexture, []);
  const order = useRef(0);

  useFrame(({ clock }, dt) => {
    // Au scroll dans le hero, les points se rangent en « a. » ; ils s'effacent avant le manifeste.
    const s = scrollY / Math.max(1, innerHeight);
    order.current += (smooth((s - 0.02) / 0.4) - order.current) * (1 - Math.exp(-dt * 5));
    chaosAt(N, clock.elapsedTime, chaos);
    blend(chaos, target, order.current, geo.attributes.position.array as Float32Array, delays);
    geo.attributes.position.needsUpdate = true;
    const p = pts.current!;
    p.rotation.y = (1 - order.current) * Math.sin(clock.elapsedTime * 0.1) * 0.6;
    mat.current!.opacity = 0.9 * (1 - smooth((s - 0.55) / 0.35));
    p.visible = mat.current!.opacity > 0.01;
    p.scale.setScalar(compact ? 0.6 : 1);
  });

  return (
    <points ref={pts} geometry={geo} position={[0, compact ? 1.2 : 0.1, -1]}>
      <pointsMaterial ref={mat} size={0.06} map={tex} vertexColors transparent depthWrite={false} sizeAttenuation />
    </points>
  );
}

export function ParticleStage({ compact, onReady }: { progress?: Progress; compact: boolean; onReady?: () => void }) {
  const [target, setTarget] = useState<Float32Array | null>(null);
  useEffect(() => {
    document.fonts.load('150px "Homemade Apple"').finally(() => setTarget(logoTargets(9)));
  }, []);
  useEffect(() => { if (target) onReady?.(); }, [target, onReady]);
  return (
    <div className="particle-stage" aria-hidden="true">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 8], fov: 40 }}>
        {target && <Field compact={compact} target={target} />}
      </Canvas>
    </div>
  );
}
