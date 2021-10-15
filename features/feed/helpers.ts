import { Proposal } from 'types/proposal';
import { ProposalFilterStatusOptions } from 'features/member-home/types';

// Additional filtering for expired proposals
export function filterProposalsByStatus(
  status: ProposalFilterStatusOptions,
  proposals: Proposal[]
): Proposal[] {
  if (status === 'Active proposals') {
    return proposals.filter(item => item.status === 'InProgress');
  }

  if (status === 'Failed') {
    const failedStatuses = ['Rejected', 'Expired', 'Moved'];

    return proposals.filter(item => failedStatuses.includes(item.status));
  }

  return proposals;
}
