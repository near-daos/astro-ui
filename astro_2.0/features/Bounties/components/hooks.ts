import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useAsyncFn, useLocalStorage, useLocation } from 'react-use';
import axios, { CancelTokenSource } from 'axios';

import { SputnikHttpService } from 'services/sputnik';
import { useModal } from 'components/modal';
import { ConfirmActionModal } from 'astro_2.0/components/ConfirmActionModal';

import { Bounty, BountyContext, BountyProposal } from 'types/bounties';
import { VoteAction } from 'types/proposal';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { useWalletContext } from 'context/WalletContext';
import { PaginationResponse } from 'types/api';
import { VOTE_ACTION_SOURCE_PAGE } from 'constants/votingConstants';

export function useBountyControls(
  daoId: string,
  bounty?: Bounty
): {
  handleClaim: () => void;
  handleUnclaim: () => void;
  loading: boolean;
} {
  const router = useRouter();
  const { nearService } = useWalletContext();
  const [, setVoteActionSource] = useLocalStorage(VOTE_ACTION_SOURCE_PAGE);
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);

  const [showModal] = useModal(ConfirmActionModal);

  const onSuccessHandler = useCallback(async () => {
    router.reload();
  }, [router]);

  const handleClaim = useCallback(async () => {
    const res = await showModal({
      title: 'Confirm Your Claim',
    });

    if (res?.length && bounty) {
      setLoading(true);

      const dao = await SputnikHttpService.getDaoById(daoId);

      if (!dao) {
        return;
      }

      try {
        setVoteActionSource(pathname);

        await nearService?.claimBounty(daoId, {
          bountyId: bounty?.bountyId,
          deadline: bounty?.maxDeadline,
          bountyBond: dao.policy.bountyBond,
          gas: res[0],
          tokenId: bounty?.token,
        });

        await onSuccessHandler();
      } catch (err) {
        setLoading(false);
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 5000,
          description: err.message,
        });
      }
    }
  }, [
    showModal,
    bounty,
    daoId,
    setVoteActionSource,
    pathname,
    nearService,
    onSuccessHandler,
  ]);

  const handleUnclaim = useCallback(async () => {
    const res = await showModal({
      title: 'Confirm Your Unclaim',
    });

    if (res?.length && bounty) {
      try {
        setLoading(true);
        setVoteActionSource(pathname);
        await nearService?.unclaimBounty(daoId, bounty?.bountyId);

        await onSuccessHandler();
      } catch (err) {
        setLoading(false);
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 5000,
          description: err.message,
        });
      }
    }
  }, [
    showModal,
    bounty,
    setVoteActionSource,
    pathname,
    nearService,
    daoId,
    onSuccessHandler,
  ]);

  return {
    handleClaim,
    handleUnclaim,
    loading,
  };
}

export function useBountyVoting(
  daoId: string,
  proposal: BountyProposal
): {
  handleVote: (vote: VoteAction) => void;
  loading: boolean;
} {
  const router = useRouter();
  const [showModal] = useModal(ConfirmActionModal);
  const { nearService } = useWalletContext();
  const [, setVoteActionSource] = useLocalStorage(VOTE_ACTION_SOURCE_PAGE);
  const { pathname } = useLocation();

  const [{ loading }, handleVote] = useAsyncFn(
    async (vote: VoteAction) => {
      const res = await showModal({
        title: 'Confirm Your Vote',
      });

      if (res?.length) {
        setVoteActionSource(pathname);
        await nearService?.vote(daoId, proposal.proposalId, vote, res[0]);
        await router.reload();
      }
    },
    [daoId, proposal, router, nearService, pathname, setVoteActionSource]
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
  const { accountId } = useWalletContext();
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const [{ loading }, handleSearch] = useAsyncFn(async query => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current?.cancel('Cancelled by new req');
    }

    const { CancelToken } = axios;
    const source = CancelToken.source();

    cancelTokenRef.current = source;

    return SputnikHttpService.findBountyContext({
      daoId: daoId || '',
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
  const { accountId, nearService, pkAndSignature } = useWalletContext();
  const [selected, setSelected] = useState<string[]>([]);

  const [{ loading }, handleSubmit] = useAsyncFn(async () => {
    if (!pkAndSignature) {
      return;
    }

    try {
      const { publicKey, signature } = pkAndSignature;

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
  }, [
    selected,
    daoId,
    showHidden,
    accountId,
    router,
    nearService,
    pkAndSignature,
  ]);

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
