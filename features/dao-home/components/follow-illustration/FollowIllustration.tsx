import React, { FC } from 'react';
import cn from 'classnames';

import styles from './follow-illustration.module.scss';

const FLAG = (
  <svg
    width="59"
    height="87"
    viewBox="0 0 59 87"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.910645 30.9892L46.4704 13.9683V51.3045L0.910645 68.3254V30.9892Z"
      fill="#201F1F"
    />
    <path
      d="M13.0249 17.0209L58.5847 0V37.3362L13.0249 54.3572V17.0209Z"
      fill="#201F1F"
    />
    <line
      x1="1.66064"
      y1="31.2021"
      x2="1.66064"
      y2="86.5457"
      stroke="#201F1F"
      strokeWidth="1.5"
    />
  </svg>
);

const PATH = (
  <svg
    width="303"
    height="85"
    viewBox="0 0 303 85"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className={styles.route}
      d="M301.242 23.007C300.687 18.3792 296.254 14.2513 288.131 10.8712C280.068 7.51609 268.632 5.01306 254.621 3.47537C226.612 0.4013 188.483 1.20272 146.884 6.62233C105.284 12.0419 68.1391 21.0472 41.7169 31.2127C28.5002 36.2976 18.0068 41.6576 10.9836 46.9782C3.90827 52.3383 0.586159 57.4766 1.14097 62.1044C1.69578 66.7323 6.12878 70.8602 14.252 74.2402C22.3153 77.5954 33.7513 80.0984 47.7619 81.6361C75.7713 84.7101 113.9 83.9087 155.499 78.4891C197.099 73.0695 234.244 64.0642 260.666 53.8987C273.883 48.8138 284.376 43.4538 291.399 38.1332C298.475 32.7731 301.797 27.6348 301.242 23.007Z"
      stroke="#201F1F"
      strokeWidth="1.5"
    />
  </svg>
);

const SMILE = (
  <svg
    width="43"
    height="43"
    viewBox="0 0 43 43"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="21.6738" cy="21.0405" r="21" fill="#E1FC31" />
    <path
      d="M34.7988 21.0405C34.7988 28.2893 28.9226 34.1655 21.6738 34.1655C14.4251 34.1655 8.54883 28.2893 8.54883 21.0405"
      stroke="#201F1F"
      strokeWidth="1.5"
    />
  </svg>
);

interface FollowIllustrationProps {
  variant?: 'follow' | 'unfollow';
}

const FollowIllustration: FC<FollowIllustrationProps> = ({
  variant = 'follow'
}) => {
  return (
    <div className={styles.root}>
      <div
        className={cn(styles.path, {
          [styles.unfollow]: variant === 'unfollow'
        })}
      >
        {PATH}
        <div className={styles.smile}>{SMILE}</div>
      </div>
      <div className={styles.flag}>{FLAG}</div>
    </div>
  );
};

export default FollowIllustration;
