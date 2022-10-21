import { OpenSearchQuery } from 'services/SearchService/types';

export function buildBountiesQuery(params: {
  account?: string;
  bountyFilter: string | null;
  bountySort: string | null;
  bountyPhase: string | null;
}): OpenSearchQuery {
  let q: OpenSearchQuery;

  switch (params.bountyFilter) {
    case 'proposer': {
      q = {
        bool: {
          must: [
            {
              simple_query_string: {
                query: params.account ?? '',
                fields: ['proposal.proposer'],
              },
            },
          ],
        },
      };

      break;
    }
    case 'numberOfClaims': {
      q = {
        bool: {
          must: [
            {
              simple_query_string: {
                query: 0,
                fields: ['numberOfClaims'],
              },
            },
          ],
        },
      };

      break;
    }
    default: {
      q = {
        match_all: {},
      };
    }
  }

  switch (params.bountyPhase) {
    case 'proposalPhase': {
      const condition = {
        simple_query_string: {
          query: 'InProgress',
          fields: ['proposal.status'],
        },
      };
      const conditionBounty = {
        simple_query_string: {
          query: 'null',
          fields: ['bountyId'],
        },
      };

      if (q.bool) {
        q.bool.must?.push(condition);
        q.bool.must?.push(conditionBounty);
      } else {
        q = {
          bool: {
            must: [condition, conditionBounty],
          },
        };
      }

      break;
    }
    case 'inProgress': {
      const condition = [
        {
          simple_query_string: {
            query: 0,
            fields: ['numberOfClaims'],
          },
        },
      ];

      if (q.bool) {
        q.bool.must_not = condition;
      } else {
        q = {
          bool: {
            must_not: condition,
          },
        };
      }

      break;
    }

    case 'availableBounty': {
      const mnCondition = [
        {
          simple_query_string: {
            query: 0,
            fields: ['times'],
          },
        },
      ];

      const condition = {
        simple_query_string: {
          query: 0,
          fields: ['numberOfClaims'],
        },
      };

      if (q.bool) {
        q.bool.must_not = mnCondition;
        q.bool.must?.push(condition);
      } else {
        q = {
          bool: {
            must_not: mnCondition,
            must: [condition],
          },
        };
      }

      break;
    }
    case 'completed': {
      const condition = {
        simple_query_string: {
          query: 0,
          fields: ['times'],
        },
      };

      if (q.bool) {
        q.bool.must?.push(condition);
      } else {
        q = {
          bool: {
            must: [condition],
          },
        };
      }

      break;
    }

    default: {
      break;
    }
  }

  return q;
}
