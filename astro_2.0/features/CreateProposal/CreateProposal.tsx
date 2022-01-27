import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useMount } from 'react-use';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import last from 'lodash/last';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

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
import { getInitialProposalVariant } from 'astro_2.0/features/CreateProposal/createProposalHelpers';
import { UserPermissions } from 'types/context';

import {
  getFormContentNode,
  getFormInitialValues,
  getNewProposalObject,
  getValidationSchema,
  mapProposalVariantToProposalType,
} from './helpers';

import { CreateProposalCard } from './components/CreateProposalCard';

import styles from './CreateProposal.module.scss';

export interface CreateProposalProps {
  className?: string;
  dao: DAO;
  proposalVariant?: ProposalVariant;
  daoTokens: Record<string, Token>;
  showFlag?: boolean;
  bountyId?: number;
  onCreate?: (result: boolean) => void;
  onClose: () => void;
  userPermissions: UserPermissions;
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
  userPermissions,
}) => {
  const { t } = useTranslation();
  const { accountId } = useAuthContext();
  const router = useRouter();
  const initialProposalVariant = getInitialProposalVariant(
    proposalVariant,
    userPermissions.isCanCreatePolicyProposals
  );
  const [selectedProposalVariant, setSelectedProposalVariant] = useState(
    initialProposalVariant
  );
  const [schemaContext, setSchemaContext] = useState({
    selectedProposalVariant: initialProposalVariant,
  });
  const formRef = useRef<HTMLDivElement>(null);

  useMount(() => {
    formRef?.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  useEffect(() => {
    setSelectedProposalVariant(initialProposalVariant);
    setSchemaContext({ selectedProposalVariant: initialProposalVariant });
  }, [initialProposalVariant]);

  const methods = useForm({
    defaultValues: getFormInitialValues(selectedProposalVariant, accountId),
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

        if (newProposal) {
          let resp;

          if (selectedProposalVariant === ProposalVariant.ProposeTransfer) {
            resp = await SputnikNearService.createTokenTransferProposal(
              newProposal
            );

            resp = last(resp as FinalExecutionOutcome[]);
          } else {
            resp = await SputnikNearService.createProposal(newProposal);
          }

          showNotification({
            type: NOTIFICATION_TYPES.INFO,
            description: t('successProposalNotification'),
            lifetime: 20000,
          });

          const newProposalId = JSON.parse(
            Buffer.from(
              // todo - Oleg: fix this!
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              resp.status.SuccessValue as string,
              'base64'
            ).toString('ascii')
          );

          await router.push({
            pathname: SINGLE_PROPOSAL_PAGE_URL,
            query: {
              dao: dao.id,
              proposal: `${dao.id}-${newProposalId}`,
            },
          });

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
      t,
    ]
  );

  const contentNode = getFormContentNode(selectedProposalVariant, dao);

  return (
    <FormProvider {...methods}>
      <div className={cn(styles.root, className)} ref={formRef}>
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
              userPermissions={userPermissions}
              onClose={onClose}
              onTypeSelect={v => {
                const defaults = getFormInitialValues(v, accountId);

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
              buttonLabel={t('propose')}
              bond={{ value: dao.policy.proposalBond }}
            />
          }
        />
      </div>
    </FormProvider>
  );
};
