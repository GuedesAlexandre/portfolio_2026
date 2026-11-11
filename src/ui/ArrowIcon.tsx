export function ArrowIcon({ size = 14, up = false }: { size?: number; up?: boolean }) {
  return (
    <svg className="arrow-icon" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={up ? 'M8 13 V3 M4 7 L8 3 L12 7' : 'M4 12 L12 4 M6 4 H12 V10'} stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
