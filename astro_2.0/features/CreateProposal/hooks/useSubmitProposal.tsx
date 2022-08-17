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
import { DATA_SEPARATOR } from 'constants/common';
import last from 'lodash/last';
import { GA_EVENTS, sendGAEvent } from 'utils/ga';
import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';
import omit from 'lodash/omit';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import {
  AcceptStakingContractParams,
  DeployStakingContractParams,
} from 'services/sputnik/SputnikNearService/services/GovernanceTokenService';
import { SputnikNearService } from 'services/sputnik';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider';

async function createProposal(
  variant: ProposalVariant,
  proposal: CreateProposalParams,
  nearService: SputnikNearService | null
) {
  if (variant === ProposalVariant.ProposeTransfer) {
    return nearService?.createTokenTransferProposal(proposal);
  }

  if (variant === ProposalVariant.ProposeStakingContractDeployment) {
    return nearService?.deployStakingContract(
      (proposal as unknown) as DeployStakingContractParams
    );
  }

  if (variant === ProposalVariant.ProposeAcceptStakingContract) {
    return nearService?.acceptStakingContract(
      (proposal as unknown) as AcceptStakingContractParams
    );
  }

  return nearService?.addProposal(proposal);
}

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
  const { accountId, nearService, pkAndSignature } = useWalletContext();
  const { draftsService } = useDraftsContext();

  const [showModal] = useModal(CaptchaModal);

  const onSubmit = useCallback(
    async data => {
      // show captcha modal for some proposals
      if (
        selectedProposalVariant === ProposalVariant.ProposeAcceptStakingContract
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
            const tokenIds = Object.values(daoTokens)
              .filter(token => Number(token.balance) > 0)
              .map(item => item.symbol);
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

          const { variant, description } = newProposal || {};

          try {
            const pVariant = variant ?? selectedProposalVariant;

            const getDescr = (separator: string) =>
              `${description}${separator}${pVariant}`;

            const pDescription = description?.includes(DATA_SEPARATOR)
              ? getDescr(DATA_SEPARATOR)
              : getDescr(`${DATA_SEPARATOR + DATA_SEPARATOR}`);

            if (selectedProposalVariant !== ProposalVariant.ProposeTransfer) {
              // Add proposal variant and gas
              newProposal = {
                ...newProposal,
                description: pDescription,
                gas: data.gas,
              } as CreateProposalParams;
            }

            if (!newProposal) {
              return;
            }

            const resp = await createProposal(
              selectedProposalVariant,
              newProposal,
              nearService
            );

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

            if (router.query.draft && pkAndSignature) {
              const { publicKey, signature } = pkAndSignature;

              if (publicKey && signature) {
                const draftId = router.query.draft as string;

                await draftsService.updateDraftClose({
                  id: draftId,
                  proposalId: newProposalId,
                  publicKey,
                  signature,
                  accountId,
                });
              }
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

            if (
              selectedProposalVariant === ProposalVariant.ProposeUpdateGroup
            ) {
              sendGAEvent({
                name: GA_EVENTS.GROUP_BULK_UPDATE,
                daoId: dao.id,
                accountId,
                params: {
                  variant: selectedProposalVariant,
                  proposalId: newProposalId,
                },
              });
            }

            if (onCreate && isMounted()) {
              onCreate(newProposalId);
            }

            await onClose();

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
      selectedProposalVariant,
      showModal,
      daoTokens,
      nearService,
      dao,
      onCreate,
      pkAndSignature,
      onClose,
      router,
      draftsService,
      accountId,
      isMounted,
      bountyId,
      redirectAfterCreation,
    ]
  );

  return {
    onSubmit,
  };
}
