import React, { FC } from 'react';
import { Button } from 'components/button/Button';
import { Icon, IconName } from 'components/Icon';

import styles from './DaoSettingFlowButton.module.scss';

interface Props {
  onClick: () => void;
  icon: IconName;
  label: string;
}

export const DaoSettingFlowButton: FC<Props> = ({ icon, label, onClick }) => {
  return (
    <Button variant="transparent" className={styles.root} onClick={onClick}>
      <Icon name={icon} className={styles.icon} />
      <p>{label}</p>
    </Button>
  );
};
