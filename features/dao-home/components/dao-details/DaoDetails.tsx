import Link from 'next/link';
import { IconButton } from 'components/button/IconButton';
import { getSocialIconNameFromUrl } from 'helpers/getSocialIconNameFromUrl';
import { ImageProps } from 'next/image';
import React, { VFC } from 'react';

import { Icon } from 'components/Icon';

import styles from './dao-details.module.scss';

export interface DaoDetailsProps {
  title: string;
  description: string;
  flag: ImageProps['src'];
  subtitle: string;
  createdAt: string;
  links: string[];
  more?: {
    label: string;
    link: string;
  };
}

export const DaoDetails: VFC<DaoDetailsProps> = ({
  title,
  subtitle,
  description,
  links,
  flag,
  more
}) => (
  <div className={styles.root}>
    <h1>{title}</h1>
    <div className={styles.subtitle}>{subtitle}</div>
    <p className={styles.content}>{description}</p>
    <div className={styles.flag} style={{ backgroundImage: `url(${flag})` }} />
    {!!links?.length && (
      <ul className={styles.links}>
        {links.map(link => (
          <li className={styles.link} key={link}>
            <a href={link} target="_blank" rel="noreferrer">
              <IconButton size="medium" icon={getSocialIconNameFromUrl(link)} />
            </a>
          </li>
        ))}
      </ul>
    )}
    {more && (
      <div>
        <Link href={more.link}>
          <a className={styles.link}>
            {more.label}
            <Icon name="buttonArrowRight" width={24} />
          </a>
        </Link>
      </div>
    )}
  </div>
);
