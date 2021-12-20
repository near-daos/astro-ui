import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import { DAO } from 'types/dao';

import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';
import { ExternalLink } from 'components/ExternalLink';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import { getSocialLinkIcon } from 'helpers/getSocialLinkIcon';

import styles from './DaoDashboardHeader.module.scss';

interface DaoDashboardHeaderProps {
  dao: DAO;
  className?: string;
}

export const DaoDashboardHeader: FC<DaoDashboardHeaderProps> = ({
  className,
  dao: { legal, flagCover, flagLogo, members, description, links },
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn(styles.root, className)}>
      <section
        className={styles.letterHeadSection}
        style={{ backgroundImage: `url(${flagCover})` }}
      >
        <DaoLogo src={flagLogo} className={styles.logo} />
      </section>

      <section className={styles.usersSection}>
        <div className={styles.label}>{t('users')}</div>
        <div className={styles.value}>{members}</div>
      </section>

      <section className={styles.descriptionSection}>
        <p>{description}</p>
      </section>

      <section className={styles.linksSection}>
        {legal.legalLink && (
          <div>
            <a
              href={legal.legalLink}
              target="_blank"
              rel="noreferrer"
              className={styles.legalLink}
            >
              {legal.legalStatus || 'Public Limited Company'}
              <Icon
                name="buttonExternal"
                width={14}
                className={styles.legalIcon}
              />
            </a>
          </div>
        )}
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
      </section>

      <section className={styles.followSection}>
        <Button size="block">{t('follow')}</Button>
      </section>
    </div>
  );
};
