import { forwardRef, useState } from 'react';
import { AzathroScene } from '../scenes/AzathroScene';
import { KelpScene } from '../scenes/KelpScene';
import { MovieScene } from '../scenes/MovieScene';
import { PixelScene } from '../scenes/PixelScene';
import { PROJECTS, type Project } from '../story/projects';

function ProjectBlock({ p }: { p: Project }) {
  const [open, setOpen] = useState(false);
  return (
    <article id={p.id} className={`project project-${p.id}`}>
      <div className="project-sticky">
        <div className="project-painting">{p.id === 'azathro' ? <AzathroScene /> : p.id === 'kelp' ? <KelpScene /> : p.id === 'movierecom' ? <MovieScene /> : <PixelScene id={p.id} />}</div>
        <div className="project-text">
          <p className="project-context">{p.context}</p>
          <h3 className="project-title">{p.title}</h3>
          <p className="margin-note project-note" aria-hidden="true">{p.note}</p>
          <p className="project-summary">{p.summary}</p>
          <ul className="project-stack" aria-label="stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          <button type="button" className="more" aria-expanded={open} aria-controls={`${p.id}-details`} onClick={() => setOpen((o) => !o)}>
            {open ? 'replier' : 'lire la suite'}
          </button>
          <ul id={`${p.id}-details`} className="project-details" hidden={!open}>
            {p.details.map((d) => <li key={d}>{d}</li>)}
          </ul>
          {p.showsCapture && <p className="capture-slot">[ capture à fournir ]</p>}
        </div>
      </div>
    </article>
  );
}

export const Projects = forwardRef<HTMLElement>(function Projects(_, ref) {
  return (
    <section id="projets" className="projects" ref={ref} aria-labelledby="projets-title">
      <h2 id="projets-title" className="section-title">Projets</h2>
      {PROJECTS.map((p) => <ProjectBlock key={p.id} p={p} />)}
    </section>
  );
});
