import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAsyncFn } from 'react-use';

import { SputnikNearService } from 'services/sputnik';
import { useModal } from 'components/modal';
import { ConfirmActionModal } from 'astro_2.0/components/ConfirmActionModal';

import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';

import { DAO } from 'types/dao';
import { Bounty, BountyProposal } from 'types/bounties';
import { VoteAction } from 'types/proposal';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

export function useBountyControls(
  dao: DAO,
  bounty: Bounty
): {
  handleClaim: () => void;
  handleUnclaim: () => void;
} {
  const router = useRouter();
  const { t } = useTranslation();

  const [showModal] = useModal(ConfirmActionModal);

  const onSuccessHandler = useCallback(async () => {
    await router.replace(router.asPath);
    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      lifetime: 20000,
      description: t('bountiesPage.successClaimBountyNotification'),
    });
  }, [t, router]);

  const handleClaim = useCallback(async () => {
    const res = await showModal({
      title: 'Confirm Your Claim',
      message: `To Confirm Your Claim you need to spend minimum ${DEFAULT_PROPOSAL_GAS} TGas`,
    });

    if (res?.length) {
      await SputnikNearService.claimBounty(dao.id, {
        bountyId: bounty.bountyId,
        deadline: bounty.maxDeadline,
        bountyBond: dao.policy.bountyBond,
        gas: res[0],
      });

      onSuccessHandler();
    }
  }, [showModal, bounty, dao.id, dao.policy.bountyBond, onSuccessHandler]);

  const handleUnclaim = useCallback(async () => {
    const res = await showModal({
      title: 'Confirm Your Unclaim',
      message: `To Confirm Your Unclaim you need to spend minimum ${DEFAULT_PROPOSAL_GAS} TGas`,
    });

    if (res?.length) {
      await SputnikNearService.unclaimBounty(dao.id, bounty.bountyId);
      onSuccessHandler();
    }
  }, [bounty.bountyId, dao.id, onSuccessHandler, showModal]);

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
        message: `To Confirm Your Vote you need to spend minimum ${DEFAULT_PROPOSAL_GAS} TGas`,
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
