import React, { FC, useState } from 'react';

import { Loader } from 'components/loader';

import { AddMemberRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegateGroupTable/AddMemberRow';
import { DelegateTokenDetails } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/types';
import { DaoDelegation } from 'types/dao';

import { TableRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegateGroupTable/TableRow';

import useQuery from 'hooks/useQuery';

import styles from './DelegateGroupTable.module.scss';

interface Props {
  data: DaoDelegation[] | undefined;
  loading: boolean;
  votingThreshold: string;
  tokenDetails: DelegateTokenDetails | undefined;
  addMemberMode: boolean;
  onAddMember: () => void;
}

type TableAction = 'Delegate' | 'Undelegate';

export const DelegateGroupTable: FC<Props> = ({
  data,
  loading,
  tokenDetails,
  votingThreshold,
  addMemberMode,
  onAddMember,
}) => {
  const { query } = useQuery<{ sort: string }>();
  const { sort } = query;

  const [activeRow, setActiveRow] = useState<{
    index: number;
    actionType: TableAction;
  } | null>(null);

  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>Name</div>
        <div>Delegated Balance</div>
        <div>Voting Power</div>
        <div>Actions</div>
      </div>
      <div className={styles.body}>
        {addMemberMode && (
          <AddMemberRow
            votingThreshold={votingThreshold}
            symbol={tokenDetails?.symbol}
            onAddMember={onAddMember}
          />
        )}
        {data
          .sort((a, b) => {
            if (a.accountId > b.accountId) {
              return sort === 'ASC' ? 1 : -1;
            }

            if (a.accountId < b.accountId) {
              return sort === 'ASC' ? -1 : 1;
            }

            return 0;
          })
          .map((item, index) => (
            <TableRow
              key={item.accountId}
              {...item}
              onActionClick={actionType => {
                setActiveRow(
                  actionType
                    ? { index, actionType: actionType as TableAction }
                    : null
                );
              }}
              isActive={activeRow?.index === index}
              actionContext={activeRow?.actionType}
              votingThreshold={votingThreshold}
              decimals={tokenDetails?.decimals}
              symbol={tokenDetails?.symbol}
              availableBalance={tokenDetails?.balance ?? 0}
            />
          ))}
      </div>
    </div>
  );
};
