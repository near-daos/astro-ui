import React, { useCallback, useState } from 'react';

import { IconButton } from 'components/button/IconButton';
import { Button } from 'components/button/Button';
import dynamic from 'next/dynamic';
import {
  BOND_DETAIL,
  CHART_DATA,
  TOKENS_DATA,
  VOTE_DETAILS
} from 'pages/treasury/tokens/mock';
import { TokenCard, TokenName } from 'components/cards/token-card';
import { Header } from 'components/cards/token-card/components/header';
import { RequestPayoutPopup } from 'features/treasury/request-payout-popup';
import { ChartData } from 'pages/treasury/types';
import styles from './tokens.module.scss';

interface TokenCardInput {
  id: string;
  tokenName: TokenName;
  tokensBalance: number;
  totalValue: number;
  voteWeight: number;
}

interface TokensPageProps {
  accountName: string;
  chartData: ChartData[];
  tokens: TokenCardInput[];
}

const AreaChart = dynamic(import('components/area-chart'), { ssr: false });

const TokensPage: React.FC<TokensPageProps> = ({
  accountName = 'meowzers.sputnikdao.near',
  chartData = CHART_DATA,
  tokens = TOKENS_DATA
}) => {
  const [isSendTokenModalOpened, showSendTokenModal] = useState(false);

  const sendToken = useCallback(() => {
    showSendTokenModal(false);
  }, []);

  const openModal = useCallback(() => {
    showSendTokenModal(true);
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.account}>
        <div className={styles.caption}>DAO account name</div>
        <div className={styles.name}>
          {accountName}
          <IconButton icon="buttonCopy" size="medium" />
        </div>
      </div>
      <div className={styles.send}>
        <Button variant="secondary" onClick={openModal}>
          Send tokens
        </Button>
        <RequestPayoutPopup
          type="send"
          isOpen={isSendTokenModalOpened}
          onClose={sendToken}
          voteDetails={VOTE_DETAILS}
          bondDetail={BOND_DETAIL}
        />
      </div>
      <div className={styles.chart}>
        <AreaChart data={chartData} />
      </div>
      <div className={styles.label}>All tokens</div>
      <div className={styles.tokens}>
        <Header />
        {tokens.map(token => (
          <div className={styles.row}>
            <TokenCard
              {...token}
              href={`/treasury/tokens/transactions/${token.id}`}
              key={token.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokensPage;
