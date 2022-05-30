import { CreateProposalParams, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';
import { useRouter } from 'next/router';
import { useMountedState } from 'react-use';
import { useWalletContext } from 'context/WalletContext';
import { useModal } from 'components/modal';
import { CaptchaModal } from 'astro_2.0/features/CreateProposal/components/CaptchaModal';
import { useCallback } from 'react';
import { getTransferDaoFundsProposal } from 'astro_2.0/features/CreateProposal/helpers/proposalObjectHelpers';
import { getNewProposalObject } from 'astro_2.0/features/CreateProposal/helpers/newProposalObject';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import last from 'lodash/last';
import { GA_EVENTS, sendGAEvent } from 'utils/ga';
import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';
import omit from 'lodash/omit';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

export function useSubmitProposal({
  selectedProposalVariant,
  dao,
  daoTokens,
  bountyId,
  onClose,
  onCreate,
  redirectAfterCreation,
}: {
  selectedProposalVariant: ProposalVariant;
  dao: DAO;
  daoTokens: Record<string, Token>;
  bountyId: number | undefined;
  onClose: () => void;
  onCreate: ((proposalId: number | number[] | null) => void) | undefined;
  redirectAfterCreation: boolean;
}): {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
} {
  const router = useRouter();
  const isMounted = useMountedState();
  const { accountId, nearService } = useWalletContext();

  const [showModal] = useModal(CaptchaModal);

  const onSubmit = useCallback(
    async data => {
      // show captcha modal for some proposals
      if (
        selectedProposalVariant === ProposalVariant.ProposeContractAcceptance
      ) {
        const [res] = await showModal();

        if (!res) {
          return;
        }
      }

      // for some proposals like migrate DAO funds we have to create several proposals in batch
      switch (selectedProposalVariant) {
        case ProposalVariant.ProposeTransferFunds: {
          try {
            const tokenIds = Object.values(daoTokens).map(item => item.symbol);
            // iterate dao tokens and prepare array of transfer params
            const proposalsData = tokenIds.map(token => {
              const amount = data[`${token}_amount`];
              const target = data[`${token}_target`];

              return getTransferDaoFundsProposal(
                dao,
                {
                  ...data,
                  amount,
                  target,
                  token,
                } as Record<string, string>,
                daoTokens
              );
            });

            const res = await nearService?.createTokensTransferProposal(
              proposalsData
            );

            if (res) {
              const newProposalsIds = res
                .map(resp => {
                  const id = resp
                    ? JSON.parse(
                        Buffer.from(
                          // todo - Oleg: fix this!
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          resp?.status?.SuccessValue as string,
                          'base64'
                        ).toString('ascii')
                      )
                    : null;

                  return parseInt(id, 10);
                })
                .filter(item => item);

              if (!newProposalsIds.length) {
                onClose();

                return;
              }

              if (onCreate) {
                onCreate(newProposalsIds);

                onClose();
              }
            }
          } catch (err) {
            showNotification({
              type: NOTIFICATION_TYPES.ERROR,
              description: err.message,
              lifetime: 20000,
            });

            if (onCreate && isMounted()) {
              onCreate(null);
            }
          }

          break;
        }
        default: {
          let newProposal = await getNewProposalObject(
            dao,
            selectedProposalVariant,
            data,
            daoTokens,
            accountId,
            bountyId
          );

          try {
            if (selectedProposalVariant !== ProposalVariant.ProposeTransfer) {
              // Add proposal variant and gas
              newProposal = {
                ...newProposal,
                description: `${newProposal?.description}${EXTERNAL_LINK_SEPARATOR}${selectedProposalVariant}`,
                gas: data.gas,
              } as CreateProposalParams;
            }

            if (!newProposal) {
              return;
            }

            let resp;

            if (selectedProposalVariant === ProposalVariant.ProposeTransfer) {
              resp = await nearService?.createTokenTransferProposal(
                newProposal
              );
            } else {
              resp = await nearService?.addProposal(newProposal);
            }

            const newProposalId = resp
              ? JSON.parse(
                  Buffer.from(
                    // todo - Oleg: fix this!
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    last(resp)?.status?.SuccessValue as string,
                    'base64'
                  ).toString('ascii')
                )
              : null;

            if (newProposalId === null) {
              onClose();

              return;
            }

            sendGAEvent({
              name: GA_EVENTS.CREATE_PROPOSAL,
              daoId: dao.id,
              accountId,
              params: {
                variant: selectedProposalVariant,
                proposalId: newProposalId,
              },
            });

            if (onCreate) {
              onCreate(newProposalId);
            }

            if (redirectAfterCreation) {
              await router.push({
                pathname: SINGLE_PROPOSAL_PAGE_URL,
                query: {
                  ...omit(router.query, ['action', 'variant', 'params']),
                  dao: dao.id,
                  proposal: `${dao.id}-${newProposalId}`,
                  fromCreate: true,
                },
              });
            }
          } catch (err) {
            showNotification({
              type: NOTIFICATION_TYPES.ERROR,
              description: err.message,
              lifetime: 20000,
            });

            if (onCreate && isMounted()) {
              onCreate(null);
            }
          }
        }
      }
    },
    [
      dao,
      selectedProposalVariant,
      daoTokens,
      accountId,
      bountyId,
      showModal,
      router,
      onCreate,
      nearService,
      onClose,
      redirectAfterCreation,
      isMounted,
    ]
  );

  return {
    onSubmit,
  };
}
