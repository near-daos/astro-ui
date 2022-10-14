import { DaoPolicy } from 'services/sputnik/types/policy';

export function getParsedVotes(
  votes: string
): Record<string, 'Approve' | 'Reject' | 'Remove'> {
  try {
    return JSON.parse(votes);
  } catch (e) {
    return {};
  }
}

export function getParsedPolicy(policy: string): DaoPolicy {
  try {
    return JSON.parse(policy);
  } catch (e) {
    return {} as DaoPolicy;
  }
}
