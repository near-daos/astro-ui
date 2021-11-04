import React from 'react';
import cn from 'classnames';

import styles from './DaoOptionCard.module.scss';

export interface DaoOptionCardProps {
  title: string;
  active: boolean;
  className?: string;
  description: string;
  iconNode?: JSX.Element;
  onSelect: () => void;
}

export const DaoOptionCard: React.VFC<DaoOptionCardProps> = ({
  title,
  active,
  className,
  iconNode,
  description,
  onSelect,
}) => {
  const rootClassName = cn(styles.root, className, {
    [styles.active]: active,
  });

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onSelect}
      onKeyPress={onSelect}
      className={rootClassName}
    >
      <div className={styles.icon}>{iconNode}</div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};
