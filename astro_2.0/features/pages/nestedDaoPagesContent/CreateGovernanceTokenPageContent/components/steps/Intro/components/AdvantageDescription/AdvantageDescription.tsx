import { FC } from 'react';

import styles from './AdvantageDescription.module.scss';

interface AdvantageDescriptionProps {
  className?: string;
}

export const AdvantageDescription: FC<AdvantageDescriptionProps> = props => {
  const { children, className } = props;

  return (
    <div className={className}>
      <div className={styles.img} />
      <div>{children}</div>
    </div>
  );
};
