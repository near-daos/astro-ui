import {
  ALL_DAOS_URL,
  ALL_FEED_URL,
  CREATE_DAO_URL,
  MY_DAOS_URL,
  MY_FEED_URL,
} from 'constants/routing';

import { NavItemProps } from './types';

export const ALL_DAOS_NAV_CONFIG: NavItemProps = {
  icon: 'aAllDaos',
  hoverIcon: 'aAllDaosHover',
  href: ALL_DAOS_URL,
  label: 'Discover',
};

export const ASTRO_FEED_NAV_CONFIG: NavItemProps = {
  icon: 'aAstroFeed',
  hoverIcon: 'aAstroFeedHover',
  href: ALL_FEED_URL,
  label: 'Global Feed',
};

export const MY_DAOS_NAV_CONFIG: NavItemProps = {
  icon: 'aMyDaos',
  hoverIcon: 'aMyDaosHover',
  href: MY_DAOS_URL,
  label: '  My DAOs',
};

export const MY_FEED_NAV_CONFIG: NavItemProps = {
  icon: 'aMyFeed',
  hoverIcon: 'aMyFeedHover',
  href: MY_FEED_URL,
  label: 'My Feed',
};

export const CREATE_DAO_NAV_CONFIG: NavItemProps = {
  icon: 'aCreateDao',
  hoverIcon: 'aCreateDaoHover',
  href: CREATE_DAO_URL,
  label: 'Create DAO',
  authRequired: true,
};
