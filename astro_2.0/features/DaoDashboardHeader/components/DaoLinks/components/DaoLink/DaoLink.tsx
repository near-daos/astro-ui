import { ExternalLink } from 'components/ExternalLink';
import { getSocialLinkIcon } from 'utils/getSocialLinkIcon';
import React from 'react';
import cn from 'classnames';
import styles from './DaoLink.module.scss';

interface DaoLinkProps {
  link: string;
  className?: string;
}

export const DaoLink: React.FC<DaoLinkProps> = ({ link, className }) => {
  return (
    <li className={cn(styles.link, className)} key={link}>
      <ExternalLink to={link} icon={getSocialLinkIcon(link)} />
    </li>
  );
};
