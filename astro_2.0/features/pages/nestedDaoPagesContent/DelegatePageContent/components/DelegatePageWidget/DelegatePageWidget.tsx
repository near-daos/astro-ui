import React, { FC } from 'react';
import cn from 'classnames';

import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Icon, IconName } from 'components/Icon';

import styles from './DelegatePageWidget.module.scss';

interface Props {
  title: string;
  className?: string;
  titleClassName?: string;
  info?: string;
  avatar?: string;
  titleIcon?: IconName;
}

export const DelegatePageWidget: FC<Props> = ({
  title,
  children,
  className,
  info,
  avatar,
  titleClassName,
  titleIcon,
}) => {
  return (
    <div className={cn(styles.root, className)}>
      {avatar && (
        <div className={styles.avatar}>
          <Icon name="defaultAvatar" className={styles.avatarIcon} />
        </div>
      )}
      <div className={styles.body}>
        <div className={cn(styles.title, titleClassName)}>
          {titleIcon && <Icon name={titleIcon} className={styles.titleIcon} />}
          {title}
          {info && (
            <Tooltip overlay={<span>{info}</span>} placement="top">
              <Icon name="info" width={14} className={styles.info} />
            </Tooltip>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
