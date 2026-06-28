import * as React from 'react';

export interface TagProps {
  children: React.ReactNode;
  /** @default 'neutral' */
  tone?: 'neutral' | 'navy' | 'rose' | 'outline';
}

/** Small uppercase pill for mandate exposures, currencies, and risk levels. */
export function Tag(props: TagProps): JSX.Element;
