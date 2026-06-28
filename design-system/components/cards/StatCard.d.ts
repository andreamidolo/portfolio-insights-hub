import * as React from 'react';

export interface StatCardProps {
  /** The figure, e.g. "2.5" or "700" or "2009". */
  value: React.ReactNode;
  /** Caps label below, e.g. "USD bn assets under management". */
  label: React.ReactNode;
  /** Small serif suffix, e.g. "bn" or "+". */
  suffix?: React.ReactNode;
  /** @default 'navy' */
  tone?: 'navy' | 'rose' | 'white';
  /** @default 'left' */
  align?: 'left' | 'center';
}

/** Serif "facts & figures" statistic — big value + caps label. */
export function StatCard(props: StatCardProps): JSX.Element;
