import React, { FC, useCallback } from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import { StakeTokensPopup } from 'features/voting-token/components/stake-tokens-popup';
import { useModal } from 'components/modal';

import styles from './voting-token.module.scss';

type Token = {
  id: string;
  tokenIcon?: string | ArrayBuffer | null;
  tokenName?: string;
  tokenSymbol?: string;
  balance: number;
};

export interface VotingTokenProps {
  token: Token;
  totalStaked: number;
  onStake: (res: string) => void;
}

export const VotingToken: FC<VotingTokenProps> = ({
  token,
  totalStaked,
  onStake
}) => {
  const [showModal] = useModal(StakeTokensPopup, { token, rate: 18 });

  const handleStakeClick = useCallback(async () => {
    const response = await showModal();

    if (response?.length) {
      onStake(response[0] as string);
    }
  }, [onStake, showModal]);

  return (
    <div className={styles.root}>
      <div className={styles.token}>
        <div className={styles.label}>Your voting token</div>
        <div className={styles.value}>
          <div className={styles.icon}>
            {token.tokenIcon && token.tokenIcon === 'iconNear' && (
              <Icon name={token.tokenIcon} />
            )}
            {token.tokenIcon && typeof token.tokenIcon === 'string' && (
              <div
                style={{ backgroundImage: `url(${token.tokenIcon})` }}
                className={styles.selected}
              />
            )}
          </div>
          {token.tokenName}
        </div>
      </div>
      <div className={styles.symbol}>
        <div className={styles.label}>&nbsp;</div>
        {token.tokenSymbol}
      </div>
      <div className={styles.total}>
        <div className={styles.label}>Total staked</div>
        <div className={styles.value}>
          <strong>{totalStaked}</strong>
          &nbsp;
          {token.tokenName}
        </div>
      </div>
      <div className={styles.control}>
        <Button variant="secondary" onClick={handleStakeClick} size="block">
          Stake tokens
        </Button>
      </div>
    </div>
  );
};
