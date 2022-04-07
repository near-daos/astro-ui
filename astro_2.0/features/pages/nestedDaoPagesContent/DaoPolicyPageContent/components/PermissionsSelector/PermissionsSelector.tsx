import React, { FC, useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import { useIntersection } from 'react-use';

import { Icon, IconName } from 'components/Icon';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Button } from 'components/button/Button';
import { Checkbox } from 'components/inputs/Checkbox';
import { SelectorRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';

import styles from './PermissionsSelector.module.scss';

interface PermissionsSelectorProps {
  title?: string;
  description?: string;
  initialData: SelectorRow[];
  onSubmit?: (values: SelectorRow[]) => void;
  disableNewProposal: boolean;
  className?: string;
}

export const PermissionsSelector: FC<PermissionsSelectorProps> = ({
  initialData,
  onSubmit,
  disableNewProposal,
  title,
  description,
  className,
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

  const [rows, setRows] = useState<SelectorRow[]>(initialData);

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

      setRows(res);
    },
    [rows]
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
            disabled={disableNewProposal}
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
      <div className={styles.header}>
        {title && <div className={styles.title}>{title}</div>}
        {!disableNewProposal && onSubmit && (
          <div className={styles.submitWrapper}>
            <Button onClick={() => onSubmit(rows)} className={styles.submit}>
              Propose Changes
            </Button>
          </div>
        )}
      </div>
      {description && <div className={styles.description}>{description}</div>}
      <div className={styles.content}>
        <div className={styles.legend}>
          <div className={styles.selectorRow}>
            <div className={cn(styles.selectorCell, styles.mainCell)}>
              &nbsp;
            </div>
          </div>
          {renderLegendCell(
            'DAO policy',
            'proposalGovernance',
            'Change DAO policy'
          )}
          {renderLegendCell('Bounty', 'proposalBounty', 'Add bounty')}
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
            'Create Group',
            'proposalCreateGroup',
            'Propose Create Group'
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
            {rows.map(row => (
              <div className={styles.column}>
                <div className={styles.selectorRow}>
                  <div className={cn(styles.selectorCell, styles.groupName)}>
                    {row.label}
                  </div>
                </div>
                {renderValueCell('policy', row.label, row.policy)}
                {renderValueCell('bounty', row.label, row.bounty)}
                {renderValueCell('transfer', row.label, row.transfer)}
                {renderValueCell('poll', row.label, row.poll)}
                {renderValueCell('removeMember', row.label, row.removeMember)}
                {renderValueCell('addMember', row.label, row.addMember)}
                {renderValueCell('createGroup', row.label, row.createGroup)}
              </div>
            ))}
            <div ref={rightIntersectionRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
