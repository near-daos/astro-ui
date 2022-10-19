import { OpenSearchQuery } from 'services/SearchService/types';

export function buildProposalQuery(query: {
  daoId: string;
  proposalId: string;
}): OpenSearchQuery {
  let q: OpenSearchQuery = {
    bool: {
      must: [] as Record<string, unknown>[],
    },
  };

  // specific DAO
  if (query.daoId) {
    q.bool?.must?.push({
      simple_query_string: {
        query: `"${query.daoId}"`,
        fields: ['daoId'],
      },
    });
  }

  // specific proposal
  if (query.proposalId) {
    q.bool?.must?.push({
      simple_query_string: {
        query: `"${query.proposalId}"`,
        fields: ['id'],
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
