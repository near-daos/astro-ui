import { useLocalStorage } from 'react-use';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { TransactionResult, TransactionResultType } from 'types/transaction';
import { WalletType } from 'types/config';

import {
  MY_DAOS_URL,
  MY_FEED_URL,
  SINGLE_BOUNTY_PAGE_URL,
  SINGLE_DAO_PAGE,
  SINGLE_PROPOSAL_PAGE_URL,
} from 'constants/routing';
import { VOTE_ACTION_SOURCE_PAGE } from 'constants/votingConstants';
import { useWalletContext } from 'context/WalletContext';
import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';

export function useSelectorWalletTransactionResult(): void {
  const router = useRouter();
  const { currentWallet } = useWalletContext();
  const [voteActionSource, setVoteActionSource] = useLocalStorage(
    VOTE_ACTION_SOURCE_PAGE
  );

  useEffect(() => {
    if (
      currentWallet !== WalletType.SELECTOR_NEAR &&
      currentWallet !== WalletType.SELECTOR_SENDER
    ) {
      return;
    }

    try {
      const { searchParams } = new URL(window.location.toString());
      const rawResults = searchParams.get('results');

      if (!rawResults) {
        if (voteActionSource) {
          const redirectUrl = voteActionSource as string;

          setVoteActionSource(null);

          router.push(redirectUrl);
        } else {
          router.push(MY_DAOS_URL);
        }

        return;
      }

      const results: TransactionResult[] = JSON.parse(rawResults);

      for (let i = 0; i < results.length; i += 1) {
        const result = results[i];

        switch (result.type) {
          case TransactionResultType.PROPOSAL_CREATE: {
            router.push({
              pathname: SINGLE_PROPOSAL_PAGE_URL,
              query: {
                dao: result.metadata.daoId,
                proposal: result.metadata.proposalId,
              },
            });

            break;
          }
          case TransactionResultType.DAO_CREATE: {
            router.push({
              pathname: SINGLE_DAO_PAGE,
              query: {
                dao: result.metadata.daoId,
              },
            });

            break;
          }
          case TransactionResultType.FINALIZE:
          case TransactionResultType.PROPOSAL_VOTE: {
            if (voteActionSource) {
              router.push(voteActionSource as string);

              setVoteActionSource(null);
            } else {
              router.push({
                pathname: SINGLE_PROPOSAL_PAGE_URL,
                query: {
                  dao: result.metadata.daoId,
                  proposal: result.metadata.proposalId,
                },
              });
            }

            break;
          }
          case TransactionResultType.BOUNTY_CLAIM: {
            if (voteActionSource) {
              router.push(voteActionSource as string);

              setVoteActionSource(null);
            } else {
              router.push({
                pathname: SINGLE_BOUNTY_PAGE_URL,
                query: {
                  dao: result.metadata.daoId,
                  bountyContext: result.metadata.bountyContextId,
                },
              });
            }

            break;
          }
          default: {
            if (result.metadata.daoId) {
              router.push({
                pathname: SINGLE_DAO_PAGE,
                query: {
                  dao: result.metadata.daoId,
                },
              });
            } else {
              router.push(MY_FEED_URL);
            }

            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      router.push(MY_FEED_URL);
    }
  }, [currentWallet, router, setVoteActionSource, voteActionSource]);
}

export function useWalletTransactionResult(): void {
  const { currentWallet } = useWalletContext();

  useEffect(() => {
    if (
      currentWallet === WalletType.SELECTOR_NEAR ||
      currentWallet === WalletType.SELECTOR_SENDER
    ) {
      return;
    }

    const { searchParams } = new URL(window.location.toString());

    const callback = window.opener?.sputnikRequestSignTransactionCompleted;

    if (typeof callback === 'function') {
      const transactionHashes =
        searchParams.get('transactionHashes') || undefined;
      const errorCode = (searchParams.get('errorCode') ||
        undefined) as SputnikWalletErrorCodes;

      callback?.({ transactionHashes, errorCode });

      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      window.close();
    }
  }, [currentWallet]);
}
