import { OpenSearchQuery } from 'services/SearchService/types';
import { ProposalCategories, ProposalType } from 'types/proposal';
import { DraftState } from 'services/DraftsService/types';

export function buildDraftProposalsQuery(
  params: {
    category?: ProposalCategories;
    daoId: string;
    state: DraftState;
    view: string;
    search?: string;
  },
  accountId: string
): OpenSearchQuery {
  const { category, daoId, state, view } = params;

  let q: OpenSearchQuery = {
    bool: {
      must: [] as Record<string, unknown>[],
      must_not: [] as Record<string, unknown>[],
      should: [] as Record<string, unknown>[],
    },
  };

  if (daoId) {
    q.bool?.must?.push({
      simple_query_string: {
        query: `"${daoId}"`,
        fields: ['daoId'],
      },
    });
  }

  // State
  if (state && state !== 'all') {
    q.bool?.must?.push({
      simple_query_string: {
        query: state,
        fields: ['state'],
      },
    });
  }

  // View
  if (view === 'unread') {
    q.bool?.must_not?.push({
      terms: {
        viewAccounts: [accountId],
      },
    });
  }

  // Categories
  if (category === ProposalCategories.Polls) {
    q.bool?.must?.push({
      simple_query_string: {
        query: ProposalType.Vote,
        fields: ['type'],
      },
    });
  }

  if (category === ProposalCategories.Governance) {
    q.bool?.must?.push({
      bool: {
        should: [ProposalType.ChangeConfig, ProposalType.ChangePolicy].map(
          item => ({
            simple_query_string: {
              query: item,
              fields: ['type'],
            },
          })
        ),
      },
    });
  }

  if (category === ProposalCategories.Bounties) {
    q.bool?.must?.push({
      bool: {
        should: [ProposalType.AddBounty, ProposalType.BountyDone].map(item => ({
          simple_query_string: {
            query: item,
            fields: ['type'],
          },
        })),
      },
    });
  }

  if (category === ProposalCategories.Financial) {
    q.bool?.must?.push({
      simple_query_string: {
        query: ProposalType.Transfer,
        fields: ['type'],
      },
    });
  }

  if (category === ProposalCategories.FunctionCalls) {
    q.bool?.must?.push({
      simple_query_string: {
        query: ProposalType.FunctionCall,
        fields: ['type'],
      },
    });
  }

  if (category === ProposalCategories.Members) {
    q.bool?.must?.push({
      bool: {
        should: [
          ProposalType.AddMemberToRole,
          ProposalType.RemoveMemberFromRole,
        ].map(item => ({
          simple_query_string: {
            query: item,
            fields: ['type'],
          },
        })),
      },
    });
  }

  // account
  if (accountId) {
    q.bool?.must?.push({
      simple_query_string: {
        query: accountId.substring(0, accountId.indexOf('.')),
        fields: ['accounts'],
      },
    });
  }

  if (
    !q.bool?.must?.length &&
    !q.bool?.must_not?.length &&
    !q.bool?.should?.length
  ) {
    q = { match_all: {} };
  }

  return q;
}
