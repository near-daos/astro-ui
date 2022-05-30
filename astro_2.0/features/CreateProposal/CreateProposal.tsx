import React, { FC, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import { ProposalCardRenderer } from 'astro_2.0/components/ProposalCardRenderer';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';
import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget';

import { ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';
import { UserPermissions } from 'types/context';

import { useWalletContext } from 'context/WalletContext';
import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { getInitialProposalVariant } from 'astro_2.0/features/CreateProposal/createProposalHelpers';

import { useSubmitProposal } from 'astro_2.0/features/CreateProposal/hooks/useSubmitProposal';

import { getFormInitialValues } from 'astro_2.0/features/CreateProposal/helpers/initialValues';
import { getNonEditableGasValue } from 'astro_2.0/features/CreateProposal/helpers/proposalVariantsHelpers';
import { resolver } from 'astro_2.0/features/CreateProposal/helpers/validation';
import {
  getFormContentNode,
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
  onCreate?: (proposalId: number | number[] | null) => void;
  redirectAfterCreation?: boolean;
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
  redirectAfterCreation = true,
  onClose,
  userPermissions,
  showClose = true,
  showInfo = true,
  canCreateTokenProposal = false,
  initialValues,
}) => {
  const { t } = useTranslation();
  const { accountId, nearService } = useWalletContext();
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

  useMount(() => {
    formRef?.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  useEffect(() => {
    setSelectedProposalVariant(initialProposalVariant);
    setSchemaContext({ selectedProposalVariant: initialProposalVariant });
  }, [initialProposalVariant]);

  const methods = useForm({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    defaultValues: getFormInitialValues(
      selectedProposalVariant,
      accountId,
      initialValues,
      daoTokens
    ),
    context: schemaContext,
    mode: 'onSubmit',
    resolver: resolver(dao, nearService, t),
  });

  const { onSubmit } = useSubmitProposal({
    selectedProposalVariant,
    dao,
    daoTokens,
    bountyId,
    onClose,
    onCreate,
    redirectAfterCreation,
  });

  const contentNode = getFormContentNode(selectedProposalVariant, dao);

  const nonEditableGas = getNonEditableGasValue(
    selectedProposalVariant,
    methods.getValues()
  );

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
            <CustomTokensContext.Provider value={{ tokens: daoTokens }}>
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
                content={contentNode}
                proposer={accountId}
                daoId={dao.id}
              />
            </CustomTokensContext.Provider>
          }
          infoPanelNode={
            <TransactionDetailsWidget
              gas={nonEditableGas}
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
