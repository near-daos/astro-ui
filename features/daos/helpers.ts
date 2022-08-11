import { SputnikHttpService } from 'services/sputnik';
import { DaoFeedItem } from 'types/dao';
import { DaoContext, UserPermissions } from 'types/context';
import {
  getAllowedProposalsToCreate,
  getAllowedProposalsToVote,
} from 'astro_2.0/features/CreateProposal/createProposalHelpers';
import { ProposalType } from 'types/proposal';
import { getClient } from 'utils/launchdarkly-server-client';

interface GetDaoListProps {
  sort?: string;
  offset?: number;
  limit?: number;
  filter?: string;
  createdBy?: string;
}

export async function getDaosList({
  sort,
  offset,
  limit,
  filter,
}: GetDaoListProps): Promise<{
  daos: DaoFeedItem[];
  total: number;
}> {
  const dao = await SputnikHttpService.getDaoList({
    sort,
    offset,
    limit,
    filter,
  });

  if (!dao) {
    return {
      daos: [],
      total: 0,
    };
  }

  return {
    daos: dao.data.map(rec => ({
      ...rec,
      council: rec.council || null,
      isCouncil: rec.isCouncil || false,
    })),
    total: dao.total,
  };
}

export function getMockPermissions(): UserPermissions {
  return {
    isCanCreateProposals: true,
    allowedProposalsToCreate: {
      [ProposalType.ChangeConfig]: true,
      [ProposalType.ChangePolicy]: true,
      [ProposalType.AddBounty]: true,
      [ProposalType.BountyDone]: true,
      [ProposalType.FunctionCall]: true,
      [ProposalType.Transfer]: true,
      [ProposalType.Vote]: true,
      [ProposalType.RemoveMemberFromRole]: true,
      [ProposalType.AddMemberToRole]: true,
      [ProposalType.UpgradeRemote]: true,
      [ProposalType.UpgradeSelf]: true,
      [ProposalType.SetStakingContract]: true,
    },
    allowedProposalsToVote: {
      [ProposalType.ChangeConfig]: false,
      [ProposalType.ChangePolicy]: false,
      [ProposalType.AddBounty]: false,
      [ProposalType.BountyDone]: false,
      [ProposalType.FunctionCall]: false,
      [ProposalType.Transfer]: false,
      [ProposalType.Vote]: false,
      [ProposalType.RemoveMemberFromRole]: false,
      [ProposalType.AddMemberToRole]: false,
      [ProposalType.UpgradeRemote]: false,
      [ProposalType.UpgradeSelf]: false,
      [ProposalType.SetStakingContract]: false,
    },
    isCanCreatePolicyProposals: true,
  };
}

export async function getDaoContext(
  accountId: string | undefined,
  daoId: string
): Promise<DaoContext | undefined> {
  const client = await getClient();
  const governanceToken = await client.variation(
    'governance-token',
    {
      key: accountId ?? '',
    },
    false
  );

  const [dao, policyAffectsProposals, delegations] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    SputnikHttpService.findPolicyAffectsProposals(daoId),
    SputnikHttpService.getDelegations(daoId, governanceToken),
  ]);

  if (!dao) {
    return undefined;
  }

  let userHasDelegatedTokens = false;
  const userDelegation = delegations.find(item => item.accountId === accountId);
  const holdersRole = dao.policy.roles.find(
    role => role.kind === 'Member' && role.name === 'TokenHolders'
  );

  if (
    userDelegation &&
    holdersRole &&
    Number(userDelegation.balance) > Number(holdersRole.balance)
  ) {
    userHasDelegatedTokens = true;
  }

  const allowedProposalsToCreate = getAllowedProposalsToCreate(
    accountId,
    dao,
    userHasDelegatedTokens
  );
  const isCanCreateProposals = !!Object.values(allowedProposalsToCreate).find(
    value => value
  );

  return {
    dao,
    userPermissions: {
      isCanCreateProposals,
      allowedProposalsToCreate,
      allowedProposalsToVote: getAllowedProposalsToVote(accountId, dao),
      isCanCreatePolicyProposals:
        allowedProposalsToCreate[ProposalType.ChangePolicy] &&
        !policyAffectsProposals.length,
    },
    policyAffectsProposals,
  };
}
