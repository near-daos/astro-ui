import React, { FC, FormEvent, useCallback, useState } from 'react';
import cn from 'classnames';

import { AmountInput } from 'features/voting-token/components/amount-input';
import { Modal } from 'components/modal';
import { Input } from 'components/input/Input';
import { Button } from 'components/button/Button';
import { Icon, IconName } from 'components/Icon';

import { useDeviceType } from 'helpers/media';

import styles from './stake-tokens-popup.module.scss';

type Token = {
  id: string;
  icon?: IconName;
  tokenName?: string;
  tokenSymbol?: string;
  balance: number;
};

export interface StakeTokensPopupProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
  token: Token;
  amount?: number;
  delegatedTo?: string;
  rate: number;
  variant: 'Stake' | 'Withdraw' | 'Change';
}

export const StakeTokensPopup: FC<StakeTokensPopupProps> = ({
  isOpen,
  onClose,
  token,
  rate,
  variant = 'Stake',
  delegatedTo = '',
  amount = ''
}) => {
  const { isMobile } = useDeviceType();
  const [value, setValue] = useState(amount);
  const [delegateTo, setDelegateTo] = useState(delegatedTo);
  const handleSubmit = useCallback(() => {
    onClose({
      delegateTo,
      value
    });
  }, [delegateTo, onClose, value]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleMax = useCallback(() => {
    setValue(`${token.balance}`);
  }, [token.balance]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.root}>
        <h2>
          {variant === 'Change' && 'Change tokens amount'}
          {variant === 'Withdraw' && 'Withdraw tokens'}
          {variant === 'Stake' && 'Stake tokens'}
        </h2>
        <div className={styles.content}>
          <div className={styles.info}>
            <div className={styles.token}>
              <div className={styles.label}>Your voting token</div>
              <div className={styles.value}>
                <div className={styles.icon}>
                  {token.icon && <Icon name={token.icon} />}
                </div>
                {token.tokenName}
              </div>
            </div>
            <div className={styles.symbol}>
              <div className={styles.label}>&nbsp;</div>
              <div className={styles.value}>{token.tokenSymbol}</div>
            </div>
            <div className={styles.balance}>
              <div className={cn(styles.label, styles.right)}>
                {variant === 'Stake' ? 'Your balance' : 'You can withdraw'}
              </div>
              <div className={cn(styles.value, styles.right)}>
                <strong>{token.balance}</strong>
                &nbsp;
                {token.tokenName}
              </div>
            </div>
          </div>
          <div className={styles.input}>
            <AmountInput
              label="Tokens amount"
              placeholder="Input tokens amount"
              tokenName="GOOSE"
              onMax={handleMax}
              value={value}
              onChange={(e: FormEvent) => {
                const val = (e.target as HTMLInputElement).value;

                setValue(+val > token.balance ? `${token.balance}` : val);
              }}
              cost={+(value ?? 0) * rate}
            />
          </div>
          {variant === 'Change' && (
            <div className={styles.delegatedTo}>
              <div className={styles.label}>Delegated to</div>
              <p>{delegateTo}</p>
            </div>
          )}
          {variant === 'Stake' && (
            <div className={styles.delegatedTo}>
              <div className={styles.inputLabel}>Delegate to</div>
              <div className={styles.row}>
                <Input
                  size="medium"
                  value={delegateTo}
                  onChange={e => {
                    setDelegateTo((e.target as HTMLInputElement).value);
                  }}
                />
                <div>.near</div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <Button
            variant="secondary"
            onClick={handleCancel}
            size={isMobile ? 'block' : 'small'}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            size={isMobile ? 'block' : 'small'}
          >
            {variant}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
