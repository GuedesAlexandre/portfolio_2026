import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { CONTACT } from '../story/about';
import { PROJECTS } from '../story/projects';
import '../styles/menu.css';

const ITEMS = [
  { href: '#intro', label: 'accueil', meta: 'Alexandre' },
  { href: '#manifeste', label: 'manifeste', meta: 'ce que je fais' },
  { href: '#projets', label: 'projets', meta: `${PROJECTS.length} projets` },
  { href: '#parcours', label: 'parcours', meta: 'BPCE SI · ESIEE' },
  { href: '#contact', label: 'contact', meta: 'dis bonjour' },
];
/** Ordre du document : la dernière ancre passée en haut d'écran est « ici ». */
const ANCHORS = ['intro', 'manifeste', 'projets', ...PROJECTS.map((p) => p.id), 'parcours', 'contact'];

function currentAnchor() {
  let here = ANCHORS[0];
  for (const id of ANCHORS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= innerHeight * 0.4) here = id;
  }
  return here;
}

/** Trait de plume rouge, tracé sous le mot survolé (comme la signature du loader). */
const Stroke = () => (
  <svg className="menu-stroke" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
    <path d="M3 9.5c22-3.4 47-5.2 76-4.6 31 .6 57 2.6 82 1.9 13-.4 24-1.7 36-3.6" pathLength="1" />
  </svg>
);

/** Le sommaire du carnet : papier quadrillé, marge rouge, entrées en serif, annotations à la main. */
export function Menu() {
  const [open, setOpen] = useState(false);
  const [here, setHere] = useState('intro');
  const burger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      const root = document.documentElement;
      const prev = root.style.overflow;
      root.style.overflow = 'hidden';
      panel.current?.querySelector<HTMLElement>('.menu-item a')?.focus();
      return () => { root.style.overflow = prev; };
    }
    if (wasOpen.current) burger.current?.focus();
  }, [open]);

  const show = () => { setHere(currentAnchor()); setOpen(true); };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
    if (e.key !== 'Tab' || !panel.current) return;
    const f = [...panel.current.querySelectorAll<HTMLElement>('a, button')];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href')!;
    if (!href.startsWith('#')) return;
    e.preventDefault();
    wasOpen.current = false; // le focus suit la section, pas le bouton
    setOpen(false);
    requestAnimationFrame(() => {
      const el = document.getElementById(href.slice(1));
      history.pushState(null, '', href);
      el?.scrollIntoView?.();
      if (el && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el?.focus?.({ preventScroll: true });
    });
  };

  const inProjects = PROJECTS.some((p) => p.id === here);

  return (
    <>
      <button ref={burger} type="button" className="burger" aria-label="ouvrir le menu" aria-expanded={open} aria-controls="menu" onClick={show}>
        <span /><span />
      </button>
      <div id="menu" ref={panel} className={`menu${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label="menu"
        aria-hidden={!open} inert={!open} onKeyDown={onKeyDown}>
        <div className="menu-margin" aria-hidden="true" />
        <div className="menu-head">
          <p className="menu-title" aria-hidden="true">sommaire</p>
          <button type="button" className="menu-close" aria-label="fermer le menu" onClick={() => setOpen(false)}>
            <span className="menu-close-word" aria-hidden="true">fermer</span>
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M6 7c6 5 13 12 20 19" pathLength="1" />
              <path d="M25 6c-5 6-12 13-19 20" pathLength="1" />
            </svg>
          </button>
        </div>
        <p className="menu-note" aria-hidden="true">on va où ?</p>
        <ol className="menu-list">
          {ITEMS.map((it, i) => {
            const isHere = it.href === `#${here}` || (it.href === '#projets' && inProjects);
            return (
              <li key={it.href} className="menu-item" style={{ '--i': i } as CSSProperties}>
                <a href={it.href} onClick={go} aria-current={isHere ? 'location' : undefined}>
                  <span className="menu-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="menu-label">
                    {it.label}
                    <Stroke />
                    {isHere && <span className="menu-here" aria-hidden="true">← ici</span>}
                  </span>
                  <span className="menu-leader" aria-hidden="true" />
                  <span className="menu-meta">{it.meta}</span>
                </a>
                {it.href === '#projets' && (
                  <ul className="menu-sub">
                    {PROJECTS.map((p) => (
                      <li key={p.id}>
                        <a href={`#${p.id}`} onClick={go} aria-current={p.id === here ? 'location' : undefined}>
                          {p.title}
                          {p.note && <span className="menu-sub-note" aria-hidden="true">{p.note}</span>}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
        <p className="menu-foot">
          <a className="menu-email" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          {CONTACT.links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
        </p>
      </div>
    </>
  );
}
