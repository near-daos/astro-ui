import React, { SVGProps } from 'react';

type IconProps = SVGProps<HTMLOrSVGElement> & { title?: string };
type IconType = React.FC<IconProps>;

interface StatusIcon {
  icon: IconType;
  active?: boolean;
}

type IconStateProps = IconProps & StatusIcon;

export const StatusIcon = React.forwardRef<SVGElement, IconStateProps>(
  ({ icon: Component, active, ...iconProps }, ref) => (
    <Component
      ref={ref}
      {...iconProps}
      style={{ opacity: active ? undefined : '0.4' }}
    />
  )
);
