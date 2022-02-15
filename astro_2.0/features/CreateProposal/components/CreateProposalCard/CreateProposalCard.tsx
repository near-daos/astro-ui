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
            onClick={() => onClose?.()}
          />
        </div>
      );
    }

    return null;
  }

  function renderProposer() {
    if (type !== ProposalVariant.ProposeCreateToken) {
      return (
        <div className={styles.proposerCell}>
          <InfoBlockWidget
            label={t('proposalCard.proposalOwner')}
            value={proposer}
          />
        </div>
      );
    }

    return null;
  }

  function renderDescription() {
    if (type !== ProposalVariant.ProposeCreateToken) {
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
              minRows={4}
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
        </div>
      );
    }

    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.proposalCell}>
        {type === ProposalVariant.ProposeDoneBounty ? (
          <InfoBlockWidget
            label="Proposal type: Transfer/Bounty Done"
            value="Complete Bounty"
          />
        ) : (
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
        )}
      </div>

      <div className={styles.countdownCell}>
        Countdown will&nbsp;be&nbsp;here
      </div>

      {renderProposer()}

      {renderDescription()}

      <div className={styles.contentCell}>{content}</div>

      <div className={styles.voteControlCell}>
        <Icon name="votingYesChecked" className={styles.voteIcon} />
        <Icon name="votingNoChecked" className={styles.voteIcon} />
      </div>

      {renderCloseButton()}
    </div>
  );
};
