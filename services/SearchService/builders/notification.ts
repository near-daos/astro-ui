import { OpenSearchQuery } from 'services/SearchService/types';

export function buildNotificationsQuery(query: {
  filter: string;
  accountId: string;
  accountDaosIds: string[];
  subscribedDaosIds: string[];
}): OpenSearchQuery {
  const q: OpenSearchQuery = {
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
    default: {
      // nothing
      break;
    }
  }

  q.bool?.must?.push({
    simple_query_string: {
      query: query.filter === 'archived',
      fields: ['isArchived'],
    },
  });

  q.bool?.must?.push({
    simple_query_string: {
      query: `"${query.accountId}"`,
      fields: ['accountId'],
    },
  });

  return q;
}
