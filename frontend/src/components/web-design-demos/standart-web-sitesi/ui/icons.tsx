import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: { children: ReactNode } & IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function PrinterIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 9V3h12v6" />
      <rect x="4" y="9" width="16" height="8" rx="1.5" />
      <path d="M6 15h12v6H6z" />
    </Base>
  );
}

export function MugIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 5c0-1 .8-1 .8-2M12 5c0-1 .8-1 .8-2" />
    </Base>
  );
}

export function StampIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 4h6l1 4H8l1-4Z" />
      <path d="M8 8h8v6H8z" />
      <path d="M6 20l1.5-6h9L18 20" />
      <path d="M4 20h16" />
    </Base>
  );
}

export function NotebookIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M9 3v18" />
      <path d="M13 8h3M13 12h3" />
    </Base>
  );
}

export function BlockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3l7 4v10l-7 4-7-4V7l7-4Z" />
      <path d="M5 7l7 4 7-4M12 11v10" />
    </Base>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M4 13h16" />
      <path d="M12 9v11" />
      <path d="M12 9C10 9 8 7.8 8 6a2 2 0 0 1 4 0 2 2 0 0 1 4 0c0 1.8-2 3-4 3Z" />
    </Base>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
      <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" />
    </Base>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M16.2 7.2h.01" />
    </Base>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v7h3v-7h2.2l.8-3H14V8Z" />
    </Base>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 17l-2 2 .6-3.2A7 7 0 1 1 9.5 19L7 17Z" />
      <path d="M9 10c0 3 2 5 5 5" />
    </Base>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 10v6M8 7.5v.01M12 16v-3.5c0-1.4 1-2.5 2.4-2.5S17 11 17 12.5V16" />
    </Base>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" />
    </Base>
  );
}

export const socialIconMap: Record<string, (props: IconProps) => ReactNode> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: WhatsappIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
};

// Maps a service.id to a hand-drawn line icon. Unknown ids fall back to
// SparkleIcon — the map is a decorative nicety, never a hard requirement.
export const serviceIconMap: Record<string, (props: IconProps) => ReactNode> = {
  "dijital-baski": PrinterIcon,
  "kupa-baski": MugIcon,
  kase: StampIcon,
  kirtasiye: NotebookIcon,
  oyuncak: BlockIcon,
  "promosyon-urunleri": GiftIcon,
  "kisiye-ozel-urunler": SparkleIcon,
};

export function ServiceIcon({ id, ...props }: { id: string } & IconProps) {
  const Icon = serviceIconMap[id] ?? SparkleIcon;
  return <>{Icon(props)}</>;
}
