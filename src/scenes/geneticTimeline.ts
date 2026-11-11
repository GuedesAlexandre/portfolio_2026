/** Rythme de la scène « Déserts médicaux », calé sur la vraie config de l'algo (ga.c). */
export const LOOP = 14;
export const GENERATIONS = 1000;
const RUN = 11; // secondes pour parcourir les générations, puis la meilleure solution reste affichée

const local = (t: number) => ((t % LOOP) + LOOP) % LOOP;

export const generationAt = (t: number) => Math.floor(Math.min(1, local(t) / RUN) * GENERATIONS);

/** Décroissance linéaire de 0,30 à 0,05, comme dans main.c. */
export const mutationRateAt = (g: number) => 0.3 + (0.05 - 0.3) * (g / GENERATIONS);

/** Part de la population d'hôpitaux déjà « réglée » sur la meilleure solution : rapide au début, lente à la fin. */
export const convergenceAt = (g: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, g / GENERATIONS)), 2.2);
