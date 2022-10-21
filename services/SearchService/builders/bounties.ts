import { OpenSearchQuery } from 'services/SearchService/types';

export function buildBountiesQuery(params: {
  daoId?: string;
  account?: string;
  bountyFilter: string | null;
  bountyPhase: string | null;
}): OpenSearchQuery {
  const q: OpenSearchQuery = {
    bool: {
      must: [] as Record<string, unknown>[],
      must_not: [] as Record<string, unknown>[],
      should: [] as Record<string, unknown>[],
    },
  };

  // specific DAO
  if (params.daoId) {
    q.bool?.must?.push({
      simple_query_string: {
        query: `"${params.daoId}"`,
        fields: ['daoId'],
      },
    });
  }

  switch (params.bountyFilter) {
    case 'proposer': {
      q.bool?.must?.push({
        simple_query_string: {
          query: params.account
            ? params.account.substring(0, params.account.indexOf('.'))
            : '',
          fields: ['accounts'],
        },
      });

      break;
    }
    case 'numberOfClaims': {
      q.bool?.must?.push({
        simple_query_string: {
          query: 0,
          fields: ['numberOfClaims'],
        },
      });

      break;
    }
    default: {
      // do nothing
    }
  }

  switch (params.bountyPhase) {
    case 'proposalPhase': {
      const condition = {
        simple_query_string: {
          query: 'InProgress',
          fields: ['status'],
        },
      };
      const conditionBounty = {
        simple_query_string: {
          query: 'null',
          fields: ['bountyId'],
        },
      };

      q.bool?.must?.push(condition);
      q.bool?.must?.push(conditionBounty);

      break;
    }
    case 'inProgress': {
      const condition = {
        simple_query_string: {
          query: 0,
          fields: ['numberOfClaims'],
        },
      };

      q.bool?.must_not?.push(condition);

      break;
    }

    case 'availableBounty': {
      const mnCondition = {
        simple_query_string: {
          query: 0,
          fields: ['times'],
        },
      };

      const condition = {
        simple_query_string: {
          query: 0,
          fields: ['numberOfClaims'],
        },
      };

      q.bool?.must_not?.push(mnCondition);
      q.bool?.must?.push(condition);

      break;
    }
    case 'completed': {
      const condition = {
        simple_query_string: {
          query: 0,
          fields: ['times'],
        },
      };

      q.bool?.must?.push(condition);

      break;
    }

    default: {
      break;
    }
  }

  return q;
}
