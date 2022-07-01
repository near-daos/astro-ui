import React, { FC, useState } from 'react';

import { Loader } from 'components/loader';

import {
  DelegateTokenDetails,
  UserDelegateDetails,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/types';

import { TableRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegateGroupTable/TableRow';

import styles from './DelegateGroupTable.module.scss';

interface Props {
  data: UserDelegateDetails[] | undefined;
  loading: boolean;
  votingThreshold: number;
  tokenDetails: DelegateTokenDetails | undefined;
}

type TableAction = 'Delegate' | 'Undelegate';

export const DelegateGroupTable: FC<Props> = ({
  data,
  loading,
  tokenDetails,
  votingThreshold,
}) => {
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
        {data.map((item, index) => (
          <TableRow
            key={item.accountId}
            {...item}
            onActionClick={actionType =>
              setActiveRow({ index, actionType: actionType as TableAction })
            }
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
