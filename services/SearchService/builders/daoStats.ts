import { OpenSearchQuery } from 'services/SearchService/types';

export function buildDaoStatsQuery(daoId: string): OpenSearchQuery {
  return {
    bool: {
      must: [
        {
          simple_query_string: {
            query: `"${daoId}"`,
            fields: ['daoId'],
          },
        },
      ],
    },
  };
}
