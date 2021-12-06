import cn from 'classnames';
import React, { FC } from 'react';

import { Icon } from 'components/Icon';

import styles from './NavLabel.module.scss';

interface NavLabelProps {
  label: string;
  className: string;
  icon: 'buttonArrowLeft' | 'buttonArrowRight';
}

export const NavLabel: FC<NavLabelProps> = ({ label, className, icon }) => (
  <div className={className}>
    {icon === 'buttonArrowLeft' && <Icon name={icon} width={24} />}
    <span
      className={cn(styles.navLabel, {
        [styles.iconLeft]: icon === 'buttonArrowLeft',
        [styles.iconRight]: icon === 'buttonArrowRight',
      })}
    >
      {label}
    </span>
    {icon === 'buttonArrowRight' && <Icon name={icon} width={24} />}
  </div>
);
