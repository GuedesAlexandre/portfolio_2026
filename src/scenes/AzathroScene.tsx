/** Fond du projet Azathro, fait avec les vrais assets du jeu : le Cthulhu en pixel art et une main de cartes. */
export const HAND = {
  cards: ['king_heart', 'king_spade', 'king_club', 'ace_spade', 'ace_heart'],
  // Valeurs réelles du Dealer d'Azathro : Full House = 40 jetons × 4.
  combo: { name: 'Full House', chips: 40, mult: 4 },
};

export function AzathroScene() {
  return (
    <div className="az" aria-hidden="true">
      <div className="az-frame">
        <img className="az-bg" src="/azathro/background.webp" alt="" loading="lazy" decoding="async" />
        <span className="az-eye" style={{ left: '41.9%' }} />
        <span className="az-eye" style={{ left: '50.5%' }} />
      </div>
      <div className="az-hand">
        {HAND.cards.map((c, i) => (
          <img key={c} className="az-card" src={`/azathro/${c}.png`} alt="" loading="lazy" decoding="async" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>
      <p className="az-score">
        <span className="az-combo">{HAND.combo.name}</span>
        <span className="az-chips">{HAND.combo.chips}</span>
        <span className="az-x">×</span>
        <span className="az-mult">{HAND.combo.mult}</span>
      </p>
    </div>
  );
}
