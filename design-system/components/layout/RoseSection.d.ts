import * as React from 'react';

export interface RoseSectionProps {
  children: React.ReactNode;
  /** Show the faint oversized "LFA" brand watermark. @default true */
  watermark?: boolean;
  /** Vertical padding (CSS length). @default 'var(--section-y)' */
  padding?: string;
}

/** Full-bleed dusty-rose editorial band with white text (the "What We Do" section). */
export function RoseSection(props: RoseSectionProps): JSX.Element;
