import React, { FC, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import ReactDOM from 'react-dom';
import { useClickAway, useLockBodyScroll } from 'react-use';

import { Icon, IconName } from 'components/Icon';
import { Button } from 'components/button/Button';

import { AnimatePresence, motion } from 'framer-motion';
import { CFC_LIBRARY, DISCOVER } from 'constants/routing';
import { LocaleSelector } from 'astro_2.0/components/LocaleSelector';

import { appConfig } from 'config';

import styles from './MoreInfo.module.scss';

export const MoreInfo: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickAway(ref, e => {
    const rootResElement = (e.target as HTMLElement).closest(
      '#astro_more-info'
    );

    if (!rootResElement) {
      setOpen(false);
    }
  });

  useLockBodyScroll(open);

  function renderSocialIcon(href: string, icon: IconName) {
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className={styles.social}
      >
        <Icon name={icon} width={24} className={styles.icon} />
      </a>
    );
  }

  function renderContent() {
    if (typeof document === 'undefined') {
      return null;
    }

    return ReactDOM.createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            id="astro_more-info"
            className={styles.content}
            initial={{ opacity: 0, transform: 'translateY(40px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0 }}
          >
            <h4 className={styles.title}>More info</h4>

            <Button
              capitalize
              className={styles.moreButton}
              variant="tertiary"
              size="small"
              onClick={() => {
                setOpen(false);
                router.push(CFC_LIBRARY);
              }}
            >
              <Icon name="sidebarActionsLibrary" className={styles.icon} />
              <span>Actions Library</span>
            </Button>

            <Button
              capitalize
              className={styles.moreButton}
              variant="tertiary"
              size="small"
              onClick={() => {
                setOpen(false);
                router.push(DISCOVER);
              }}
            >
              <Icon name="sidebarDaosStats" className={styles.icon} />
              <span>DAOs Statistic</span>
            </Button>
            <Button
              capitalize
              className={styles.moreButton}
              variant="tertiary"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <a
                href={appConfig.RELEASE_NOTES ?? ''}
                rel="noreferrer"
                target="_blank"
              >
                <Icon name="sidebarReleaseNotes" className={styles.icon} />
                <span>Release Notes</span>
              </a>
            </Button>
            <Button
              capitalize
              className={styles.moreButton}
              variant="tertiary"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <a
                href="https://feedback.astrodao.com"
                rel="noreferrer"
                target="_blank"
              >
                <Icon name="sidebarFeedback" className={styles.icon} />
                <span>Feedback</span>
              </a>
            </Button>
            <div className={styles.footer}>
              <div className={styles.locale}>
                <LocaleSelector />
              </div>
              <div>
                {renderSocialIcon(
                  'https://discord.com/invite/KmMqF4KNBM',
                  'socialDiscord'
                )}
                {renderSocialIcon(
                  'https://twitter.com/AstroDao',
                  'socialTwitter'
                )}
                {renderSocialIcon('https://t.me/astro_near', 'socialTelegram')}
              </div>
            </div>
            <div className={styles.copyright}>
              {t('components.appFooter.opensourceAsIs')}
              <br />
              {t('components.appFooter.communityDeveloped')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  }

  return (
    <div ref={ref}>
      <Button
        variant="transparent"
        size="block"
        className={cn(styles.root, {
          [styles.open]: open,
        })}
        onClick={() => setOpen(!open)}
      >
        <div className={cn(styles.iconWrapper)}>
          <Icon name="buttonMore" className={cn(styles.more)} />
        </div>
        <div className={styles.label}>More</div>
      </Button>
      {renderContent()}
    </div>
  );
};
