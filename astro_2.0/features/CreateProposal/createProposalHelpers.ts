import { DAO } from 'types/dao';
import { ProposalVariant } from 'types/proposal';

export function isUserPermittedToCreateProposal(
  accountId: string | null | undefined,
  dao: DAO | null
): boolean {
  if (!accountId || !dao) {
    return false;
  }

  const daoRoles = dao.policy?.roles;

  if (!daoRoles) {
    return false;
  }

  let matched = false;

  daoRoles.forEach(role => {
    if (!role.accountIds && role.kind === 'Everyone') {
      if (
        role.permissions.includes('*:*') ||
        role.permissions.includes('*:AddProposal')
      ) {
        matched = true;
      }
    } else if (
      role.accountIds?.includes(accountId) &&
      (role.permissions.includes('*:*') ||
        role.permissions.includes('*:AddProposal'))
    ) {
      matched = true;
    }
  });

  return matched;
}

const policyAffectsProposalVariants = [
  ProposalVariant.ProposeChangeDaoLinks,
  ProposalVariant.ProposeAddMember,
  ProposalVariant.ProposeChangeBonds,
  ProposalVariant.ProposeChangeDaoFlag,
  ProposalVariant.ProposeChangeDaoLegalInfo,
  ProposalVariant.ProposeChangeDaoName,
  ProposalVariant.ProposeChangeDaoPurpose,
  ProposalVariant.ProposeChangeVotingPolicy,
  ProposalVariant.ProposeCreateGroup,
  ProposalVariant.ProposeRemoveMember,
];

export function getInitialProposalVariant(
  defaultProposalVariant: ProposalVariant,
  isCanCreatePolicyProposals: boolean
): ProposalVariant {
  if (
    !isCanCreatePolicyProposals &&
    policyAffectsProposalVariants.includes(defaultProposalVariant)
  ) {
    return ProposalVariant.ProposeTransfer;
  }

  return defaultProposalVariant;
}
