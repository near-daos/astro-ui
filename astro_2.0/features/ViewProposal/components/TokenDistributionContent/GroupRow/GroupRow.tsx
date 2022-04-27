import React, { FC } from 'react';
import cn from 'classnames';

import { Badge, getBadgeVariant } from 'components/Badge';
import { MemberRow } from 'astro_2.0/features/ViewProposal/components/TokenDistributionContent/MemberRow';

import { TokenDistributionGroup } from 'astro_2.0/features/CreateProposal/types';
import { GovernanceToken } from 'types/token';

import styles from './GroupRow.module.scss';

interface GroupRowProps {
  data: TokenDistributionGroup;
  governanceToken: GovernanceToken;
}

export const GroupRow: FC<GroupRowProps> = ({ data, governanceToken }) => {
  const { isCustom, name, members, groupTotal } = data;

  return (
    <>
      <div className={cn(styles.root)}>
        <div className={styles.title}>
          <Badge size="small" variant={getBadgeVariant(name)}>
            <div className={styles.groupBadge}>
              <div className={styles.groupName}>{name}</div>&nbsp;
              <div>({members?.length ?? 0})</div>
            </div>
          </Badge>
        </div>
        <div className={styles.member}>
          {isCustom ? (
            <div className={styles.label}>Custom</div>
          ) : (
            <>
              <div className={styles.total}>{groupTotal}</div>
              <div className={styles.totalSuffix}>{governanceToken.name}</div>
            </>
          )}
        </div>
        <div className={styles.group}>
          <div className={styles.input}>{groupTotal}</div>
          <div className={styles.suffix}>{governanceToken.name}</div>
        </div>
      </div>
      {isCustom && members && (
        <div className={styles.membersContainer}>
          {members.map(member => {
            return (
              <MemberRow
                data={member}
                key={member.name}
                governanceToken={governanceToken}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
