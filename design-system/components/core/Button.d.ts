import * as React from 'react';

/**
 * Props for the LFA call-to-action button.
 * @startingPoint section="Core" subtitle="CTA buttons — outline pill, solid rose, navy, link" viewport="700x150"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. @default 'primary' */
  variant?: 'primary' | 'outline' | 'navy' | 'link';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Render as an anchor when provided. */
  href?: string;
  /** Optional trailing icon/glyph (e.g. an arrow). */
  iconRight?: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function Button(props: ButtonProps): JSX.Element;
