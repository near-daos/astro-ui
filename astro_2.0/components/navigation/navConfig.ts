import {
  ALL_DAOS_URL,
  ALL_FEED_URL,
  CFC_LIBRARY,
  CREATE_DAO_URL,
  DISCOVER,
  MY_DAOS_URL,
  MY_FEED_URL,
} from 'constants/routing';

import { NavItemProps } from './types';

export const DISCOVER_NAV_CONFIG: NavItemProps = {
  icon: 'aDiscover',
  hoverIcon: 'aDiscover',
  href: DISCOVER,
  label: 'Discovery',
};

export const CFC_LIBRARY_NAV_CONFIG: NavItemProps = {
  icon: 'proposalFunctionCall',
  hoverIcon: 'proposalFunctionCall',
  href: CFC_LIBRARY,
  label: 'Actions Library',
};

export const ALL_DAOS_NAV_CONFIG: NavItemProps = {
  icon: 'aAllDaos',
  hoverIcon: 'aAllDaosHover',
  href: ALL_DAOS_URL,
  label: 'All DAOs',
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
