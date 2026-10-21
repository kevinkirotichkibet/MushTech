'use client';

type Props = {
  value: number; min?: number; max: number; step?: number;
  onChange: (n: number) => void; label?: string;
};

export default function Stepper({ value, min = 0.5, max, step = 0.5, onChange, label = 'Quantity in kilograms' }: Props) {
  const set = (n: number) => onChange(Math.min(max, Math.max(min, Math.round(n * 100) / 100)));
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" aria-label="Decrease" onClick={() => set(value - step)} disabled={value <= min}>-</button>
      <input
        type="number" inputMode="decimal" value={value} min={min} max={max} step={step}
        onChange={(e) => set(Number(e.target.value) || min)} aria-label={label}
      />
      <span className="unit">kg</span>
      <button type="button" aria-label="Increase" onClick={() => set(value + step)} disabled={value >= max}>+</button>
    </div>
  );
}
