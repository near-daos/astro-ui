import cn from 'classnames';
import { Button } from 'components/button/Button';
import { IconButton } from 'components/button/IconButton';
import { Icon } from 'components/Icon';
import { getSocialLinkIcon } from 'helpers/getSocialLinkIcon';
import { ImageProps } from 'next/image';
import Link from 'next/link';
import React, { VFC } from 'react';
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
  sendFunds?: boolean;
  followed?: boolean;
}

export const DaoDetails: VFC<DaoDetailsProps> = ({
  title,
  subtitle,
  description,
  links,
  flag,
  more,
  sendFunds,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  followed
}) => {
  return (
    <>
      <div className={styles.root}>
        <h1>{title}</h1>
        <div className={styles.row}>
          <div className={styles.subtitle}>{subtitle}</div>
          {sendFunds && (
            <Button variant="secondary" className={styles.send}>
              <Icon name="buttonAdd" width={24} /> Send funds
            </Button>
          )}
        </div>
        <p className={styles.content}>
          {description}
          {more && (
            <Link href={more.link}>
              <a className={styles.link}>
                <span className={styles.linkText}>{more.label}</span>
                <Icon
                  name="buttonArrowRight"
                  width={16}
                  className={styles.right}
                />
                <Icon
                  name="buttonExternal"
                  width={16}
                  className={styles.external}
                />
              </a>
            </Link>
          )}
        </p>
        <div
          className={styles.flag}
          style={{ backgroundImage: `url(${flag})` }}
        />
        <div className={cn(styles.row, styles.bottom)}>
          {!!links?.length && (
            <ul className={styles.links}>
              {links.map(link => (
                <li className={styles.link} key={link}>
                  <a href={link} target="_blank" rel="noreferrer">
                    <IconButton size="medium" icon={getSocialLinkIcon(link)} />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.followCell}>
            {/* <Button */}
            {/*  variant="secondary" */}
            {/*  className={cn( */}
            {/*    styles.follow, */}
            {/*    followed && styles.followed, */}
            {/*    'disabled' */}
            {/*  )} */}
            {/* > */}
            {/*  <Icon name="buttonBookmark" width={24} className={styles.icon} /> */}
            {/*  {followed ? 'Unfollow' : 'Follow'} */}
            {/* </Button> */}
          </div>
        </div>
      </div>
    </>
  );
};
