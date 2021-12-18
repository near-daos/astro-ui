import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import { DAO } from 'types/dao';

import {
  ALL_DAOS_URL,
  SINGLE_DAO_PAGE,
  GROUPS_PAGE_URL,
  ALL_PROPOSALS_PAGE_URL,
} from 'constants/routing';
import { UrlObject } from 'url';

type GroupConfig = {
  id: string;
  label: string;
};

type Breadcrumbs = Record<
  string,
  {
    href?: string | UrlObject;
    label: string;
  }
>;

export function useGetBreadcrumbsConfig(
  dao?: DAO,
  group?: GroupConfig
): Breadcrumbs {
  const { t } = useTranslation();

  const breadcrumbs = useMemo(() => {
    const { id = '', displayName = '' } = dao || {};

    return {
      ALL_DAOS_URL: {
        href: ALL_DAOS_URL,
        label: t('allDaos'),
      },
      SINGLE_DAO_PAGE: {
        href: {
          pathname: SINGLE_DAO_PAGE,
          query: {
            dao: id,
          },
        },
        label: displayName || id,
      },
      ALL_PROPOSALS_PAGE_URL: {
        href: {
          pathname: ALL_PROPOSALS_PAGE_URL,
          query: {
            dao: id,
          },
        },
        label: t('proposals'),
      },
      TREASURY: {
        label: 'Treasury',
      },
      BOUNTIES: {
        label: 'Bounties',
      },
      GROUPS: {
        href: {
          pathname: GROUPS_PAGE_URL,
          query: {
            dao: id,
            group: 'all',
          },
        },
        label: t('groups'),
      },
      SINGLE_GROUP: {
        href: {
          pathname: GROUPS_PAGE_URL,
          query: {
            dao: id,
            group: group?.id,
          },
        },
        label: group?.label || '',
      },
    };
  }, [t, dao, group]);

  return breadcrumbs;
}
