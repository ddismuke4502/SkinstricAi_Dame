"use client";

import Link from "next/link";
import { useRef } from "react";
import type { MouseEvent, Ref } from "react";
import gsap from "gsap";

type DiamondButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  direction?: "left" | "right";
  disabled?: boolean;
  className?: string;
};

function DiamondIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <span className="diamond-button-icon relative grid h-11 w-11 shrink-0 rotate-45 place-items-center border border-current">
      <span
        className={[
          "h-0 w-0 -rotate-45 border-y-[5px] border-y-transparent",
          direction === "right"
            ? "border-l-[7px] border-l-current"
            : "border-r-[7px] border-r-current",
        ].join(" ")}
      />
    </span>
  );
}

function DiamondButtonContent({
  label,
  direction,
}: {
  label: string;
  direction: "left" | "right";
}) {
  const icon =
    direction === "left" ? <DiamondIcon direction="left" /> : null;

  const rightIcon =
    direction === "right" ? <DiamondIcon direction="right" /> : null;

  return (
    <>
      {icon}
      <span className="diamond-button-label text-[12px] font-semibold uppercase leading-none tracking-[-0.02em]">
        {label}
      </span>
      {rightIcon}
    </>
  );
}

export default function DiamondButton({
  label,
  href,
  onClick,
  direction = "right",
  disabled = false,
  className = "",
}: DiamondButtonProps) {
  const rootRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  function handleMouseEnter() {
    const root = rootRef.current;
    if (!root || disabled) return;

    const icon = root.querySelector(".diamond-button-icon");
    const labelElement = root.querySelector(".diamond-button-label");

    gsap.to(icon, {
      scale: 1.12,
      rotate: direction === "right" ? 52 : 38,
      duration: 0.35,
      ease: "power3.out",
    });

    gsap.to(labelElement, {
      x: direction === "right" ? -4 : 4,
      duration: 0.35,
      ease: "power3.out",
    });
  }

  function handleMouseLeave() {
    const root = rootRef.current;
    if (!root) return;

    const icon = root.querySelector(".diamond-button-icon");
    const labelElement = root.querySelector(".diamond-button-label");

    gsap.to(icon, {
      scale: 1,
      rotate: 45,
      duration: 0.42,
      ease: "power3.out",
    });

    gsap.to(labelElement, {
      x: 0,
      duration: 0.42,
      ease: "power3.out",
    });
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.();
  }

  const sharedClassName = [
    "group inline-flex items-center gap-4 text-current transition-opacity disabled:cursor-not-allowed disabled:opacity-40",
    direction === "right" ? "flex-row" : "flex-row",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <DiamondButtonContent label={label} direction={direction} />
  );

  if (href) {
    return (
      <Link
        ref={rootRef as Ref<HTMLAnchorElement>}
        href={href}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        onClick={handleClick}
        className={sharedClassName}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={rootRef as Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      onClick={handleClick}
      className={sharedClassName}
    >
      {content}
    </button>
  );
}