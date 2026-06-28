import * as React from 'react';

/**
 * Props for the LFA section opener.
 * @startingPoint section="Content" subtitle="Section opener — eyebrow, serif headline, lead" viewport="760x260"
 */
export interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  /** The italic-serif headline (often a question). */
  title: React.ReactNode;
  /** Optional standfirst paragraph. */
  lead?: React.ReactNode;
  /** @default 'left' */
  align?: 'left' | 'center';
  /** 'white' for navy/photo sections. @default 'navy' */
  tone?: 'navy' | 'white';
  /** Render the headline in italic serif. @default true */
  italic?: boolean;
}

/** Eyebrow + italic-serif headline + lead — the standard LFA section opener. */
export function SectionHeading(props: SectionHeadingProps): JSX.Element;
