import React, { FC } from 'react';
import Link from 'next/link';

import { getSocialLinkIcon } from 'helpers/getSocialLinkIcon';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { FlagRenderer } from 'astro_2.0/components/Flag';
import ExternalLink from 'components/cards/components/external-link/ExternalLink';

import styles from './DaoGeneralCard.module.scss';

interface DaoGeneralCardProps {
  cover?: string;
  logo?: string;
  flag?: string;
  displayName: string;
  id: string;
  description: string;
  links: string[];
  preview?: boolean;
}

export const DaoGeneralCard: FC<DaoGeneralCardProps> = ({
  flag,
  cover,
  logo,
  displayName,
  id,
  description,
  links,
  preview = false,
}) => {
  return (
    <div className={styles.root}>
      <Link href={`/dao/${id}`}>
        <a>
          <div className={styles.flagWrapper}>
            <FlagRenderer flag={cover} size="lg" logo={logo} fallBack={flag} />
          </div>
        </a>
      </Link>
      <div className={styles.generalInfoWrapper}>
        <section>
          <Link href={`/dao/${id}`}>
            <a>
              <div className={styles.displayName}>{displayName || id}</div>
            </a>
          </Link>
          <div className={styles.daoId}>
            <div>{id}</div>
            {!preview && <CopyButton text={id} className={styles.copyIcon} />}
          </div>
          <p>{description}</p>
        </section>
        <section>
          {!!links?.length && (
            <ul className={styles.links}>
              {links
                .filter(link => link)
                .map(link => (
                  <li className={styles.link} key={link}>
                    <ExternalLink to={link} icon={getSocialLinkIcon(link)} />
                  </li>
                ))}
            </ul>
          )}
          <svg className="svg" width="0" height="0">
            <clipPath id="flag">
              <path d="M240.01 0L50.4101 67.7595V105.35L0 123.366V272L189.599 204.24V166.65L240.01 148.634V0Z" />
            </clipPath>
          </svg>
        </section>
      </div>
    </div>
  );
};
