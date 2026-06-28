import * as React from 'react';

/**
 * Props for the LFA feature block.
 * @startingPoint section="Content" subtitle="Feature blocks — icon, caps title, sentence" viewport="700x300"
 */
export interface FeatureCardProps {
  /** Optional line icon (e.g. a Lucide SVG), rendered in rose. */
  icon?: React.ReactNode;
  /** ALL-CAPS feature title. */
  title: React.ReactNode;
  /** One- or two-sentence explanation. */
  children: React.ReactNode;
  /** @default 'left' */
  align?: 'left' | 'center';
  /** Wrap in a bordered white card. @default false */
  boxed?: boolean;
}

/** Caps-title + one-sentence feature block used across LFA's value sections. */
export function FeatureCard(props: FeatureCardProps): JSX.Element;
