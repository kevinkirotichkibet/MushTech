import { CARE, VARIETY_NOTES } from '@/lib/care';

export default function CareGuide({ variety, name }: { variety: string; name: string }) {
  const note = VARIETY_NOTES[variety];
  return (
    <section className="care" aria-labelledby="care-title">
      <div className="care-intro">
        <p className="eyebrow">Before you cook</p>
        <h2 id="care-title">Storage and care</h2>
        {note && <p className="care-note"><strong>{name}:</strong> {note}</p>}
      </div>
      <div className="care-list">
        {CARE.map((s, i) => (
          <details key={s.title} open={i === 0}>
            <summary>{s.title}</summary>
            <ul>{s.items.map((t) => <li key={t}>{t}</li>)}</ul>
          </details>
        ))}
      </div>
    </section>
  );
}
