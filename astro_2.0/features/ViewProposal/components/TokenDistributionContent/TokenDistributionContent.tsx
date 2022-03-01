import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { GroupRow } from 'astro_2.0/features/ViewProposal/components/TokenDistributionContent/GroupRow';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { AmountBalanceCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/AmountBalanceCard';

import { GovernanceToken } from 'types/token';
import { TokenDistributionGroup } from 'astro_2.0/features/CreateProposal/types';

import styles from './TokenDistributionContent.module.scss';

interface TokenDistributionContentProps {
  proposer: string;
  groups: TokenDistributionGroup[];
  governanceToken: GovernanceToken;
}

export const TokenDistributionContent: FC<TokenDistributionContentProps> = ({
  proposer,
  groups,
  governanceToken,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.proposerCell}>
        <InfoBlockWidget
          label={t('proposalCard.proposalOwner')}
          value={proposer}
        />
        <AmountBalanceCard
          value={governanceToken.value}
          suffix={governanceToken.name}
          className={styles.amountBalance}
        />
      </div>
      <div className={styles.header}>
        <div className={styles.title} />
        <div className={styles.member}>By member</div>
        <div className={styles.group}>By group</div>
      </div>
      {groups.map(group => {
        return (
          <GroupRow
            data={group}
            key={group.name}
            governanceToken={governanceToken}
          />
        );
      })}
    </div>
  );
};
