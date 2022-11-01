import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLifecycles, useLocalStorage, useMount } from 'react-use';
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
import { CreateProposalAction } from 'astro_2.0/features/CreateProposal/types';

import { useWalletContext } from 'context/WalletContext';
import { getInitialProposalVariant } from 'astro_2.0/features/CreateProposal/createProposalHelpers';

import { useSubmitProposal } from 'astro_2.0/features/CreateProposal/hooks/useSubmitProposal';
import { useSubmitDraft } from 'astro_2.0/features/CreateProposal/hooks/useSubmitDraft';

import { getFormInitialValues } from 'astro_2.0/features/CreateProposal/helpers/initialValues';
import { getNonEditableGasValue } from 'astro_2.0/features/CreateProposal/helpers/proposalVariantsHelpers';
import { resolver } from 'astro_2.0/features/CreateProposal/helpers/validation';

import { CREATE_PROPOSAL_FORM } from 'constants/common';

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
  actionType?: CreateProposalAction;
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
  actionType,
}) => {
  const [, setNewProposalFlag] = useLocalStorage(CREATE_PROPOSAL_FORM);
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
    formRef?.current?.scrollIntoView({ block: 'center' });
  });

  useEffect(() => {
    setSelectedProposalVariant(initialProposalVariant);
    setSchemaContext({ selectedProposalVariant: initialProposalVariant });
  }, [initialProposalVariant]);

  useLifecycles(
    () => {
      setNewProposalFlag(1);
    },
    () => {
      setNewProposalFlag(0);
    }
  );

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
      isDraft,
      dao
    ),
    context: schemaContext,
    shouldUnregister: false,
    mode: 'all',
    reValidateMode: 'onChange',
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
    actionType,
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
          isDraft,
          dao
        );

        methods.reset({ ...defaults });
      }

      setSchemaContext({ selectedProposalVariant: value });

      setSelectedProposalVariant(value);
    },
    [t, accountId, isDraft, draftTitle, draftDescription, dao, methods]
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
          }
          infoPanelNode={
            isDraft ? undefined : (
              <TransactionDetailsWidget
                gas={nonEditableGas}
                onSubmit={onSubmit}
                buttonLabel={t('propose')}
                bond={{ value: dao.policy.proposalBond }}
                bondInfo={
                  selectedProposalVariant === ProposalVariant.ProposeTransfer ||
                  selectedProposalVariant ===
                    ProposalVariant.ProposeCreateBounty
                    ? 'Extra 0.1N fee may be used as a storage deposit to register an account in case FT is used'
                    : undefined
                }
              />
            )
          }
        />
        {isDraft ? (
          <Button
            disabled={Object.keys(methods.formState.errors).length > 0}
            capitalize
            size="small"
            className={styles.saveDraft}
            onClick={methods.handleSubmit(onDraftSubmit)}
          >
            {t('drafts.createDraftPage.saveButton')}
          </Button>
        ) : null}
      </div>
    </FormProvider>
  );
};
