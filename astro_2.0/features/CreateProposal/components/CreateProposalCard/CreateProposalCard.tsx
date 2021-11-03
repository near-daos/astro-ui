import React, { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { TextArea } from 'components/inputs/textarea/TextArea';
import { Input } from 'components/inputs/input/Input';
import { Icon } from 'components/Icon';
import { IconButton } from 'components/button/IconButton';
import { GroupedSelect } from 'astro_2.0/features/CreateProposal/components/GroupedSelect';

import { ProposalVariant } from 'types/proposal';

import { LOREN_IPSUM } from 'constants/common';

import {
  getInputSize,
  getProposalTypesOptions,
} from 'astro_2.0/features/CreateProposal/helpers';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';

import styles from './CreateProposalCard.module.scss';

const proposalTypesOptions = getProposalTypesOptions();

export interface CreateProposalCardProps {
  type: ProposalVariant;
  proposer: string;
  content: ReactNode;
  onTypeSelect: (newType: ProposalVariant) => void;
  onClose: () => void;
}

export const CreateProposalCard: React.FC<CreateProposalCardProps> = ({
  type,
  proposer,
  content,
  onTypeSelect,
  onClose,
}) => {
  const {
    register,
    formState: { touchedFields, errors },
  } = useFormContext();

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
            inputSize={getInputSize(type)}
            defaultValue={type}
            options={proposalTypesOptions}
            onChange={v => onTypeSelect(v as ProposalVariant)}
          />
        )}
      </div>

      <div className={styles.countdownCell}>Countdown will be here</div>

      <div className={styles.proposerCell}>
        <InfoBlockWidget label="Proposer" value={proposer} />
      </div>

      <div className={styles.descriptionCell}>
        <div className={styles.label}>Description</div>
        <div className={styles.proposalDescription}>
          <TextArea
            isValid={touchedFields.description && !errors.description?.message}
            size="block"
            textAlign="left"
            resize="none"
            placeholder={LOREN_IPSUM}
            className={styles.textArea}
            isBorderless
            maxLength={500}
            maxRows={4}
            minRows={1}
            {...register('details')}
          />
        </div>
        <div className={styles.proposalExternalLink}>
          <Icon name="buttonExternal" width={14} />
          <Input
            isBorderless
            size="block"
            className={styles.linkInput}
            {...register('externalUrl')}
            placeholder="example.com/putyourlinkhere"
          />
        </div>
      </div>

      <div className={styles.contentCell}>{content}</div>

      <div className={styles.voteControlCell}>
        <Icon name="votingYesChecked" className={styles.voteIcon} />
        <Icon name="votingNoChecked" className={styles.voteIcon} />
      </div>

      <div className={styles.actionBar}>
        <IconButton icon="close" className={styles.action} onClick={onClose} />
      </div>
    </div>
  );
};
