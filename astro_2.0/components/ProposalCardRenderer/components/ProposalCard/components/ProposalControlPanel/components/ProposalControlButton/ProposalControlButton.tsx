import cn from 'classnames';
import React from 'react';

import { IconName } from 'components/Icon';
import { IconButton } from 'components/button/IconButton';

import styles from './ProposalControlButton.module.scss';

interface ProposalControlButtonProps {
  times: number | string;
  icon: IconName;
  voted?: boolean;
  disabled: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  iconClassName?: string;
  type: 'submit' | 'button';
}

export const ProposalControlButton: React.FC<ProposalControlButtonProps> = ({
  icon,
  voted,
  times,
  disabled,
  type,
  onClick,
  iconClassName = '',
}) => {
  const statusClassName = cn({
    [styles.yesAvailable]: icon === 'votingYes' && !voted && !disabled,
    [styles.noAvailable]: icon === 'votingNo' && !voted && !disabled,
    [styles.dismissAvailable]: icon === 'votingDismiss' && !voted && !disabled,
  });

  return (
    <span className={styles.item}>
      <IconButton
        icon={icon}
        type={type}
        iconProps={{
          className: iconClassName,
        }}
        className={cn(styles.icon, statusClassName, {
          [styles.voted]: voted,
        })}
        size="large"
        disabled={disabled || voted}
        onClick={!voted && !disabled ? onClick : undefined}
      />
      <span className={cn(styles.value, 'title3')}>{times}</span>
    </span>
  );
};
