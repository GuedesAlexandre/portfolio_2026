import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { CameraRig } from './CameraRig';
import { Abyss, Cinema, Sonar, SunkenCity, Surface } from './sets/Depths';
import { KelpVoid } from './sets/KelpVoid';
import { Room } from './sets/Room';

const FONTS = ['20px "Homemade Apple"', 'bold 12px "Courier Prime"', '12px "Courier Prime"'];

/** Toute la plongée dans une seule scène ; la caméra descend de décor en décor. */
export function Stage({ progressRef, roomExtras, pointer, compact }: {
  progressRef: React.MutableRefObject<number>;
  roomExtras?: React.ReactNode;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  compact: boolean;
}) {
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    const move = (e: PointerEvent) => { pointer.current = { x: (e.clientX / innerWidth) * 2 - 1, y: -((e.clientY / innerHeight) * 2 - 1) }; };
    addEventListener('pointermove', move, { passive: true });
    return () => removeEventListener('pointermove', move);
  }, [pointer]);
  useEffect(() => {
    Promise.all(FONTS.map((f) => document.fonts.load(f))).finally(() => setFontsReady(true));
  }, []);

  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        dpr={compact ? 0.6 : 0.5}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0.4, 2.5, 8.2], fov: 42, near: 0.1, far: 120 }}
      >
        <CameraRig progressRef={progressRef} />
        {fontsReady && (
          <>
            <Room draggable={!compact}>{roomExtras}</Room>
            <Surface />
            <Sonar />
            <KelpVoid draggable={!compact} />
            <Cinema />
            <Abyss pointer={pointer} />
            <SunkenCity />
          </>
        )}
      </Canvas>
    </div>
  );
}
