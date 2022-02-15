import { FC } from 'react';

import { Icon, IconName } from 'components/Icon';

import styles from './AdvantageDescription.module.scss';

interface AdvantageDescriptionProps {
  className?: string;
  icon: IconName;
}

export const AdvantageDescription: FC<AdvantageDescriptionProps> = props => {
  const { icon, children, className } = props;

  return (
    <div className={className}>
      <Icon name={icon} className={styles.img} />
      <div>{children}</div>
    </div>
  );
};
