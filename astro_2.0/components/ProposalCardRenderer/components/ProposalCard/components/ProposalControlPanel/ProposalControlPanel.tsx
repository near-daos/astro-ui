import cn from 'classnames';
import React, { FC } from 'react';
import {
  ProposalStatus,
  ProposalVariant,
  ProposalVotingPermissions,
} from 'types/proposal';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { kFormatter } from 'utils/format';
import { TgasInput } from 'astro_2.0/components/TgasInput';
import { useWalletContext } from 'context/WalletContext';

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
  variant: ProposalVariant;
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
  variant,
}) => {
  const { accountId } = useWalletContext();
  const { handleSubmit } = useFormContext();
  const { canApprove, canReject } = permissions;
  const voted =
    liked || disliked || dismissed || (status && status !== 'InProgress');

  const yesIconName = canApprove ? 'votingYes' : 'votingYesDisabled';
  const noIconName = canReject ? 'votingNo' : 'votingNoDisabled';

  const showTGas = !(voted || (!canApprove && !canReject) || disableControls);

  const readOnlyGas =
    variant === ProposalVariant.ProposeRemoveUpgradeCode ||
    variant === ProposalVariant.ProposeUpgradeSelf ||
    variant === ProposalVariant.ProposeGetUpgradeCode ||
    variant === ProposalVariant.ProposeCreateDao;

  return (
    <form
      onSubmit={handleSubmit(onLike)}
      className={cn(styles.root, className)}
    >
      {showTGas && <TgasInput readOnly={readOnlyGas} />}
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
        disabled={!accountId}
      />
    </form>
  );
};
