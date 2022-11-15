import { DaoContext } from 'types/context';
import { SputnikHttpService } from 'services/sputnik';
import {
  getAllowedProposalsToCreate,
  getAllowedProposalsToVote,
} from 'astro_2.0/features/CreateProposal/createProposalHelpers';
import { ProposalType } from 'types/proposal';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useAsync } from 'react-use';

export function useDaoContext(
  accountId: string | undefined,
  daoId: string | undefined
): DaoContext | undefined {
  const { governanceToken, useOpenSearchDataApi } = useFlags();

  const { value } = useAsync(async () => {
    if (!daoId || useOpenSearchDataApi || useOpenSearchDataApi === undefined) {
      return undefined;
    }

    const [dao, policyAffectsProposals, delegations] = await Promise.all([
      SputnikHttpService.getDaoById(daoId),
      SputnikHttpService.findPolicyAffectsProposals(daoId),
      SputnikHttpService.getDelegations(daoId, governanceToken),
    ]);

    return {
      dao,
      policyAffectsProposals,
      delegations,
    };
  }, [daoId]);

  if (!value || !value?.dao) {
    return undefined;
  }

  const { dao, policyAffectsProposals, delegations } = value;

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
    v => v
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
