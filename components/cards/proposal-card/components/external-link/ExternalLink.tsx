import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';

import styles from './external-link.module.scss';

interface ExternalLinkProps {
  to: string;
  children: ReactNode;
}

const ExternalLink: FC<ExternalLinkProps> = ({ to, children }) => {
  return (
    <a
      href={to}
      target="_blank"
      rel="noreferrer"
      className={cn('caption1', styles.root)}
    >
      <Icon name="buttonExternal" width={14} />
      &nbsp;
      <span className={cn('caption1', styles.text)}>{children}</span>
    </a>
  );
};

export default ExternalLink;
