import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { ProjectId } from '../story/projects';

const ORANGE = '#ff6a1f';
const CREAM = '#ede8df';
const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const dark = (c = '#1c1b1a', rough = 0.6) => new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: 0.2 });
const glow = (c = ORANGE, i = 2) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: 0.4 });

/** Dérive lente de la caméra : la scène respire. */
function Drift({ amp = 0.6, look = [0, 0, 0] as [number, number, number] }) {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime * 0.15;
    camera.position.x = Math.sin(t) * amp;
    camera.position.y += (Math.cos(t * 0.8) * amp * 0.4 + 0.4 - camera.position.y) * 0.02;
    camera.lookAt(...look);
  });
  return null;
}

/* ---------- Kelp : alvéoles reliées par des câbles, rubans d'algues ---------- */
const HEXES: [number, number, number][] = [[-2.6, 0.6, -1], [-0.4, 1.6, -2], [2.2, 0.9, -1.4], [1.2, -1.2, -0.6], [-1.6, -1.4, -1.6], [3.6, -0.8, -3]];
const LINKS = [[0, 1], [0, 4], [1, 2], [2, 3], [3, 4], [2, 5]];
function Kelp() {
  const g = useRef<THREE.Group>(null);
  const ribbons = useRef<THREE.Group>(null);
  const cables = useMemo(() => LINKS.map(([a, b]) => {
    const A = new THREE.Vector3(...HEXES[a]), B = new THREE.Vector3(...HEXES[b]);
    const mid = A.clone().lerp(B, 0.5).add(new THREE.Vector3(0, -0.5, 0.3));
    return new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(A, mid, B), 24, 0.03, 6);
  }), []);
  const hexMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#1a1918', roughness: 0.3, clearcoat: 1, metalness: 0.3 }), []);
  const edge = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.62, 0.62, 0.22, 6)), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    g.current!.children.forEach((h, i) => { h.position.y = HEXES[i][1] + Math.sin(t * 0.7 + i) * 0.12; h.rotation.z = Math.sin(t * 0.3 + i) * 0.15; });
    ribbons.current!.children.forEach((r, i) => { r.rotation.y = Math.sin(t * 0.5 + i) * 0.6; r.rotation.z = Math.sin(t * 0.7 + i * 2) * 0.05; });
  });
  return (
    <>
      <group ref={g}>
        {HEXES.map((p, i) => (
          <group key={i} position={p} rotation={[Math.PI / 2, 0, 0]}>
            <mesh material={hexMat}><cylinderGeometry args={[0.62, 0.62, 0.22, 6]} /></mesh>
            <lineSegments geometry={edge}><lineBasicMaterial color={ORANGE} /></lineSegments>
          </group>
        ))}
      </group>
      {cables.map((geo, i) => <mesh key={i} geometry={geo} material={glow(ORANGE, 1.6)} />)}
      <group ref={ribbons}>
        {Array.from({ length: 14 }, (_, i) => (
          <mesh key={i} position={[(rnd(i) - 0.5) * 14, -1.5, -2.5 - rnd(i + 3) * 5]} material={dark('#2a2826', 0.8)}>
            <boxGeometry args={[0.18, 6 + rnd(i + 1) * 4, 0.02]} />
          </mesh>
        ))}
      </group>
      <Drift look={[0.4, 0, -1.5]} />
    </>
  );
}

/* ---------- MovieRecom : salle de cinéma, écran qui scintille, faisceau ---------- */
function Cinema() {
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  const dust = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const a = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) { const z = rnd(i) * 9 - 3; const s = 0.2 + (z + 3) * 0.18; a.set([(rnd(i + 1) - 0.5) * s * 2, 2.6 + (rnd(i + 2) - 0.5) * s, z], i * 3); }
    g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    return g;
  }, []);
  const pts = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    screen.current!.emissiveIntensity = 0.55 + Math.sin(t * 23) * 0.04 + Math.sin(t * 7) * 0.06;
    pts.current!.rotation.z = Math.sin(t * 0.2) * 0.02;
  });
  return (
    <>
      <mesh position={[0, 1.6, -6]}><planeGeometry args={[7.5, 3.4]} /><meshStandardMaterial ref={screen} color="#8c867c" emissive="#bdb6aa" emissiveIntensity={0.6} /></mesh>
      <mesh position={[0, 2.6, 0]} rotation={[-Math.PI / 2 - 0.12, 0, 0]}>
        <coneGeometry args={[2.2, 10, 24, 1, true]} />
        <meshBasicMaterial color="#bdb6aa" transparent opacity={0.05} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <points ref={pts} geometry={dust}><pointsMaterial color={CREAM} size={0.025} transparent opacity={0.6} /></points>
      {[0, 1, 2, 3].map((row) => Array.from({ length: 9 }, (_, k) => (
        <RoundedBox key={`${row}-${k}`} args={[0.8, 0.9, 0.3]} radius={0.12} position={[(k - 4) * 0.95 + (row % 2) * 0.3, -1.6 + row * 0.25, 1.4 - row * 1.3]} material={dark(row % 2 ? '#3a1d17' : '#2b1612', 0.7)} />
      )))}
      <pointLight position={[0, 1.6, -4.5]} color="#bdb6aa" intensity={6} distance={12} />
      <Drift amp={0.35} look={[0, 0.8, -6]} />
    </>
  );
}

/* ---------- Azathro : cartes en apesanteur, l'œil au fond ---------- */
function Abyss() {
  const cards = useRef<THREE.Group>(null);
  const iris = useRef<THREE.Group>(null);
  const cardMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: CREAM, roughness: 0.5, clearcoat: 0.6 }), []);
  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    cards.current!.children.forEach((c, i) => {
      c.rotation.x = t * (0.2 + rnd(i) * 0.3) + i; c.rotation.y = t * (0.15 + rnd(i + 2) * 0.2);
      c.position.y = (rnd(i + 4) - 0.5) * 5 + Math.sin(t * 0.4 + i) * 0.4;
    });
    iris.current!.position.x += (3.2 + pointer.x * 0.6 - iris.current!.position.x) * 0.05;
    iris.current!.position.y += (2.2 + pointer.y * 0.3 - iris.current!.position.y) * 0.05;
    const blink = (t % 6) > 5.75 ? Math.sin(((t % 6) - 5.75) / 0.25 * Math.PI) : 0;
    iris.current!.scale.y = 1 - blink * 0.95;
  });
  return (
    <>
      <mesh position={[3.2, 2.2, -9]} scale={[2.4, 1.1, 0.6]} material={dark('#151413', 0.9)}><sphereGeometry args={[2, 32, 16]} /></mesh>
      <group ref={iris} position={[3.2, 2.2, -7.7]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={glow(ORANGE, 1.2)}><cylinderGeometry args={[0.9, 0.9, 0.05, 40]} /></mesh>
        <mesh position={[0, 0, 0.04]}><boxGeometry args={[0.16, 1.5, 0.02]} /><meshBasicMaterial color="#050505" /></mesh>
      </group>
      <group ref={cards}>
        {Array.from({ length: 9 }, (_, i) => (
          <group key={i} position={[(rnd(i) - 0.5) * 9, 0, -1 - rnd(i + 1) * 5]}>
            <RoundedBox args={[0.6, 0.9, 0.02]} radius={0.04} material={cardMat} />
            <mesh position={[0, 0, 0.015]} material={glow(i % 3 ? '#0b0b0c' : ORANGE, i % 3 ? 0 : 1)}><circleGeometry args={[0.12, 16]} /></mesh>
          </group>
        ))}
      </group>
      <pointLight position={[3.2, 2.2, -6]} color={ORANGE} intensity={8} distance={9} />
      <Drift amp={0.5} look={[0, 0.3, -5]} />
    </>
  );
}

/* ---------- Spring Boot Admin : ville de serveurs et tour radar ---------- */
function Watch() {
  const beam = useRef<THREE.Group>(null);
  const leds = useRef<THREE.InstancedMesh>(null);
  const racks = useMemo(() => Array.from({ length: 26 }, (_, i) => ({ x: (i % 13 - 6) * 0.95 + (rnd(i) - 0.5) * 0.2, z: -2 - Math.floor(i / 13) * 2.2 - rnd(i + 5), h: 1.5 + rnd(i + 2) * 2.6 })), []);
  const ledCount = racks.length * 6;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => [new THREE.Color(CREAM), new THREE.Color(ORANGE), new THREE.Color('#2c2a28')], []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    beam.current!.rotation.y = t * 0.8;
    let n = 0;
    racks.forEach((r, i) => {
      for (let k = 0; k < 6; k++, n++) {
        dummy.position.set(r.x + 0.28, -2 + 0.4 + k * (r.h / 6.5), r.z + 0.36);
        dummy.updateMatrix();
        leds.current!.setMatrixAt(n, dummy.matrix);
        const on = Math.sin(t * (1.5 + rnd(n)) + n) > 0.1;
        leds.current!.setColorAt(n, on ? (rnd(n * 3) > 0.9 ? colors[1] : colors[0]) : colors[2]);
      }
      void i;
    });
    leds.current!.instanceMatrix.needsUpdate = true;
    if (leds.current!.instanceColor) leds.current!.instanceColor.needsUpdate = true;
  });
  return (
    <>
      {racks.map((r, i) => (
        <RoundedBox key={i} args={[0.8, r.h, 0.7]} radius={0.05} position={[r.x, -2 + r.h / 2, r.z]} material={dark(i % 2 ? '#1f1e1d' : '#262422', 0.5)} />
      ))}
      <instancedMesh ref={leds} args={[undefined, undefined, ledCount]}><boxGeometry args={[0.06, 0.06, 0.02]} /><meshBasicMaterial toneMapped={false} /></instancedMesh>
      <group position={[-4.6, -2, -1]}>
        <mesh position={[0, 2.2, 0]} material={dark('#3d3b38', 0.4)}><cylinderGeometry args={[0.08, 0.12, 4.4, 8]} /></mesh>
        <group ref={beam} position={[0, 4.4, 0]}>
          <mesh rotation={[0, 0, -Math.PI / 2 + 0.25]} position={[3, -0.4, 0]}>
            <coneGeometry args={[0.5, 6, 24, 1, true]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh material={glow(ORANGE, 2)}><sphereGeometry args={[0.12, 16, 8]} /></mesh>
        </group>
      </group>
      <Drift amp={0.5} look={[0, -0.6, -3]} />
    </>
  );
}

const SCENES: Record<ProjectId, () => React.JSX.Element> = { kelp: Kelp, movierecom: Cinema, azathro: Abyss, sba: Watch };

/** Une scène 3D de fond ; `still` : une seule image, sans animation. */
export default function ProjectScene({ id, still }: { id: ProjectId; still: boolean }) {
  const Scene = SCENES[id];
  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} frameloop={still ? 'demand' : 'always'} camera={{ position: [0, 0.4, 6], fov: 45 }}>
      <fog attach="fog" args={['#0b0b0c', 7, 18]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={0.9} />
      <Suspense fallback={null}>
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={1.4} position={[0, 4, 3]} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={1} color={ORANGE} position={[5, -1, -2]} scale={[3, 5, 1]} />
        </Environment>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
