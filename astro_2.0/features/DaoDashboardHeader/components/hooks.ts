import { useEffect, useState } from 'react';
import { SputnikHttpService } from 'services/sputnik';
import { UserPermissions } from 'types/context';
import { useWalletContext } from 'context/WalletContext';

type JoinDaoState = {
  showButton: boolean;
  showWarning: boolean;
};

export function useJoinDao(
  daoId: string,
  userPermissions: UserPermissions,
  daoMembers: string[]
): JoinDaoState {
  const { accountId } = useWalletContext();
  const [state, setState] = useState<JoinDaoState>({
    showButton: false,
    showWarning: false,
  });

  useEffect(() => {
    (async () => {
      if (
        !userPermissions.isCanCreateProposals ||
        daoMembers.includes(accountId) ||
        !accountId
      ) {
        return;
      }

      const pendingJoinApproval = await SputnikHttpService.getJoiningDaoProposal(
        { daoId, accountId }
      );

      if (pendingJoinApproval) {
        setState({
          showButton: false,
          showWarning: true,
        });

        return;
      }

      setState({
        showButton: true,
        showWarning: false,
      });
    })();
  }, [accountId, daoId, daoMembers, userPermissions.isCanCreateProposals]);

  return state;
}
