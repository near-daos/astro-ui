import { IconButton } from 'components/button/IconButton';
import { getSocialIconNameFromUrl } from 'helpers/getSocialIconNameFromUrl';
import { ImageProps } from 'next/image';
import React, { VFC } from 'react';

import styles from './dao-details.module.scss';

export interface DaoDetailsProps {
  title: string;
  description: string;
  flag: ImageProps['src'];
  subtitle: string;
  createdAt: string;
  links: string[];
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
        <li className={styles.link} key={link}>
          <a href={link} target="_blank" rel="noreferrer">
            <IconButton size="medium" icon={getSocialIconNameFromUrl(link)} />{' '}
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
