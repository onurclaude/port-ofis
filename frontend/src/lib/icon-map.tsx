import {
  Briefcase,
  Building2,
  Camera,
  Copy,
  Gift,
  Image as ImageIcon,
  Layers,
  type LucideIcon,
  Package,
  Palette,
  PenTool,
  Printer,
  Scan,
  Scissors,
  ShoppingBag,
  Sparkles,
  Stamp,
  Tag,
  Users,
} from "lucide-react";

/**
 * Maps a service's `iconKey` (an admin-authored free-text field per the API
 * contract) to a lucide icon. Unknown keys fall back to a generic mark rather
 * than breaking — the admin can type any short slug-like key.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  printer: Printer,
  "pen-tool": PenTool,
  pen: PenTool,
  briefcase: Briefcase,
  gift: Gift,
  layers: Layers,
  package: Package,
  scissors: Scissors,
  palette: Palette,
  camera: Camera,
  stamp: Stamp,
  building: Building2,
  users: Users,
  "shopping-bag": ShoppingBag,
  image: ImageIcon,
  scan: Scan,
  copy: Copy,
  tag: Tag,
};

export function getServiceIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? Sparkles;
}
