import cn from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { DISCOVER } from 'constants/routing';

import { Icon, IconName } from 'components/Icon';
import { LocaleSelector } from 'astro_2.0/components/LocaleSelector';

import { configService } from 'services/ConfigService';

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
  const { t } = useTranslation();

  const { appConfig } = configService.get();
  const RELEASE_NOTES = appConfig?.RELEASE_NOTES || '';

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
            {renderSocialIcon(
              'https://discord.com/invite/KmMqF4KNBM',
              'socialDiscord'
            )}
            {renderSocialIcon('https://twitter.com/AstroDao', 'socialTwitter')}
            {renderSocialIcon('https://t.me/astro_near', 'socialTelegram')}
          </div>
          <a
            className={styles.devLink}
            href="https://github.com/near-daos/astro-ui/discussions"
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('components.appFooter.askQuestion')}
          </a>
          <div className={styles.version}>
            <a
              className={styles.devLink}
              href="https://github.com/near-daos/astro-ui/issues"
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
              {t('components.appFooter.githubRepo')}
            </a>
            <a
              className={styles.devLink}
              href="https://testnet.app.astrodao.com/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Testnet env
            </a>
            <a
              className={styles.devLink}
              href="https://api.app.astrodao.com/docs/#/"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t('components.appFooter.swaggerApi')}
            </a>
            <Link passHref href={DISCOVER}>
              <a href="*" className={styles.devLink}>
                {t('components.appFooter.stats')}
              </a>
            </Link>
          </div>
          <div className={styles.copyright}>
            {t('components.appFooter.opensourceAsIs')}
            <br />
            {t('components.appFooter.communityDeveloped')}
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

          <div className={styles.locale}>
            <LocaleSelector />
          </div>
        </div>
      </div>
    </div>
  );
};
