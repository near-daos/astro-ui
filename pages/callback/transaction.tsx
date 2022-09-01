import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';

import { getTranslations } from 'utils/getTranslations';
import { useWalletContext } from 'context/WalletContext';
import { WalletType } from 'types/config';
import { SINGLE_DAO_PAGE, SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';
import { useRouter } from 'next/router';
import { useLocalStorage } from 'react-use';

enum TransactionResultType {
  PROPOSAL_CREATE = 'ProposalCreate',
  DAO_CREATE = 'DaoCreate',
  PROPOSAL_VOTE = 'ProposalVote',
}

type TransactionResult = {
  type: TransactionResultType;
  metadata: Record<string, string>;
};

const Transaction: NextPage = () => {
  const router = useRouter();
  const { currentWallet } = useWalletContext();
  const [voteActionSource, setVoteActionSource] = useLocalStorage(
    'astro-vote-action-source'
  );

  useEffect(() => {
    const { searchParams } = new URL(window.location.toString());
    const rawResults = searchParams.get('results');

    // eslint-disable-next-line no-console
    console.log('rawResults', rawResults);
    // eslint-disable-next-line no-console
    console.log('currentWallet', currentWallet);

    if (
      (currentWallet === WalletType.SELECTOR_NEAR ||
        currentWallet === WalletType.SELECTOR_SENDER) &&
      rawResults
    ) {
      try {
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
            case TransactionResultType.PROPOSAL_VOTE: {
              if (voteActionSource) {
                const redirectUrl = voteActionSource as string;

                setVoteActionSource(null);

                router.push(redirectUrl);
              }

              break;
            }
            default: {
              break;
            }
          }
        }
      } catch (e) {
        console.error(e);
      }

      return;
    }

    const callback = window.opener?.sputnikRequestSignTransactionCompleted;

    // eslint-disable-next-line no-console
    console.log(typeof callback === 'function', callback);

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
  }, [currentWallet, router, setVoteActionSource, voteActionSource]);

  return null;
};

export default Transaction;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  return {
    props: {
      ...(await getTranslations(locale)),
    },
  };
};
