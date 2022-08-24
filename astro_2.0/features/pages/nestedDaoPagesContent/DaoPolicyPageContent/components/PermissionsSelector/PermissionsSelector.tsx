import React, { FC, useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import pick from 'lodash/pick';
import { useIntersection } from 'react-use';

import { Icon, IconName } from 'components/Icon';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Button } from 'components/button/Button';
import { Checkbox } from 'components/inputs/Checkbox';
import {
  isOptionDisabled,
  SelectorRow,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';

import styles from './PermissionsSelector.module.scss';

interface PermissionsSelectorProps {
  title?: string;
  description?: string;
  initialData: SelectorRow[];
  onSubmit?: (values: SelectorRow[]) => void;
  disableNewProposal: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  controlClassName?: string;
  controlLabel?: string;
  onChange?: (values: SelectorRow[]) => void;
}

const DATA_FIELDS = [
  'config',
  'policy',
  'bounty',
  'bountyDone',
  'transfer',
  'poll',
  'removeMember',
  'addMember',
  'call',
  'upgradeSelf',
  'upgradeRemote',
  'setStakingContract',
];

export const PermissionsSelector: FC<PermissionsSelectorProps> = ({
  initialData,
  onSubmit,
  disableNewProposal,
  title,
  description,
  className,
  headerClassName,
  contentClassName,
  controlClassName,
  controlLabel = 'Propose Changes',
  onChange,
}) => {
  const rootRef = useRef(null);
  const leftIntersectionRef = React.useRef(null);
  const rightIntersectionRef = React.useRef(null);
  const leftIntersection = useIntersection(leftIntersectionRef, {
    root: rootRef.current,
    rootMargin: '0px',
    threshold: 1,
  });
  const rightIntersection = useIntersection(rightIntersectionRef, {
    root: rootRef.current,
    rootMargin: '0px',
    threshold: 1,
  });

  const [rows, setRows] = useState<SelectorRow[]>(
    initialData?.sort((a, b) => {
      if (a.label > b.label) {
        return 1;
      }

      if (a.label < b.label) {
        return -1;
      }

      return 0;
    }) ?? []
  );

  const handleUpdateData = useCallback(
    val => {
      setRows(val);

      if (onChange) {
        onChange(val);
      }
    },
    [onChange]
  );

  const handleToggle = useCallback(
    (dataField: string, groupName: string, value: boolean) => {
      const res = rows.map(row => {
        if (row.label === groupName) {
          return {
            ...row,
            [dataField]: value,
          };
        }

        return row;
      });

      handleUpdateData(res);
    },
    [handleUpdateData, rows]
  );

  function isAllChecked(row: SelectorRow) {
    const values = pick(row, DATA_FIELDS);

    return Object.values(values).filter(value => !value).length === 0;
  }

  const handleAllToggle = useCallback(
    (selectedRow: SelectorRow, val: boolean) => {
      const res = rows.map(row => {
        if (row.label === selectedRow.label) {
          const values = pick(row, DATA_FIELDS);

          return Object.keys(values).reduce<
            SelectorRow & Record<string, boolean | string>
          >(
            (acc, key) => {
              const isDisabled = isOptionDisabled(key, row.label, true);

              acc[key] = isDisabled ? true : val;

              return acc;
            },
            {
              ...row,
            }
          );
        }

        return row;
      });

      handleUpdateData(res);
    },
    [handleUpdateData, rows]
  );

  function renderValueCell(
    dataField: string,
    groupName: string,
    value: boolean
  ) {
    return (
      <div className={styles.selectorRow}>
        <div
          className={cn(styles.selectorCell, styles.valueCell, {
            [styles.disabled]: disableNewProposal,
          })}
        >
          <Checkbox
            label=""
            checked={value}
            disabled={
              disableNewProposal ||
              isOptionDisabled(dataField, groupName, value)
            }
            onClick={() => handleToggle(dataField, groupName, !value)}
            className={styles.checkbox}
          />
        </div>
      </div>
    );
  }

  function renderLegendCell(label: string, icon: IconName, tooltip: string) {
    return (
      <div className={styles.selectorRow}>
        <div className={cn(styles.selectorCell, styles.mainCell)}>
          <Tooltip overlay={<div>{tooltip}</div>} placement="top">
            <div className={styles.row}>
              <Icon name={icon} className={styles.icon} />
              <div className={styles.label}>{label}</div>
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }

  if (!rows.length) {
    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <div className={cn(styles.header, headerClassName)}>
        {title && <div className={styles.title}>{title}</div>}
        {!disableNewProposal && onSubmit && (
          <div className={cn(styles.submitWrapper, controlClassName)}>
            <Button onClick={() => onSubmit(rows)} className={styles.submit}>
              {controlLabel}
            </Button>
          </div>
        )}
      </div>
      {description && <div className={styles.description}>{description}</div>}
      <div className={cn(styles.content, contentClassName)}>
        <div className={styles.legend}>
          <div className={styles.selectorRow}>
            <div className={cn(styles.selectorCell, styles.mainCell)}>
              &nbsp;
            </div>
          </div>
          {renderLegendCell(
            'Change DAO config',
            'proposalGovernance',
            'Change DAO config'
          )}
          {renderLegendCell(
            'Change DAO policy',
            'proposalGovernance',
            'Change DAO policy'
          )}
          {renderLegendCell(
            'Bounty',
            'proposalBounty',
            'Create add bounty proposals'
          )}
          {renderLegendCell(
            'Bounty done',
            'proposalBounty',
            'Create bounty done proposals'
          )}
          {renderLegendCell('Transfer', 'proposalSendFunds', 'Transfer funds')}
          {renderLegendCell('Polls', 'proposalPoll', 'Add poll')}
          {renderLegendCell(
            'Remove members',
            'proposalRemoveMember',
            'Remove members from group'
          )}
          {renderLegendCell(
            'Add members',
            'proposalAddMember',
            'Add members to group'
          )}
          {renderLegendCell(
            'Function call',
            'proposalNearFunctionCall',
            'Function call'
          )}
          {renderLegendCell(
            'Upgrade self',
            'proposalGovernance',
            'Upgrade self'
          )}
          {renderLegendCell(
            'Upgrade remote',
            'proposalGovernance',
            'Upgrade remote'
          )}
          {renderLegendCell(
            'Set vote token',
            'proposalGovernance',
            'Set vote token'
          )}
        </div>
        <div
          className={cn(styles.panel, {
            [styles.scrolledRight]: !leftIntersection?.isIntersecting,
            [styles.scrolledLeft]: !rightIntersection?.isIntersecting,
          })}
        >
          <div className={cn(styles.columns)} ref={rootRef}>
            <div ref={leftIntersectionRef} />
            {rows.map(row => {
              const allChecked = isAllChecked(row);

              return (
                <div className={styles.column} key={row.label}>
                  <div className={styles.selectorRow}>
                    <div className={cn(styles.selectorCell, styles.groupName)}>
                      <Tooltip
                        overlay={<span>{row.label}</span>}
                        placement="top"
                      >
                        <Button
                          size="small"
                          disabled={disableNewProposal}
                          variant="transparent"
                          onClick={() => handleAllToggle(row, !allChecked)}
                          className={styles.columnLabel}
                        >
                          {row.label}
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                  {renderValueCell('config', row.label, row.config)}
                  {renderValueCell('policy', row.label, row.policy)}
                  {renderValueCell('bounty', row.label, row.bounty)}
                  {renderValueCell('bountyDone', row.label, row.bountyDone)}
                  {renderValueCell('transfer', row.label, row.transfer)}
                  {renderValueCell('poll', row.label, row.poll)}
                  {renderValueCell('removeMember', row.label, row.removeMember)}
                  {renderValueCell('addMember', row.label, row.addMember)}
                  {renderValueCell('call', row.label, row.call)}
                  {renderValueCell('upgradeSelf', row.label, row.upgradeSelf)}
                  {renderValueCell(
                    'upgradeRemote',
                    row.label,
                    row.upgradeRemote
                  )}
                  {renderValueCell(
                    'setStakingContract',
                    row.label,
                    row.setStakingContract
                  )}
                </div>
              );
            })}
            <div ref={rightIntersectionRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
