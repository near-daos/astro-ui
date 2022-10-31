import React, { FC, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { usePopper } from 'react-popper';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useClickAway } from 'react-use';

import { SidebarActionItem } from 'astro_3.0/features/Sidebar/components/SidebarActionItem';
import { LocaleSelector } from 'astro_2.0/components/LocaleSelector';
import { Icon, IconName } from 'components/Icon';

import { Button } from 'components/button/Button';
import { DISCOVER, TERMS_AND_CONDITIONS } from 'constants/routing';

import { configService } from 'services/ConfigService';

import styles from './SidebarMore.module.scss';

const POPUP_LEFT_MARGIN = 20;
const POPUP_RIGHT_MARGIN = 20;

export const SidebarMore: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const ref = useRef(null);
  const { appConfig } = configService.get();
  const RELEASE_NOTES = appConfig?.RELEASE_NOTES || '';

  const { styles: popperStyles, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [24, 24],
          },
        },
        {
          name: 'preventOverflow',
          options: {
            padding: { left: POPUP_LEFT_MARGIN, right: POPUP_RIGHT_MARGIN },
          },
        },
      ],
    }
  );

  useClickAway(ref, e => {
    const rootResElement = (e.target as HTMLElement).closest(
      '#astro_sidebar-more'
    );

    if (!rootResElement) {
      setOpen(false);
    }
  });

  function renderSocialIcon(href: string, icon: IconName) {
    return (
      <a href={href} rel="noopener noreferrer" target="_blank">
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
          <div
            ref={setPopperElement}
            style={{ ...popperStyles.popper, zIndex: 100 }}
            {...attributes.popper}
          >
            <motion.div
              id="astro_sidebar-more"
              className={styles.root}
              initial={{ opacity: 0, transform: 'translateY(40px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0 }}
            >
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
                  router.push(TERMS_AND_CONDITIONS);
                }}
              >
                <Icon name="sidebarReleaseNotes" className={styles.icon} />
                <span>Terms and Conditions</span>
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
                <a href={RELEASE_NOTES ?? ''} rel="noreferrer" target="_blank">
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
              <div className={styles.row}>
                <span>
                  <LocaleSelector />
                </span>
                <span>
                  {renderSocialIcon(
                    'https://discord.com/invite/KmMqF4KNBM',
                    'socialDiscord'
                  )}
                  {renderSocialIcon(
                    'https://twitter.com/AstroDao',
                    'socialTwitter'
                  )}
                  {renderSocialIcon(
                    'https://t.me/astro_near',
                    'socialTelegram'
                  )}
                </span>
              </div>
              <div className={styles.copyright}>
                {t('components.appFooter.opensourceAsIs')}
                <br />
                {t('components.appFooter.communityDeveloped')}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  }

  return (
    <div ref={ref}>
      <SidebarActionItem
        label="More"
        icon="buttonMore"
        iconClassName={styles.controlIcon}
        onClick={() => {
          setOpen(!open);
        }}
      />
      <div
        className={styles.anchor}
        ref={setReferenceElement as React.LegacyRef<HTMLDivElement>}
      />
      {renderContent()}
    </div>
  );
};
