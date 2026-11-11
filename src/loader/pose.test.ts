import { IDLE, runPose } from './pose';

it('fait se balancer les jambes en opposition', () => {
  for (const ph of [0, 0.7, 1.9, 3.3, 5]) {
    const p = runPose(ph);
    expect(p.thighFront + p.thighBack).toBeCloseTo(0, 6);
  }
});

it('balance les bras à l’inverse des jambes du même côté', () => {
  const p = runPose(Math.PI / 2);
  expect(Math.sign(p.armFront)).toBe(-Math.sign(p.thighFront));
});

it('garde des angles plausibles', () => {
  for (let ph = 0; ph < Math.PI * 2; ph += 0.1) {
    const p = runPose(ph);
    expect(Math.abs(p.thighFront)).toBeLessThanOrEqual(45);
    expect(p.kneeFront).toBeGreaterThanOrEqual(0);
    expect(p.kneeFront).toBeLessThanOrEqual(110);
  }
});

it('se tient droit au repos', () => {
  expect(IDLE.thighFront).toBe(0);
  expect(IDLE.lean).toBe(0);
});
