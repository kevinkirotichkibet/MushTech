// Round "rubber stamp" badge for the hero. Decorative.
export default function StampBadge() {
  return (
    <svg viewBox="0 0 120 120" className="stamp" aria-hidden="true">
      <defs>
        <path id="stamp-ring-path" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
      </defs>
      <circle cx="60" cy="60" r="57" className="stamp-bg" />
      <circle cx="60" cy="60" r="33" className="stamp-in" />
      <g className="stamp-ring">
        <text>
          <textPath href="#stamp-ring-path" textLength="278" lengthAdjust="spacing">
            FRESH · WEIGHED TO ORDER ·
          </textPath>
        </text>
      </g>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <image href="/brand/logo-mark.png" x="39" y="38" width="42" height="42" />
    </svg>
  );
}
