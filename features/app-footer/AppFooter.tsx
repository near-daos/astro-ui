import React, { FC } from 'react';
import Link from 'next/link';
import { Icon } from 'components/Icon';
import styles from './app-footer.module.scss';

export interface AppFooterProps {
  isLandingPage?: boolean;
  isLoggedIn?: boolean;
}

export const AppFooter: FC<AppFooterProps> = ({
  isLandingPage,
  isLoggedIn
}) => {
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
            <a href="https://discord.com/" rel="noopener noreferrer">
              <Icon name="socialDiscord" width={24} className={styles.icon} />
            </a>
            <a href="https://twitter.com/" rel="noopener noreferrer">
              <Icon name="socialTwitter" width={24} className={styles.icon} />
            </a>
            <a href="https://github.com/" rel="noopener noreferrer">
              <Icon name="socialGithub" width={24} className={styles.icon} />
            </a>
            <a href="https://telegram.org/" rel="noopener noreferrer">
              <Icon name="socialTelegram" width={24} className={styles.icon} />
            </a>
          </div>
          <div className={styles.links}>
            <Link passHref href="/policy">
              <a href="*" className={styles.link}>
                Privacy Policy
              </a>
            </Link>
            <Link passHref href="/terms">
              <a href="*" className={styles.link}>
                Terms of Use
              </a>
            </Link>
          </div>
          <div className={styles.copyright}>
            SputnikDAO 2021. The software is an&nbsp;open source and provided
            “as&nbsp;is”, without warranty of&nbsp;any kind.
          </div>
          <div className={styles.powered}>
            <span>powered by</span>
            <i>
              <Icon name="logoNearFull" width={77} className={styles.logo} />
            </i>
          </div>
        </div>
      </div>
    </footer>
  );
};
