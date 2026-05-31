export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const PRIMARY_NAV: readonly NavItem[] = [] as const;

export const FOOTER_NAV: readonly { heading: string; items: readonly NavItem[] }[] = [] as const;
