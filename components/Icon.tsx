import React from 'react';
import getConfig from 'next/config';

import * as icons from 'assets/icons';

export type IconName = keyof typeof icons;

export type IconProps = React.SVGProps<SVGSVGElement> & {
  name: IconName;
  title?: string;
};

export const Icon: React.VFC<IconProps> = ({ name, title, ...svgProps }) => {
  const { viewBox, id, url } = icons[name];

  const { publicRuntimeConfig } = getConfig();

  return (
    <svg viewBox={viewBox} {...svgProps}>
      {title && <title> {title}</title>}
      <use
        href={
          publicRuntimeConfig.shouldUseExternalAssetUrl
            ? `${publicRuntimeConfig.assetUrl}${id}`
            : `/_next/${url}`
        }
      />
    </svg>
  );
};
