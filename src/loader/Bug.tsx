/** Le bug qui détale : un petit insecte orange, pattes qui s'agitent. */
export function Bug({ className = '' }: { className?: string }) {
  return (
    <svg className={`bug ${className}`} viewBox="0 0 60 40" aria-hidden="true">
      <g stroke="#ede8df" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <g className="bug-legs-a"><path d="M20 26 l-6 8 M30 27 l-2 9 M40 26 l4 8" /></g>
        <g className="bug-legs-b"><path d="M22 26 l-3 9 M31 27 l2 9 M39 26 l7 7" /></g>
        <path d="M49 14 q6 -8 10 -6 M47 12 q2 -9 7 -10" />
      </g>
      <ellipse cx="30" cy="20" rx="17" ry="11" fill="#ff6a1f" stroke="#ede8df" strokeWidth="1.4" />
      <path d="M30 9 L30 31" stroke="#0b0b0c" strokeWidth="1.4" />
      <circle cx="23" cy="16" r="2.4" fill="#0b0b0c" /><circle cx="36" cy="22" r="2.2" fill="#0b0b0c" /><circle cx="24" cy="25" r="1.8" fill="#0b0b0c" />
      <circle cx="48" cy="18" r="6" fill="#1c1714" stroke="#ede8df" strokeWidth="1.3" />
      <circle cx="50" cy="16.5" r="1.2" fill="#ede8df" />
    </svg>
  );
}
