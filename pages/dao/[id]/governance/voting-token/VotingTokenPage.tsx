import React, { FC, useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import cn from 'classnames';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { useModal } from 'components/modal';
import { VotingTokenPopup } from 'features/voting-token';
import { TData } from 'features/voting-token/components/voting-token-wizard/helpers';
import { AmountsStaked } from 'features/voting-token/components/amounts-staked';
import { VotingToken } from 'features/voting-token/components/voting-token';
import {
  RecentlyUnstaked,
  Stake
} from 'features/voting-token/components/recently-unstaked';
import { useDeviceType } from 'helpers/media';

import styles from 'pages/dao/[id]/governance/voting-token/voting-token-page.module.scss';

const VotingTokenPage: FC = () => {
  const [showModal] = useModal(VotingTokenPopup);
  // TODO - use external API when ready instead of local state
  const [token, setToken] = useState<TData | null>(null);
  const [stakes, setStakes] = useState<Stake[]>([]);
  const [unstaked, setUnstaked] = useState<Stake[]>([]);
  const { isMobile } = useDeviceType();

  const handleStartClick = useCallback(async () => {
    const response = await showModal();

    if (response?.length) {
      setToken(response[0] as TData);
    }
  }, [showModal]);

  const handleStake = useCallback(
    (tkn, stakeResult) => {
      setStakes([
        ...stakes,
        {
          id: nanoid(),
          amount: Number(stakeResult.value),
          name: tkn.tokenName,
          delegatedTo: stakeResult.delegateTo
        }
      ]);
    },
    [stakes]
  );

  return (
    <>
      <div className={styles.header}>
        <h1>Enable voting by token</h1>
        {!token && !isMobile && (
          <Button size="small" variant="secondary" onClick={handleStartClick}>
            Start
          </Button>
        )}
      </div>
      {!token && (
        <>
          <div className={styles.subheader}>
            You can create or adopt a token to allow weighted voting by the
            community.
          </div>
          <div className={styles.warning}>
            <Icon name="buttonAlert" className={styles.icon} />
            Once a DAO adopts a token for voting, the choice of token cannot be
            changed.
          </div>
          {isMobile && (
            <div className={cn(styles.mobile, styles.row)}>
              Visit Sputnik on your desktop to see proposed changes.
            </div>
          )}
        </>
      )}
      {token && (
        <VotingToken
          token={token}
          balance={token.balance}
          onStake={res => handleStake(token, res)}
        />
      )}
      {!!unstaked.length && (
        <div className={styles.row}>
          <RecentlyUnstaked stakes={unstaked} />
        </div>
      )}
      {!!stakes.length && (
        <div className={styles.row}>
          <AmountsStaked
            stakes={stakes}
            onUnstakeTokens={(stk, unstk) => {
              setUnstaked([...unstaked, ...unstk] as Stake[]);
              setStakes(stk);
            }}
            onChangeStakes={res => setStakes(res)}
          />
        </div>
      )}
    </>
  );
};

export default VotingTokenPage;
