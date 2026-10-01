import type { CSSProperties } from "react";
import { MenuApp } from "./menu-app";
import { menuCategories, menuTenant } from "./menu-data";
import { buildMenuThemeVars } from "./theme";

// Ported from the cafe-menu project's public restaurant menu page
// (src/app/[tenant]/page.tsx + components/menu/menu-app.tsx), showing its
// "Özsoy Bistro" sample menu. Shown at /web-tasarimlari/dijital-restoran-menusu.
// The theme variables are set on this wrapper (not :root) so they stay
// scoped to the demo.
export function DijitalRestoranMenusuDemo() {
  const themeVars = buildMenuThemeVars(menuTenant) as CSSProperties;

  return (
    <div style={themeVars}>
      <MenuApp tenant={menuTenant} menu={menuCategories} />
    </div>
  );
}
