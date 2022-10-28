import { useMemo } from 'react';
import { SputnikHttpService } from 'services/sputnik';
import { UserPermissions } from 'types/context';
import { useWalletContext } from 'context/WalletContext';
import { useJoiningDaoProposals } from 'services/ApiService/hooks/useJoiningDaoProposals';
import { ProposalType } from 'types/proposal';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useAsync } from 'react-use';

type JoinDaoState = {
  showButton: boolean;
  showWarning: boolean;
};

export function useJoinDao(
  daoId: string,
  userPermissions: UserPermissions,
  daoMembers: string[]
): JoinDaoState {
  const { useOpenSearchDataApi } = useFlags();
  const { accountId } = useWalletContext();
  const hasPendingApprovalProposals = useJoiningDaoProposals();

  const { value } = useAsync(async () => {
    if (
      useOpenSearchDataApi ||
      useOpenSearchDataApi === undefined ||
      !userPermissions.allowedProposalsToCreate[ProposalType.AddMemberToRole] ||
      !userPermissions.isCanCreateProposals ||
      daoMembers.includes(accountId) ||
      !accountId
    ) {
      return false;
    }

    return SputnikHttpService.getJoiningDaoProposal({
      daoId,
      accountId,
    });
  }, [
    accountId,
    daoId,
    daoMembers,
    userPermissions.allowedProposalsToCreate,
    userPermissions.isCanCreateProposals,
  ]);

  const hasPending = value || hasPendingApprovalProposals;

  return useMemo(() => {
    if (hasPending) {
      return {
        showButton: false,
        showWarning: true,
      };
    }

    if (
      userPermissions.allowedProposalsToCreate[ProposalType.AddMemberToRole] &&
      userPermissions.isCanCreateProposals &&
      !daoMembers.includes(accountId) &&
      accountId
    ) {
      return {
        showButton: true,
        showWarning: false,
      };
    }

    return {
      showButton: false,
      showWarning: false,
    };
  }, [
    accountId,
    daoMembers,
    hasPending,
    userPermissions.allowedProposalsToCreate,
    userPermissions.isCanCreateProposals,
  ]);
}
