type RotatingDiamondProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

const sizeClasses = {
  sm: {
    container: "h-[280px] w-[280px] md:h-[360px] md:w-[360px]",
    large: "w-[280px] md:w-[360px]",
    medium: "w-[240px] md:w-[310px]",
    small: "w-[200px] md:w-[260px]",
  },
  md: {
    container: "h-[360px] w-[360px] md:h-[520px] md:w-[520px]",
    large: "w-[360px] md:w-[520px]",
    medium: "w-[310px] md:w-[450px]",
    small: "w-[260px] md:w-[380px]",
  },
  lg: {
    container: "h-[420px] w-[420px] md:h-[640px] md:w-[640px]",
    large: "w-[420px] md:w-[640px]",
    medium: "w-[360px] md:w-[560px]",
    small: "w-[300px] md:w-[480px]",
  },
};

export function RotatingDiamond({
  size = "md",
  className = "",
  children,
}: RotatingDiamondProps) {
  const selectedSize = sizeClasses[size];

  return (
    <div
      className={[
        "diamond-shell",
        selectedSize.container,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "diamond-frame rotate-slow",
          selectedSize.large,
        ].join(" ")}
      />
      <span
        aria-hidden="true"
        className={[
          "diamond-frame rotate-medium",
          selectedSize.medium,
        ].join(" ")}
      />
      <span
        aria-hidden="true"
        className={[
          "diamond-frame rotate-fast",
          selectedSize.small,
        ].join(" ")}
      />

      <div className="relative z-10 flex max-w-[90%] flex-col items-center text-center">
        {children}
      </div>
    </div>
  );
}

export default RotatingDiamond;