import React, { FC, useCallback, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useMount } from 'react-use';

import { SputnikHttpService, SputnikNearService } from 'services/sputnik';
import { useCustomTokensContext } from 'context/CustomTokensContext';

import { ProposalCardRenderer } from 'astro_2.0/components/ProposalCardRenderer';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';
import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget';

import { ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';

import {
  getFormContentNode,
  getFormInitialValues,
  getNewProposalObject,
  getValidationSchema,
  mapProposalVariantToProposalType,
} from 'astro_2.0/features/CreateProposal/helpers';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { CreateProposalCard } from './components/CreateProposalCard';

export interface CreateProposalProps {
  dao: DAO;
  proposalVariant: ProposalVariant;
  onCreate: (result: boolean) => void;
  onClose: () => void;
}

export const CreateProposal: FC<CreateProposalProps> = ({
  dao,
  proposalVariant,
  onCreate,
  onClose,
}) => {
  const accountId = 'me';
  const [selectedProposalVariant, setSelectedProposalVariant] = useState(
    proposalVariant
  );
  const [schemaContext, setSchemaContext] = useState({
    selectedProposalVariant: proposalVariant,
  });
  const formRef = useRef<HTMLFormElement>(null);

  useMount(() => {
    formRef?.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  const { tokens, setTokens } = useCustomTokensContext();

  useMount(() => {
    SputnikHttpService.getAccountTokens(dao.id).then(res => setTokens(res));
  });

  const methods = useForm({
    defaultValues: getFormInitialValues(selectedProposalVariant, dao),
    context: schemaContext,
    mode: 'onSubmit',
    resolver: async (data, context) => {
      const schema = getValidationSchema(context?.selectedProposalVariant);

      try {
        const values = await schema.validate(data, {
          abortEarly: false,
        });

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
        const newProposal = await getNewProposalObject(
          dao,
          selectedProposalVariant,
          data,
          tokens
        );

        if (newProposal) {
          await SputnikNearService.createProposal(newProposal);

          showNotification({
            type: NOTIFICATION_TYPES.INFO,
            description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
            lifetime: 20000,
          });

          onCreate(true);
        }
      } catch (err) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          description: err.message,
          lifetime: 20000,
        });

        onCreate(false);
      }
    },
    [dao, onCreate, selectedProposalVariant, tokens]
  );

  const contentNode = getFormContentNode(selectedProposalVariant, dao);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate ref={formRef}>
        <ProposalCardRenderer
          daoFlagNode={<DaoFlagWidget daoName={dao.name} flagUrl={dao.logo} />}
          letterHeadNode={
            <LetterHeadWidget
              type={mapProposalVariantToProposalType(selectedProposalVariant)}
              coverUrl="/cover.png"
            />
          }
          proposalCardNode={
            <CreateProposalCard
              onClose={onClose}
              onTypeSelect={v => {
                const defaults = getFormInitialValues(v, dao);

                methods.reset({ ...defaults });

                setSchemaContext({ selectedProposalVariant: v });

                setSelectedProposalVariant(v);
              }}
              type={selectedProposalVariant}
              content={contentNode}
              proposer={accountId}
            />
          }
          infoPanelNode={
            <TransactionDetailsWidget
              bond={dao.policy.proposalBond}
              gas="0.2"
              buttonLabel="Propose"
            />
          }
        />
      </form>
    </FormProvider>
  );
};
