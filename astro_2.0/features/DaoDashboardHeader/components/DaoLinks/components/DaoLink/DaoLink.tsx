import { ExternalLink } from 'components/ExternalLink';
import { getSocialLinkIcon } from 'utils/getSocialLinkIcon';
import React from 'react';
import styles from './DaoLink.module.scss';

interface DaoLinkProps {
  link: string;
}

export const DaoLink: React.FC<DaoLinkProps> = ({ link }) => {
  return (
    <li className={styles.link} key={link}>
      <ExternalLink to={link} icon={getSocialLinkIcon(link)} />
    </li>
  );
};
