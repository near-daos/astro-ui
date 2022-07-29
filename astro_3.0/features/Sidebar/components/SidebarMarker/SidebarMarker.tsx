import React, { ComponentProps, FC } from 'react';
import { useRouter } from 'next/router';

import { SidebarNavItem } from 'astro_3.0/features/Sidebar/components/SidebarNavItem';

import styles from './SidebarMarker.module.scss';

interface Props {
  items: ComponentProps<typeof SidebarNavItem>[];
}

export const SidebarMarker: FC<Props> = ({ items }) => {
  const router = useRouter();
  const HEIGHT = 56;

  const activeItemIndex = items.findIndex(item => {
    return router.asPath.indexOf(item.href) !== -1;
  });

  const transform = `translateY(${
    activeItemIndex === -1 ? 0 : activeItemIndex * HEIGHT
  }px)`;

  return (
    <svg
      className={styles.root}
      style={{ transform }}
      width="14"
      height="56"
      viewBox="0 0 14 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_579_16313)">
        <path
          d="M0.539212 48C0.241413 48 0 47.7586 0 47.4608L0 8.54401C0 8.24356 0.243564 8 0.544014 8C0.758394 8 0.954718 8.12993 1.04177 8.32584C7.71336 23.3405 7.59342 32.075 1.03704 47.6667C0.953111 47.8663 0.75572 48 0.539212 48Z"
          fill="#6038D0"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_579_16313"
          x="-8"
          y="0"
          width="22"
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
            result="effect1_dropShadow_579_16313"
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
            result="effect1_dropShadow_579_16313"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_579_16313"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default SidebarMarker;
