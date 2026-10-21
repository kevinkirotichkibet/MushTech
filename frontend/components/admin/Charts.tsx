// Small dependency-free SVG charts for the admin dashboard.
type Point = { label: string; value: number };

function niceMax(v: number) {
  const raw = Math.max(v, 1) / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw;
  return step * 4;
}

const W = 640, H = 240, PAD = { l: 44, r: 10, t: 12, b: 28 };
const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;

function Grid({ max, format }: { max: number; format: (n: number) => string }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => {
        const v = (max / 4) * i;
        const y = PAD.t + ih - (v / max) * ih;
        return (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} className="c-grid" />
            <text x={PAD.l - 8} y={y + 4} textAnchor="end" className="c-tick">{format(v)}</text>
          </g>
        );
      })}
    </>
  );
}

export function BarChart({ data, label, format = (n) => String(Math.round(n)) }: { data: Point[]; label: string; format?: (n: number) => string }) {
  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const bw = iw / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="chart">
      <Grid max={max} format={format} />
      {data.map((d, i) => {
        const h = (d.value / max) * ih;
        return (
          <rect key={i} x={PAD.l + i * bw + bw * 0.2} y={PAD.t + ih - h} width={bw * 0.6} height={Math.max(h, 0)} rx={3} className="c-bar">
            <title>{`${d.label}: ${format(d.value)}`}</title>
          </rect>
        );
      })}
      {data.map((d, i) => i % 2 === 0 && (
        <text key={i} x={PAD.l + i * bw + bw / 2} y={H - 8} textAnchor="middle" className="c-tick">{d.label}</text>
      ))}
    </svg>
  );
}

export function AreaChart({ data, label, format = (n) => String(Math.round(n)) }: { data: Point[]; label: string; format?: (n: number) => string }) {
  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const n = data.length;
  const x = (i: number) => PAD.l + (n === 1 ? iw / 2 : (i * iw) / (n - 1));
  const y = (v: number) => PAD.t + ih - (v / max) * ih;
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`).join(' ');
  const area = `${line} L${x(n - 1).toFixed(1)} ${PAD.t + ih} L${x(0).toFixed(1)} ${PAD.t + ih} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="chart">
      <Grid max={max} format={format} />
      <path d={area} className="c-area" />
      <path d={line} className="c-line" />
      {data.map((d, i) => (
        <circle key={i} cx={x(i)} cy={y(d.value)} r={3.5} className="c-dot"><title>{`${d.label}: ${format(d.value)}`}</title></circle>
      ))}
      {data.map((d, i) => i % 2 === 0 && (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="c-tick">{d.label}</text>
      ))}
    </svg>
  );
}

export type Segment = { label: string; value: number; color: string };

export function Donut({ segments, label }: { segments: Segment[]; label: string }) {
  const sum = segments.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  return (
    <svg viewBox="0 0 42 42" role="img" aria-label={label} className="donut">
      <circle cx="21" cy="21" r="15.9155" className="c-track" fill="none" strokeWidth="6" />
      {sum > 0 && segments.map((s) => {
        const pct = (s.value / sum) * 100;
        const el = pct > 0 && (
          <circle key={s.label} cx="21" cy="21" r="15.9155" fill="none" stroke={s.color} strokeWidth="6"
            strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={25 - acc}>
            <title>{`${s.label}: ${s.value}`}</title>
          </circle>
        );
        acc += pct;
        return el;
      })}
      <text x="21" y="22.5" textAnchor="middle" className="donut-n">{sum}</text>
      <text x="21" y="27" textAnchor="middle" className="donut-s">orders</text>
    </svg>
  );
}
