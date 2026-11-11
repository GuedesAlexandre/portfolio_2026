/** Une session Kelp rejouée en boucle. Noms d'événements tirés de l'architecture de Kelp (événements de domaine). */
export const LOOP = 16;

export type KelpEvent = { t: number; name: string; detail: string };

export const EVENTS: KelpEvent[] = [
  { t: 0.4, name: 'ClusterCreated', detail: 'cluster-local' },
  { t: 0.9, name: 'ContainerCreated', detail: 'nginx' },
  { t: 1.6, name: 'ContainerCreated', detail: 'api' },
  { t: 2.3, name: 'ContainerCreated', detail: 'postgres' },
  { t: 3.4, name: 'NamespaceCreated', detail: 'ns-shop · api ↔ postgres' },
  { t: 4.8, name: 'ContainerAssignedToNamespace', detail: 'nginx → ns-shop' },
  { t: 5.6, name: 'ContainerCreated', detail: 'worker' },
  { t: 6.3, name: 'ContainerCreated', detail: 'redis' },
  { t: 7.4, name: 'NamespaceCreated', detail: 'ns-jobs · worker ↔ redis' },
  { t: 8.8, name: 'LoadBalancerCreated', detail: 'lb-front → nginx' },
  { t: 10, name: 'LoadBalancerStatusChanged', detail: 'lb-front · UP' },
];

/** Événements déjà survenus à l'instant t (la boucle repart de zéro). */
export function eventsUntil(t: number): KelpEvent[] {
  const local = ((t % LOOP) + LOOP) % LOOP;
  return EVENTS.filter((e) => e.t <= local);
}
