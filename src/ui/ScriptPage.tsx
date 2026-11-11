import { useEffect, useRef } from 'react';
import { CHAPTERS, type ChapterId } from '../story/chapters';
import { PROJECTS, type ProjectId } from '../story/projects';
import { ArrowIcon } from './ArrowIcon';

export function ScriptPage({ projectId, onClose, onCutTo }: {
  projectId: ProjectId; onClose: () => void; onCutTo: (id: ChapterId) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const p = PROJECTS[projectId];
  const next = CHAPTERS.find((c) => c.id === p.next)!;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const d = ref.current!;
    if (!d.open) d.showModal();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); if (d.open) d.close(); opener?.focus(); };
  }, [onClose]);

  return (
    <dialog ref={ref} className="script" aria-labelledby="script-title" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button type="button" className="script-close" onClick={onClose}>fermer</button>
      <article className="script-page">
        <h2 id="script-title" className="script-title">{p.title.toUpperCase()}</h2>
        <p className="script-credit">{p.credit}</p>
        {p.script.map((b, i) => <p key={i} className={`script-${b.kind}`}>{b.text}</p>)}
        <button type="button" className="script-cut" onClick={() => onCutTo(p.next)}>
          COUPE FRANCHE VERS : {next.label} <ArrowIcon />
        </button>
      </article>
    </dialog>
  );
}
