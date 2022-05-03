import React, { FC } from 'react';
import { useWalletContext } from 'context/WalletContext';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { GroupRow } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent/GroupRow';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { AmountBalanceCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/AmountBalanceCard';

import { GovernanceToken } from 'types/token';
import { Member } from 'astro_2.0/features/CreateProposal/types';

import styles from './TokenDistributionContent.module.scss';

interface TokenDistributionContentProps {
  groups: {
    name: string;
    numberOfMembers: number;
    members: string[];
  }[];
  governanceToken: GovernanceToken;
}

export const TokenDistributionContent: FC<TokenDistributionContentProps> = ({
  groups,
  governanceToken,
}) => {
  const { t } = useTranslation();
  const { accountId } = useWalletContext();

  const { watch } = useFormContext();

  const groupsEntries = watch('groups') as Record<
    string,
    { groupTotal: string; isCustom: boolean; members?: Member[] }
  >;

  const totalDistributed = Object.keys(groupsEntries)
    .map(key => {
      const group = groups.find(grp => grp.name === key);

      if (!group) {
        return 0;
      }

      const item = groupsEntries[key];

      if (item.isCustom) {
        if (!item.members) {
          return 0;
        }

        return item.members.reduce((res, val) => res + +val.value, 0);
      }

      return item.groupTotal
        ? Number(item.groupTotal) * group.numberOfMembers
        : 0;
    })
    .reduce((res, item) => res + item, 0);

  return (
    <div className={styles.root}>
      <div className={styles.proposerCell}>
        <InfoBlockWidget
          label={t('proposalCard.proposalOwner')}
          value={accountId}
        />
        <AmountBalanceCard
          value={governanceToken.value - totalDistributed}
          suffix={governanceToken.name}
          className={styles.amountBalance}
        />
      </div>
      <div className={styles.header}>
        <div className={styles.title} />
        <div className={styles.member}>By member</div>
        <div className={styles.control} />
        <div className={styles.group}>By group</div>
      </div>
      {groups.map(({ name, numberOfMembers, members }) => {
        return (
          <GroupRow
            key={name}
            name={name}
            numberOfMembers={numberOfMembers}
            members={members}
            totalDistributed={totalDistributed}
            governanceToken={governanceToken}
          />
        );
      })}
    </div>
  );
};
