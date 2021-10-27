import { Variant } from 'components/badge/Badge';
import { ProposalType } from 'types/proposal';

export function getBadgeVariant(name: string): Variant {
  const variants = [
    'violet',
    'blurple',
    'blue',
    'turqoise',
    'green',
    'red',
    'orange',
    'yellow',
    'primary',
  ];

  return (variants[name.length] ||
    variants[name.length % variants.length]) as Variant;
}

export function getProposalNameByType(type: ProposalType): string {
  switch (type) {
    case ProposalType.AddBounty: {
      return 'Add Bounty';
    }
    case ProposalType.AddMemberToRole: {
      return 'Add Member to Role';
    }
    case ProposalType.BountyDone: {
      return 'Bounty done';
    }
    case ProposalType.ChangeConfig: {
      return 'Change DAO config';
    }
    case ProposalType.ChangePolicy: {
      return 'Change DAO policy';
    }
    case ProposalType.RemoveMemberFromRole: {
      return 'Remove Member from Role';
    }
    case ProposalType.Transfer: {
      return 'Transfer';
    }
    case ProposalType.Vote: {
      return 'Vote';
    }
    default: {
      return type;
    }
  }
}
