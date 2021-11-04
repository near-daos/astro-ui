import React from 'react';

import { ProposalStatuses } from 'types/proposal';
import Checkbox from 'astro_2.0/components/inputs/Checkbox';

import styles from './StatusFilters.module.scss';

const StatusFilters = ({
  proposal,
  disabled,
  onChange,
}: Props): JSX.Element => {
  const onProposalFilterChange = (
    value: ProposalStatuses
  ): React.ChangeEventHandler<HTMLInputElement> => async () => {
    onChange?.(proposal === value ? undefined : value);
  };

  return (
    <div className={styles.statusFilter}>
      <p className={styles.filterStatusText}>Filter by proposal status:</p>

      <Checkbox
        input={{
          name: ProposalStatuses.Active,
          checked:
            proposal === ProposalStatuses.Active || proposal === undefined,
          onChange: onProposalFilterChange(ProposalStatuses.Active),
          disabled,
        }}
        label="Active"
        classes={{ root: styles.filterStatusProposalCheckboxRoot }}
      />
      <Checkbox
        input={{
          name: ProposalStatuses.Approved,
          checked:
            proposal === ProposalStatuses.Approved || proposal === undefined,
          onChange: onProposalFilterChange(ProposalStatuses.Approved),
          disabled,
        }}
        label="Approved"
        classes={{ root: styles.filterStatusProposalCheckboxRoot }}
      />
      <Checkbox
        input={{
          name: ProposalStatuses.Failed,
          checked:
            proposal === ProposalStatuses.Failed || proposal === undefined,
          onChange: onProposalFilterChange(ProposalStatuses.Failed),
          disabled,
        }}
        label="Failed"
        classes={{ root: styles.filterStatusProposalCheckboxRoot }}
      />

      {/* <Checkbox */}
      {/*  input={{ */}
      {/*    name: 'timeline', */}
      {/*    checked: timelineView, */}
      {/*    onChange: onTimelineChange, */}
      {/*    disabled, */}
      {/*  }} */}
      {/*  as="switch" */}
      {/*  label="Timeline View:" */}
      {/*  classes={{ */}
      {/*    root: styles.timelineSwitch, */}
      {/*    label: styles.timelineSwitchLabel, */}
      {/*  }} */}
      {/* /> */}
    </div>
  );
};

type Props = {
  proposal?: ProposalStatuses;
  disabled?: boolean;
  onChange?: (proposal?: ProposalStatuses) => void;
};

StatusFilters.defaultProps = {
  disabled: false,
  onChange: undefined,
  proposal: undefined,
} as Pick<Props, 'disabled'>;

export default StatusFilters;
