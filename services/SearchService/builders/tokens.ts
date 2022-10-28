import { OpenSearchQuery } from 'services/SearchService/types';

export function buildTokensQuery(account?: string): OpenSearchQuery {
  if (!account) {
    return {
      match_all: {},
    };
  }

  return {
    bool: {
      must: [
        {
          simple_query_string: {
            query: account,
            fields: ['accountId'],
          },
        },
      ],
    },
  };
}
