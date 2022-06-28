import React, { FC } from 'react';
import cn from 'classnames';

import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Icon } from 'components/Icon';

import styles from './DelegatePageWidget.module.scss';

interface Props {
  title: string;
  className?: string;
  info?: string;
}

export const DelegatePageWidget: FC<Props> = ({
  title,
  children,
  className,
  info,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.title}>
        {title}
        {info && (
          <Tooltip overlay={<span>{info}</span>} placement="top">
            <Icon name="info" width={14} className={styles.info} />
          </Tooltip>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
