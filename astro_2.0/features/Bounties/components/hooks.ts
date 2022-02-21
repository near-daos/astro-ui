import { useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAsyncFn } from 'react-use';
import axios, { CancelTokenSource } from 'axios';

import { SputnikHttpService, SputnikNearService } from 'services/sputnik';
import { useModal } from 'components/modal';
import { ConfirmActionModal } from 'astro_2.0/components/ConfirmActionModal';

import { DAO } from 'types/dao';
import { Bounty, BountyContext, BountyProposal } from 'types/bounties';
import { VoteAction } from 'types/proposal';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { useAuthContext } from 'context/AuthContext';
import { PaginationResponse } from 'types/api';

export function useBountyControls(
  dao: DAO,
  bounty?: Bounty
): {
  handleClaim: () => void;
  handleUnclaim: () => void;
} {
  const router = useRouter();
  const { t } = useTranslation();

  const [showModal] = useModal(ConfirmActionModal);

  const onSuccessHandler = useCallback(async () => {
    await router.reload();
    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      lifetime: 20000,
      description: t('bountiesPage.successClaimBountyNotification'),
    });
  }, [t, router]);

  const handleClaim = useCallback(async () => {
    const res = await showModal({
      title: 'Confirm Your Claim',
    });

    if (res?.length && bounty) {
      await SputnikNearService.claimBounty(dao.id, {
        bountyId: bounty?.bountyId,
        deadline: bounty?.maxDeadline,
        bountyBond: dao.policy.bountyBond,
        gas: res[0],
        tokenId: bounty?.token,
      });

      onSuccessHandler();
    }
  }, [showModal, bounty, dao.id, dao.policy.bountyBond, onSuccessHandler]);

  const handleUnclaim = useCallback(async () => {
    const res = await showModal({
      title: 'Confirm Your Unclaim',
    });

    if (res?.length && bounty) {
      await SputnikNearService.unclaimBounty(dao.id, bounty?.bountyId);
      onSuccessHandler();
    }
  }, [bounty, dao.id, onSuccessHandler, showModal]);

  return {
    handleClaim,
    handleUnclaim,
  };
}

export function useBountyVoting(
  dao: DAO,
  proposal: BountyProposal
): {
  handleVote: (vote: VoteAction) => void;
  loading: boolean;
} {
  const router = useRouter();
  const [showModal] = useModal(ConfirmActionModal);

  const [{ loading }, handleVote] = useAsyncFn(
    async (vote: VoteAction) => {
      const res = await showModal({
        title: 'Confirm Your Vote',
      });

      if (res?.length) {
        await SputnikNearService.vote(
          dao.id,
          proposal.proposalId,
          vote,
          res[0]
        );
        await router.reload();
      }
    },
    [dao, proposal, router]
  );

  return {
    handleVote,
    loading,
  };
}

export function useBountySearch(): {
  handleSearch: (
    val: string
  ) => Promise<PaginationResponse<BountyContext[]> | null>;
  loading: boolean;
} {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const { accountId } = useAuthContext();
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const [{ loading }, handleSearch] = useAsyncFn(async query => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current?.cancel('Cancelled by new req');
    }

    const { CancelToken } = axios;
    const source = CancelToken.source();

    cancelTokenRef.current = source;

    return SputnikHttpService.findBountyContext({
      daoId,
      accountId,
      query,
      cancelToken: source.token,
    });
  }, []);

  return {
    handleSearch,
    loading,
  };
}
