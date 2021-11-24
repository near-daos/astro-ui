import cn from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';

import { Icon, IconName } from 'components/Icon';

import styles from './AppFooter.module.scss';

export interface AppFooterProps {
  mobile?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AppFooter: FC<AppFooterProps> = ({
  mobile,
  className,
  onClick,
}) => {
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
            <div>
              <a
                className={styles.devLink}
                href="https://doc.clickup.com/p/h/4fh9y-341/f6e2cb99c0b9ce3"
                target="_blank"
                rel="noreferrer noopener"
              >
                Build number: 22.0
              </a>
            </div>
            <div>
              <a
                className={styles.devLink}
                href="https://airtable.com/shr4ZmQzmTE5cKZm3"
                target="_blank"
                rel="noreferrer noopener"
              >
                Report an issue
              </a>
            </div>
            <div>
              <Link passHref href="/terms-conditions">
                <a href="*" className={styles.devLink}>
                  Terms and Conditions
                </a>
              </Link>
            </div>
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
            {'SputnikDAO 2021. The software is an open source and provided “as' +
              'is”, without warranty of any kind.\n\n' +
              'Community developed. Not audited. Use at your own risk.'}
          </div>

          <div className={styles.powered}>
            <span>powered by</span>
            <i>
              <Icon name="logoNearFull" width={77} className={styles.logo} />
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};
