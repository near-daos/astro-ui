import React, { FC } from 'react';
import cn from 'classnames';

import styles from './InfoPanel.module.scss';

interface InfoPanelProps {
  className?: string;
}

export const InfoPanel: FC<InfoPanelProps> = ({ children, className }) => {
  return <div className={cn(styles.root, className)}>{children}</div>;
};
