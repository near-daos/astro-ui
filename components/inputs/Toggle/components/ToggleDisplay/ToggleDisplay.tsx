import React from 'react';
import cn from 'classnames';

import styles from './ToggleDisplay.module.scss';

export const ToggleDisplay: React.FC<{ value?: boolean }> = props => {
  const { value = false } = props;

  const rootClassName = cn(styles.switch, {
    [styles.on]: value,
  });

  return (
    <div className={rootClassName}>
      <div className={styles.slider} />
    </div>
  );
};
