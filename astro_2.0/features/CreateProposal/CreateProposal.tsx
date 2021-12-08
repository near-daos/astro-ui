import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useMount } from 'react-use';
import { useRouter } from 'next/router';

import { SputnikNearService } from 'services/sputnik';

import { ProposalCardRenderer } from 'astro_2.0/components/ProposalCardRenderer';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';
import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget';

import { CreateProposalParams, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

import { useAuthContext } from 'context/AuthContext';
import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import {
  getFormContentNode,
  getFormInitialValues,
  getNewProposalObject,
  getValidationSchema,
  mapProposalVariantToProposalType,
} from './helpers';

import { CreateProposalCard } from './components/CreateProposalCard';

export interface CreateProposalProps {
  className?: string;
  dao: DAO;
  proposalVariant?: ProposalVariant;
  daoTokens: Record<string, Token>;
  showFlag?: boolean;
  bountyId?: string;
  onCreate?: (result: boolean) => void;
  onClose: () => void;
}

export const CreateProposal: FC<CreateProposalProps> = ({
  className,
  dao,
  daoTokens,
  proposalVariant = ProposalVariant.ProposeTransfer,
  showFlag = true,
  bountyId,
  onCreate,
  onClose,
}) => {
  const { accountId } = useAuthContext();
  const router = useRouter();
  const [selectedProposalVariant, setSelectedProposalVariant] = useState(
    proposalVariant
  );
  const [schemaContext, setSchemaContext] = useState({
    selectedProposalVariant: proposalVariant,
  });
  const formRef = useRef<HTMLDivElement>(null);

  useMount(() => {
    formRef?.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  useEffect(() => {
    setSelectedProposalVariant(proposalVariant);
    setSchemaContext({ selectedProposalVariant: proposalVariant });
  }, [proposalVariant]);

  const methods = useForm({
    defaultValues: getFormInitialValues(
      selectedProposalVariant,
      dao,
      accountId
    ),
    context: schemaContext,
    mode: 'onSubmit',
    resolver: async (data, context) => {
      const schema = getValidationSchema(context?.selectedProposalVariant);

      try {
        let values = await schema.validate(data, {
          abortEarly: false,
        });

        if (
          context?.selectedProposalVariant ===
          ProposalVariant.ProposeChangeDaoFlag
        ) {
          values = {
            ...values,
            flagCover: data.flagCover,
            flagLogo: data.flagLogo,
          };
        }

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (
              allErrors: Record<string, string>,
              currentError: { path: string; type?: string; message: string }
            ) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
  });

  const onSubmit = useCallback(
    async data => {
      try {
        let newProposal = await getNewProposalObject(
          dao,
          selectedProposalVariant,
          data,
          daoTokens,
          accountId,
          bountyId
        );

        // Add proposal variant and gas
        newProposal = {
          ...newProposal,
          description: `${newProposal?.description}${EXTERNAL_LINK_SEPARATOR}${selectedProposalVariant}`,
          gas: data.gas,
        } as CreateProposalParams;

        if (newProposal) {
          const resp = await SputnikNearService.createProposal(newProposal);

          showNotification({
            type: NOTIFICATION_TYPES.INFO,
            description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
            lifetime: 20000,
          });

          const newProposalId = JSON.parse(
            // todo - Oleg: fix this!
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Buffer.from(resp.status.SuccessValue as string, 'base64').toString(
              'ascii'
            )
          );

          await router.push(
            `/dao/${dao.id}/proposals/${dao.id}-${newProposalId}`
          );

          if (onCreate) {
            onCreate(true);
          }
        }
      } catch (err) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          description: err.message,
          lifetime: 20000,
        });

        if (onCreate) {
          onCreate(false);
        }
      }
    },
    [
      dao,
      selectedProposalVariant,
      daoTokens,
      accountId,
      bountyId,
      router,
      onCreate,
    ]
  );

  const contentNode = getFormContentNode(selectedProposalVariant, dao);

  return (
    <FormProvider {...methods}>
      <div className={className} ref={formRef}>
        <ProposalCardRenderer
          daoFlagNode={
            showFlag && (
              <DaoFlagWidget
                daoName={dao.name}
                flagUrl={dao.flagCover}
                daoId={dao.id}
                fallBack={dao.logo}
              />
            )
          }
          letterHeadNode={
            <LetterHeadWidget
              type={mapProposalVariantToProposalType(selectedProposalVariant)}
              coverUrl={dao.flagCover}
            />
          }
          proposalCardNode={
            <CreateProposalCard
              key={selectedProposalVariant}
              onClose={onClose}
              onTypeSelect={v => {
                const defaults = getFormInitialValues(v, dao, accountId);

                methods.reset({ ...defaults });

                setSchemaContext({ selectedProposalVariant: v });

                setSelectedProposalVariant(v);
              }}
              type={selectedProposalVariant}
              content={
                <CustomTokensContext.Provider value={{ tokens: daoTokens }}>
                  {contentNode}
                </CustomTokensContext.Provider>
              }
              proposer={accountId}
            />
          }
          infoPanelNode={
            <TransactionDetailsWidget
              onSubmit={onSubmit}
              buttonLabel="Propose"
              bond={{ value: dao.policy.proposalBond }}
            />
          }
        />
      </div>
    </FormProvider>
  );
};
