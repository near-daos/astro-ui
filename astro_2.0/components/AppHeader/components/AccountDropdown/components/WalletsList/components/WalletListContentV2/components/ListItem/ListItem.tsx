import { FC } from 'react';
import cn from 'classnames';

import styles from './ListItem.module.scss';

interface ListItemProps {
  className?: string;

  [x: string]: unknown;
}

export const ListItem: FC<ListItemProps> = props => {
  const { children, className, ...rest } = props;

  return (
    <div
      tabIndex={0}
      role="button"
      {...rest}
      className={cn(styles.root, className)}
    >
      {children}
    </div>
  );
};
