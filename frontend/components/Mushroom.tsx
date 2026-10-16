import { variety } from '@/lib/varieties';

type CapProps = {
  x: number; y: number; w: number; h: number; r: number; stemLen: number;
  cap: string; rim: string; stem: string;
};

function Cap({ x, y, w, h, r, stemLen, cap, rim, stem }: CapProps) {
  const gills = [-0.6, -0.3, 0, 0.3, 0.6];
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d={`M ${-w * 0.14} 0 L ${w * 0.14} 0 L ${w * 0.09} ${stemLen} L ${-w * 0.09} ${stemLen} Z`} fill={stem} />
      <path d={`M ${-w} 0 C ${-w} ${-h * 1.3} ${w} ${-h * 1.3} ${w} 0 C ${w * 0.55} ${h * 0.3} ${-w * 0.55} ${h * 0.3} ${-w} 0 Z`} fill={cap} />
      <path d={`M ${-w} 0 C ${-w * 0.55} ${h * 0.3} ${w * 0.55} ${h * 0.3} ${w} 0`} fill="none" stroke={rim} strokeWidth="2" strokeLinecap="round" />
      {gills.map((g) => (
        <path key={g} d={`M ${g * w} ${h * 0.02} Q ${g * w * 0.6} ${h * 0.15} ${g * w * 0.25} ${h * 0.2}`} stroke={rim} strokeWidth="1" opacity=".45" fill="none" />
      ))}
      <ellipse cx={-w * 0.25} cy={-h * 0.55} rx={w * 0.35} ry={h * 0.16} fill="#fff" opacity=".22" transform={`rotate(-12 ${-w * 0.25} ${-h * 0.55})`} />
    </g>
  );
}

export default function Mushroom({ variety: key, className }: { variety: string; className?: string }) {
  const v = variety(key);
  const c = { cap: v.cap, rim: v.rim, stem: v.stem };
  return (
    <svg viewBox="0 0 240 180" className={className} role="img" aria-label={`${v.label} oyster mushrooms`}>
      <ellipse cx="120" cy="166" rx="86" ry="7" fill={v.rim} opacity=".16" />
      <Cap x={150} y={78} w={52} h={40} r={10} stemLen={80} {...c} />
      <Cap x={82} y={92} w={58} h={46} r={-9} stemLen={68} {...c} />
      <Cap x={124} y={118} w={40} h={32} r={3} stemLen={44} {...c} />
    </svg>
  );
}
