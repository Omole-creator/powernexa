type WaveformProps = {
  variant?: "hero" | "divider";
  className?: string;
};

/**
 * Signature brand motif: a line that starts jagged (unreliable grid power)
 * and resolves into a smooth sine curve (PowerNexa power). A pure sine wave
 * is also the literal technical difference between a good inverter and a
 * cheap one, so this shape is not decoration, it is the product claim.
 */
export function Waveform({ variant = "hero", className = "" }: WaveformProps) {
  if (variant === "divider") {
    return (
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M0,30 C 60,0 120,0 180,30 C 240,60 300,60 360,30 C 420,0 480,0 540,30 C 600,60 660,60 720,30 C 780,0 840,0 900,30 C 960,60 1020,60 1080,30 C 1140,0 1170,0 1200,15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 1000 240"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="waveform-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="38%" stopColor="#f58220" />
          <stop offset="100%" stopColor="#092b4c" />
        </linearGradient>
      </defs>
      <path
        className="waveform-path"
        d="M0,120 L40,55 L75,175 L110,45 L145,185 L180,65 L215,150 L250,95 L285,140 L320,100 L355,122
           C 390,70 420,70 450,120
           C 480,170 510,170 540,120
           C 570,70 600,70 630,120
           C 660,170 690,170 720,120
           C 750,70 780,70 810,120
           C 840,170 870,170 900,120
           C 930,95 960,95 990,120"
        fill="none"
        stroke="url(#waveform-gradient)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <text x="10" y="215" fontSize="15" fill="#64748b" fontFamily="ui-sans-serif, system-ui">
        Grid power
      </text>
      <text x="855" y="215" fontSize="15" fill="#092b4c" fontFamily="ui-sans-serif, system-ui" fontWeight="600">
        PowerNexa power
      </text>
    </svg>
  );
}
