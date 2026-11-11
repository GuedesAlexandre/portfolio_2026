import { EVENTS, LOOP, eventsUntil } from './kelpTimeline';

const DOMAIN_EVENTS = ['ClusterCreated', 'ContainerCreated', 'NamespaceCreated', 'ContainerAssignedToNamespace', 'LoadBalancerCreated', 'LoadBalancerStatusChanged'];

it('n’utilise que de vrais événements du domaine de Kelp', () => {
  for (const e of EVENTS) expect(DOMAIN_EVENTS).toContain(e.name);
});

it('déroule les événements dans l’ordre, dans la boucle', () => {
  for (let i = 1; i < EVENTS.length; i++) expect(EVENTS[i].t).toBeGreaterThan(EVENTS[i - 1].t);
  expect(EVENTS[EVENTS.length - 1].t).toBeLessThan(LOOP);
});

it('crée un namespace seulement après le câble entre api et postgres', () => {
  const at = (t: number) => eventsUntil(t).map((e) => e.name);
  expect(at(2.5)).not.toContain('NamespaceCreated');
  expect(at(3.5)).toContain('NamespaceCreated');
});

it('repart de zéro à chaque boucle', () => {
  expect(eventsUntil(LOOP + 0.1)).toHaveLength(0);
  expect(eventsUntil(LOOP + 3.5)).toEqual(eventsUntil(3.5));
});
