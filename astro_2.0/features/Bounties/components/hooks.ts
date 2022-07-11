import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useAsyncFn } from 'react-use';
import axios, { CancelTokenSource } from 'axios';

import { SputnikHttpService } from 'services/sputnik';
import { useModal } from 'components/modal';
import { ConfirmActionModal } from 'astro_2.0/components/ConfirmActionModal';

import { DAO } from 'types/dao';
import { Bounty, BountyContext, BountyProposal } from 'types/bounties';
import { VoteAction } from 'types/proposal';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { useWalletContext } from 'context/WalletContext';
import { useWalletSelectorContext } from 'context/WalletSelectorContext';
import { PaginationResponse } from 'types/api';

export function useBountyControls(
  dao: DAO,
  bounty?: Bounty
): {
  handleClaim: () => void;
  handleUnclaim: () => void;
} {
  const router = useRouter();
  const { nearService } = useWalletContext();

  const [showModal] = useModal(ConfirmActionModal);

  const onSuccessHandler = useCallback(async () => {
    await router.reload();
  }, [router]);

  const handleClaim = useCallback(async () => {
    const res = await showModal({
      title: 'Confirm Your Claim',
    });

    if (res?.length && bounty) {
      await nearService?.claimBounty(dao.id, {
        bountyId: bounty?.bountyId,
        deadline: bounty?.maxDeadline,
        bountyBond: dao.policy.bountyBond,
        gas: res[0],
        tokenId: bounty?.token,
      });

      onSuccessHandler();
    }
  }, [
    showModal,
    bounty,
    dao.id,
    dao.policy.bountyBond,
    onSuccessHandler,
    nearService,
  ]);

  const handleUnclaim = useCallback(async () => {
    const res = await showModal({
      title: 'Confirm Your Unclaim',
    });

    if (res?.length && bounty) {
      await nearService?.unclaimBounty(dao.id, bounty?.bountyId);
      onSuccessHandler();
    }
  }, [bounty, dao.id, onSuccessHandler, showModal, nearService]);

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
  const { nearService } = useWalletContext();

  const [{ loading }, handleVote] = useAsyncFn(
    async (vote: VoteAction) => {
      const res = await showModal({
        title: 'Confirm Your Vote',
      });

      if (res?.length) {
        await nearService?.vote(dao.id, proposal.proposalId, vote, res[0]);
        await router.reload();
      }
    },
    [dao, proposal, router, nearService]
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
  const { accountId } = useWalletSelectorContext();
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

export function useHideBounty(): {
  handleSubmit: () => void;
  handleSelect: (id: string) => void;
  selected: string[];
  loading: boolean;
} {
  const router = useRouter();
  const showHidden = router.query?.bountyFilter === 'hidden';
  const daoId = router.query.dao as string;
  const { accountId, nearService } = useWalletContext();
  const [selected, setSelected] = useState<string[]>([]);

  const [{ loading }, handleSubmit] = useAsyncFn(async () => {
    try {
      const publicKey = await nearService?.getPublicKey();
      const signature = await nearService?.getSignature();

      if (publicKey && signature) {
        await SputnikHttpService.toggleBountyContexts({
          accountId,
          publicKey,
          signature,
          daoId,
          ids: selected,
          isArchived: !showHidden,
        });

        await router.replace(router.asPath, undefined, {
          shallow: false,
        });

        setSelected([]);
      }
    } catch (err) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        lifetime: 20000,
        description: err.message,
      });
    }
  }, [selected, daoId, showHidden, accountId, router, nearService]);

  const handleSelect = useCallback(
    (id: string) => {
      if (selected.includes(id)) {
        setSelected(selected.filter(item => item !== id));
      } else {
        setSelected([...selected, id]);
      }
    },
    [selected]
  );

  return {
    handleSubmit,
    handleSelect,
    selected,
    loading,
  };
}
