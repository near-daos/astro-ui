import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import { DAO } from 'types/dao';

import { FollowButton } from 'astro_2.0/features/DaoDashboardHeader/components/FollowButton';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';
import { ExternalLink } from 'components/ExternalLink';
import { Icon } from 'components/Icon';

import { getSocialLinkIcon } from 'utils/getSocialLinkIcon';
import { useAuthContext } from 'context/AuthContext';

import styles from './DaoDashboardHeader.module.scss';

interface DaoDashboardHeaderProps {
  dao: DAO;
  className?: string;
}

export const DaoDashboardHeader: FC<DaoDashboardHeaderProps> = ({
  className,
  dao: {
    id,
    displayName,
    legal,
    daoMembersList,
    flagCover,
    flagLogo,
    members,
    description,
    links,
  },
}) => {
  const { accountId } = useAuthContext();
  const { t } = useTranslation();

  return (
    <div className={cn(styles.root, className)}>
      <section
        className={styles.letterHeadSection}
        style={{
          backgroundImage: `url(${flagCover || '/flags/defaultDaoFlag.png'})`,
        }}
      >
        <DaoLogo src={flagLogo} className={styles.logo} />
      </section>

      <section className={styles.usersSection}>
        <div className={styles.label}>{t('users')}</div>
        <div className={styles.value}>{members}</div>
        {!daoMembersList.includes(accountId) && (
          <FollowButton daoId={id} daoName={displayName} />
        )}
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
    </div>
  );
};
