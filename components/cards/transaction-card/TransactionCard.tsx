import React from 'react';
import classNames from 'classnames';
import { TokenName } from 'components/cards/token-card';
import { Icon } from 'components/Icon';
import { format, parseISO } from 'date-fns';
import s from './transaction-card.module.scss';

export interface TransactionCardProps {
  type: 'Deposit' | 'Windrow';
  tokenName: TokenName;
  tokensBalance: number;
  date: string;
  accountName: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  tokenName,
  type,
  tokensBalance,
  date,
  accountName
}) => {
  return (
    <div className={s.root}>
      <div
        className={classNames(s.icon, {
          [s.purple]: type === 'Deposit',
          [s.green]: type === 'Windrow'
        })}
      >
        <Icon
          className={s.container}
          name={
            type === 'Deposit' ? 'proposalReceivedFunds' : 'proposalSendFunds'
          }
        />
      </div>
      <div className={s.token}>
        <div className={s.balance}>{`${
          type === 'Deposit' ? '+' : '-'
        } ${tokensBalance}`}</div>
        <div>&nbsp;</div>
        <div className={s.name}>{tokenName}</div>
      </div>

      <div className={s.date}>{format(parseISO(date), 'dd.LL.yyyy H:MM')}</div>
      <div className={s.account}>{accountName}</div>
    </div>
  );
};
