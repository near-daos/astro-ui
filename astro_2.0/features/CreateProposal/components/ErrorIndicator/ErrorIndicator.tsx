import React, { FC, useState } from 'react';
import { Icon } from 'components/Icon';
import { Popup } from 'components/Popup';

import styles from './ErrorIndicator.module.scss';

interface ErrorIndicatorProps {
  message: string;
}

export const ErrorIndicator: FC<ErrorIndicatorProps> = ({ message }) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <>
      <div ref={setRef} className={styles.root}>
        <Icon name="info" width={12} className={styles.icon} />
      </div>
      <Popup anchor={ref} offset={[0, 10]} placement="auto">
        <span className={styles.error}>{message}</span>
      </Popup>
    </>
  );
};
