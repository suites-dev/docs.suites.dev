declare module "@theme/Tabs" {
  import type { ReactNode } from "react";

  export interface Props {
    children: ReactNode;
    defaultValue?: string;
    values?: Array<{ label: string; value: string }>;
    groupId?: string;
    className?: string;
    queryString?: boolean | string;
  }

  export default function Tabs(props: Props): JSX.Element;
}

declare module "@theme/TabItem" {
  import type { ReactNode } from "react";

  export interface Props {
    children: ReactNode;
    value: string;
    label?: string;
    default?: boolean;
    className?: string;
    attributes?: Record<string, unknown>;
  }

  export default function TabItem(props: Props): JSX.Element;
}
