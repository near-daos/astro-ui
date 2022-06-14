import React, { ReactNode, useCallback, useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import cn from 'classnames';
import { useFormContext } from 'react-hook-form';
import { useMedia } from 'react-use';

import { TextArea } from 'components/inputs/TextArea';
import { Input } from 'components/inputs/Input';
import { Icon } from 'components/Icon';
import { IconButton } from 'components/button/IconButton';
import { GroupedSelect } from 'astro_2.0/features/CreateProposal/components/GroupedSelect';
import { FunctionCallTypeSelector } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/FunctionCallTypeSelector';

import { ProposalVariant } from 'types/proposal';
import { UserPermissions } from 'types/context';
import { LOREN_IPSUM } from 'constants/common';

import {
  getInputSize,
  getProposalTypesOptions,
} from 'astro_2.0/features/CreateProposal/helpers';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { EditableContent } from 'astro_2.0/components/EditableContent';

import styles from './CreateProposalCard.module.scss';

export interface CreateProposalCardProps {
  type: ProposalVariant;
  proposer: string;
  content: ReactNode;
  onTypeSelect: (newType: ProposalVariant) => void;
  onClose?: () => void;
  userPermissions: UserPermissions;
  showClose: boolean;
  canCreateTokenProposal: boolean;
  daoId: string;
  isDraft?: boolean;
  isEditDraft?: boolean;
}

export const CreateProposalCard: React.FC<CreateProposalCardProps> = ({
  type,
  showClose,
  proposer,
  content,
  onTypeSelect,
  onClose,
  userPermissions,
  canCreateTokenProposal,
  daoId,
  isDraft,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext();
  const isMobile = useMedia('(max-width: 767px)');
  const { t } = useTranslation();

  const title = watch('title');
  const description = watch('description');
  const hashtags = watch('hashtags');

  const proposalTypesOptions = useMemo(
    () =>
      getProposalTypesOptions(
        t,
        userPermissions.isCanCreatePolicyProposals,
        userPermissions.allowedProposalsToCreate,
        canCreateTokenProposal
      ),
    [t, userPermissions, canCreateTokenProposal]
  );

  function renderCloseButton() {
    if (showClose) {
      return (
        <div className={styles.actionBar}>
          <IconButton
            icon="close"
            className={styles.action}
            onClick={onClose}
          />
        </div>
      );
    }

    return null;
  }

  function renderProposalCell() {
    const getTranslation = (key: string) =>
      t(`proposalCard.createProposal.header.${key}`);

    switch (type) {
      case ProposalVariant.ProposeChangeProposalCreationPermissions: {
        return (
          <InfoBlockWidget
            label={getTranslation('changePolicy')}
            value={getTranslation('proposalCreation')}
          />
        );
      }
      case ProposalVariant.ProposeChangeProposalVotingPermissions: {
        return (
          <InfoBlockWidget
            label={getTranslation('changePolicy')}
            value={getTranslation('votingPermissions')}
          />
        );
      }
      case ProposalVariant.ProposeCreateDao: {
        return (
          <InfoBlockWidget
            label={getTranslation('migrate')}
            value={getTranslation('createDao')}
          />
        );
      }
      case ProposalVariant.ProposeTransferFunds: {
        return (
          <InfoBlockWidget
            label={getTranslation('migrate')}
            value={getTranslation('transferDaoFunds')}
          />
        );
      }
      case ProposalVariant.ProposeGetUpgradeCode: {
        return (
          <InfoBlockWidget
            label={getTranslation('upgrade')}
            value={getTranslation('getCodeFromFactory')}
          />
        );
      }
      case ProposalVariant.ProposeUpgradeSelf: {
        return (
          <InfoBlockWidget
            label={getTranslation('upgrade')}
            value={getTranslation('upgradeDao')}
          />
        );
      }
      case ProposalVariant.ProposeRemoveUpgradeCode: {
        return (
          <InfoBlockWidget
            label={getTranslation('upgrade')}
            value={getTranslation('recoverStorageCosts')}
          />
        );
      }
      case ProposalVariant.ProposeDoneBounty: {
        return (
          <InfoBlockWidget
            label={getTranslation('transferBountyDone')}
            value={getTranslation('completeBounty')}
          />
        );
      }
      case ProposalVariant.ProposeTokenDistribution: {
        return (
          <InfoBlockWidget
            label={getTranslation('customFunction')}
            value={getTranslation('distributionOfTokens')}
          />
        );
      }
      case ProposalVariant.ProposeStakingContractDeployment: {
        return (
          <InfoBlockWidget
            label={getTranslation('createGovernanceToken')}
            value={getTranslation('deployStakingContract')}
          />
        );
      }
      case ProposalVariant.ProposeCreateToken: {
        return (
          <InfoBlockWidget
            label={getTranslation('changeConfig')}
            value={getTranslation('createToken')}
          />
        );
      }
      case ProposalVariant.ProposeUpdateGroup: {
        return (
          <InfoBlockWidget
            label={getTranslation('changePolicy')}
            value={getTranslation('group')}
          />
        );
      }
      case ProposalVariant.ProposeAcceptStakingContract: {
        return (
          <InfoBlockWidget
            label={getTranslation('createGovernanceToken')}
            value={getTranslation('acceptStakingContract')}
          />
        );
      }
      case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting: {
        return (
          <InfoBlockWidget
            label={getTranslation('createGovernanceToken')}
            value={getTranslation('changeVotingPolicy')}
          />
        );
      }
      default: {
        return (
          <GroupedSelect
            key={type}
            inputStyles={
              isMobile
                ? {
                    width: `${getInputSize(t, type, 26) - 2}ch`,
                    paddingRight: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    paddingLeft: 0,
                  }
                : {}
            }
            defaultValue={type}
            options={proposalTypesOptions}
            onChange={v => onTypeSelect(v as ProposalVariant)}
          />
        );
      }
    }
  }

  function renderProposer() {
    switch (type) {
      case ProposalVariant.ProposeCreateToken: {
        return null;
      }
      case ProposalVariant.ProposeCustomFunctionCall: {
        return (
          <div className={styles.proposerCell}>
            <InfoBlockWidget
              label={t('proposalCard.proposalOwner')}
              value={proposer}
            />
            <FunctionCallTypeSelector daoId={daoId} />
          </div>
        );
      }
      default: {
        return (
          <div className={styles.proposerCell}>
            <InfoBlockWidget
              label={t('proposalCard.proposalOwner')}
              value={proposer}
            />
          </div>
        );
      }
    }
  }

  const handlerChangeTitle = useCallback(
    titleValue => {
      setValue('title', titleValue);
      trigger('title');
    },
    [setValue, trigger]
  );

  const handlerChangeHashtags = useCallback(
    hashtagsValue => {
      setValue('hashtags', hashtagsValue);
      trigger('hashtags');
    },
    [setValue, trigger]
  );

  const handlerChangeDescription = useCallback(
    html => {
      let value = html;

      if (value === '<p><br></p>') {
        value = '';
      }

      setValue('description', value);
      setValue('details', value);
      trigger('description');
      trigger('details');
    },
    [setValue, trigger]
  );

  function renderEditableContent() {
    return (
      <EditableContent
        errors={errors}
        placeholder="Describe your draft..."
        titlePlaceholder="Add draft name"
        title={title}
        setTitle={handlerChangeTitle}
        hashtags={hashtags}
        setHashtags={handlerChangeHashtags}
        className={styles.editable}
        html={description}
        setHTML={handlerChangeDescription}
      />
    );
  }

  function renderDescription(optionalNode?: ReactNode) {
    if (isDraft) {
      return renderEditableContent();
    }

    switch (type) {
      case ProposalVariant.ProposeCreateToken: {
        return null;
      }
      case ProposalVariant.ProposeRemoveUpgradeCode:
      case ProposalVariant.ProposeUpgradeSelf:
      case ProposalVariant.ProposeGetUpgradeCode: {
        return (
          <div className={styles.descriptionCell}>
            <InputWrapper
              fieldName="details"
              label={t('proposalCard.proposalDescription')}
              fullWidth
            >
              <TextArea
                size="block"
                textAlign="left"
                resize="none"
                autoFocus
                placeholder={LOREN_IPSUM}
                className={styles.textArea}
                isBorderless
                maxLength={500}
                minRows={2}
                maxRows={4}
                {...register('details')}
              />
            </InputWrapper>
          </div>
        );
      }
      default: {
        return (
          <div className={styles.descriptionCell}>
            <InputWrapper
              fieldName="details"
              label={t('proposalCard.proposalDescription')}
              fullWidth
            >
              <TextArea
                size="block"
                textAlign="left"
                resize="none"
                autoFocus
                placeholder={LOREN_IPSUM}
                className={styles.textArea}
                isBorderless
                maxLength={500}
                minRows={2}
                maxRows={4}
                {...register('details')}
              />
            </InputWrapper>
            <div className={styles.proposalExternalLink}>
              <Icon
                name="buttonExternal"
                width={14}
                className={cn({
                  [styles.error]: errors.externalUrl,
                })}
              />
              <Input
                isBorderless
                size="block"
                className={styles.linkInput}
                {...register('externalUrl')}
                placeholder="example.com/putyourlinkhere"
              />
            </div>
            {optionalNode}
          </div>
        );
      }
    }
  }

  function renderCardContent() {
    switch (type) {
      case ProposalVariant.ProposeChangeProposalVotingPermissions:
      case ProposalVariant.ProposeChangeProposalCreationPermissions: {
        return (
          <>
            {renderProposer()}
            {renderDescription(
              <div className={styles.customContent}>{content}</div>
            )}
          </>
        );
      }
      case ProposalVariant.ProposeStakingContractDeployment:
      case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting:
      case ProposalVariant.ProposeAcceptStakingContract:
      case ProposalVariant.ProposeTokenDistribution: {
        return (
          <>
            <div className={styles.descriptionCell}>{content}</div>
            {renderEditableContent()}
          </>
        );
      }
      case ProposalVariant.ProposeUpdateGroup: {
        return (
          <>
            {renderProposer()}
            {renderDescription()}
            <div className={styles.proposalGroupCell}>{content}</div>
          </>
        );
      }
      default: {
        return (
          <>
            {renderProposer()}
            {renderDescription()}
            <div className={styles.contentCell}>{content}</div>
          </>
        );
      }
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.proposalCell}>{renderProposalCell()}</div>
      <div className={styles.countdownCell}>
        {t('proposalCard.createProposal.countdown')}
      </div>
      {renderCardContent()}
      <div className={styles.voteControlCell}>
        <Icon name="votingYesChecked" className={styles.voteIcon} />
        <Icon name="votingNoChecked" className={styles.voteIcon} />
      </div>
      {renderCloseButton()}
    </div>
  );
};
