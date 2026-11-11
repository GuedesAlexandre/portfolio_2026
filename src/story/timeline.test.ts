import { progressToState, chapterProgress } from './timeline';

describe('progressToState', () => {
  it('commence dans la chambre à 0 m', () => {
    expect(progressToState(0)).toEqual({ index: 0, id: 'chambre', depthMeters: 0, timecode: '00:00:00:00' });
  });
  it('arrive sur Kelp au début de son chapitre', () => {
    const s = progressToState(chapterProgress('kelp'));
    expect(s.id).toBe('kelp');
    expect(s.timecode).toBe('00:02:05:00');
  });
  it('finit au générique', () => {
    expect(progressToState(1).id).toBe('generique');
  });
  it('borne les valeurs hors de 0..1', () => {
    expect(progressToState(-0.3)).toEqual(progressToState(0));
    expect(progressToState(1.7)).toEqual(progressToState(1));
  });
  it('interpole la profondeur entre SBA et Kelp', () => {
    const mid = (chapterProgress('sba') + chapterProgress('kelp')) / 2;
    expect(progressToState(mid).depthMeters).toBe(80);
  });
});
