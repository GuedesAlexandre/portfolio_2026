import { forwardRef, useState } from 'react';
import { AzathroScene } from '../scenes/AzathroScene';
import { KelpScene } from '../scenes/KelpScene';
import { CatalogueScene } from '../scenes/CatalogueScene';
import { GeneticScene } from '../scenes/GeneticScene';
import { PROJECTS, type Project } from '../story/projects';
import { ArrowIcon } from '../ui/ArrowIcon';

const SCENES = { kelp: KelpScene, movierecom: CatalogueScene, azathro: AzathroScene, deserts: GeneticScene };

/** Un projet = une planche : la scène occupe l'essentiel de l'écran, le texte tient dans une colonne, côté alterné. */
function ProjectBlock({ p, index }: { p: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const Scene = SCENES[p.id];
  return (
    <article id={p.id} className={`project project-${p.id}${index % 2 ? ' is-flipped' : ''}`}>
      <div className="project-painting"><Scene /></div>
      <div className="project-text">
        <p className="project-context">
          <span className="project-index">{String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}</span>
          {p.context}
        </p>
        <h3 className="project-title">{p.title}</h3>
        {p.note && <p className="margin-note project-note" aria-hidden="true">{p.note}</p>}
        <p className="project-role"><span>mon rôle</span> {p.role}</p>
        <p className="project-summary">{p.summary}</p>
        <ul className="project-stack" aria-label="stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
        <div className="project-actions">
          <button type="button" className="more" aria-expanded={open} aria-controls={`${p.id}-details`} onClick={() => setOpen((o) => !o)}>
            {open ? 'replier' : 'lire la suite'}
          </button>
          {p.repo && (
            <a className="more project-repo" href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`voir le code de ${p.title} sur GitHub`}>
              voir le code <ArrowIcon />
            </a>
          )}
        </div>
        <ul id={`${p.id}-details`} className="project-details" hidden={!open}>
          {p.details.map((d) => <li key={d}>{d}</li>)}
        </ul>
      </div>
    </article>
  );
}

export const Projects = forwardRef<HTMLElement>(function Projects(_, ref) {
  return (
    <section id="projets" className="projects" ref={ref} aria-labelledby="projets-title">
      <h2 id="projets-title" className="section-title">Projets</h2>
      {PROJECTS.map((p, i) => <ProjectBlock key={p.id} p={p} index={i} />)}
    </section>
  );
});
