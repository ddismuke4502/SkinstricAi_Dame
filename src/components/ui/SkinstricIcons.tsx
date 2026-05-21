import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ApertureIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="2" />
      <circle cx="48" cy="48" r="32" stroke="currentColor" strokeWidth="2" />
      <path d="M48 17L62 48H48H31L48 17Z" fill="currentColor" />
      <path d="M79 48L48 62V48V31L79 48Z" fill="currentColor" />
      <path d="M48 79L34 48H48H65L48 79Z" fill="currentColor" />
    </svg>
  );
}

export function GalleryIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="2" />
      <circle cx="59" cy="35" r="9" fill="currentColor" />
      <path
        d="M19 63L36 49L50 61L61 54L78 67V72H19V63Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="18"
        y="29"
        width="60"
        height="43"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M36 29L41 21H55L60 29"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="48" cy="51" r="14" stroke="currentColor" strokeWidth="2" />
      <circle cx="48" cy="51" r="6" fill="currentColor" />
    </svg>
  );
}