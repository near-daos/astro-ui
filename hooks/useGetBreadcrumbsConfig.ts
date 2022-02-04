import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import {
  ALL_DAOS_URL,
  SINGLE_DAO_PAGE,
  GROUPS_PAGE_URL,
  ALL_PROPOSALS_PAGE_URL,
  SINGLE_PROPOSAL_PAGE_URL,
  TREASURY_PAGE_URL,
  SINGLE_BOUNTY_PAGE_URL,
  ALL_BOUNTIES_PAGE_URL,
} from 'constants/routing';
import { UrlObject } from 'url';
import { Proposal } from 'types/proposal';

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
  daoId: string,
  daoDisplayName: string,
  group?: GroupConfig,
  proposal?: Pick<Proposal, 'id'>,
  bountyContextId?: string
): Breadcrumbs {
  const { t } = useTranslation();

  const breadcrumbs = useMemo(() => {
    return {
      ALL_DAOS_URL: {
        href: ALL_DAOS_URL,
        label: t('allDaos'),
      },
      SINGLE_DAO_PAGE: {
        href: {
          pathname: SINGLE_DAO_PAGE,
          query: {
            dao: daoId,
          },
        },
        label: daoDisplayName || daoId,
      },
      ALL_PROPOSALS_PAGE_URL: {
        href: {
          pathname: ALL_PROPOSALS_PAGE_URL,
          query: {
            dao: daoId,
          },
        },
        label: t('daoDetailsMinimized.proposals'),
      },
      SINGLE_PROPOSAL_PAGE_URL: {
        href: {
          pathname: SINGLE_PROPOSAL_PAGE_URL,
          query: {
            dao: daoId,
            proposal: proposal?.id,
          },
        },
        label: proposal?.id ?? '',
      },
      TREASURY: {
        label: t('daoDetailsMinimized.treasury'),
        href: {
          pathname: TREASURY_PAGE_URL,
          query: {
            dao: daoId,
          },
        },
      },
      BOUNTIES: {
        label: 'Bounties',
      },
      ALL_BOUNTIES_PAGE_URL: {
        href: {
          pathname: ALL_BOUNTIES_PAGE_URL,
          query: {
            dao: daoId,
          },
        },
        label: t('bounties'),
      },
      SINGLE_BOUNTY_PAGE_URL: {
        href: {
          pathname: SINGLE_BOUNTY_PAGE_URL,
          query: {
            dao: daoId,
            bountyContext: bountyContextId,
          },
        },
        label: bountyContextId ?? '',
      },
      GROUPS: {
        href: {
          pathname: GROUPS_PAGE_URL,
          query: {
            dao: daoId,
            group: 'all',
          },
        },
        label: t('groups'),
      },
      SINGLE_GROUP: {
        href: {
          pathname: GROUPS_PAGE_URL,
          query: {
            dao: daoId,
            group: group?.id,
          },
        },
        label: group?.label || '',
      },
      CREATE_GOVERNANCE_TOKEN: {
        label: t('daoDetailsMinimized.createGovernanceToken'),
      },
    };
  }, [
    t,
    daoId,
    daoDisplayName,
    proposal?.id,
    bountyContextId,
    group?.id,
    group?.label,
  ]);

  return breadcrumbs;
}
