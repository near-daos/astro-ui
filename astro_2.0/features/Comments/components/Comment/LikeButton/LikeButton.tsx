import React, { FC } from 'react';
import { IconButton } from 'components/button/IconButton';

import styles from './LikeButton.module.scss';

export type LikeButtonProps = {
  amount: number;
  disabled: boolean;
  isActive: boolean;
  onClick: () => void;
};

export const LikeButton: FC<LikeButtonProps> = ({
  amount,
  disabled,
  isActive,
  onClick,
}) => {
  return (
    <div className={styles.likes}>
      {amount}
      <IconButton
        size="medium"
        disabled={disabled}
        icon={isActive ? 'likeFilled' : 'like'}
        className={styles.likeIcon}
        onClick={onClick}
      />
    </div>
  );
};
