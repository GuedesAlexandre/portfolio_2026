import { useRef } from 'react';
import { Contact } from './sections/Contact';
import { Hero } from './sections/Hero';
import { Journey } from './sections/Journey';
import { Manifesto } from './sections/Manifesto';
import { Projects } from './sections/Projects';
import './styles/v3.css';

export default function App() {
  const manifesto = useRef<HTMLElement>(null);
  const projects = useRef<HTMLElement>(null);
  return (
    <>
      <header className="nav">
        <a href="#intro" className="logo" aria-label="accueil">a.</a>
        <nav aria-label="sections"><a href="#projets">projets</a><a href="#parcours">parcours</a><a href="#contact">contact</a></nav>
      </header>
      <main>
        <Hero />
        <Manifesto ref={manifesto} />
        <Projects ref={projects} />
        <Journey />
      </main>
      <Contact />
    </>
  );
}
