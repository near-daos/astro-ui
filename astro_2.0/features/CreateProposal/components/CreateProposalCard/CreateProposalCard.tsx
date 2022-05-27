import React, { ReactNode, useMemo } from 'react';
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
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const isMobile = useMedia('(max-width: 767px)');
  const { t } = useTranslation();

  const proposalTypesOptions = useMemo(
    () =>
      getProposalTypesOptions(
        userPermissions.isCanCreatePolicyProposals,
        userPermissions.allowedProposalsToCreate,
        canCreateTokenProposal
      ),
    [userPermissions, canCreateTokenProposal]
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
    switch (type) {
      case ProposalVariant.ProposeChangeProposalCreationPermissions: {
        return (
          <InfoBlockWidget
            label="Proposal type: Change Policy"
            value="Proposal Creation"
          />
        );
      }
      case ProposalVariant.ProposeChangeProposalVotingPermissions: {
        return (
          <InfoBlockWidget
            label="Proposal type: Change Policy"
            value="Voting Permissions"
          />
        );
      }
      case ProposalVariant.ProposeCreateDao: {
        return <InfoBlockWidget label="Migrate" value="Create DAO" />;
      }
      case ProposalVariant.ProposeTransferFunds: {
        return <InfoBlockWidget label="Migrate" value="Transfer DAO funds" />;
      }
      case ProposalVariant.ProposeGetUpgradeCode: {
        return (
          <InfoBlockWidget label="Upgrade" value="Get Code From Factory" />
        );
      }
      case ProposalVariant.ProposeUpgradeSelf: {
        return <InfoBlockWidget label="Upgrade" value="Upgrade DAO" />;
      }
      case ProposalVariant.ProposeRemoveUpgradeCode: {
        return (
          <InfoBlockWidget label="Upgrade" value="Recover Storage Costs" />
        );
      }
      case ProposalVariant.ProposeDoneBounty: {
        return (
          <InfoBlockWidget
            label="Proposal type: Transfer/Bounty Done"
            value="Complete Bounty"
          />
        );
      }
      case ProposalVariant.ProposeTokenDistribution: {
        return (
          <InfoBlockWidget
            label="Custom Function"
            value="Distribution of tokens"
          />
        );
      }
      case ProposalVariant.ProposeContractAcceptance: {
        return (
          <InfoBlockWidget
            label="Creating Token"
            value="Acceptance of contract"
          />
        );
      }
      case ProposalVariant.ProposeCreateToken: {
        return <InfoBlockWidget label="Change Config" value="Create Token" />;
      }
      default: {
        return (
          <GroupedSelect
            key={type}
            inputStyles={
              isMobile
                ? {
                    width: `${getInputSize(type, 26) - 2}ch`,
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

  function renderDescription(optionalNode?: ReactNode) {
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
      case ProposalVariant.ProposeContractAcceptance:
      case ProposalVariant.ProposeTokenDistribution: {
        return <div className={styles.descriptionCell}>{content}</div>;
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
        Countdown will&nbsp;be&nbsp;here
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
