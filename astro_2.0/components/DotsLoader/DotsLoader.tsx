import { VFC } from 'react';
import cn from 'classnames';

import styles from './DotsLoader.module.scss';

interface DotsLoaderProps {
  className?: string;
  dotClassName?: string;
}

export const DotsLoader: VFC<DotsLoaderProps> = ({
  className,
  dotClassName,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={cn(styles.p1, dotClassName)} />
      <div className={cn(styles.p2, dotClassName)} />
      <div className={cn(styles.p3, dotClassName)} />
      <div className={cn(styles.p4, dotClassName)} />
    </div>
  );
};
