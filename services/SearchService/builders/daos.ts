import { OpenSearchQuery } from 'services/SearchService/types';

export function buildAccountDaosQuery(account: string): OpenSearchQuery {
  return {
    bool: {
      must: [
        {
          simple_query_string: {
            query: account.substring(0, account.indexOf('.')),
            fields: ['accounts'],
          },
        },
      ],
    },
  };
}

export function buildDaosListQuery(
  filter: string | undefined
): OpenSearchQuery {
  if (!filter) {
    return {
      match_all: {},
    };
  }

  return {
    bool: {
      must: [
        {
          simple_query_string: {
            query: filter,
            fields: ['status'],
          },
        },
      ],
    },
  };
}
