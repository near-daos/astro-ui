import React, { VFC } from 'react';
import { IconButton } from 'components/button/IconButton';
import { ImageProps } from 'next/image';

import styles from './dao-details.module.scss';

type ExternalLink = {
  type: 'Twitter' | 'Discord' | 'AnyUrl';
  url: string;
};

export interface DaoDetailsProps {
  title: string;
  description: string;
  flag: ImageProps['src'];
  subtitle: string;
  createdAt: string;
  links: ExternalLink[];
}

export const DaoDetails: VFC<DaoDetailsProps> = ({
  title,
  subtitle,
  description,
  links,
  flag
}) => (
  <div className={styles.root}>
    <h1>{title}</h1>
    <div className={styles.subtitle}>{subtitle}</div>
    <p className={styles.content}>{description}</p>
    <div className={styles.flag} style={{ backgroundImage: `url(${flag})` }} />
    <ul className={styles.links}>
      {links.map(link => (
        <li className={styles.link} key={link.type}>
          <a href={link.url} target="_blank" rel="noreferrer">
            <IconButton size="medium" icon={`social${link.type}`} />
          </a>
        </li>
      ))}
    </ul>
  </div>
);
