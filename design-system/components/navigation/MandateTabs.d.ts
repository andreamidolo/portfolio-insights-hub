import * as React from 'react';

export interface MandateTabsProps {
  /** Tab labels, e.g. Investment Management, International Wealth Planning… */
  items: string[];
  /** Controlled active label. */
  value?: string;
  /** Uncontrolled initial active label. */
  defaultValue?: string;
  onChange?: (item: string) => void;
}

/** Vertical left-rail selector (Services page). Active = solid navy fill. */
export function MandateTabs(props: MandateTabsProps): JSX.Element;
