import { ROLE, TAGLINE } from '../story/about';

/** `revealed` : le titre apparaît quand la signature du loader s'efface. */
export function Hero({ revealed = true }: { revealed?: boolean }) {
  return (
    <section id="intro" className={`hero${revealed ? ' is-revealed' : ''}`}>
      <p className="hero-role">{ROLE}</p>
      <h1 className="hero-title">Alexandre</h1>
      <p className="hero-tagline">{TAGLINE}</p>
      <a className="hero-down" href="#projets">voir les projets</a>
      <p className="margin-note n-1" aria-hidden="true">4 projets plus bas ↓</p>
    </section>
  );
}
