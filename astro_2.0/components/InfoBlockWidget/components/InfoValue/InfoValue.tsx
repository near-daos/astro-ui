import React from 'react';
import styles from './InfoValue.module.scss';

interface NearValueProps {
  value: string | number;
  label: string;
}

export const InfoValue: React.FC<NearValueProps> = ({ value, label }) => {
  return (
    <div className={styles.root}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};
