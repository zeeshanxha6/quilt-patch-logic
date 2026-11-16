/** mm:ss with tabular digits (always two-digit minutes). */
export function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
