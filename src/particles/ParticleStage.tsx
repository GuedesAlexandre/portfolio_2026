import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { pointSeeds, sampleTargets } from './field';

type Progress = { current: Record<string, number> };
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
/** Part de scroll (en hauteurs d'écran) au-delà de laquelle les points ont disparu : on coupe le rendu. */
const GONE_AT = 0.92;

/** Moins de points sur mobile et sur les machines modestes : la forme du « a. » reste lisible. */
function pointCount(compact: boolean) {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  return compact ? 2000 : weak ? 2600 : 4200;
}

/** Cible : le logo « a. » écrit à la plume, échantillonné sur un canvas. */
function logoTargets(n: number, width: number) {
  const c = document.createElement('canvas');
  c.width = 460; c.height = 220;
  const ctx = c.getContext('2d')!;
  ctx.font = '150px "Homemade Apple"';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText('a.', 230, 120);
  return sampleTargets(ctx.getImageData(0, 0, c.width, c.height), n, width);
}

// Tout le mouvement est calculé sur le GPU : le CPU ne fait que passer le temps et l'avancement.
const vertexShader = /* glsl */ `
  uniform float uTime, uOrder, uSize, uScale;
  attribute vec4 aSeed; // rayon, angle de départ, phase, délai
  attribute vec3 color;
  varying vec3 vColor;
  void main() {
    float r = aSeed.x;
    float a = aSeed.y + uTime * (0.12 + 0.45 / r);
    vec3 chaos = vec3(
      cos(a) * r * 1.5,
      sin(a * 1.3 + aSeed.z) * r * 0.45 + sin(uTime * 0.5 + aSeed.z) * 0.2,
      sin(a) * r * 0.7 - 1.0
    );
    float raw = clamp((uOrder - aSeed.w) / (1.0 - aSeed.w), 0.0, 1.0);
    vec3 p = mix(chaos, position, raw * raw * (3.0 - 2.0 * raw));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (uScale / -mv.z);
    vColor = color;
  }
`;
const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float a = d < 0.45 ? mix(1.0, 0.9, d / 0.45) : mix(0.9, 0.0, (d - 0.45) / 0.55);
    gl_FragColor = vec4(vColor, a * uOpacity);
    #include <colorspace_fragment>
  }
`;

function Field({ compact, target, n }: { compact: boolean; target: Float32Array; n: number }) {
  const pts = useRef<THREE.Points>(null);
  const height = useThree((s) => s.size.height), dpr = useThree((s) => s.viewport.dpr);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(target, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(pointSeeds(n), 4));
    const col = new Float32Array(n * 3);
    const ink = new THREE.Color('#161513'), accent = new THREE.Color('#cf2a25');
    for (let i = 0; i < n; i++) (i % 9 === 0 ? accent : ink).toArray(col, i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, [target, n]);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader, fragmentShader, transparent: true, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uOrder: { value: 0 }, uOpacity: { value: 0.9 }, uSize: { value: 0.06 }, uScale: { value: 1 } },
  }), []);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  useEffect(() => { mat.uniforms.uScale.value = (height * dpr) / 2; }, [mat, height, dpr]);

  useFrame(({ clock }, dt) => {
    // Au scroll dans le hero, les points se rangent en « a. » ; ils s'effacent avant le manifeste.
    const s = scrollY / Math.max(1, innerHeight);
    const u = mat.uniforms, t = clock.elapsedTime;
    u.uTime.value = t;
    u.uOrder.value += (smooth((s - 0.02) / 0.4) - u.uOrder.value) * (1 - Math.exp(-Math.min(dt, 0.1) * 5));
    // Le nuage reste discret derrière le nom ; les points ne prennent leur encre qu'en formant le « a. ».
    u.uOpacity.value = 0.9 * (0.3 + 0.7 * u.uOrder.value) * (1 - smooth((s - 0.55) / 0.35));
    const p = pts.current!;
    p.rotation.y = (1 - u.uOrder.value) * Math.sin(t * 0.1) * 0.6;
    p.scale.setScalar(compact ? 0.6 : 1);
  });

  return <points ref={pts} geometry={geo} material={mat} frustumCulled={false} position={[0, compact ? 1.2 : 0.1, -1]} />;
}

/** Vrai tant que les particules sont à l'écran et l'onglet visible : sinon, plus aucune frame n'est rendue. */
function useOnStage() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    let raf = 0;
    const check = () => { raf = 0; setOn(!document.hidden && scrollY / Math.max(1, innerHeight) < GONE_AT); };
    const queue = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    document.addEventListener('visibilitychange', check);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', queue); removeEventListener('resize', queue);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);
  return on;
}

export function ParticleStage({ compact, onReady }: { progress?: Progress; compact: boolean; onReady?: () => void }) {
  const [n] = useState(() => pointCount(compact));
  const [target, setTarget] = useState<Float32Array | null>(null);
  const onStage = useOnStage();
  useEffect(() => {
    document.fonts.load('150px "Homemade Apple"').finally(() => setTarget(logoTargets(n, 9)));
  }, [n]);
  useEffect(() => { if (target) onReady?.(); }, [target, onReady]);
  return (
    <div className="particle-stage" aria-hidden="true" style={onStage ? undefined : { visibility: 'hidden' }}>
      <Canvas frameloop={onStage ? 'always' : 'never'} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 8], fov: 40 }}>
        {target && <Field compact={compact} target={target} n={n} />}
      </Canvas>
    </div>
  );
}
