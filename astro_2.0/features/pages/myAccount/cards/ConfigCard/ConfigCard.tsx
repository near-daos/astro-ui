import { FC, PropsWithChildren } from 'react';
import cn from 'classnames';

import styles from './ConfigCard.module.scss';

interface ConfigCardProps extends PropsWithChildren {
  className?: string;
}

export const ConfigCard: FC<ConfigCardProps> = props => {
  const { children, className } = props;

  return <div className={cn(styles.root, className)}>{children}</div>;
};
