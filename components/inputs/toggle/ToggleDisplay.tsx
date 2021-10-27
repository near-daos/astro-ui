import React from 'react';
import classNames from 'classnames';
import styles from './toggle.module.scss';

export const ToggleDisplay: React.FC<{ value?: boolean }> = ({ value }) => {
  return (
    <div
      className={value ? classNames(styles.switch, styles.on) : styles.switch}
    >
      <div className={styles.slider} />
    </div>
  );
};

ToggleDisplay.defaultProps = {
  value: false,
};
