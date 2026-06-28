import * as React from 'react';

/**
 * Props for the LFA top navigation.
 * @startingPoint section="Navigation" subtitle="lfa.ch top nav — centered logo, links, CTA" viewport="1200x90"
 */
export interface NavBarProps {
  /** Path to the LFA logo lockup. */
  logoSrc?: string;
  leftLinks?: string[];
  rightLinks?: string[];
  /** CTA pill label. @default 'Get Started' */
  cta?: string;
  /** Label of the currently-active nav item (rendered rose). */
  active?: string;
  /** Called with a link label (or 'Home' for the logo) when clicked. */
  onNavigate?: (label: string) => void;
  /** Called when the CTA pill is clicked. */
  onCta?: () => void;
}

/** Sticky white top navigation with centered logo and outlined rose CTA. */
export function NavBar(props: NavBarProps): JSX.Element;
