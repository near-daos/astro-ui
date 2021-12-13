import cn from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { Icon, IconName } from 'components/Icon';

import styles from './AppFooter.module.scss';

export interface AppFooterProps {
  mobile?: boolean;
  className?: string;
  onClick?: () => void;
}

const RELEASE_NOTES = process.env.NEXT_PUBLIC_RELEASE_NOTES;

export const AppFooter: FC<AppFooterProps> = ({
  mobile,
  className,
  onClick,
}) => {
  const { t } = useTranslation();

  function renderSocialIcon(href: string, icon: IconName) {
    return (
      <a href={href} rel="noopener noreferrer" target="_blank">
        <Icon name={icon} width={24} className={styles.icon} />
      </a>
    );
  }

  const rootClassName = cn(styles.root, className, {
    [styles.mobile]: mobile,
  });

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyPress={onClick}
      className={rootClassName}
    >
      <div className={styles.side}>
        <div className={styles.wrapper}>
          <div className={styles.social}>
            {renderSocialIcon('https://twitter.com/AstroDao', 'socialTwitter')}
            {renderSocialIcon('https://t.me/astro_near', 'socialTelegram')}
          </div>
          <div className={styles.version}>
            <a
              className={styles.devLink}
              href="https://airtable.com/shr4ZmQzmTE5cKZm3"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t('reportAnIssue')}
            </a>
          </div>
          <div className={styles.repo}>
            <a
              className={styles.devLink}
              href="https://github.com/near-daos/astro-ui"
              target="_blank"
              rel="noreferrer noopener"
            >
              Github repo
            </a>
          </div>
          <div className={styles.copyright}>
            SputnikDAO 2021. The software is an open source and provided “as
            is”, without warranty of any kind.
            <br />
            Community developed. Not audited. Use at your own risk.
          </div>
          <div className={styles.terms}>
            <Link passHref href="/terms-conditions">
              <a href="*" className={styles.devLink}>
                {t('termsAndConditions')}
              </a>
            </Link>
          </div>
          <div className={styles.release}>
            <a
              className={styles.devLink}
              href={RELEASE_NOTES}
              target="_blank"
              rel="noreferrer noopener"
            >
              {t('releaseNotes')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
