import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { canvasTexture, labelTexture, mat, SET_Y } from '../n64';

/* ---------- 02 Surface : mer low-poly, soleil, trois bouées ---------- */
export function Surface() {
  const sea = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(120, 80, 30, 20);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array), [geo]);
  useFrame(({ clock }) => {
    const p = geo.attributes.position as THREE.BufferAttribute;
    const t = clock.elapsedTime;
    for (let i = 0; i < p.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2];
      p.setY(i, Math.sin(x * 0.35 + t * 0.9) * 0.18 + Math.cos(z * 0.4 + t * 0.7) * 0.15);
    }
    p.needsUpdate = true;
    geo.computeVertexNormals();
  });
  const buoys: [string, number][] = [['#e5322d', -4.2], ['#f1e6cf', 0], ['#ffb35c', 4.2]];
  return (
    <group position={[0, SET_Y.surface, 0]}>
      <hemisphereLight args={['#fff1d6', '#1a4e6e', 1.6]} />
      <directionalLight position={[10, 8, -20]} intensity={1.6} color="#ffd29a" />
      <mesh ref={sea} geometry={geo} position={[0, 0, -20]} material={mat('#3c8db5')} />
      <mesh position={[8, 2.4, -30]} material={mat('#ff9f43', { emissive: '#ff9f43', emissiveIntensity: 0.8 })}><icosahedronGeometry args={[3.2, 0]} /></mesh>
      {buoys.map(([c, x], i) => (
        <Buoy key={x} color={c} position={[x, 0, 1.5 - i * 0.6]} phase={i} />
      ))}
    </group>
  );
}

function Buoy({ color, position, phase }: { color: string; position: [number, number, number]; phase: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    g.current!.position.y = position[1] + Math.sin(t * 1.3) * 0.12;
    g.current!.rotation.z = Math.sin(t * 1.1) * 0.12;
  });
  return (
    <group ref={g} position={position}>
      <mesh position={[0, 0.55, 0]} material={mat(color)}><coneGeometry args={[0.45, 1.1, 5]} /></mesh>
      <mesh position={[0, -0.1, 0]} material={mat('#10202b')}><cylinderGeometry args={[0.05, 0.05, 0.6, 5]} /></mesh>
    </group>
  );
}

/* ---------- 03 Spring Boot Admin : sonar vu du dessus ---------- */
const APPS: [number, number][] = [[-4.2, -2], [-2, 3.2], [3, -3.4], [5, 1.5], [-5.4, 2.2], [1, 4.2], [4.3, -0.6], [-1, -4.4]];
export function Sonar() {
  const rings = useRef<THREE.Group>(null);
  const alert = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    rings.current!.children.forEach((r, i) => {
      const k = ((t * 0.35 + i / 5) % 1);
      r.scale.setScalar(0.6 + k * 7);
      ((r as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.75 * (1 - k);
    });
    alert.current!.visible = Math.sin(t * 6) > 0;
  });
  return (
    <group position={[0, SET_Y.sba, 0]}>
      <hemisphereLight args={['#bfe3f2', '#0e2e46', 1.4]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} material={mat('#1a5a80')}><planeGeometry args={[60, 60]} /></mesh>
      <group ref={rings}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.95, 1, 48]} /><meshBasicMaterial color="#7cffd9" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
      <mesh material={mat('#f1e6cf')}><cylinderGeometry args={[0.9, 1.05, 0.6, 6]} /></mesh>
      <mesh position={[0, 0.32, 0]} material={mat('#e5322d')}><cylinderGeometry args={[0.32, 0.32, 0.08, 8]} /></mesh>
      <mesh position={[0, 0.38, 0]}><cylinderGeometry args={[0.12, 0.12, 0.06, 8]} /><meshBasicMaterial color="#7cffd9" /></mesh>
      {APPS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, i * 0.4, 0]}>
          <mesh material={mat(i === 4 ? '#3a6b1f' : '#6db33f')}><boxGeometry args={[0.8, 0.5, 0.8]} /></mesh>
          <mesh ref={i === 4 ? alert : undefined} position={[0.5, 0.3, -0.5]}><boxGeometry args={[0.18, 0.18, 0.18]} /><meshBasicMaterial color={i === 4 ? '#ffb35c' : '#7cffd9'} /></mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- 05 MovieRecom : cinéma englouti ---------- */
export function Cinema() {
  const screen = useMemo(() => canvasTexture(256, 136, (ctx, w, h) => {
    ctx.fillStyle = '#f2d49a'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,240,200,0.6)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w / 2, h * 0.55); ctx.fill();
  }), []);
  return (
    <group position={[0, SET_Y.movierecom, 0]}>
      <ambientLight intensity={0.35} color="#3d5f7a" />
      <pointLight position={[0, 3, 1.5]} color="#f2d49a" intensity={22} distance={16} decay={1.4} />
      <group position={[0, 3.1, -1]} rotation={[0, 0, -0.035]}>
        <mesh position={[0, 0, -0.08]} material={mat('#2a2418')}><boxGeometry args={[10.2, 5.6, 0.12]} /></mesh>
        <mesh><planeGeometry args={[9.4, 5]} /><meshBasicMaterial map={screen} /></mesh>
        <mesh position={[-4.2, -3.6, -0.1]} material={mat('#1c1810')}><boxGeometry args={[0.18, 2.4, 0.18]} /></mesh>
        <mesh position={[4.2, -3.6, -0.1]} material={mat('#1c1810')}><boxGeometry args={[0.18, 2.4, 0.18]} /></mesh>
      </group>
      {[0, 1, 2].map((row) => Array.from({ length: 7 }, (_, k) => (
        <group key={`${row}-${k}`} position={[(k - 3) * 1.35 + (row % 2) * 0.6, -1.6 + row * 0.35, 3 + row * 1.8]}>
          <mesh position={[0, 0.55, 0.3]} material={mat(row === 2 ? '#2a0e12' : '#6e262c')}><boxGeometry args={[1.1, 1.1, 0.25]} /></mesh>
          <mesh position={[0, 0, 0]} material={mat(row === 2 ? '#1c0a0d' : '#531c21')}><boxGeometry args={[1.1, 0.3, 0.9]} /></mesh>
        </group>
      )))}
    </group>
  );
}

/* ---------- 06 Azathro : l'œil ---------- */
export function Abyss({ pointer }: { pointer?: React.MutableRefObject<{ x: number; y: number }> }) {
  const iris = useRef<THREE.Group>(null);
  const pts = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const a = new Float32Array(600);
    for (let i = 0; i < 600; i += 3) { a[i] = (Math.random() - 0.5) * 22; a[i + 1] = (Math.random() - 0.5) * 12; a[i + 2] = -Math.random() * 9 + 1; }
    g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    return g;
  }, []);
  useFrame(({ clock }, dt) => {
    const p = pointer?.current ?? { x: Math.sin(clock.elapsedTime * 0.3) * 0.4, y: 0 };
    const k = 1 - Math.exp(-dt * 4);
    iris.current!.position.x += (p.x * 1.4 - iris.current!.position.x) * k;
    iris.current!.position.y += (p.y * 0.8 - iris.current!.position.y) * k;
  });
  return (
    <group position={[0, SET_Y.azathro, 0]}>
      <ambientLight intensity={0.25} color="#2a1f4f" />
      <mesh position={[0, 0, -9]} scale={[1.9, 1, 0.6]} material={mat('#120c26')}><sphereGeometry args={[4, 12, 8]} /></mesh>
      <group ref={iris} position={[0, 0, -6]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[2.1, 2.1, 0.05, 14]} /><meshBasicMaterial color="#3fbf9e" /></mesh>
        <mesh position={[0, 0, 0.06]}><boxGeometry args={[0.38, 3.4, 0.02]} /><meshBasicMaterial color="#010309" /></mesh>
      </group>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 7.5, 0, -5]} rotation={[0, 0, s * 0.2]} material={mat('#2a1f4f')}>
          <tubeGeometry args={[new THREE.CatmullRomCurve3([new THREE.Vector3(0, -7, 0), new THREE.Vector3(s, -2, 0.5), new THREE.Vector3(-s, 2, 0), new THREE.Vector3(0, 7, 0.5)]), 16, 0.45, 5]} />
        </mesh>
      ))}
      <points geometry={pts}><pointsMaterial color="#7cffd9" size={0.06} transparent opacity={0.8} /></points>
    </group>
  );
}

/* ---------- 07 Générique : la cité engloutie, en deux tons ---------- */
const TOWERS: [number, number, number][] = [[-7, 3, 1.4], [-5.2, 5.5, 1.2], [-3, 2.4, 2], [-0.8, 4.6, 1.1], [1.2, 3, 1.6], [3.2, 6.2, 1], [5, 2.8, 2], [7, 4, 1.3]];
export function SunkenCity() {
  return (
    <group position={[0, SET_Y.generique - 10.5, -6]} scale={0.8}>
      {TOWERS.map(([x, h, w], i) => (
        <group key={i} position={[x, h / 2, 0]} rotation={[0, 0, (i % 3 - 1) * 0.06]}>
          <mesh><boxGeometry args={[w, h, 0.4]} /><meshBasicMaterial color="#f1e6cf" transparent opacity={0.22} /></mesh>
          <mesh position={[0, h / 2 + w * 0.35, 0]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[w * 0.7, w * 0.7, 0.4]} /><meshBasicMaterial color="#f1e6cf" transparent opacity={0.22} /></mesh>
        </group>
      ))}
    </group>
  );
}

export const hexLabel = (name: string) => labelTexture(name, { w: 128, h: 48, bg: '#0c3a57', fg: '#ede6d6', font: '"Courier Prime"', size: 18 });
