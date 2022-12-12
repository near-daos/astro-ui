import { OpenSearchQuery } from 'services/SearchService/types';

export function buildNotificationsQuery(query: {
  filter: string;
  accountDaosIds: string[];
  subscribedDaosIds: string[];
}): OpenSearchQuery {
  let q: OpenSearchQuery = {
    bool: {
      must: [] as Record<string, unknown>[],
      must_not: [] as Record<string, unknown>[],
      should: [] as Record<string, unknown>[],
    },
  };

  switch (query.filter) {
    case 'yourDaos': {
      q.bool?.must?.push({
        bool: {
          should: query.accountDaosIds.map(item => ({
            simple_query_string: {
              query: item,
              fields: ['daoId'],
            },
          })),
        },
      });

      break;
    }
    case 'subscribed': {
      q.bool?.must?.push({
        bool: {
          should: query.accountDaosIds.map(item => ({
            simple_query_string: {
              query: item,
              fields: ['daoId'],
            },
          })),
        },
      });

      break;
    }
    case 'archived': {
      q.bool?.must?.push({
        simple_query_string: {
          query: true,
          fields: ['isArchived'],
        },
      });

      break;
    }
    default: {
      // nothing
      break;
    }
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
