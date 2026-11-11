/** Angles en degrés, personnage tourné vers la droite : positif = vers l'avant. */
export interface Pose {
  thighFront: number; thighBack: number;
  kneeFront: number; kneeBack: number;
  footFront: number; footBack: number;
  armFront: number; armBack: number;
  elbowFront: number; elbowBack: number;
  lean: number; bob: number; head: number;
}

export const IDLE: Pose = {
  thighFront: 0, thighBack: 0, kneeFront: 0, kneeBack: 0, footFront: 0, footBack: 0,
  armFront: 4, armBack: -4, elbowFront: 12, elbowBack: 10, lean: 0, bob: 0, head: 0,
};

/** Cycle de course : `phase` en radians (un cycle = 2π, deux foulées). */
export function runPose(phase: number): Pose {
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  const kneeFront = 10 + 85 * Math.max(0, c);
  const kneeBack = 10 + 85 * Math.max(0, -c);
  return {
    thighFront: 38 * s, thighBack: -38 * s,
    kneeFront, kneeBack,
    footFront: 8 - kneeFront * 0.2, footBack: 8 - kneeBack * 0.2,
    armFront: -42 * s, armBack: 42 * s,
    elbowFront: 80 - 12 * s, elbowBack: 80 + 12 * s,
    lean: 13, bob: -5 * Math.abs(c), head: -6,
  };
}
