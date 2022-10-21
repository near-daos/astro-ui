import { ProposalsListParams } from 'services/sputnik/types';
import { OpenSearchQuery } from 'services/SearchService/types';
import {
  ProposalCategories,
  ProposalsFeedStatuses,
  ProposalType,
} from 'types/proposal';

export function buildProposalsQuery(
  query: ProposalsListParams,
  accountId?: string
): OpenSearchQuery {
  let q: OpenSearchQuery = {
    bool: {
      must: [] as Record<string, unknown>[],
      must_not: [] as Record<string, unknown>[],
      should: [] as Record<string, unknown>[],
    },
  };

  // ids in the list
  if (query.ids) {
    q.bool?.must?.push({
      bool: {
        should: query.ids.map(item => ({
          simple_query_string: {
            query: item,
            fields: ['id'],
          },
        })),
      },
    });
  }

  // specific DAO
  if (query.daoId) {
    q.bool?.must?.push({
      simple_query_string: {
        query: `"${query.daoId}"`,
        fields: ['daoId'],
      },
    });
  }

  // Proposers
  if (query?.proposers) {
    q.bool?.must?.push({
      bool: {
        should: query?.proposers.split(',').map(item => ({
          simple_query_string: {
            query: `"${item}"`,
            fields: ['proposer'],
          },
        })),
      },
    });
  }

  // Statuses
  if (
    query?.status === ProposalsFeedStatuses.Active ||
    query?.status === ProposalsFeedStatuses.VoteNeeded
  ) {
    q.bool?.must?.push({
      simple_query_string: {
        query: 'InProgress',
        fields: ['status'],
      },
    });
    q.bool?.must?.push({
      simple_query_string: {
        query: 'Active',
        fields: ['voteStatus'],
      },
    });
  }

  if (query?.status === ProposalsFeedStatuses.Approved) {
    q.bool?.must?.push({
      simple_query_string: {
        query: 'Approved',
        fields: ['status'],
      },
    });
  }

  if (query?.status === ProposalsFeedStatuses.Failed) {
    q.bool?.must?.push({
      bool: {
        should: ['Rejected', 'Expired', 'Moved', 'Removed'].map(item => ({
          simple_query_string: {
            query: item,
            fields: ['status'],
          },
        })),
      },
    });
  }

  // Categories
  if (query.category === ProposalCategories.Polls) {
    q.bool?.must?.push({
      simple_query_string: {
        query: ProposalType.Vote,
        fields: ['type'],
      },
    });
  }

  if (query.category === ProposalCategories.Governance) {
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

  if (query.category === ProposalCategories.Bounties) {
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

  if (query.category === ProposalCategories.Financial) {
    q.bool?.must?.push({
      simple_query_string: {
        query: ProposalType.Transfer,
        fields: ['type'],
      },
    });
  }

  if (query.category === ProposalCategories.FunctionCalls) {
    q.bool?.must?.push({
      simple_query_string: {
        query: ProposalType.FunctionCall,
        fields: ['type'],
      },
    });
  }

  if (query.category === ProposalCategories.Members) {
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
