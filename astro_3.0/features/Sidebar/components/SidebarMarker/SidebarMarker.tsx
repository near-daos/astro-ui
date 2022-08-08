import React, { FC } from 'react';
import { useRouter } from 'next/router';

import { DaoFeedItem } from 'types/dao';

import styles from './SidebarMarker.module.scss';

interface Props {
  items: DaoFeedItem[];
}

export const SidebarMarker: FC<Props> = ({ items }) => {
  const router = useRouter();
  const HEIGHT = 56;

  const activeItemIndex = items.findIndex(({ id }) => {
    if (Array.isArray(id)) {
      return id.some(link => router.asPath.indexOf(link) !== -1);
    }

    return router.asPath.indexOf(id) !== -1;
  });

  const transform = `translateY(${
    activeItemIndex === -1 ? 0 : activeItemIndex * HEIGHT
  }px)`;

  const display = activeItemIndex === -1 ? 'none' : 'block';

  return (
    <svg
      className={styles.root}
      style={{ transform, display }}
      width="19"
      height="56"
      viewBox="0 0 19 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_787_29577)">
        <path
          d="M9 48C10.1046 48 11 47.1046 11 46L11 10C11 8.89543 10.1046 8 9 8H8C8 30 8 30 8 48H9Z"
          fill="#6038D0"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_787_29577"
          x="0"
          y="0"
          width="19"
          height="56"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="2"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_787_29577"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.376471 0 0 0 0 0.219608 0 0 0 0 0.815686 0 0 0 0.3 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_787_29577"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_787_29577"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
