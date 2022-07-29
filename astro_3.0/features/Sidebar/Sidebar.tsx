import React, { ComponentProps, FC, useMemo, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { useCookie } from 'react-use';

import { Icon, IconName } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SidebarMarker } from 'astro_3.0/features/Sidebar/components/SidebarMarker';
import { SidebarNavItem } from 'astro_3.0/features/Sidebar/components/SidebarNavItem';
import { SidebarDaos } from 'astro_3.0/features/Sidebar/components/SidebarDaos';
import { LocaleSelector } from 'astro_2.0/components/LocaleSelector';

import {
  ALL_FEED_URL,
  CFC_LIBRARY,
  DISCOVER,
  MY_FEED_URL,
} from 'constants/routing';

import { configService } from 'services/ConfigService';

import styles from './Sidebar.module.scss';

export const Sidebar: FC = () => {
  const [value, updateCookie] = useCookie('astroAppSidebar');
  const [expanded, setExpanded] = useState(value === '1');
  const { t } = useTranslation();
  const { appConfig } = configService.get();

  const navItems: ComponentProps<typeof SidebarNavItem>[] = useMemo(() => {
    return [
      {
        icon: 'sidebarHome',
        label: 'Home',
        href: MY_FEED_URL,
      },
      {
        icon: 'sidebarDaosAndUsers',
        label: 'DAOs and Users',
        href: DISCOVER,
      },
      {
        icon: 'sidebarBounties',
        label: 'Bounties area',
        href: ALL_FEED_URL,
      },
      {
        icon: 'sidebarActionsLibrary',
        label: 'Actions Library',
        href: CFC_LIBRARY,
      },
      {
        icon: 'sidebarDaosStats',
        label: 'DAOs Statistic',
        href: 'none',
      },
    ];
  }, []);

  function renderSocialIcon(href: string, icon: IconName) {
    return (
      <a href={href} rel="noopener noreferrer" target="_blank">
        <Icon name={icon} width={24} className={styles.icon} />
      </a>
    );
  }

  return (
    <div className={styles.root}>
      <div
        className={cn(styles.content, {
          [styles.expanded]: expanded,
        })}
      >
        <div className={styles.top}>
          <Button
            size="block"
            variant="transparent"
            onClick={() => {
              updateCookie(!expanded ? '1' : '0', { path: '/' });
              setExpanded(!expanded);
            }}
          >
            <Icon name="burgerMenu" className={styles.topIcon} />
          </Button>
        </div>
        <div className={styles.nav}>
          <SidebarMarker items={navItems} />
          {navItems.map(item => (
            <SidebarNavItem key={item.label} {...item} />
          ))}
        </div>
        <div className={styles.separator} />
        <div className={styles.daos}>
          <SidebarDaos />
        </div>
        <div className={styles.separator} />
        <div className={styles.nav}>
          <SidebarNavItem
            label="Release notes"
            icon="sidebarReleaseNotes"
            href={appConfig?.RELEASE_NOTES || ''}
            externalLink
          />
          <SidebarNavItem
            label="Leave feedback"
            icon="sidebarFeedback"
            href="https://feedback.astrodao.com"
            externalLink
          />
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              className={styles.footer}
              data-expanded="false"
              initial={{
                opacity: 0,
                // transform: 'translateY(180px)',
                height: 0,
                display: 'none',
              }}
              animate={{
                opacity: 1,
                // transform: 'translateY(0px)',
                height: 160,
                display: 'block',
                transition: {
                  type: 'spring',
                  delay: 0.1,
                  bounce: 0,
                },
              }}
              exit={{
                opacity: 0,
                // transform: 'translateY(180px)',
                height: 0,
                transition: {
                  duration: 0.2,
                },
                transitionEnd: {
                  display: 'none',
                },
              }}
            >
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
