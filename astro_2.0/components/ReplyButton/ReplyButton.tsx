import React, { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './ReplyButton.module.scss';

interface ReplyButtonProps {
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}

export const ReplyButton: FC<ReplyButtonProps> = ({
  className,
  onClick,
  disabled,
  title,
}) => {
  return (
    <Button
      disabled={disabled}
      capitalize
      size="small"
      variant="transparent"
      className={cn(styles.replyButton, className)}
      onClick={onClick}
    >
      {title} <Icon className={styles.icon} name="reply" />
    </Button>
  );
};
