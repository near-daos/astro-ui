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

function skipApiDataFetch(
  useOpenSearchDataApi: boolean | undefined,
  userPermissions: UserPermissions,
  daoMembers: string[],
  accountId: string
) {
  const isDataFetchedFromOpenSeacrh =
    useOpenSearchDataApi || useOpenSearchDataApi === undefined;
  const isUserNotAllowedToCreateProposal =
    !userPermissions.allowedProposalsToCreate[ProposalType.AddMemberToRole] ||
    !userPermissions.isCanCreateProposals;
  const isAlreadyADaoMember = daoMembers.includes(accountId);

  return (
    isDataFetchedFromOpenSeacrh ||
    isUserNotAllowedToCreateProposal ||
    isAlreadyADaoMember ||
    !accountId
  );
}

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
      skipApiDataFetch(
        useOpenSearchDataApi,
        userPermissions,
        daoMembers,
        accountId
      )
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

    const isUserAllowedToCreateProposal =
      userPermissions.allowedProposalsToCreate[ProposalType.AddMemberToRole] &&
      userPermissions.isCanCreateProposals;

    if (
      isUserAllowedToCreateProposal &&
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
