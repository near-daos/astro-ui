import { DAO, DaoDelegation } from 'types/dao';
import {
  fetcher as getPolicyAffectsProposals,
  usePolicyAffectsProposals,
} from 'services/ApiService/hooks/usePolicyAffectsProposals';
import {
  getAllowedProposalsToCreate,
  getAllowedProposalsToVote,
} from 'astro_2.0/features/CreateProposal/createProposalHelpers';
import { ProposalFeedItem, ProposalType } from 'types/proposal';
import { useWalletContext } from 'context/WalletContext';
import { DaoContext } from 'types/context';

import { fetcher as getDao, useDao } from './useDao';

export async function fetcher(
  daoId: string
): Promise<
  [
    dao: DAO | undefined,
    policyAffectsProposals: ProposalFeedItem[],
    delegations: DaoDelegation[]
  ]
> {
  const [dao, policyAffectsProposals] = await Promise.all([
    getDao('dao', daoId),
    getPolicyAffectsProposals('proposals', daoId),
  ]);

  return [dao, policyAffectsProposals, dao?.delegations ?? []];
}

export function useDaoContext(daoId?: string): DaoContext | undefined {
  const { accountId } = useWalletContext();
  const { dao } = useDao(daoId);
  const { data: policyAffectsProposals } = usePolicyAffectsProposals();
  const delegations = dao?.delegations as DaoDelegation[];

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
        !policyAffectsProposals?.length,
    },
    policyAffectsProposals: policyAffectsProposals || [],
  };
}
