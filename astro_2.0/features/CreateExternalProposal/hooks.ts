import { ProposalVariant } from 'types/proposal';
import { useCallback, useEffect, useState } from 'react';
import { useWalletContext } from 'context/WalletContext';
import { useMountedState } from 'react-use';
import { useRouter } from 'next/router';
import omit from 'lodash/omit';

const CREATE_PROPOSAL = 'create_proposal';

// example:
// https://dev.app.astrodao.com/dao/aviarium.sputnikv2.testnet/proposals?action=create_proposal&variant=ProposeCustomFunctionCall&params={"details":"Proposal description here", "methodName": "create", "smartContractAddress": "sputnikv2.testnet", "json":{ "key": "some value" }}

export function isActionValid(action: string | undefined): boolean {
  return action === CREATE_PROPOSAL;
}

export function isVariantValid(proposalVariant: string | undefined): boolean {
  return Object.values(ProposalVariant).includes(
    proposalVariant as ProposalVariant
  );
}

export function useCreateProposalFromExternal(
  onCreateProposal: (
    initialProposalVariant?: ProposalVariant,
    initialValues?: Record<string, unknown>
  ) => void
): {
  error: string;
  handleDismiss: () => void;
} {
  const router = useRouter();
  const isMounted = useMountedState();
  const { accountId } = useWalletContext();
  const { action, variant, params } = router.query;

  const [error, setError] = useState<string>('');

  const handleDismiss = useCallback(() => {
    setError('');
    router.replace(
      {
        pathname: router.pathname,
        query: omit(router.query, ['action', 'variant', 'params']),
      },
      undefined,
      {
        shallow: true,
      }
    );
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        if (!action && !variant) {
          return;
        }

        if (!isActionValid(action as string)) {
          setError('Unsupported action');

          return;
        }

        if (!isVariantValid(variant as string)) {
          setError('Unsupported proposal variant');

          return;
        }

        if (!accountId) {
          setError(
            'Cannot create proposal by unauthorized user. Please sign in first'
          );

          return;
        }

        // http://localhost:8080/dao/aviarium.sputnikv2.testnet/proposals?action=create_proposal&variant=ProposeCustomFunctionCall&params={"details":"Proposal description here", "methodName": "create", "smartContractAddress": "sputnikv2.testnet", "json":{ "msg": "{\"draft_group_id\":1}" }}
        // http://localhost:8080/dao/aviarium.sputnikv2.testnet/proposals?action=create_proposal&variant=ProposeCustomFunctionCall&params={"details":"Proposal description here", "methodName": "create", "smartContractAddress": "sputnikv2.testnet", "json":{ "msg": {"draft_group_id":1} }}

        const parsedParams = params
          ? JSON.parse(decodeURIComponent(params as string).trim())
          : {};

        setError('');

        setTimeout(() => {
          if (!isMounted()) {
            return;
          }

          onCreateProposal(variant as ProposalVariant, {
            ...parsedParams,
            json: JSON.stringify(parsedParams.json),
          });
        }, 1500);
      } catch (e) {
        // probably invalid params
        setError('Invalid proposal parameters');
      }
    })();
  }, [onCreateProposal, accountId, isMounted, action, variant, params]);

  return {
    error,
    handleDismiss,
  };
}
