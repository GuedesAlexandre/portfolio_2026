let ctx: AudioContext | null = null;

/** Clap de cinéma synthétisé (bruit bref), seulement si le son est activé. */
export function clap() {
  try {
    ctx ??= new AudioContext();
    const len = Math.floor(ctx.sampleRate * 0.08);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    src.buffer = buf;
    src.connect(gain).connect(ctx.destination);
    src.start();
  } catch { /* pas d'audio : on reste silencieux */ }
}
