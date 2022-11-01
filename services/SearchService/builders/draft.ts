import { OpenSearchQuery } from 'services/SearchService/types';

export function buildDraftQuery(query: {
  daoId: string;
  draftId: string;
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

  // specific draft
  if (query.draftId) {
    q.bool?.must?.push({
      simple_query_string: {
        query: `"${query.draftId}"`,
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
