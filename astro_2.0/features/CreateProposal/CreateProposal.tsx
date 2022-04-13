import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMount, useMountedState } from 'react-use';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import last from 'lodash/last';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { useModal } from 'components/modal';

import { ProposalCardRenderer } from 'astro_2.0/components/ProposalCardRenderer';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';
import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget';
import { CaptchaModal } from 'astro_2.0/features/CreateProposal/components/CaptchaModal';

import { CreateProposalParams, ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';

import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

import { useAuthContext } from 'context/AuthContext';
import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { getInitialProposalVariant } from 'astro_2.0/features/CreateProposal/createProposalHelpers';
import { UserPermissions } from 'types/context';

import { getFormInitialValues } from 'astro_2.0/features/CreateProposal/helpers/initialValues';
import { getNewProposalObject } from 'astro_2.0/features/CreateProposal/helpers/newProposalObject';
import {
  getFormContentNode,
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
  showClose?: boolean;
  showInfo?: boolean;
  canCreateTokenProposal?: boolean;
  initialValues?: Record<string, unknown>;
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
  showClose = true,
  showInfo = true,
  canCreateTokenProposal = false,
  initialValues,
}) => {
  const isMounted = useMountedState();
  const { t } = useTranslation();
  const { accountId, nearService } = useAuthContext();
  const router = useRouter();
  const initialProposalVariant = getInitialProposalVariant(
    proposalVariant,
    userPermissions.isCanCreatePolicyProposals,
    userPermissions.allowedProposalsToCreate
  );
  const [selectedProposalVariant, setSelectedProposalVariant] = useState(
    initialProposalVariant
  );
  const [schemaContext, setSchemaContext] = useState({
    selectedProposalVariant: initialProposalVariant,
  });
  const formRef = useRef<HTMLDivElement>(null);

  const [showModal] = useModal(CaptchaModal);

  useMount(() => {
    formRef?.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  useEffect(() => {
    setSelectedProposalVariant(initialProposalVariant);
    setSchemaContext({ selectedProposalVariant: initialProposalVariant });
  }, [initialProposalVariant]);

  const methods = useForm({
    defaultValues: getFormInitialValues(
      selectedProposalVariant,
      accountId,
      initialValues
    ),
    context: schemaContext,
    mode: 'onSubmit',
    resolver: async (data, context) => {
      const schema = getValidationSchema(
        context?.selectedProposalVariant,
        dao,
        data,
        nearService
      );

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
        if (
          selectedProposalVariant === ProposalVariant.ProposeContractAcceptance
        ) {
          const [res] = await showModal();

          if (!res) {
            return;
          }
        }

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
            resp = await nearService?.createTokenTransferProposal(newProposal);
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

          await router.push({
            pathname: SINGLE_PROPOSAL_PAGE_URL,
            query: {
              dao: dao.id,
              proposal: `${dao.id}-${newProposalId}`,
              fromCreate: true,
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

        if (onCreate && isMounted()) {
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
      showModal,
      router,
      onCreate,
      nearService,
      onClose,
      isMounted,
    ]
  );

  const contentNode = getFormContentNode(selectedProposalVariant, dao);

  return (
    <FormProvider {...methods}>
      <div className={cn(styles.root, className)} ref={formRef}>
        <ProposalCardRenderer
          showInfo={showInfo}
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
              showClose={showClose}
              key={selectedProposalVariant}
              userPermissions={userPermissions}
              canCreateTokenProposal={canCreateTokenProposal}
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
