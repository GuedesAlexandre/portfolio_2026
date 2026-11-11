import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { CHAPTERS } from '../story/chapters';
import { GRADE, SHOTS } from './n64';

const ease = (t: number) => t * t * (3 - 2 * t);
const D = Math.PI / 180;
/** En portrait, on garde le champ horizontal du cadrage desktop (réf. 1.6) au lieu de rogner les côtés. */
const fitFov = (fov: number, aspect: number) => {
  if (aspect >= 1.6) return fov;
  const h = 2 * Math.atan(Math.tan((fov * D) / 2) * 1.6);
  return Math.min(100, (2 * Math.atan(Math.tan(h / 2) / aspect)) / D);
};
const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const colA = new THREE.Color();
const colB = new THREE.Color();

/** La caméra suit les cadrages du storyboard au rythme du scroll. */
export function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera, scene } = useThree();
  const look = useRef(new THREE.Vector3(...SHOTS.chambre.look));
  const first = useRef(true);
  scene.fog ??= new THREE.Fog(GRADE.chambre.bg, GRADE.chambre.near, GRADE.chambre.far);
  scene.background ??= new THREE.Color(GRADE.chambre.bg);

  useFrame((_, dt) => {
    const x = Math.min(1, Math.max(0, progressRef.current)) * (CHAPTERS.length - 1);
    const i = Math.min(CHAPTERS.length - 2, Math.floor(x));
    // Le plan reste posé sur 55 % du chapitre, puis la caméra plonge vers le suivant.
    const t = ease(Math.min(1, Math.max(0, (x - i - 0.55) / 0.45)));
    const a = CHAPTERS[i].id, b = CHAPTERS[i + 1].id;
    const A = SHOTS[a], B = SHOTS[b];
    tmpPos.set(...A.pos).lerp(new THREE.Vector3(...B.pos), t);
    tmpLook.set(...A.look).lerp(new THREE.Vector3(...B.look), t);
    const k = first.current ? 1 : 1 - Math.exp(-dt * 6);
    first.current = false;
    camera.position.lerp(tmpPos, k);
    look.current.lerp(tmpLook, k);
    camera.lookAt(look.current);
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov += (fitFov(A.fov + (B.fov - A.fov) * t, cam.aspect) - cam.fov) * k;
    cam.updateProjectionMatrix();

    const fog = scene.fog as THREE.Fog;
    colA.set(GRADE[a].bg); colB.set(GRADE[b].bg); colA.lerp(colB, t);
    (scene.background as THREE.Color).copy(colA);
    fog.color.copy(colA);
    fog.near = GRADE[a].near + (GRADE[b].near - GRADE[a].near) * t;
    fog.far = GRADE[a].far + (GRADE[b].far - GRADE[a].far) * t;
  });
  return null;
}
