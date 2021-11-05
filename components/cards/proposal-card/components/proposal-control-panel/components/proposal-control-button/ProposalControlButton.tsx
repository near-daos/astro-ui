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
  const statusClassName = cn({
    [styles.yesAvailable]: icon === 'votingYes' && !voted && !disabled,
    [styles.noAvailable]: icon === 'votingNo' && !voted && !disabled,
    [styles.dismissAvailable]: icon === 'votingDismiss' && !voted && !disabled
  });

  return (
    <span className={styles.item}>
      <IconButton
        icon={icon}
        className={cn(styles.icon, statusClassName, {
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
