import { OpenSearchQuery } from 'services/SearchService/types';

export function buildDraftProposalCommentsQuery(params: {
  daoId?: string;
  draftId?: string;
}): OpenSearchQuery {
  const { daoId, draftId } = params;

  let q: OpenSearchQuery = {
    bool: {
      must: [
        {
          match: {
            isArchived: false,
          },
        },
      ] as Record<string, unknown>[],
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

  if (draftId) {
    q.bool?.must?.push({
      simple_query_string: {
        query: `"${draftId}"`,
        fields: ['contextId'],
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
