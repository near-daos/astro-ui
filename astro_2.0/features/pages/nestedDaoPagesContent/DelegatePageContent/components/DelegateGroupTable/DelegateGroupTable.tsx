import React, { FC, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';

import { Loader } from 'components/loader';

import { AddMemberRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegateGroupTable/AddMemberRow';
import { DelegateTokenDetails } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/types';
import { DaoDelegation } from 'types/dao';

import { TableRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegateGroupTable/TableRow';

import useQuery from 'hooks/useQuery';

import { useDelegatePageContext } from 'astro_2.0/features/pages/nestedDaoPagesContent/DelegatePageContent/components/DelegatePageContext';

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
  const { t } = useTranslation();
  const { query } = useQuery<{ sort: string }>();
  const { sort } = query;

  const { symbol } = useDelegatePageContext();

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
        <div>{t('delegateVoting.delegatedToken', { token: symbol })}</div>
        <div className={styles.desktop}>Voting Power</div>
        <div>{t('delegateVoting.voteActions')}</div>
      </div>
      <div className={styles.body}>
        <AnimatePresence>
          {addMemberMode && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AddMemberRow
                votingThreshold={votingThreshold}
                symbol={tokenDetails?.symbol}
                onAddMember={onAddMember}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
              availableBalance={tokenDetails?.balance ?? 0}
            />
          ))}
      </div>
    </div>
  );
};
