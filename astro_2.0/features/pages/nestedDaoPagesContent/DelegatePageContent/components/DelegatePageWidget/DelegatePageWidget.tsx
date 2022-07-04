import React, { FC } from 'react';
import cn from 'classnames';

import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Icon, IconName } from 'components/Icon';

import styles from './DelegatePageWidget.module.scss';

interface Props {
  title: string;
  className?: string;
  titleClassName?: string;
  iconClassName?: string;
  info?: string;
  icon?: IconName;
}

export const DelegatePageWidget: FC<Props> = ({
  title,
  children,
  className,
  info,
  icon,
  titleClassName,
  iconClassName,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={cn(styles.title, titleClassName)}>
        {icon && (
          <Icon name={icon} className={cn(styles.icon, iconClassName)} />
        )}
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
