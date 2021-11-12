import Link from 'next/link';
import React, { FC } from 'react';

import { Icon, IconName } from 'components/Icon';

import styles from './app-footer.module.scss';

export interface AppFooterProps {
  isLandingPage?: boolean;
  isLoggedIn?: boolean;
}

export const AppFooter: FC<AppFooterProps> = ({
  isLandingPage,
  isLoggedIn
}) => {
  function renderSocialIcon(href: string, icon: IconName) {
    return (
      <a href={href} rel="noopener noreferrer" target="_blank">
        <Icon name={icon} width={24} className={styles.icon} />
      </a>
    );
  }

  return (
    <footer className={styles.root}>
      <div
        className={isLandingPage || !isLoggedIn ? styles.bottom : styles.side}
      >
        <div className={styles.wrapper}>
          {(isLandingPage || !isLoggedIn) && (
            <div className={styles.invitation}>
              <i>
                <Icon name="buttonBookmark" width={32} />
              </i>
              <span>Need a NEAR account?</span>
              <span>
                Create one{' '}
                <Link passHref href="/register">
                  <a href="*" className={styles.register}>
                    here
                  </a>
                </Link>
                .
              </span>
            </div>
          )}
          <div className={styles.social}>
            {renderSocialIcon('https://twitter.com/AstroDao', 'socialTwitter')}
            {renderSocialIcon('https://t.me/astro_near', 'socialTelegram')}
          </div>
          <div className={styles.version}>
            <a
              className={styles.devLink}
              href="https://doc.clickup.com/p/h/4fh9y-341/f6e2cb99c0b9ce3"
              target="_blank"
              rel="noreferrer noopener"
            >
              Build 21.5
            </a>
            <span className={styles.divider}>|</span>
            <a
              className={styles.devLink}
              href="https://airtable.com/shr4ZmQzmTE5cKZm3"
              target="_blank"
              rel="noreferrer noopener"
            >
              Report issue
            </a>
          </div>
          <div className={styles.copyright}>
            SputnikDAO 2021. The software is an open source and provided “as
            is”, without warranty of any kind. Community developed. Not audited.
            Use at your own risk.
          </div>
        </div>
      </div>
    </footer>
  );
};
