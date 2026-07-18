function StatusIllustration({variant = "notFound", title}) {
  const isServerDown = variant === "serverDown";

  return (
    <svg
      className={`status-illustration status-illustration--${variant}`}
      viewBox="0 0 520 360"
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id="statusGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary-soft)" />
          <stop offset="100%" stopColor="var(--color-accent-soft)" />
        </linearGradient>
      </defs>

      <rect
        x="36"
        y="44"
        width="448"
        height="272"
        rx="28"
        fill="url(#statusGradient)"
        opacity="0.72"
      />
      <rect x="68" y="76" width="384" height="208" rx="22" fill="var(--color-surface)" />
      <circle cx="112" cy="112" r="9" fill="var(--color-primary)" />
      <circle cx="140" cy="112" r="9" fill="var(--color-warning)" />
      <circle cx="168" cy="112" r="9" fill="var(--color-accent)" />

      <rect x="102" y="138" width="316" height="18" rx="9" fill="var(--color-border)" />
      <rect x="102" y="168" width="192" height="14" rx="7" fill="var(--color-primary-soft)" />
      <rect x="102" y="192" width="236" height="14" rx="7" fill="var(--color-border)" />

      {isServerDown ? (
        <>
          <rect
            x="96"
            y="224"
            width="328"
            height="38"
            rx="19"
            fill="color-mix(in srgb, var(--color-danger) 16%, var(--color-surface))"
          />
          <path
            d="M132 242h84m22 0h66m18 0h30"
            stroke="var(--color-danger)"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <circle cx="390" cy="242" r="18" fill="var(--color-danger)" />
          <path d="M390 233v11m0 9h.01" stroke="#ffffff" strokeLinecap="round" strokeWidth="6" />
        </>
      ) : (
        <>
          <rect
            x="96"
            y="224"
            width="328"
            height="38"
            rx="19"
            fill="color-mix(in srgb, var(--color-accent) 14%, var(--color-surface))"
          />
          <path
            d="M130 243l24-24m0 24l-24-24"
            stroke="var(--color-primary)"
            strokeLinecap="round"
            strokeWidth="10"
          />
          <path
            d="M192 242h96m24 0h44"
            stroke="var(--color-accent)"
            strokeLinecap="round"
            strokeWidth="12"
          />
        </>
      )}

      <g transform="translate(364 22)">
        <circle cx="50" cy="50" r="40" fill="var(--color-surface)" />
        <text
          x="50"
          y="63"
          fill={isServerDown ? "var(--color-danger)" : "var(--color-primary-strong)"}
          fontFamily="Inter, sans-serif"
          fontSize="44"
          fontWeight="900"
          textAnchor="middle"
        >
          {isServerDown ? "500" : "404"}
        </text>
      </g>
    </svg>
  );
}

export default StatusIllustration;
