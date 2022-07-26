import React, { FC } from 'react';
import cn from 'classnames';
import { IconButton } from 'components/button/IconButton';

import styles from './LikeButton.module.scss';

export type LikeButtonProps = {
  amount: number;
  disabled: boolean;
  isActive: boolean;
  onClick: () => void;
  iconClassName?: string;
};

export const LikeButton: FC<LikeButtonProps> = ({
  amount,
  disabled,
  isActive,
  onClick,
  iconClassName,
}) => {
  return (
    <div className={cn(styles.likes, { [styles.disabled]: disabled })}>
      {amount}
      <IconButton
        size="medium"
        disabled={disabled}
        icon={isActive ? 'likeFilled' : 'like'}
        className={cn(styles.likeIcon, iconClassName)}
        onClick={onClick}
      />
    </div>
  );
};
