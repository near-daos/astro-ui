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
  GOVERNANCE_TOKEN_INFO_URL,
  DAO_SETTINGS_PAGE_URL,
  DAO_CONFIG_PAGE_URL,
  DAO_CUSTOM_FC_TEMPLATES_PAGE_URL,
  DRAFTS_PAGE_URL,
  DRAFT_PAGE_URL,
  CREATE_DRAFT_PAGE_URL,
  EDIT_DRAFT_PAGE_URL,
  DELEGATE_PAGE_URL,
} from 'constants/routing';
import { UrlObject } from 'url';
import { Proposal } from 'types/proposal';
import { DraftProposal } from 'types/draftProposal';

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
  bountyContextId?: string,
  draft?: Pick<DraftProposal, 'id'>
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
      GOVERNANCE_TOKEN_INFO: {
        label: 'Governance Token',
        href: {
          pathname: GOVERNANCE_TOKEN_INFO_URL,
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
      POLLS: {
        label: t('polls'),
      },
      NFTS: {
        label: 'NFTs',
      },
      SETTINGS: {
        label: t('daoSettings'),
        href: {
          pathname: DAO_SETTINGS_PAGE_URL,
          query: {
            dao: daoId,
          },
        },
      },
      DAO_CONFIG: {
        label: t('daoConfig'),
        href: {
          pathname: DAO_CONFIG_PAGE_URL,
          query: {
            dao: daoId,
          },
        },
      },
      CUSTOM_FC_TEMPLATES: {
        label: t('customFunctionCallTemplates'),
        href: {
          pathname: DAO_CUSTOM_FC_TEMPLATES_PAGE_URL,
          query: {
            dao: daoId,
          },
        },
      },
      DELEGATE: {
        label: 'Delegate',
        href: {
          pathname: DELEGATE_PAGE_URL,
          query: {
            dao: daoId,
          },
        },
      },
      DRAFTS: {
        label: t('daoDetailsMinimized.drafts'),
        href: {
          pathname: DRAFTS_PAGE_URL,
          query: {
            dao: daoId,
          },
        },
      },
      SINGLE_DRAFT_PAGE_URL: {
        label: draft?.id ?? '',
        href: {
          pathname: DRAFT_PAGE_URL,
          query: {
            dao: daoId,
            draft: draft?.id ?? '',
          },
        },
      },
      CREATE_DRAFT_PAGE_URL: {
        label: t('drafts.breadcrumbs.createDraft'),
        href: {
          pathname: CREATE_DRAFT_PAGE_URL,
          query: {
            dao: daoId,
          },
        },
      },
      EDIT_DRAFT_PAGE_URL: {
        label: t('drafts.breadcrumbs.editDraft'),
        href: {
          pathname: EDIT_DRAFT_PAGE_URL,
          query: {
            dao: daoId,
            draft: draft?.id ?? '',
          },
        },
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
    draft?.id,
  ]);

  return breadcrumbs;
}
