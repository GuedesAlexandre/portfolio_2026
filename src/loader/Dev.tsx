/** Petit dev dessiné au trait (personnage original) : sweat à capuche, lunettes, café orange. */
export function Dev({ walking = false, className = '' }: { walking?: boolean; className?: string }) {
  return (
    <svg className={`dev${walking ? ' is-walking' : ''} ${className}`} viewBox="0 0 64 128" width="64" height="128" aria-hidden="true">
      <g fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <g className="dev-body">
          <path d="M20 41 q12 -9 24 0 l3 34 h-30 z" fill="var(--bg)" />
          <path d="M25 39 q7 6 14 0" />
          <path d="M29 47 v6 M35 47 v6" strokeWidth="1.4" />
          <path d="M20 45 q-5 9 -5 18" />
          <path d="M44 45 q6 6 5 12" />
          <rect x="44" y="56" width="9" height="10" rx="1.5" fill="var(--accent)" />
          <path d="M53 59 q4 0 3 4 q-1 2 -3 2" strokeWidth="1.6" />
          <path className="dev-steam" d="M47 52 q-2 -3 0 -5 q2 -2 0 -5 M51 52 q-2 -3 0 -5" stroke="var(--accent)" strokeWidth="1.4" />
          <circle cx="32" cy="23" r="11" fill="var(--bg)" />
          <path d="M21 21 q2 -12 11 -11 q3 -5 8 -1 q6 2 4 10 q-4 -5 -9 -4 q-6 -3 -14 6" fill="var(--ink)" strokeWidth="1.2" />
          <circle cx="28" cy="25" r="3.2" strokeWidth="1.5" />
          <circle cx="37" cy="25" r="3.2" strokeWidth="1.5" />
          <path d="M31.2 25 h2.6" strokeWidth="1.5" />
          <path d="M30 31 q2.5 1.5 5 0" strokeWidth="1.4" />
        </g>
        <g className="dev-legs dev-legs-a">
          <path d="M28 75 l-3 24 l-4 12" /><path d="M21 111 h-5" />
          <path d="M37 75 l3 24 l4 11" /><path d="M44 110 h5" />
        </g>
        <g className="dev-legs dev-legs-b">
          <path d="M28 75 l1 24 l1 12" /><path d="M30 111 h-5" />
          <path d="M37 75 l-1 24 l-2 12" /><path d="M34 111 h5" />
        </g>
      </g>
    </svg>
  );
}
