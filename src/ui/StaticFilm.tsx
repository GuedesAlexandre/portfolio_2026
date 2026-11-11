import { CHAPTERS } from '../story/chapters';
import { PROJECTS, type ProjectId } from '../story/projects';
import { CONTACT, CREDITS, INTRO, INVENTORY, MANIFESTO, STACK } from '../story/about';

const PROJECT_IDS: ProjectId[] = ['sba', 'kelp', 'movierecom', 'azathro'];
const sub = (id: string) => CHAPTERS.find((c) => c.id === id)!.subtitle;

/** Le film sans 3D ni animation : même récit, mêmes ancres. */
export function StaticFilm() {
  return (
    <div className="static">
      <a href="#chambre" className="logo" aria-label="accueil">a.</a>
      <section id="chambre" className="static-shot">
        <p className="note">un film d’</p>
        <h1 className="shot-title static-hero">Alexandre</h1>
        <p>{INTRO}</p>
        <p className="static-sub">{sub('chambre')}</p>
      </section>
      <section id="surface" className="static-shot">
        <h2 className="shot-title">{MANIFESTO}</h2>
        <dl className="static-stack">{STACK.map((s) => <div key={s.part}><dt>{s.part}</dt><dd>{s.value}</dd></div>)}</dl>
        <p className="shot-tags">{INVENTORY}</p>
        <p className="static-sub">{sub('surface')}</p>
      </section>
      {PROJECT_IDS.map((id) => {
        const p = PROJECTS[id];
        return (
          <section key={id} id={id} className="static-shot">
            <h2 className="shot-title">{p.title}</h2>
            <p className="shot-tags">{p.credit} · {p.tags.join(' · ')}</p>
            <p className="static-sub">{sub(id)}</p>
            <div className="script-page">{p.script.map((b, i) => <p key={i} className={`script-${b.kind}`}>{b.text}</p>)}</div>
          </section>
        );
      })}
      <section id="generique" className="static-shot">
        <h2 className="shot-title">dis bonjour</h2>
        <p className="shot-tags">{CONTACT.email}</p>
        <ul className="static-links">{CONTACT.links.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}</ul>
        <dl className="credits">{CREDITS.map(([r, n]) => <div key={r}><dt>{r}</dt><dd>{n}</dd></div>)}</dl>
      </section>
    </div>
  );
}
