import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import { ProposalCardRenderer } from 'astro_2.0/components/ProposalCardRenderer';
import { LetterHeadWidget } from 'astro_2.0/components/ProposalCardRenderer/components/LetterHeadWidget';
import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';
import { TransactionDetailsWidget } from 'astro_2.0/components/TransactionDetailsWidget';
import { Button } from 'components/button/Button';

import { ProposalVariant } from 'types/proposal';
import { DAO } from 'types/dao';
import { Token } from 'types/token';
import { UserPermissions } from 'types/context';

import { useWalletContext } from 'context/WalletContext';
import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { getInitialProposalVariant } from 'astro_2.0/features/CreateProposal/createProposalHelpers';

import { useSubmitProposal } from 'astro_2.0/features/CreateProposal/hooks/useSubmitProposal';
import { useSubmitDraft } from 'astro_2.0/features/CreateProposal/hooks/useSubmitDraft';

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
  isDraft?: boolean;
  isEditDraft?: boolean;
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
  isDraft,
  isEditDraft,
}) => {
  const { t } = useTranslation();
  const { accountId, nearService } = useWalletContext();
  const initialProposalVariant = !isDraft
    ? getInitialProposalVariant(
        proposalVariant,
        userPermissions.isCanCreatePolicyProposals,
        userPermissions.allowedProposalsToCreate
      )
    : proposalVariant;

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

  const proposalType = useMemo(
    () => mapProposalVariantToProposalType(selectedProposalVariant),
    [selectedProposalVariant]
  );

  const methods = useForm({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    defaultValues: getFormInitialValues(
      t,
      selectedProposalVariant,
      accountId,
      initialValues,
      daoTokens,
      isDraft
    ),
    context: schemaContext,
    shouldUnregister: false,
    mode: 'onSubmit',
    resolver: resolver(dao, nearService, t, isDraft),
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

  const { onDraftSubmit } = useSubmitDraft({
    proposalType,
    proposalVariant: selectedProposalVariant,
    dao,
    bountyId,
    daoTokens,
    draftId: (initialValues?.id as string) || '',
    isEditDraft,
  });

  const contentNode = getFormContentNode(selectedProposalVariant, dao);

  const nonEditableGas = getNonEditableGasValue(
    selectedProposalVariant,
    methods.getValues()
  );

  const draftTitle = methods.watch('title');
  const draftDescription = methods.watch('description');

  const onTypeSelect = useCallback(
    (value, skip) => {
      if (!skip) {
        const defaults = getFormInitialValues(
          t,
          value,
          accountId,
          isDraft
            ? {
                title: draftTitle,
                description: draftDescription,
              }
            : undefined,
          undefined,
          isDraft
        );

        methods.reset({ ...defaults });
      }

      setSchemaContext({ selectedProposalVariant: value });

      setSelectedProposalVariant(value);
    },
    [draftTitle, draftDescription, t, accountId, isDraft, methods]
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
              type={proposalType}
              coverUrl={dao.flagCover}
              proposalVariant={selectedProposalVariant}
            />
          }
          proposalCardNode={
            <CustomTokensContext.Provider value={{ tokens: daoTokens }}>
              <CreateProposalCard
                isDraft={isDraft}
                showClose={showClose}
                key={selectedProposalVariant}
                userPermissions={userPermissions}
                canCreateTokenProposal={canCreateTokenProposal}
                onClose={onClose}
                onTypeSelect={onTypeSelect}
                type={selectedProposalVariant}
                content={contentNode}
                proposer={accountId}
                dao={dao}
                isEditDraft={isEditDraft}
                draftState={(initialValues?.state as string) || ''}
                draftId={(initialValues?.id as string) || ''}
              />
            </CustomTokensContext.Provider>
          }
          infoPanelNode={
            isDraft ? undefined : (
              <TransactionDetailsWidget
                gas={nonEditableGas}
                onSubmit={onSubmit}
                buttonLabel={t('propose')}
                bond={{ value: dao.policy.proposalBond }}
              />
            )
          }
        />
        {isDraft ? (
          <Button
            disabled={
              !methods?.formState.isValid ||
              !methods?.formState.isDirty ||
              Object.keys(methods.formState.errors).length > 0
            }
            capitalize
            size="small"
            className={styles.saveDraft}
            onClick={methods.handleSubmit(onDraftSubmit)}
          >
            Save
          </Button>
        ) : null}
      </div>
    </FormProvider>
  );
};
