import { useRef, useState } from 'react';
import type { ChapterId } from '../story/chapters';
import { CONTACT, CREDITS, INVENTORY, MANIFESTO, STACK } from '../story/about';
import { PROJECTS, type ProjectId } from '../story/projects';
import { ArrowIcon } from './ArrowIcon';

/** Ce qui est posé dans l'image de chaque plan : titres lettrés, notes du réalisateur, liens. */
export function Shots({ activeId, onOpenScript, onJump }: {
  activeId: ChapterId; onOpenScript: (id: ProjectId) => void; onJump: (id: ChapterId) => void;
}) {
  const torch = useRef<HTMLDivElement>(null);
  const [talk, setTalk] = useState(0);
  const onTorch = (e: React.PointerEvent) => {
    const r = torch.current!.getBoundingClientRect();
    torch.current!.style.setProperty('--mx', `${e.clientX - r.left}px`);
    torch.current!.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const on = (id: ChapterId) => `shot shot-${id}${activeId === id ? ' is-on' : ''}`;
  const hidden = (id: ChapterId) => activeId !== id;
  const link = (id: ProjectId) => (
    <button type="button" className="script-link" onClick={() => onOpenScript(id)}>lire le script <ArrowIcon /></button>
  );
  const tags = (id: ProjectId) => <p className="shot-tags">{PROJECTS[id].credit}<br />{PROJECTS[id].tags.join(' · ')}</p>;

  return (
    <>
      <section className={on('chambre')} aria-hidden={hidden('chambre')} inert={hidden('chambre')}>
        <div className="title-block">
          <p className="pre-title">un film d’</p>
          <h2 className="shot-title">Alexandre</h2>
          <p className="shot-lede">apprenti ingénieur logiciel · ESIEE Paris · BPCE SI</p>
          <button type="button" className="script-link" onClick={() => onJump('surface')}>plonger <ArrowIcon up={false} /></button>
        </div>
        <p className="note note-tv">la télé éclaire toute la pièce</p>
        <p className="note note-carts">clique une cartouche : coupe franche vers le projet</p>
      </section>

      <section className={on('surface')} aria-hidden={hidden('surface')} inert={hidden('surface')}>
        <h2 className="shot-title manifesto">{MANIFESTO}</h2>
        <dl className="buoys">{STACK.map((s) => <div key={s.part}><dt>{s.part}</dt><dd>{s.value}</dd></div>)}</dl>
        <p className="shot-tags inventory">{INVENTORY}</p>
      </section>

      <section className={on('sba')} aria-hidden={hidden('sba')} inert={hidden('sba')}>
        <p className="note">plongée verticale : on voit le sonar d’en haut</p>
        <div className="title-block">
          {tags('sba')}
          <h2 className="shot-title">Spring Boot Admin</h2>
        </div>
        <div className="corner-link">{link('sba')}</div>
      </section>

      <section className={on('kelp')} aria-hidden={hidden('kelp')} inert={hidden('kelp')}>
        <div className="title-block">
          <h2 className="shot-title">Kelp</h2>
          {tags('kelp')}
          {link('kelp')}
        </div>
        <p className="note">attrape une alvéole : les câbles suivent</p>
      </section>

      <section className={on('movierecom')} aria-hidden={hidden('movierecom')} inert={hidden('movierecom')}>
        <div className="projected">
          <h2 className="shot-title">MovieRecom</h2>
          <p className="projected-lede">Un « conseil du soir » : on discute avec un LLM local qui négocie avec toi le film à regarder.</p>
          <p className="shot-tags">{PROJECTS.movierecom.tags.join(' · ')}</p>
          <ol className="negotiation" aria-live="polite">
            {NEGOTIATION.slice(0, talk).map((l) => <li key={l}>{l}</li>)}
          </ol>
          <div className="projected-actions">
            {talk < NEGOTIATION.length
              ? <button type="button" className="script-link" onClick={() => setTalk((t) => t + 1)}>{talk === 0 ? 'demander un film' : 'répondre'}</button>
              : <button type="button" className="script-link" onClick={() => setTalk(0)}>rejouer</button>}
            {link('movierecom')}
          </div>
        </div>
        <p className="note">plan subjectif : on est assis au 3e rang</p>
      </section>

      <section className={on('azathro')} aria-hidden={hidden('azathro')} inert={hidden('azathro')} onPointerMove={onTorch}>
        <p className="note">l’œil suit le curseur</p>
        <div className="torch-text" ref={torch}>
          <p>Un roguelike de cartes lovecraftien,<br />codé de zéro en Java.</p>
          {link('azathro')}
        </div>
        <div className="corner-title">
          <h2 className="shot-title">Azathro</h2>
          <p className="shot-tags">{PROJECTS.azathro.tags.join(' · ')}</p>
        </div>
      </section>

      <section className={on('generique')} aria-hidden={hidden('generique')} inert={hidden('generique')}>
        <dl className="credits">{CREDITS.map(([r, n]) => <div key={r}><dt>{r}</dt><dd>{n}</dd></div>)}</dl>
        <p className="shot-title hello">dis bonjour <ArrowIcon size={44} /></p>
        <p className="shot-tags email">{CONTACT.email}</p>
        <ul className="contact-links">
          {CONTACT.links.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
          <li><button type="button" className="script-link" onClick={() => onJump('chambre')}>rembobiner <ArrowIcon up /></button></li>
        </ul>
      </section>
    </>
  );
}

const NEGOTIATION = [
  '— Un truc qui fait peur, mais pas trop ?',
  '— Un huis clos dans la neige, années 80 ?',
  '— Vendu.',
];
