'use client';
import { useEffect, useState } from 'react';

type Props = {
  value: number; min: number; max: number; step: number; // all in kg
  onChange: (kg: number) => void; label?: string;
};
const toG = (kg: number) => Math.round(kg * 1000);

// Weight stepper shown in grams (250 g, 500 g, 750 g, 1000 g ...). Typed values snap to the nearest valid step.
export default function Stepper({ value, min, max, step, onChange, label = 'Quantity in grams' }: Props) {
  const minG = toG(min);
  const stepG = Math.max(toG(step), 1);
  const maxG = Math.max(Math.floor(toG(max) / stepG) * stepG, minG);
  const g = toG(value);
  const [draft, setDraft] = useState<string | null>(null);
  useEffect(() => setDraft(null), [value]);

  const commit = (n: number) => onChange(Math.min(maxG, Math.max(minG, Math.round(n / stepG) * stepG)) / 1000);

  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" aria-label={`Decrease by ${stepG} grams`} onClick={() => commit(g - stepG)} disabled={g <= minG}>-</button>
      <input
        type="number" inputMode="numeric" min={minG} max={maxG} step={stepG}
        value={draft ?? g}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft === null) return;
          const n = Number(draft);
          commit(Number.isFinite(n) && n > 0 ? n : minG);
          setDraft(null);
        }}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        aria-label={label}
      />
      <span className="unit">g</span>
      <button type="button" aria-label={`Increase by ${stepG} grams`} onClick={() => commit(g + stepG)} disabled={g >= maxG}>+</button>
    </div>
  );
}
