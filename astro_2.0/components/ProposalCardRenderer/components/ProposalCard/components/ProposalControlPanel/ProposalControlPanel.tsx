import cn from 'classnames';
import React, { FC } from 'react';
import { ProposalStatus, ProposalVotingPermissions } from 'types/proposal';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import {
  DEFAULT_PROPOSAL_GAS,
  MAX_GAS,
  MIN_GAS,
} from 'services/sputnik/constants';
import { kFormatter } from 'utils/format';
import { Input } from 'components/inputs/Input';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import { ProposalControlButton } from './components/ProposalControlButton';

import styles from './ProposalControlPanel.module.scss';

interface ProposalControlPanelProps {
  likes: number;
  liked: boolean;
  dislikes: number;
  disliked: boolean;
  dismisses?: number;
  dismissed?: boolean;
  permissions: ProposalVotingPermissions;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onLike: SubmitHandler<any>;
  onDislike: SubmitHandler<any>;
  onRemove?: React.MouseEventHandler<HTMLButtonElement>;
  disableControls?: boolean;
  className?: string;
  status?: ProposalStatus;
  toggleInfoPanel?: React.MouseEventHandler<HTMLButtonElement>;
  commentsCount: number;
}

export const ProposalControlPanel: FC<ProposalControlPanelProps> = ({
  status,
  likes,
  liked,
  dislikes,
  disliked,
  dismissed,
  onLike,
  onDislike,
  permissions,
  className = '',
  disableControls,
  toggleInfoPanel,
  commentsCount,
}) => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { canApprove, canReject } = permissions;
  const voted =
    liked || disliked || dismissed || (status && status !== 'InProgress');

  const yesIconName = canApprove ? 'votingYes' : 'votingYesDisabled';
  const noIconName = canReject ? 'votingNo' : 'votingNoDisabled';

  const currentGasValue = watch('gas');

  const showTGas = !(voted || (!canApprove && !canReject) || disableControls);

  function getInputWidth() {
    if (currentGasValue?.length > 6 && currentGasValue?.length <= 10) {
      return `${currentGasValue?.length}ch`;
    }

    if (currentGasValue?.length > 10) {
      return '10ch';
    }

    return '6ch';
  }

  return (
    <form
      onSubmit={handleSubmit(onLike)}
      className={cn(styles.root, className)}
    >
      {showTGas && (
        <InputWrapper
          className={styles.detailsItem}
          labelClassName={styles.inputLabel}
          fieldName="gas"
          label="TGas"
        >
          <div className={styles.row}>
            <Input
              className={cn(styles.inputWrapper, styles.detailsInput, {
                [styles.error]: errors?.gas,
                [styles.readOnly]:
                  voted || (!canApprove && !canReject) || disableControls,
              })}
              inputStyles={{
                width: getInputWidth(),
              }}
              onClick={e => e.stopPropagation()}
              type="number"
              min={MIN_GAS}
              step={1}
              max={MAX_GAS}
              isBorderless
              size="block"
              disabled={voted || (!canApprove && !canReject) || disableControls}
              placeholder={`${DEFAULT_PROPOSAL_GAS}`}
              {...register('gas')}
            />
          </div>
        </InputWrapper>
      )}

      <ProposalControlButton
        icon={liked ? 'votingYesChecked' : yesIconName}
        voted={voted}
        type="submit"
        times={likes}
        disabled={Boolean(!canApprove || disableControls)}
      />
      <ProposalControlButton
        icon={disliked ? 'votingNoChecked' : noIconName}
        voted={voted}
        type="submit"
        times={dislikes}
        onClick={handleSubmit(onDislike)}
        disabled={Boolean(!canReject || disableControls)}
      />
      <ProposalControlButton
        icon="chat"
        iconClassName={styles.toggleCommentsButton}
        voted={false}
        type="button"
        times={kFormatter(commentsCount)}
        onClick={toggleInfoPanel}
        disabled={false}
      />
    </form>
  );
};
