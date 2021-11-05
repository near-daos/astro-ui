import React, { FC } from 'react';
import styles from './FlagMinimized.module.scss';

interface FlagMinimizedProps {
  image?: string;
}

export const FlagMinimized: FC<FlagMinimizedProps> = ({ image }) => {
  return (
    <div className={styles.root}>
      <svg
        className="svg"
        width="0"
        height="0"
        style={{ position: 'absolute' }}
      >
        <clipPath id="flagMinimized">
          <path d="M68.8249 0L14.4555 19.4307V30.2124L0 35.3785V78.0007L54.3694 58.57V47.7883L68.8249 42.6222V0Z" />
        </clipPath>
      </svg>
      <div className={styles.background} />
      <div
        className={styles.cover}
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
};
