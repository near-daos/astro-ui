import React, { FC } from 'react';
import { Icon } from 'components/Icon';

import styles from './WarningMessage.module.scss';

interface Props {
  text: string;
}

export const WarningMessage: FC<Props> = ({ text }) => {
  return (
    <div className={styles.root}>
      <Icon name="stateAlert" className={styles.icon} />
      <span className={styles.text}>{text}</span>
    </div>
  );
};
