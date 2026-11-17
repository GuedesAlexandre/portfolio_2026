import { SIGNATURE } from '../loader/signature';
import { CONTACT } from '../story/about';
import { ArrowIcon } from '../ui/ArrowIcon';
import { useInView } from '../ui/useInView';

const external = (href: string) => /^https?:/.test(href);

export function Contact() {
  const [ref, seen] = useInView<SVGSVGElement>(0.6);
  return (
    <footer id="contact" className="contact">
      <h2 className="contact-title">dis bonjour</h2>
      <a className="contact-email" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      <ul className="contact-links">
        {CONTACT.links.map((l) => (
          <li key={l.label}>
            <a href={l.href} {...(external(l.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.label} <ArrowIcon /></a>
          </li>
        ))}
      </ul>
      {/* La signature du loader revient fermer le carnet. */}
      <svg ref={ref} className={`contact-sign${seen ? ' is-drawn' : ''}`} viewBox={`0 0 ${SIGNATURE.width} ${SIGNATURE.height}`} aria-hidden="true">
        {SIGNATURE.glyphs.map((d, i) => (
          <path key={i} d={d} pathLength="1" style={{ animationDelay: `${i * 0.2}s, ${SIGNATURE.glyphs.length * 0.2 + 0.1}s` }} />
        ))}
      </svg>
      <p className="contact-foot">carnet tenu en 2026</p>
    </footer>
  );
}
