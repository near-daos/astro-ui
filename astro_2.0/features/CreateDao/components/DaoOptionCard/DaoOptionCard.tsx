import cn from 'classnames';
import React from 'react';
import styles from './DaoOptionCard.module.scss';

export interface DaoOptionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  className?: string;
  iconNode?: JSX.Element;
  title: string;
  description: string;
  onClick?: () => void | undefined;
}

export const DaoOptionCard: React.VFC<DaoOptionCardProps> = ({
  active,
  className: classNameProp,
  iconNode,
  title,
  description,
  ...props
}) => {
  const className = cn(
    styles.root,
    {
      [styles.active]: active,
    },
    classNameProp
  );

  return (
    <div {...props} className={className}>
      <div className={styles.icon}>{iconNode}</div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};
