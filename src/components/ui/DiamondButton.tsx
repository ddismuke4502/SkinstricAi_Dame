"use client";

import Link from "next/link";

type DiamondButtonDirection = "left" | "right";

type DiamondButtonProps = {
  label: string;
  direction?: DiamondButtonDirection;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function DiamondButton({
  label,
  direction = "right",
  href,
  onClick,
  disabled = false,
  className = "",
  ariaLabel,
}: DiamondButtonProps) {
  const icon = (
    <span
      aria-hidden="true"
      className={`diamond-icon ${
        direction === "left" ? "diamond-icon-left" : "diamond-icon-right"
      }`}
    />
  );

  const content = (
    <>
      {direction === "left" && icon}
      <span>{label}</span>
      {direction === "right" && icon}
    </>
  );

  const classes = [
    "diamond-button",
    disabled ? "pointer-events-none opacity-30" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href && !disabled) {
    return (
      <Link href={href} aria-label={ariaLabel ?? label} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

export default DiamondButton;