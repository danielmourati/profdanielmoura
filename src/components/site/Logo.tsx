type LogoProps = {
  className?: string;
  brackets?: string;
  primary?: string;
  accent?: string;
};

export function Logo({
  className = "",
  brackets = "#1E90FF",
  primary = "#FFFFFF",
  accent = "#1E90FF",
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 900 360"
      className={className}
      role="img"
      aria-label="Prof. Daniel Moura"
    >
      <text
        x="20"
        y="120"
        fontFamily="'Inter','Helvetica Neue',Arial,sans-serif"
        fontWeight="800"
        fontSize="110"
        fill={brackets}
      >
        [
      </text>
      <text
        x="100"
        y="140"
        fontFamily="'Inter','Helvetica Neue',Arial,sans-serif"
        fontWeight="800"
        fontSize="120"
        fill={primary}
      >
        Prof.
      </text>
      <text
        x="100"
        y="280"
        fontFamily="'Inter','Helvetica Neue',Arial,sans-serif"
        fontWeight="800"
        fontSize="160"
        fill={primary}
      >
        Daniel
      </text>
      <text
        x="520"
        y="280"
        fontFamily="'Inter','Helvetica Neue',Arial,sans-serif"
        fontWeight="800"
        fontSize="160"
        fill={accent}
      >
        Moura
      </text>
      <text
        x="850"
        y="270"
        fontFamily="'Inter','Helvetica Neue',Arial,sans-serif"
        fontWeight="800"
        fontSize="220"
        fill={brackets}
      >
        ]
      </text>
    </svg>
  );
}
