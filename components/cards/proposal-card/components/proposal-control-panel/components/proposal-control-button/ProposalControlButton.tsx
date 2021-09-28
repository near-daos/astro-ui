import cn from 'classnames';
import React, { FC } from 'react';

import { IconName } from 'components/Icon';
import { IconButton } from 'components/button/IconButton';

import styles from './proposal-control-button.module.scss';

interface ProposalControlButtonProps {
  times: number;
  icon: IconName;
  voted?: boolean;
  disabled: boolean;
  onClick?: (e?: Partial<Event>) => void;
}

const ProposalControlButton: FC<ProposalControlButtonProps> = ({
  icon,
  voted,
  times,
  disabled,
  onClick
}) => {
  return (
    <span className={styles.item}>
      <IconButton
        icon={icon}
        className={cn(styles.icon, {
          [styles.voted]: voted
        })}
        size="large"
        onClick={!voted && !disabled ? onClick : undefined}
      />
      <span className={cn(styles.value, 'title3')}>{times}</span>
    </span>
  );
};

export default ProposalControlButton;
