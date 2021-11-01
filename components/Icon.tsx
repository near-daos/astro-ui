import React from 'react';

import * as icons from 'assets/icons';

export type IconName = keyof typeof icons;

export type IconProps = React.SVGProps<SVGSVGElement> & {
  name: IconName;
  title?: string;
};

export const Icon: React.VFC<IconProps> = ({ name, title, ...svgProps }) => {
  const { viewBox, url } = icons[name];

  return (
    <svg viewBox={viewBox} {...svgProps}>
      {title && <title> {title}</title>}
      <use href={`/_next/${url}`} />
    </svg>
  );
};
