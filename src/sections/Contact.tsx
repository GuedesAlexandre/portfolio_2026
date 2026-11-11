import { CONTACT } from '../story/about';
import { ArrowIcon } from '../ui/ArrowIcon';

export function Contact() {
  return (
    <footer id="contact" className="contact">
      <h2 className="contact-title">dis bonjour</h2>
      <p className="contact-email">{CONTACT.email}</p>
      <ul className="contact-links">
        {CONTACT.links.map((l) => <li key={l.label}><a href={l.href}>{l.label} <ArrowIcon /></a></li>)}
      </ul>
      <p className="contact-foot">Alexandre, 2026</p>
    </footer>
  );
}
