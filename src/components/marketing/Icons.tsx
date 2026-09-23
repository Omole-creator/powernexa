import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function PanelIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M6 18 12 8h30l6 10-9 22H15L6 18Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18 8 12.5 40M30 8l5.5 32M12 18h30M9 30h34" stroke="currentColor" strokeWidth="2" opacity="0.55" />
    </svg>
  );
}

export function InverterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="7" y="10" width="34" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 26h6l3-8 5 16 3-8h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BatteryIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="6" y="14" width="32" height="20" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M38 20v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 19l-6 8h6l-2 6 8-9h-6l2-5Z" fill="currentColor" />
    </svg>
  );
}

export function WrenchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M31 9a9 9 0 0 0-11.9 9.9L8 30l4 4 3.5-3.5 3 3 3.5-3.5-3-3L30 19.9A9 9 0 0 0 39 8l-6 6-4-1-1-4 6-6"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M10 42V10l14-4 14 4v32" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M17 18h4M17 25h4M27 18h4M27 25h4M20 42v-9h8v9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export const SERVICE_ICON_MAP = {
  panel: PanelIcon,
  inverter: InverterIcon,
  battery: BatteryIcon,
  wrench: WrenchIcon,
  building: BuildingIcon,
};

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10 1.5l2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L10 15l-5.5 3.1 1.4-6.1L1.2 7.8l6.2-.6L10 1.5Z" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M10 2a6 6 0 0 0-6 6c0 4.2 6 10 6 10s6-5.8 6-10a6 6 0 0 0-6-6Zm0 8.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ProjectsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M8 22 24 9l16 13v17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V22Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="m17 29 5 5 9-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SmileIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16.5 28c1.8 3 4.4 4.5 7.5 4.5s5.7-1.5 7.5-4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="20" r="2" fill="currentColor" />
      <circle cx="30" cy="20" r="2" fill="currentColor" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 6 9 12v11c0 9.5 6.4 16.6 15 19 8.6-2.4 15-9.5 15-19V12L24 6Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="m17 24 5 5 9-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeadsetIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M9 27v-4a15 15 0 0 1 30 0v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="7" y="26" width="8" height="12" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <rect x="33" y="26" width="8" height="12" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M37 38c0 3-3 4-7 4h-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronIcon({ direction = "right", ...props }: IconProps & { direction?: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d={direction === "right" ? "m8 5 5 5-5 5" : "m12 5-5 5 5 5"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
