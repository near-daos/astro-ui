import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { TransactionResult, TransactionResultType } from 'types/transaction';
import { WalletType } from 'types/config';
import { CreateGovernanceTokenSteps } from 'types/settings';

import {
  ALL_BOUNTIES_PAGE_URL,
  MY_DAOS_URL,
  MY_FEED_URL,
  SINGLE_DAO_PAGE,
  SINGLE_PROPOSAL_PAGE_URL,
} from 'constants/routing';
import { VOTE_ACTION_SOURCE_PAGE } from 'constants/votingConstants';
import {
  CREATE_GOVERNANCE_TOKEN_PROPOSAL,
  CREATE_PROPOSAL_ACTION_TYPE,
} from 'constants/proposals';
import { DELEGATE_VOTING_KEY, STAKE_TOKENS_KEY } from 'constants/localStorage';

import { useWalletContext } from 'context/WalletContext';
import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';

import { useUpdateGovernanceTokenWizardProgress } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/hooks';

export function useSelectorWalletTransactionResult(): void {
  const router = useRouter();
  const { currentWallet } = useWalletContext();
  const { update } = useUpdateGovernanceTokenWizardProgress();

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

      // On votes, accessing delegate page in governance token wizard etc. we save current location in LS
      // so we can return to same page after wallet redirect
      const voteActionSource = localStorage.getItem(VOTE_ACTION_SOURCE_PAGE);
      const delegateVotingAction = localStorage.getItem(DELEGATE_VOTING_KEY);
      const createProposalAction = localStorage.getItem(
        CREATE_PROPOSAL_ACTION_TYPE
      );
      const stakeTokensAction = localStorage.getItem(STAKE_TOKENS_KEY);

      if (delegateVotingAction) {
        // We were on last wizard step so we complete wizard and get back to wizard initial page
        update(delegateVotingAction.replaceAll('"', ''), {
          step: null,
          wizardCompleted: true,
        });

        return;
      }

      // No rawResults from BE - this means this was unhandled action and we dont know its type, so we
      // redirect user to default location
      if (!rawResults) {
        if (voteActionSource) {
          const redirectUrl = voteActionSource as string;

          localStorage.setItem(VOTE_ACTION_SOURCE_PAGE, '');

          router.push(redirectUrl.replaceAll('"', ''));
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
            if (createProposalAction === CREATE_GOVERNANCE_TOKEN_PROPOSAL) {
              // we created new proposal in governance token wiard - update dao settings with proposal Id
              update(result.metadata.daoId, {
                proposalId: result.metadata.proposalId,
              });
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
              router.push((voteActionSource as string).replaceAll('"', ''));
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
              localStorage.setItem(VOTE_ACTION_SOURCE_PAGE, '');

              router.push((voteActionSource as string).replaceAll('"', ''));
            } else {
              router.push({
                pathname: ALL_BOUNTIES_PAGE_URL,
                query: {
                  dao: result.metadata.daoId,
                },
              });
            }

            break;
          }
          default: {
            if (stakeTokensAction) {
              update(stakeTokensAction.replaceAll('"', ''), {
                step: CreateGovernanceTokenSteps.DelegateVoting,
              });
            } else if (delegateVotingAction) {
              update(delegateVotingAction.replaceAll('"', ''), {
                step: null,
              });
            } else if (result?.metadata?.daoId) {
              router.push({
                pathname: SINGLE_DAO_PAGE,
                query: {
                  dao: result.metadata.daoId,
                },
              });
            } else if (i === results.length - 1) {
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
  }, [currentWallet, router, update]);
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
