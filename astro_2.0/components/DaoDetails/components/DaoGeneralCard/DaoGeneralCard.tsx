import React, { FC } from 'react';

import { composeProperLinkUrl } from 'helpers/composeProperLinkUrl';
import { IconButton } from 'components/button/IconButton';
import { getSocialLinkIcon } from 'helpers/getSocialLinkIcon';
import { CopyButton } from 'features/copy-button';

import styles from './DaoGeneralCard.module.scss';

interface DaoGeneralCardProps {
  cover: string;
  logo: string;
  displayName: string;
  id: string;
  description: string;
  links: string[];
  preview?: boolean;
}

export const DaoGeneralCard: FC<DaoGeneralCardProps> = ({
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
      <div className={styles.flagWrapper}>
        <div className={styles.background} />
        <div
          className={styles.cover}
          style={{ backgroundImage: `url(${cover})` }}
        />
        {logo && (
          <div
            className={styles.logo}
            style={{ backgroundImage: `url(${logo})` }}
          />
        )}
      </div>
      <div className={styles.generalInfoWrapper}>
        <div className={styles.displayName}>{displayName ?? id}</div>
        <div className={styles.daoId}>
          <div>{id}</div>
          {!preview && <CopyButton text={id} className={styles.copyIcon} />}
        </div>
        <p>{description}</p>
        {!!links?.length && (
          <ul className={styles.links}>
            {links.map(link => (
              <li className={styles.link} key={link}>
                <a
                  href={composeProperLinkUrl(link)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconButton size="medium" icon={getSocialLinkIcon(link)} />
                </a>
              </li>
            ))}
          </ul>
        )}
        <svg className="svg" width="0" height="0">
          <clipPath id="flag-outline">
            <path d="M240.01 0L50.4101 67.7595V105.35L0 123.366V272L189.599 204.24V166.65L240.01 148.634V0Z" />
          </clipPath>
          <clipPath id="flag">
            <path d="M240.01 0L50.4101 67.7595V105.35L0 123.366V272L189.599 204.24V166.65L240.01 148.634V0Z" />
          </clipPath>
        </svg>
      </div>
    </div>
  );
};
