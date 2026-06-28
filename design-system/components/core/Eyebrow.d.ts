import * as React from 'react';

export interface EyebrowProps {
  children: React.ReactNode;
  /** @default 'rose' */
  tone?: 'rose' | 'navy' | 'muted' | 'white';
  /** Element to render. @default 'div' */
  as?: keyof JSX.IntrinsicElements;
}

/** Letterspaced ALL-CAPS label / eyebrow above headings and feature titles. */
export function Eyebrow(props: EyebrowProps): JSX.Element;
