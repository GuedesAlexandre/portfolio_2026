import { Dev } from '../loader/Dev';
import { TAGLINE } from '../story/about';

export function Hero() {
  return (
    <section id="intro" className="hero">
      <p className="margin-note n-1" aria-hidden="true">kubectl apply -f ?</p>
      <p className="margin-note n-2" aria-hidden="true">@Transactional</p>
      <p className="margin-note n-3" aria-hidden="true">git push</p>
      <h1 className="hero-title">Alexandre</h1>
      <Dev className="hero-dev" />
      <p className="hero-tagline">{TAGLINE}</p>
      <a className="hero-down" href="#manifeste">voir comment</a>
    </section>
  );
}
